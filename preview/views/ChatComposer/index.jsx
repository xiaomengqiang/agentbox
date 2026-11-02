import { useState, useEffect, useRef } from "react";
import { Icon } from "../../components/Icon/index.jsx";
import "./index.css";

/* ================= 配置数据（下拉选项） ================= */
const AGENT_MODES = [
  {
    id: "single",
    label: "单Agent模式",
    icon: "bot",
    src: "./assets/uploads/single-agent-mode.svg",
    desc: "在安全沙箱内自动执行，超出范围时会请求你的允许",
  },
  {
    id: "swarm",
    label: "蜂群模式",
    icon: "network",
    desc: "由多个子Agent分工协作完成任务，适合结构复杂或需要协同处理的场景",
  },
];

const PERMISSIONS = [
  {
    id: "request",
    label: "请求权限",
    icon: "hand",
    src: "./assets/uploads/request-permission.svg",
    desc: "在安全沙箱内自动执行，超出范围时会请求你的允许",
  },
  {
    id: "full",
    label: "完全访问",
    icon: "shield-alert",
    desc: "自动执行所有操作，可能涉及文件修改或外部执行等敏感操作",
  },
];

/* 运行环境:本地/云端 */
const RUNTIMES = [
  {
    id: "local",
    label: "本地模式",
    icon: "hard-drive",
    desc: "项目运行于本地电脑，数据与文件存储在本地设备中",
  },
  {
    id: "cloud",
    label: "云端模式",
    icon: "cloud",
    desc: "项目运行于一体机云端环境，数据与文件存储在一体机中",
  },
];

/* 模型数据来自外部（可覆盖），此处为默认模拟数据；auto 恒为第一项。
   src 指向 assets/uploads 下的真实品牌 logo（优先展示），icon 作为无图兜底 */
const DEFAULT_MODELS = [
  { id: "deepseek", label: "Deepseek-V4-Flash", src: "./assets/uploads/deepseek.png", icon: "cpu" },
  { id: "glm-52", label: "GLM-5.2", src: "./assets/uploads/glm.png", icon: "brain" },
  { id: "glm-5v", label: "GLM-5v-Turbo", src: "./assets/uploads/glm.png", icon: "zap" },
  { id: "minimax-m3", label: "MiniMax-M3", src: "./assets/uploads/minimax.png", icon: "layers" },
];

const SPACES = [
  { id: "onboard", name: "项目新手引导" },
  { id: "personal", name: "个人工作" },
  { id: "onboard-duplicate", name: "项目新手引导" },
];

const ATTACH_ITEMS = [
  { id: "file", label: "上传文件", icon: "paperclip" },
  { id: "code", label: "粘贴代码", icon: "braces" },
  { id: "text", label: "粘贴文本", icon: "type" },
];

/* 纯浏览器拿不到本地绝对路径：用最近目录模拟系统目录选择器（真实桌面端换 Electron showOpenDialog 即可） */
const MOCK_DIRS = [
  { id: "dir-1", path: "C:\\Workspace\\agent-demo" },
  { id: "dir-2", path: "D:\\Projects\\glm-copilot" },
  { id: "dir-3", path: "C:\\Users\\demo\\Documents\\chat-agent" },
];

/* ============ 通用行渲染与文件工具 ============ */
/* 文件卡片：取扩展名 / 图标 / 可读容量 */
function fileTypeOf(name) {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop().toUpperCase() : "FILE";
}

/* 文件类型 → 内置彩色图标（文件/图片/压缩包） */
function fileSrcOf(name) {
  const ext = fileTypeOf(name);
  if (["PNG", "JPG", "JPEG", "GIF", "WEBP", "SVG", "BMP"].includes(ext))
    return "./assets/uploads/file-image.svg";
  if (["ZIP", "RAR", "7Z", "TAR", "GZ", "TGZ", "BZ2"].includes(ext))
    return "./assets/uploads/file-zip.svg";
  return "./assets/uploads/file-doc.svg";
}

function fmtSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

/* 复用行：图标 + 左对齐标题 + 右对齐正文 */
const ADD_FILE_CMD = { id: "add-file", title: "添加文件", icon: "paperclip" };

const SLASH_SKILLS = [
  { id: "file-summary", title: "文件总结", icon: "file-text", desc: "提炼文档要点并生成结构化总结" },
  {
    id: "doc-convert",
    title: "文档转换",
    icon: "file-output",
    desc: "支持在 Word、Excel、PDF、Markdown 与图片之间批量互转，自动保留目录、表格与样式排版，转换结果可直接预览下载",
  },
  { id: "data-analyze", title: "数据分析", icon: "chart-column", desc: "透视数据并输出图表与业务洞察" },
];

const SLASH_EXPERTS = [
  { id: "dev-code", title: "软件开发", icon: "code-xml", desc: "理解需求并输出可运行的实现方案" },
  {
    id: "code-review",
    title: "代码审查",
    icon: "scan-search",
    desc: "按可读性、性能、安全与可维护性逐项审查代码改动，标注风险等级并给出可直接落地的修改建议，覆盖主流语言与框架",
  },
  { id: "product-design", title: "产品设计", icon: "palette", desc: "梳理用户流程并生成设计方案" },
];

/* ============ 加号(+)下拉：两级结构 ============ */
const ADD_ROOTS = [
  { key: "add-file", title: "添加文件", icon: "paperclip" },
  { key: "skill", title: "技能", icon: "wrench" },
  { key: "expert", title: "专家", icon: "user-round" },
  { key: "connector", title: "连接器", icon: "plug" },
];

const ADD_CHILDREN = [
  { id: "add-upload", title: "上传文件", icon: "paperclip" },
  { id: "add-code", title: "粘贴代码", icon: "braces" },
  { id: "add-text", title: "粘贴文本", icon: "type" },
];

/* 技能二级：含搜索 + 底部管理项 */
const SKILL_CHILDREN = [
  { id: "doc-summary", title: "文档总结", icon: "file-text", desc: "提炼文档要点并生成结构化总结" },
  {
    id: "doc-convert-2",
    title: "文档转换",
    icon: "file-output",
    desc: "支持在 Word、Excel、PDF、Markdown 与图片之间批量互转，自动保留目录、表格与样式排版，转换结果可直接预览下载",
  },
  { id: "data-analyze-2", title: "数据分析", icon: "chart-column", desc: "透视数据并输出图表与业务洞察" },
];

const EXPERT_CHILDREN = [
  { id: "dev-code-2", title: "软件开发", icon: "code-xml", desc: "理解需求并输出可运行的实现方案" },
  {
    id: "code-review-2",
    title: "代码审查",
    icon: "scan-search",
    desc: "按可读性、性能、安全与可维护性逐项审查代码改动，标注风险等级并给出可直接落地的修改建议，覆盖主流语言与框架",
  },
  { id: "product-design-2", title: "产品设计", icon: "palette", desc: "梳理用户流程并生成设计方案" },
];

/* 连接器二级（无正文，行尾为开关，底部带管理项；src 为真实 logo） */
const CONN_CHILDREN = [
  { id: "conn-github", title: "GitHub", icon: "git-branch", src: "./assets/uploads/github.png" },
  { id: "conn-txdocs", title: "腾讯文档", icon: "file-spreadsheet", src: "./assets/uploads/txdocs.png" },
];

const ADD_LEVELS = {
  "add-file": { key: "add-file", title: "添加文件", items: ADD_CHILDREN },
  skill: { key: "skill", title: "技能", items: SKILL_CHILDREN, searchable: true, manage: true },
  expert: { key: "expert", title: "专家", items: EXPERT_CHILDREN },
  connector: { key: "connector", title: "连接器", items: CONN_CHILDREN },
};

/* ================= 通用下拉菜单面板 ================= */
function DropMenu({ options, selectedId, onPick }) {
  return (
    <div className="cc-menu">
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
    modeId = "single",
    permissionId = "request",
    modelId = "auto",
    models = DEFAULT_MODELS,
    spaceId = "",
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
  // 加号(+)下拉：一级 hover 时向右侧弹出二级
  const [hoverAdd, setHoverAdd] = useState(null); // 当前悬停的一级 key
  const [attachSecQuery, setAttachSecQuery] = useState("");
  // 连接器开关状态
  const [connOn, setConnOn] = useState({});

  const canSend = msg.trim().length > 0;

  // 点击组件外部任意位置时关闭下拉
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!e.target.closest("[data-drop]")) setOpen(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // 点击 “/”指令菜单外（且不在输入区）时关闭
  useEffect(() => {
    if (!slashOpen) return;
    const onDown = (e) => {
      if (!e.target.closest("[data-slash]") && !e.target.closest(".cc-input")) {
        setSlashOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [slashOpen]);

  const toggle = (key) => setOpen(open === key ? null : key);

  // 选中菜单项：更新状态并收起
  const pick = (setter) => (item) => {
    setter(item);
    setOpen(null);
  };

  // 模拟发送：清空输入、指令胶囊与文件卡片 + 按钮闪现反馈
  const send = () => {
    if (!canSend || sent) return;
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

  // 添加胶囊（去重，支持多选）
  const addChip = (item) =>
    setCmdChips((cs) =>
      cs.some((c) => c.id === item.id)
        ? cs
        : [...cs, { id: item.id, title: item.title, icon: item.icon }]
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
          {skillFiltered.map((it) => (
            <button
              type="button"
              key={it.id}
              className="cc-add-line"
              onClick={() => pickAddItem(it)}
            >
              <span className="cc-add-line-title">{it.title}</span>
              <span className="cc-add-line-desc">{it.desc}</span>
            </button>
          ))}
          {skillFiltered.length === 0 ? (
            <div className="cc-space-empty">未找到相关选项</div>
          ) : null}
          <div className="cc-menu-divider" />
          <button type="button" className="cc-add-manage" onClick={() => {}}>
            <Icon name="plus" size={15} />
            <span>添加技能</span>
          </button>
          <button type="button" className="cc-add-manage" onClick={() => {}}>
            <Icon name="settings-2" size={15} />
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
              <span className="cc-add-line-title">{it.title}</span>
              <span className="cc-add-line-desc">{it.desc}</span>
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

  // 一级行（+ 菜单），hover 时右侧弹二级；「添加文件」无二级，点击唤起本地文件选择
  const renderAddRoot = (r) => {
    if (r.key === "add-file") {
      return (
        <div key={r.key} className="cc-add-item" onMouseEnter={() => setHoverAdd(null)}>
          <button
            type="button"
            className="cc-slash-row cc-slash-nav cc-add-root"
            onClick={handleAddFile}
          >
            <Icon name={r.icon} size={16} className="cc-slash-icon" />
            <span className="cc-slash-nav-title">{r.title}</span>
            <Icon name="chevron-right" size={14} className="cc-slash-nav-arrow" />
          </button>
        </div>
      );
    }
    return (
      <div
        key={r.key}
        className={"cc-add-item" + (hoverAdd === r.key ? " is-active" : "")}
        onMouseEnter={() => {
          setHoverAdd(r.key);
          setAttachSecQuery("");
        }}
      >
        <button type="button" className="cc-slash-row cc-slash-nav cc-add-root">
          <Icon name={r.icon} size={16} className="cc-slash-icon" />
          <span className="cc-slash-nav-title">{r.title}</span>
          <Icon name="chevron-right" size={14} className="cc-slash-nav-arrow" />
        </button>
        {/* 右侧悬浮二级面板 */}
        {hoverAdd === r.key ? <div className="cc-add-sub">{addSub(r.key)}</div> : null}
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
    setFiles((prev) => [
      ...prev,
      ...picked.map((f, i) => ({
        id: "file-" + Date.now() + "-" + i,
        name: f.name,
        ext: fileTypeOf(f.name),
        src: fileSrcOf(f.name),
        size: fmtSize(f.size),
      })),
    ]);
    // 允许再次选择同一文件
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (id) => setFiles((fs) => fs.filter((f) => f.id !== id));

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
    <div className="cc-shell">
      {/* 输入框右上角外侧:吉祥鸟装饰(不参与交互) */}
      <img
        className="cc-shell-mascot"
        src="./assets/uploads/mascot-bird.svg"
        alt=""
        aria-hidden="true"
      />
      {/* ============ 输入卡片 792 × 140 ============ */}
      <div className="cc-card">
        {/* 正文输入区 */}
        <div className="cc-body">
          {files.length > 0 ? (
            <div className="cc-file-list">
              {files.map((f) => (
                <div className="cc-file-card" key={f.id}>
                  <span className="cc-file-icon">
                    <Icon src={f.src} size={30} />
                  </span>
                  <span className="cc-file-info">
                    <span className="cc-file-name" title={f.name}>
                      {f.name}
                    </span>
                    <span className="cc-file-meta">
                      {f.ext} · {f.size}
                    </span>
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
          {cmdChips.length > 0 ? (
            <div className="cc-cmd-chips">
              {cmdChips.map((c) => (
                <span className="cc-cmd-chip" key={c.id}>
                  <Icon name={c.icon} size={13} />
                  <span className="cc-cmd-chip-label">{c.title}</span>
                  <button
                    type="button"
                    className="cc-cmd-chip-x"
                    onClick={() => removeChip(c.id)}
                    aria-label={"移除" + c.title}
                  >
                    <Icon name="x" size={10} />
                  </button>
                </span>
              ))}
            </div>
          ) : null}
          <textarea
            className="cc-input"
            placeholder={cmdChips.length ? "继续输入你的需求…" : '需要帮你做些什么?输入"/"快速引用技能及指令'}
            value={msg}
            onChange={handleInput}
            onKeyDown={onKeyDown}
            rows={1}
            spellCheck={false}
            aria-label="消息输入"
          />
        </div>

        {/* “/”快捷指令面板位于灰色外框下方（见 shell 底部） */}

        {/* 底部工具栏 */}
        <div className="cc-toolbar">
          <div className="cc-tool-group">
            {/* 加号：二级下拉（展开时旋转 45°，菜单向下弹出） */}
            <div className={"cc-drop" + (open === "attach" ? " is-active" : "")} data-drop>
              <button
                type="button"
                className={"cc-ghost" + (open === "attach" ? " is-active" : "")}
                onClick={toggleAttach}
                title="添加内容"
                aria-label="添加内容"
              >
                <Icon src="./assets/uploads/add-skill.svg" size={16} className="cc-plus-icon" />
              </button>
              {open === "attach" ? (
                <div className="cc-addmenu" onMouseLeave={() => setHoverAdd(null)}>
                  {/* 添加文件 + 分割线，与 技能/专家/连接器 分开 */}
                  {ADD_ROOTS.slice(0, 1).map(renderAddRoot)}
                  <div className="cc-menu-divider" />
                  {ADD_ROOTS.slice(1).map(renderAddRoot)}
                </div>
              ) : null}
            </div>

            {/* Agent 模式下拉 */}
            <div className={"cc-drop" + (open === "mode" ? " is-active" : "")} data-drop>
              <button
                type="button"
                className={"cc-chip" + (open === "mode" ? " is-active" : "")}
                onClick={() => toggle("mode")}
              >
                <Icon name={mode.icon} src={mode.src} size={16} />
                <span className="cc-chip-label">{mode.label}</span>
                <Icon name="chevron-down" size={13} className="cc-chev" />
              </button>
              {open === "mode" ? (
                <DropMenu options={AGENT_MODES} selectedId={mode.id} onPick={pick(setMode)} />
              ) : null}
            </div>

            {/* 请求权限下拉 */}
            <div className={"cc-drop" + (open === "permission" ? " is-active" : "")} data-drop>
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
            {/* 模型选择下拉（auto + 外部传入的模型列表，靠右对齐） */}
            <div className={"cc-drop cc-drop-right" + (open === "model" ? " is-active" : "")} data-drop>
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

            {/* 发送按钮 */}
            <button
              type="button"
              className={"cc-send" + (sent ? " is-sent" : "")}
              onClick={send}
              disabled={!canSend}
              aria-label="发送"
            >
              {sent ? (
                <Icon name="check" size={18} />
              ) : (
                <Icon src="./assets/uploads/icon-send.svg" size={18} className="cc-send-plane" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ============ 灰色外框下方：选择项目空间 ============ */}
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

        {/* 右侧:运行环境(本地/云端)下拉,面板向上弹出、右对齐 */}
        <div
          className={
            "cc-drop cc-drop-up cc-drop-right cc-drop-local" +
            (open === "runtime" ? " is-active" : "")
          }
          data-drop
        >
          <button
            type="button"
            className={"cc-local" + (open === "runtime" ? " is-active" : "")}
            onClick={() => toggle("runtime")}
          >
            <Icon name={runtime.icon} size={14} />
            <span className="cc-chip-label">{runtime.label}</span>
          </button>
          {open === "runtime" ? (
            <DropMenu options={RUNTIMES} selectedId={runtime.id} onPick={pick(setRuntime)} />
          ) : null}
        </div>
      </div>

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
        <div className="cc-slash" data-slash>
          {/* 独立小节：添加文件 */}
          {slashAdd.map((it) => cmdRow(it, pickSlash))}
          {/* 技能组 */}
          {slashSkills.length > 0 ? <div className="cc-slash-group-label">技能</div> : null}
          {slashSkills.map((it) => cmdRow(it, pickSlash))}
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
    </div>
  );
}
