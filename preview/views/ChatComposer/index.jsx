import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Icon } from "../../components/Icon/index.jsx";
import {
  AGENT_MODES,
  PERMISSIONS,
  RUNTIMES,
  DEFAULT_MODELS,
  SPACES,
  ATTACH_ITEMS,
  MOCK_DIRS,
  MAX_UPLOAD_FILES,
  MAX_UPLOAD_SIZE,
  ADD_FILE_CMD,
  SLASH_SKILLS,
  SLASH_EXPERTS,
  ADD_ROOTS,
  ADD_CHILDREN,
  SKILL_CHILDREN,
  SKILL_CHIP_MASK,
  EXPERT_CHILDREN,
  CONN_CHILDREN,
  ADD_LEVELS
} from "../../src/constants/chatComposer.js";
import { fileTypeOf, isImageFile, fileSrcOf, fmtSize } from "../../src/utils/file.js";
import { useClickOutside } from "../../src/hook/useClickOutside.js";
import "./index.css";
const asSkillChip = (it) => ({ ...it, mask: SKILL_CHIP_MASK, closable: false });







/* ================= 通用下拉菜单面板 ================= */
/* 自适应方向：默认向下弹出；底部空间不足时翻转到按钮上方（渲染前测量，无闪烁） */
function DropMenu({ options, selectedId, onPick }) {
  const ref = useRef(null);
  const [up, setUp] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.bottom > window.innerHeight - 8) setUp(true);
  }, []);

  return (
    <div ref={ref} className={"cc-menu" + (up ? " cc-menu--up" : "")}>
      {options.map((o) => {
        const isSel = o.id === selectedId;
        return (
          <button
            type="button"
            key={o.id}
            className={"cc-menu-item" + (isSel ? " is-selected" : "")}
            onClick={() => onPick(o)}
          >
            {o.icon || o.src ? (
              <Icon name={o.icon} src={o.src} size={16} className="cc-mitem-icon" />
            ) : null}
            <span className="cc-mitem-main">
              <span className="cc-mitem-label">{o.label}</span>
              {o.desc ? <span className="cc-mitem-desc">{o.desc}</span> : null}
            </span>
            {/* 对号独立占位，每行统一靠右 */}
            <span className="cc-menu-check">
              {isSel ? <Icon name="check" size={14} /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ================= 主组件 ================= */
export default function ChatComposer(props) {
  const {
    initialMessage = "",
    placeholder = '需要帮你做些什么?输入"/"快速引用技能及指令',
    modeId = "single",
    permissionId = "request",
    modelId = "auto",
    models = DEFAULT_MODELS,
    spaceId = "",
    onSend, // 发送回调：把输入内容与当前选择上报给父级（会话页据此追加消息）
    chatMode = false, // 对话页模式:隐藏吉祥鸟/灰色外框/底部行,发送按钮显示生成中图标
    isGenerating = false, // 会话页生成中标记：true 时按钮变为停止按钮
    onStop, // 停止生成回调：点击后停止流式打印并恢复按钮初始态
  } = props;

  // auto 固定置于选项首位，其后拼接外部传入的模型列表
  const modelOptions = [
    { id: "auto", label: "Auto", icon: "zap", src: "./assets/uploads/auto-select-model.svg" },
  ].concat(models);

  const [mode, setMode] = useState(AGENT_MODES.find((m) => m.id === modeId) || AGENT_MODES[0]);
  const [permission, setPermission] = useState(
    PERMISSIONS.find((p) => p.id === permissionId) || PERMISSIONS[0]
  );
  const [model, setModel] = useState(
    modelOptions.find((m) => m.id === modelId) || modelOptions[0]
  );
  const [space, setSpace] = useState(SPACES.find((s) => s.id === spaceId) || null);
  const [runtime, setRuntime] = useState(RUNTIMES[0]);

  const [msg, setMsg] = useState(initialMessage);
  const [open, setOpen] = useState(null); // 当前展开的下拉：mode / permission / model / space / attach
  const [sent, setSent] = useState(false);
  const [spaceQuery, setSpaceQuery] = useState("");
  const [spaceList, setSpaceList] = useState(SPACES);
  // 新建项目弹窗
  const [showNewProject, setShowNewProject] = useState(false);
  const [npName, setNpName] = useState("");
  const [npPath, setNpPath] = useState("");
  const [pathMenu, setPathMenu] = useState(false);
  // 完全访问二次确认弹窗
  const [confirmFull, setConfirmFull] = useState(false);
  // “/”快捷指令
  const [slashOpen, setSlashOpen] = useState(false);
  const [cmdChips, setCmdChips] = useState([]);
  // 添加文件（本地选择 → 输入框卡片）
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  // 顶部居中提示(超限/超大等)
  const [toast, setToast] = useState("");
  // 加号(+)下拉:一级 hover 预览/点击选中均向右侧弹出二级
  const [hoverAdd, setHoverAdd] = useState(null); // 当前悬停的一级 key(预览,鼠标离开即失效)
  const [selectedAdd, setSelectedAdd] = useState(null); // 当前选中的一级 key(点击确定,面板常驻不消失)
  const [attachSecQuery, setAttachSecQuery] = useState("");
  // 二级面板当前展示的一级项:悬停预览优先,否则回落到选中项
  const activeAdd = hoverAdd || selectedAdd;
  // 连接器开关状态
  const [connOn, setConnOn] = useState({});

  // 有内容(已传文件/指令胶囊/文字)即可发送,并驱动发送按钮激活态图标
  const canSend = files.length > 0 || cmdChips.length > 0 || msg.trim().length > 0;

  // 文件卡片行数(每行4个)驱动输入卡片高度:0文件=140 / 1行=210 / 2行及以上=280(超出滚动)
  const fileCardHeight = files.length === 0 ? 140 : Math.ceil(files.length / 4) === 1 ? 210 : 280;

  // 点击组件外部任意位置时关闭下拉
  useClickOutside(!!open, (t) => t.closest("[data-drop]"), () => setOpen(null));

  // 点击 “/”指令菜单外（且不在输入区）时关闭
  useClickOutside(
    slashOpen,
    (t) => t.closest("[data-slash]") || t.closest(".cc-input"),
    () => setSlashOpen(false)
  );

  // 提示 4 秒后自动消失
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 4000);
    return () => window.clearTimeout(t);
  }, [toast]);

  // 加号菜单关闭时重置悬停与选中(下次打开回到初始态)
  useEffect(() => {
    if (open !== "attach") {
      setHoverAdd(null);
      setSelectedAdd(null);
    }
  }, [open]);

  const toggle = (key) => setOpen(open === key ? null : key);

  // 选中菜单项：更新状态并收起
  const pick = (setter) => (item) => {
    setter(item);
    setOpen(null);
  };

  // 发送：清空输入、指令胶囊与文件卡片；若外部传入 onSend 则上报完整载荷 + 按钮闪现反馈
  const send = () => {
    if (!canSend || sent) return;
    if (onSend) {
      onSend({
        text: msg.trim(),
        /* 胶囊完整视觉字段(icon/src/mask)透传,会话页气泡按输入框同款图标渲染 */
        chips: cmdChips.map((c) => ({ id: c.id, title: c.title, icon: c.icon, src: c.src, mask: c.mask })),
        /* 文件完整字段(ext/size/preview/failed)透传,会话页按输入框同款卡片渲染 */
        files: files.map((f) => ({ id: f.id, name: f.name, src: f.src, ext: f.ext, size: f.size, preview: f.preview, failed: f.failed })),
        meta: {
          modeId: mode.id,
          modeLabel: mode.label,
          permissionId: permission.id,
          permissionLabel: permission.label,
          modelId: model.id,
          modelLabel: model.label,
          space,
        },
      });
    }
    setMsg("");
    setCmdChips([]);
    setFiles([]);
    setSent(true);
    window.setTimeout(() => setSent(false), 700);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      setSlashOpen(false);
      return;
    }
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };

  // 空间列表支持按关键词过滤
  const filteredSpaces = spaceList.filter((s) =>
    s.name.toLowerCase().includes(spaceQuery.trim().toLowerCase())
  );

  // ---- “/”指令（单层分组，保持原样）：取最后一个斜杠后的输入过滤 ----
  const slashQuery = (() => {
    const i = msg.lastIndexOf("/");
    return i === -1 ? "" : msg.slice(i + 1);
  })();
  const matchSlash = (it) => it.title.toLowerCase().includes(slashQuery.trim().toLowerCase());
  const slashAdd = matchSlash(ADD_FILE_CMD) ? [ADD_FILE_CMD] : [];
  const slashSkills = SLASH_SKILLS.filter(matchSlash);
  const slashExperts = SLASH_EXPERTS.filter(matchSlash);

  // 共用行：图标 + 左对齐标题 + 右对齐正文
  const cmdRow = (it, onPick) => (
    <button type="button" key={it.id} className="cc-slash-row" onClick={() => onPick(it)}>
      <Icon name={it.icon} size={16} className="cc-slash-icon" />
      <span className="cc-slash-title">{it.title}</span>
      {it.desc ? <span className="cc-slash-desc">{it.desc}</span> : null}
    </button>
  );

  // 键入处理：以 / 开头（后跟无空格的查询串）时保持“/”菜单展开
  const handleInput = (e) => {
    const v = e.target.value;
    setMsg(v);
    const i = v.lastIndexOf("/");
    const after = i === -1 ? "" : v.slice(i + 1);
    setSlashOpen(i !== -1 && !/[ \n]/.test(after));
  };

  // 添加胶囊（去重，支持多选；src/closable 随 item 透传）
  const addChip = (item) =>
    setCmdChips((cs) =>
      cs.some((c) => c.id === item.id)
        ? cs
        : [
            ...cs,
            {
              id: item.id,
              title: item.title,
              icon: item.icon,
              src: item.src,
              mask: item.mask,
              closable: item.closable,
            },
          ]
    );

  // 选择“/”指令：清掉已输入的“/查询串”，标题作为胶囊
  const pickSlash = (item) => {
    setMsg((m) => {
      const i = m.lastIndexOf("/");
      return i === -1 ? m : m.slice(0, i);
    });
    addChip(item);
    setSlashOpen(false);
  };

  // ---- 加号(+)下拉：一级 hover 向右侧弹出二级 ----
  const toggleAttach = () => {
    setOpen((o) => (o === "attach" ? null : "attach"));
    setHoverAdd(null);
    setAttachSecQuery("");
  };

  // 选择二级里的实际指令：作为胶囊加入（多选），并关闭加号菜单
  const pickAddItem = (item) => {
    addChip(item);
    setOpen(null);
    setHoverAdd(null);
    setAttachSecQuery("");
  };

  const skillFiltered = SKILL_CHILDREN.filter((it) =>
    it.title.toLowerCase().includes(attachSecQuery.trim().toLowerCase())
  );
  const expertFiltered = EXPERT_CHILDREN.filter((it) =>
    it.title.toLowerCase().includes(attachSecQuery.trim().toLowerCase())
  );
  const connFiltered = CONN_CHILDREN.filter((it) =>
    it.title.toLowerCase().includes(attachSecQuery.trim().toLowerCase())
  );

  // 连接器行尾开关：切换启用状态
  const toggleConn = (id) => setConnOn((m) => ({ ...m, [id]: !m[id] }));

  // 二级面板内容：技能/专家为「标题在上、正文在下、无图标」，管理项为图标+标题
  const addSub = (key) => {
    if (key === "skill") {
      return (
        <>
          <label className="cc-menu-search">
            <Icon name="search" size={16} className="cc-search-icon" />
            <input
              className="cc-search-input"
              placeholder="搜索技能"
              value={attachSecQuery}
              onChange={(e) => setAttachSecQuery(e.target.value)}
            />
          </label>
          {skillFiltered.map((it) => {
            // 已选中的技能再点一次 = 取消(移除胶囊与对号);面板保持打开,支持多选
            // 选中样式对齐请求权限菜单:标题不变色,对号固定占位于整行右侧
            const picked = cmdChips.some((c) => c.id === it.id);
            return (
              <button
                type="button"
                key={it.id}
                className={"cc-add-line" + (picked ? " is-picked" : "")}
                aria-pressed={picked}
                onClick={() => (picked ? removeChip(it.id) : addChip(asSkillChip(it)))}
              >
                <span className="cc-add-line-main">
                  <span className="cc-add-line-title">{it.title}</span>
                  <span className="cc-add-line-desc">{it.desc}</span>
                </span>
                {picked ? (
                  <span className="cc-add-check">
                    <Icon name="check" size={14} />
                  </span>
                ) : null}
              </button>
            );
          })}
          {skillFiltered.length === 0 ? (
            <div className="cc-space-empty">未找到相关选项</div>
          ) : null}
          <div className="cc-menu-divider" />
          <button type="button" className="cc-add-manage" onClick={() => {}}>
            <Icon src="./assets/uploads/add-skill.svg" size={15} />
            <span>添加技能</span>
          </button>
          <button type="button" className="cc-add-manage" onClick={() => {}}>
            <Icon src="./assets/uploads/manage-skill.svg" size={15} />
            <span>管理技能</span>
          </button>
        </>
      );
    }
    if (key === "expert") {
      return (
        <>
          <label className="cc-menu-search">
            <Icon name="search" size={16} className="cc-search-icon" />
            <input
              className="cc-search-input"
              placeholder="搜索专家"
              value={attachSecQuery}
              onChange={(e) => setAttachSecQuery(e.target.value)}
            />
          </label>
          {expertFiltered.map((it) => (
            <button
              type="button"
              key={it.id}
              className="cc-add-line"
              onClick={() => pickAddItem(it)}
            >
              <span className="cc-add-line-main">
                <span className="cc-add-line-title">{it.title}</span>
                <span className="cc-add-line-desc">{it.desc}</span>
              </span>
            </button>
          ))}
          {expertFiltered.length === 0 ? (
            <div className="cc-space-empty">未找到相关选项</div>
          ) : null}
          <div className="cc-menu-divider" />
          <button type="button" className="cc-add-manage" onClick={() => {}}>
            <Icon name="plus" size={15} />
            <span>添加专家</span>
          </button>
          <button type="button" className="cc-add-manage" onClick={() => {}}>
            <Icon name="settings-2" size={15} />
            <span>管理专家</span>
          </button>
        </>
      );
    }
    if (key === "connector") {
      return (
        <>
          <label className="cc-menu-search">
            <Icon name="search" size={16} className="cc-search-icon" />
            <input
              className="cc-search-input"
              placeholder="搜索连接器"
              value={attachSecQuery}
              onChange={(e) => setAttachSecQuery(e.target.value)}
            />
          </label>
          {connFiltered.map((c) => (
            <div
              key={c.id}
              className="cc-add-conn"
              onClick={() => toggleConn(c.id)}
            >
              <Icon name={c.icon} src={c.src} size={16} className="cc-slash-icon" />
              <span className="cc-add-conn-title">{c.title}</span>
              <button
                type="button"
                className={"cc-add-toggle" + (connOn[c.id] ? " is-on" : "")}
                aria-pressed={!!connOn[c.id]}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleConn(c.id);
                }}
              >
                <span className="cc-add-toggle-knob" />
              </button>
            </div>
          ))}
          {connFiltered.length === 0 ? (
            <div className="cc-space-empty">未找到相关选项</div>
          ) : null}
          <div className="cc-menu-divider" />
          <button type="button" className="cc-add-manage" onClick={() => {}}>
            <Icon name="plus" size={15} />
            <span>添加连接器</span>
          </button>
          <button type="button" className="cc-add-manage" onClick={() => {}}>
            <Icon name="settings-2" size={15} />
            <span>管理连接器</span>
          </button>
        </>
      );
    }
    // add-file
    return ADD_CHILDREN.map((it) => cmdRow(it, pickAddItem));
  };

  // 一级行（+ 菜单）：hover 或点击选中时右侧弹二级（添加文件除外 —— 点击直接唤起本地文件选择）
  const renderAddRoot = (r) => {
    if (r.key === "add-file") {
      return (
        <div key={r.key} className="cc-add-item" onMouseEnter={() => setHoverAdd(null)}>
          <button
            type="button"
            className="cc-slash-row cc-slash-nav cc-add-root"
            onClick={handleAddFile}
          >
            <Icon name={r.icon} src={r.src} size={16} className="cc-slash-icon" />
            <span className="cc-slash-nav-title">{r.title}</span>
            <Icon name="chevron-right" size={14} className="cc-slash-nav-arrow" />
          </button>
        </div>
      );
    }
    return (
      <div
        key={r.key}
        className={
          "cc-add-item" +
          (hoverAdd === r.key ? " is-active" : "") +
          (selectedAdd === r.key ? " is-selected" : "")
        }
        onMouseEnter={() => {
          setHoverAdd(r.key);
          setAttachSecQuery("");
        }}
      >
        <button
          type="button"
          className="cc-slash-row cc-slash-nav cc-add-root"
          onClick={() => {
            /* 点击选中(再次点击取消):选中行常驻背景,二级面板在选中期间不随鼠标离开消失 */
            if (selectedAdd === r.key) {
              setSelectedAdd(null);
              setHoverAdd(null);
            } else {
              setSelectedAdd(r.key);
            }
            setAttachSecQuery("");
          }}
        >
          <Icon name={r.icon} src={r.src} size={16} className="cc-slash-icon" />
          <span className="cc-slash-nav-title">{r.title}</span>
          <Icon name="chevron-right" size={14} className="cc-slash-nav-arrow" />
        </button>
      </div>
    );
  };

  const removeChip = (id) => setCmdChips((cs) => cs.filter((c) => c.id !== id));

  // ---- 添加文件：唤起本地文件选择，选中后生成输入框卡片 ----
  const handleAddFile = () => {
    setOpen(null);
    setHoverAdd(null);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;

    // 20 个上限:超出部分直接拒收
    const room = MAX_UPLOAD_FILES - files.length;
    const accepted = picked.slice(0, Math.max(0, room));
    const overflowCount = picked.length - accepted.length;

    // 100MB 上限:超大的文件进入卡片但标记为上传失败
    let firstOversized = null;
    const additions = accepted.map((f, i) => {
      const failed = f.size > MAX_UPLOAD_SIZE;
      if (failed && !firstOversized) firstOversized = f;
      return {
        id: "file-" + Date.now() + "-" + i,
        name: f.name,
        ext: fileTypeOf(f.name),
        src: fileSrcOf(f.name),
        // 图片类型:生成缩略图预览
        preview: isImageFile(f.name) ? URL.createObjectURL(f) : undefined,
        size: fmtSize(f.size),
        failed,
      };
    });

    if (additions.length) setFiles((prev) => [...prev, ...additions]);

    // 数量超限优先提示;其次提示第一个超大文件
    if (overflowCount > 0) {
      setToast("单次对话最多上传20个附件");
    } else if (firstOversized) {
      setToast(firstOversized.name + "（最大100MB）");
    }

    // 允许再次选择同一文件
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (id) => setFiles((fs) => fs.filter((f) => f.id !== id));

  // 重试上传(演示:重试即成功,清除失败态)
  const retryFile = (id) =>
    setFiles((fs) => fs.map((f) => (f.id === id ? { ...f, failed: false } : f)));

  // 新建项目：关闭菜单、重置表单并弹出居中弹窗
  const openNewProject = () => {
    setOpen(null);
    setNpName("");
    setNpPath("");
    setPathMenu(false);
    setShowNewProject(true);
  };

  // 确认新建：把新项目追加进空间列表并选中
  const confirmNewProject = () => {
    const name = npName.trim();
    if (!name || !npPath.trim()) return;
    const item = { id: "sp-" + Date.now(), name };
    setSpaceList((list) => [...list, item]);
    setSpace(item);
    setSpaceQuery("");
    setShowNewProject(false);
  };

  const closeNewProject = () => {
    setShowNewProject(false);
    setPathMenu(false);
  };

  return (
    <div className={"cc-shell" + (chatMode ? " cc-shell--chat" : "")}>
      {/* 输入框右上角外侧:吉祥鸟装饰(仅首页态显示) */}
      {!chatMode ? (
        <img
          className="cc-shell-mascot"
          src="./assets/uploads/mascot-bird.svg"
          alt=""
          aria-hidden="true"
        />
      ) : null}
      {/* ============ 输入卡片(高度随已选文件行数自适应) ============ */}
      <div
        className={"cc-card" + (chatMode ? " cc-card--chat" : "")}
        style={{ height: fileCardHeight, flexBasis: fileCardHeight }}
      >
        {/* 正文输入区 */}
        <div className="cc-body">
          {files.length > 0 ? (
            <div className="cc-file-list">
              {files.map((f) => (
                <div className="cc-file-card" key={f.id}>
                  <span className="cc-file-icon">
                    {f.preview ? (
                      <img className="cc-file-thumb" src={f.preview} alt={f.name} />
                    ) : (
                      <Icon src={f.src} size={30} />
                    )}
                  </span>
                  <span className="cc-file-info">
                    <span className="cc-file-name" title={f.name}>
                      {f.name}
                    </span>
                    {f.failed ? (
                      <span className="cc-file-meta cc-file-meta-failed">
                        <span className="cc-file-failed">上传失败</span>
                        <button
                          type="button"
                          className="cc-file-retry"
                          onClick={() => retryFile(f.id)}
                        >
                          重试
                        </button>
                      </span>
                    ) : (
                      <span className="cc-file-meta">
                        {f.ext} · {f.size}
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    className="cc-file-x"
                    onClick={() => removeFile(f.id)}
                    aria-label={"移除" + f.name}
                  >
                    <Icon name="x" size={10} />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          {/* 胶囊与输入同行:文字紧跟标签后,单行不换行 */}
          <div className="cc-input-row">
          {cmdChips.length > 0 ? (
            <div className="cc-cmd-chips">
              {cmdChips.map((c) => (
                <span
                  className={
                    "cc-cmd-chip" + (c.closable === false ? " cc-cmd-chip--info" : "")
                  }
                  key={c.id}
                >
                  <Icon name={c.icon} src={c.src} mask={c.mask} size={13} />
                  <span className="cc-cmd-chip-label">{c.title}</span>
                  {c.closable === false ? null : (
                    <button
                      type="button"
                      className="cc-cmd-chip-x"
                      onClick={() => removeChip(c.id)}
                      aria-label={"移除" + c.title}
                    >
                      <Icon name="x" size={10} />
                    </button>
                  )}
                </span>
              ))}
            </div>
          ) : null}
          <textarea
            className="cc-input"
            placeholder={cmdChips.length ? "继续输入你的需求…" : placeholder}
            value={msg}
            onChange={handleInput}
            onKeyDown={onKeyDown}
            rows={1}
            spellCheck={false}
            aria-label="消息输入"
            wrap={cmdChips.length ? "off" : undefined}
          />
          </div>
        </div>

        {/* “/”快捷指令面板位于灰色外框下方（见 shell 底部） */}

        {/* 底部工具栏 */}
        <div className="cc-toolbar">
          <div className="cc-tool-group">
            {/* 加号：二级下拉（对话页向上弹出，避免被视口底部裁切） */}
            <div
              className={
                "cc-drop" +
                (chatMode ? " cc-drop-up" : "") +
                (open === "attach" ? " is-active" : "")
              }
              data-drop
            >
              <button
                type="button"
                className={"cc-ghost" + (open === "attach" ? " is-active" : "")}
                onClick={toggleAttach}
                title="添加内容"
                aria-label="添加内容"
              >
                {/* 展开时显示 ×(收起),收起时显示资源插画 */}
                <Icon
                  name={open === "attach" ? "x" : undefined}
                  src={open === "attach" ? undefined : "./assets/uploads/add-skill.svg"}
                  size={16}
                  className="cc-plus-icon"
                />
              </button>
              {open === "attach" ? (
                <div className="cc-addmenu" onMouseLeave={() => setHoverAdd(null)}>
                  {/* 添加文件 + 分割线，与 技能/专家/连接器 分开 */}
                  {ADD_ROOTS.slice(0, 1).map(renderAddRoot)}
                  <div className="cc-menu-divider" />
                  {ADD_ROOTS.slice(1).map(renderAddRoot)}
                  {/* 二级面板锚定在菜单整体(而非所在行):切换选项时位置不跳动,避免抖动;
                      悬停项优先预览,无悬停时回落到选中项 —— 选中期间面板常驻不消失 */}
                  {activeAdd ? <div className="cc-add-sub">{addSub(activeAdd)}</div> : null}
                </div>
              ) : null}
            </div>

            {/* Agent 模式下拉（对话页向上弹出） */}
            <div
              className={
                "cc-drop" +
                (chatMode ? " cc-drop-up" : "") +
                (open === "mode" ? " is-active" : "")
              }
              data-drop
            >
              <button
                type="button"
                className={"cc-chip" + (open === "mode" ? " is-active" : "")}
                onClick={() => toggle("mode")}
                disabled={chatMode}
              >
                <Icon name={mode.icon} src={mode.src} size={16} />
                <span className="cc-chip-label">{mode.label}</span>
                <Icon name="chevron-down" size={13} className="cc-chev" />
              </button>
              {open === "mode" ? (
                <DropMenu options={AGENT_MODES} selectedId={mode.id} onPick={pick(setMode)} />
              ) : null}
            </div>

            {/* 请求权限下拉（对话页向上弹出） */}
            <div
              className={
                "cc-drop" +
                (chatMode ? " cc-drop-up" : "") +
                (open === "permission" ? " is-active" : "")
              }
              data-drop
            >
              <button
                type="button"
                className={
                  "cc-chip" +
                  (open === "permission" ? " is-active" : "") +
                  (permission.id === "full" ? " cc-chip-danger" : "")
                }
                onClick={() => toggle("permission")}
              >
                <Icon name={permission.icon} src={permission.src} size={16} />
                <span className="cc-chip-label">{permission.label}</span>
                <Icon name="chevron-down" size={13} className="cc-chev" />
              </button>
              {open === "permission" ? (
                <DropMenu
                  options={PERMISSIONS}
                  selectedId={permission.id}
                  onPick={(item) => {
                    // 完全访问：先弹二次确认，确认后生效
                    if (item.id === "full") {
                      setOpen(null);
                      setConfirmFull(true);
                      return;
                    }
                    pick(setPermission)(item);
                  }}
                />
              ) : null}
            </div>
          </div>

          <div className="cc-tool-group">
            {/* 模型选择下拉（auto + 外部传入的模型列表，靠右对齐；对话页向上弹出） */}
            <div
              className={
                "cc-drop cc-drop-right" +
                (chatMode ? " cc-drop-up" : "") +
                (open === "model" ? " is-active" : "")
              }
              data-drop
            >
              <button
                type="button"
                className={"cc-chip" + (open === "model" ? " is-active" : "")}
                onClick={() => toggle("model")}
              >
                <Icon name={model.icon} src={model.src} size={16} />
                <span className="cc-chip-label">{model.label}</span>
                <Icon name="chevron-down" size={13} className="cc-chev" />
              </button>
              {open === "model" ? (
                <DropMenu options={modelOptions} selectedId={model.id} onPick={pick(setModel)} />
              ) : null}
            </div>

            {/* 发送/停止按钮 */}
            <button
              type="button"
              className={"cc-send" + (sent && !chatMode ? " is-sent" : "")}
              onClick={chatMode && isGenerating ? onStop : send}
              disabled={!chatMode && !canSend}
              aria-label={chatMode && isGenerating ? "停止" : "发送"}
            >
              {chatMode && isGenerating ? (
                /* 生成中：显示 generating.svg，点击停止流式打印 → 图标变为 send-inactive.svg */
                <Icon src="./assets/uploads/generating.svg" size={32} />
              ) : chatMode ? (
                /* 会话页空闲：正常发送按钮 */
                <Icon
                  src={
                    canSend
                      ? "./assets/uploads/send-active.svg"
                      : "./assets/uploads/send-inactive.svg"
                  }
                  size={32}
                />
              ) : sent ? (
                <Icon name="check" size={18} />
              ) : (
                /* 有内容时切换 send-active(蓝底),否则 send-inactive(灰底);图形自带圆底 */
                <Icon
                  src={
                    canSend
                      ? "./assets/uploads/send-active.svg"
                      : "./assets/uploads/send-inactive.svg"
                  }
                  size={32}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ============ 灰色外框下方：选择项目空间(仅首页态显示) ============ */}
      {!chatMode ? (
      <div className="cc-footer">
        <div className={"cc-drop" + (open === "space" ? " is-active" : "")} data-drop>
          <button
            type="button"
            className={"cc-space" + (open === "space" ? " is-active" : "")}
            onClick={() => toggle("space")}
          >
            <Icon src="./assets/uploads/select-project-space.svg" size={16} />
            <span className="cc-chip-label">{space ? space.name : "选择项目空间"}</span>
          </button>
          {open === "space" ? (
            <div className="cc-menu cc-space-menu">
              {/* 顶部搜索：放大镜 + 输入，无底色 */}
              <label className="cc-menu-search">
                <Icon name="search" size={14} className="cc-search-icon" />
                <input
                  className="cc-search-input"
                  placeholder="搜索项目空间"
                  value={spaceQuery}
                  onChange={(e) => setSpaceQuery(e.target.value)}
                />
              </label>

              {/* 空间列表 */}
              <div className="cc-space-list">
                {filteredSpaces.map((s) => {
                  const isSel = space && space.id === s.id;
                  return (
                    <button
                      type="button"
                      key={s.id}
                      className={"cc-menu-item" + (isSel ? " is-selected" : "")}
                      onClick={() => {
                        setSpace(s);
                        setOpen(null);
                      }}
                    >
                      <Icon name="folder" size={16} className="cc-mitem-icon" />
                      <span className="cc-mitem-main">
                        <span className="cc-mitem-label">{s.name}</span>
                      </span>
                      <span className="cc-menu-check">
                        {isSel ? <Icon name="check" size={14} /> : null}
                      </span>
                    </button>
                  );
                })}
                {filteredSpaces.length === 0 ? (
                  <div className="cc-space-empty">未找到相关项目空间</div>
                ) : null}
              </div>

              {/* 横向分割线 */}
              <div className="cc-menu-divider" />

              {/* 管理操作 */}
              <button
                type="button"
                className="cc-menu-item"
                onClick={openNewProject}
              >
                <Icon name="plus" size={15} className="cc-mitem-icon" />
                <span className="cc-mitem-main">
                  <span className="cc-mitem-label">新建项目</span>
                </span>
              </button>
              <button
                type="button"
                className="cc-menu-item"
                onClick={() => {
                  setSpace(null);
                  setSpaceQuery("");
                  setOpen(null);
                }}
              >
                <Icon name="ban" size={15} className="cc-mitem-icon" />
                <span className="cc-mitem-main">
                  <span className="cc-mitem-label">不使用项目</span>
                </span>
              </button>
            </div>
          ) : null}
        </div>

        {/* 右侧:运行环境(本地/云端)下拉,面板向下弹出、右对齐 */}
        <div
          className={
            "cc-drop cc-drop-right cc-drop-local" +
            (open === "runtime" ? " is-active" : "")
          }
          data-drop
        >
          <button
            type="button"
            className={"cc-local" + (open === "runtime" ? " is-active" : "")}
            onClick={() => toggle("runtime")}
          >
            <Icon name={runtime.icon} src={runtime.src} size={14} />
            <span className="cc-chip-label">{runtime.label}</span>
          </button>
          {open === "runtime" ? (
            <DropMenu options={RUNTIMES} selectedId={runtime.id} onPick={pick(setRuntime)} />
          ) : null}
        </div>
      </div>
      ) : null}

      {/* 隐藏的原生文件选择器（纯浏览器可用） */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        style={{ display: "none" }}
        tabIndex={-1}
        onChange={handleFileChange}
        aria-hidden="true"
      />

      {/* ============ “/”快捷指令面板：悬于灰色外框下方 ============ */}
      {slashOpen && (slashAdd.length > 0 || slashSkills.length > 0 || slashExperts.length > 0) ? (
        <div className={"cc-slash" + (chatMode ? " cc-slash--up" : "")} data-slash>
          {/* 独立小节：添加文件 */}
          {slashAdd.map((it) => cmdRow(it, pickSlash))}
          {/* 技能组 */}
          {slashSkills.length > 0 ? <div className="cc-slash-group-label">技能</div> : null}
          {slashSkills.map((it) => cmdRow(asSkillChip(it), pickSlash))}
          {/* 专家组 */}
          {slashExperts.length > 0 ? <div className="cc-slash-group-label">专家</div> : null}
          {slashExperts.map((it) => cmdRow(it, pickSlash))}
        </div>
      ) : null}

      {/* ============ 新建项目 · 居中弹窗 ============ */}
      {showNewProject ? (
        <div
          className="cc-scrim"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeNewProject();
          }}
        >
          <div className="cc-modal" role="dialog" aria-modal="true" aria-label="新建项目">
            <div className="cc-modal-head">
              <h3 className="cc-modal-title">新建项目</h3>
              <button
                type="button"
                className="cc-modal-close"
                onClick={closeNewProject}
                aria-label="关闭"
              >
                <Icon name="x" size={16} />
              </button>
            </div>

            <div className="cc-modal-body">
              <label className="cc-field-label">
                项目名称 <span className="cc-required">*</span>
              </label>
              <input
                className="cc-field-input"
                placeholder="请输入项目名称"
                value={npName}
                onChange={(e) => setNpName(e.target.value)}
              />

              <label className="cc-field-label">
                项目路径 <span className="cc-required">*</span>
              </label>
              <div className="cc-path-wrap">
                <input
                  className="cc-field-input cc-path-input"
                  placeholder="点击选择本地文件夹路径"
                  value={npPath}
                  readOnly
                  onClick={() => setPathMenu((v) => !v)}
                />
                <Icon name="folder-open" size={16} className="cc-path-pick-icon" />
                {pathMenu ? (
                  <div className="cc-path-pop">
                    {MOCK_DIRS.map((d) => (
                      <button
                        type="button"
                        key={d.id}
                        className="cc-path-option"
                        onClick={() => {
                          setNpPath(d.path);
                          setPathMenu(false);
                        }}
                      >
                        <Icon name="folder" size={15} className="cc-mitem-icon" />
                        <span className="cc-path-name">{d.path}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <p className="cc-path-note">
                预览为模拟目录选择；桌面端接入系统对话框后可返回真实路径
              </p>
            </div>

            <div className="cc-modal-foot">
              <button type="button" className="cc-btn cc-btn-ghost" onClick={closeNewProject}>
                取消
              </button>
              <button
                type="button"
                className="cc-btn cc-btn-primary"
                disabled={!npName.trim() || !npPath.trim()}
                onClick={confirmNewProject}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ============ 完全访问 · 二次确认弹窗 ============ */}
      {confirmFull ? (
        <div
          className="cc-scrim"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setConfirmFull(false);
          }}
        >
          <div
            className="cc-modal cc-modal-confirm"
            role="dialog"
            aria-modal="true"
            aria-label="确认允许完全访问？"
          >
            <div className="cc-modal-head cc-modal-head-warn">
              <Icon name="shield-alert" size={20} className="cc-confirm-warn" />
              <h3 className="cc-modal-title">确认允许完全访问？</h3>
            </div>
            <p className="cc-confirm-body">
              在完全访问模式下，AI无需你的批准即可编辑你电脑上的任何文件，并执行可联网的命令。启用完全访问权限前请谨慎评估。
            </p>
            <p className="cc-confirm-body cc-confirm-body-risk">
              此操作将显著增加数据丢失、泄露或异常行为的风险。
            </p>
            <div className="cc-modal-foot">
              <button
                type="button"
                className="cc-btn cc-btn-ghost"
                onClick={() => setConfirmFull(false)}
              >
                取消
              </button>
              <button
                type="button"
                className="cc-btn cc-btn-primary"
                onClick={() => {
                  setPermission(PERMISSIONS.find((p) => p.id === "full"));
                  setConfirmFull(false);
                }}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ============ 顶部居中提示(toast) ============ */}
      {toast ? (
        <div className="cc-toast" role="status">
          <span className="cc-toast-icon">
            <Icon name="x" size={12} />
          </span>
          <span className="cc-toast-text">{toast}</span>
          <button
            type="button"
            className="cc-toast-close"
            onClick={() => setToast("")}
            aria-label="关闭提示"
          >
            <Icon mask="./assets/uploads/icon/function/close.svg" size={14} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
