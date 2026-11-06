import { useState, useEffect, useMemo, useRef } from "react";
import { Icon } from "../../components/Icon/index.jsx";
import { buildSwarmBlocks, buildSwarmFlowBlocks } from "./swarm.jsx";
import SwarmPanel from "../SwarmPanel/index.jsx";
import { short } from "../../src/utils/text.js";
import {
  PROJECT_FILES_SVG,
  ZOOM_SVG,
  W2M_MEMBERS,
  W2M_DAYS,
  W2M_HOURS,
  W2M_DATA,
  W2M_RECOS,
  W2M_FEATS,
  W2M_STATS,
  W2M_FEED,
  W2M_MOBILE_NOTES,
  SWARM_ARTIFACTS
} from "../../src/constants/chatSession.js";
import { useClickOutside } from "../../src/hook/useClickOutside.js";
import "./index.css";

/* ================= 会话数据构造 ================= */
/* 会话标题前的显示器图标:与左侧对话项(ChatComposer 输入框联调)尾随的电脑图标一致,表示会话进行中 */
const MONITOR_ICON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.5" y="3" width="13" height="9" rx="1.5" stroke="black" strokeOpacity="0.4" strokeLinejoin="round"/><path d="M8 12v2.5" stroke="black" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.5 14.5h5" stroke="black" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

/* 依据发送载荷构造一次 Agent 回复：结构化回答块流。
   块类型："p" 段落 / "li" 列表项 / "status" 图标状态行（随流式逐字输出）/
   "perm-wait" 授权等待标记 — 流式输出到该块时挂起，授权弹框在输入框上方弹出，
   允许后继续输出其后的块；拒绝则跳过剩余内容，任务中止。 */
export function buildAgentReply(payload) {
  /* 失败注入：用户消息包含「失败 / 中断 / fail」时，冲刺阶段打完文案后触发生成失败（测试失败流程） */
  const failMode = /失败|中断|fail/i.test(payload.text || "");
  const swarm = payload.meta && payload.meta.modeId === "swarm";

  /* 蜂群模式：多子Agent并行协作流程（由 swarm.jsx 独立模块处理） */
  const swarmPre = swarm ? buildSwarmBlocks(payload) : [];

  /* ---- 单Agent模式：默认流程 ---- */
  const singlePre = [
    {
      type: "p",
      cls: "cs-node-intro",
      text: "好的，我会结合你最近的讨论内容，先整理汇报结构，再通过代码生成完整的演示文件。",
    },
    {
      type: "status",
      cls: "cs-node-explore",
      src: "./assets/uploads/search.svg",
      text: "已探索 12 个文件，4 个列表",
      hideOnDone: true, // 生成完成后隐藏
    },
    {
      type: "p",
      cls: "cs-node-outline",
      text: "我已经梳理好整体内容，将按照 18 页结构生成，并把首页交互和智慧推荐作为重点展开。",
      hideOnDone: true, // 生成完成后隐藏
    },
    {
      type: "status",
      cls: "cs-node-thinking",
      src: "./assets/uploads/think.webp",
      text: "思考中：好消息，思路已经有眉目了",
      endsThinking: true, // 该块完成 → 状态栏由「思考中」变「已思考」
      transient: true, // 思考完成后隐藏该节点
    },
    {
      type: "status",
      cls: "cs-node-reading",
      icon: "file-search",
      text: "正在读取文档",
      gradient: true,
      endsReading: true, // 读取完成 → 状态栏由「已思考」变「生成中」
      transient: true, // 读取完成后隐藏该节点
      /* 读取中随进度逐条输出文档相关内容 */
      reading: [
        {
          name: "会议纪要-产品评审.md",
          excerpt: "确认汇报主线：以首页交互改版与智慧推荐作为核心展开…",
        },
        {
          name: "需求清单.xlsx",
          excerpt: "共梳理 18 页结构，其中第 3、7 页为交互重点页…",
        },
        {
          name: "项目规划.docx",
          excerpt: "演示文件需覆盖背景现状、方案设计与落地路线图三部分…",
        },
      ],
    },
  ];

  /* 授权等待（仅单Agent模式）+ 冲刺 + 产物输出 */
  const blocks = [...(swarm ? swarmPre : singlePre)];
  if (!swarm) {
    blocks.push({
      type: "perm-wait",
      cls: "cs-node-permission",
      title: "操作授权",
      desc: "申请新建GitHub仓库【When2meet】，并将该项目部署至个人网站/测试环境",
      short: "新建GitHub仓库【When2meet】",
    });
  } else {
    /* 蜂群模式：表单后插入完整协作流程，再接冲刺+产物 */
    blocks.push(...buildSwarmFlowBlocks(payload));
  }
  blocks.push(
    {
      type: "status",
      cls: "cs-node-sprint",
      src: "./assets/uploads/bird.webp",
      text: "咻一一青鸟正在最终冲刺中......",
      linear: true,
      transient: true,
      failHere: failMode,
    },
    {
      type: "filecontent",
      cls: "cs-node-filecontent",
      noPerm: true,
      title: "汇报演示.html · HTML",
      lines: [
        "• 汇报演示 · When2meet 项目",
        "• 背景与目标 —— 会议时间协调痛点与改进机会",
        "• 用户画像 —— 目标人群与核心使用场景",
        "• 首页交互改版 —— 布局与动效方案（重点）",
        "• 智慧推荐 —— 推荐策略与算法链路（重点）",
        "• 竞品分析 —— Doodle、Calendly 功能对比",
        "• 信息架构 —— 站点地图与页面跳转关系",
        "• 交互流程 —— 创建/参与/分享三大主流程",
        "• 视觉规范 —— 色彩、字体与间距系统",
        "• 动效设计 —— 微交互与转场动效规范",
        "• 数据看板 —— 关键指标定义与埋点方案",
        "• 技术方案 —— 前端架构与性能预算",
        "• 性能优化 —— 首屏加载与包体积优化",
        "• A/B 实验 —— 实验设计与分流策略",
        "• 数据验证 —— 核心指标与 A/B 结论",
        "• 风险与应对 —— 识别、评估与缓解措施",
        "• 团队分工 —— 角色职责与协作机制",
        "• 排期计划 —— 三期迭代里程碑",
        "• 路线图与 Q&A —— 长期规划与讨论",
      ],
    },
    {
      type: "summary",
      cls: "cs-node-summary-card",
      noPerm: true,
      title: "产物汇总",
    },
    {
      type: "artifacts",
      cls: "cs-node-artifacts",
      noPerm: true,
      /* 蜂群模式的最终产物为 When2meet 小程序(与协作流程各环节的产出一致);
         单Agent模式保持汇报演示文档 */
      files: [
        swarm
          ? {
              id: "art-1",
              name: "When2meet.html",
              size: "132.6 KB",
              src: "./assets/uploads/icon/file-type/filled/code.svg",
            }
          : {
              id: "art-1",
              name: "汇报演示.html",
              size: "86.5 KB",
              src: "./assets/uploads/docx.svg",
            },
      ],
    },
    /* 编辑统计 + 变更胶囊 + 撤销/审核按钮(仅单Agent模式) */
    ...(swarm
      ? []
      : [
          {
            type: "edit-stats",
            cls: "cs-node-edit-stats",
            noPerm: true,
            text: "编辑了18个文本",
            additions: "+956",
            deletions: "-0",
          },
        ]),
  );
  /* 蜂群模式跳过 filecontent、summary 和冲刺节点（已在协作流程中覆盖） */
  if (swarm) {
    const fcIdx = blocks.findIndex((b) => b.type === "filecontent");
    if (fcIdx !== -1) blocks.splice(fcIdx, 1);
    const smIdx = blocks.findIndex((b) => b.type === "summary");
    if (smIdx !== -1) blocks.splice(smIdx, 1);
    const spIdx = blocks.findIndex((b) => b.cls === "cs-node-sprint");
    if (spIdx !== -1) blocks.splice(spIdx, 1);
  }

  return { blocks, failMode };
}

/* ================= 用户消息气泡 ================= */
function UserBubble({ msg, onFileAction }) {
  const chips = msg.chips || [];
  const files = msg.files || [];
  return (
    <div className="cs-user-wrap">
      {files.length > 0 ? (
        /* 附件卡片:复用输入框 cc-file-card 同款样式(图标/缩略图 + 名称 + 类型·大小,
           hover 显移除按钮,失败态带重试);操作经 onFileAction 回写消息数据 */
        <div className="cs-user-attach">
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
                      onClick={() => onFileAction && onFileAction(msg.id, f.id, "retry")}
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
                onClick={() => onFileAction && onFileAction(msg.id, f.id, "remove")}
                aria-label={"移除" + f.name}
              >
                <Icon name="x" size={10} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <div className="cs-user-bubble">
        {/* 首页输入框添加的技能/专家等指令胶囊 → 同步为气泡内标签;
            图标按输入框胶囊同款渲染(mask 优先 → src → Lucide 名),其后为用户需求文本;
            未添加时仅显示需求文本 */}
        {chips.map((c) => (
          <span className="cs-user-tag" key={c.id}>
            <Icon name={c.icon} src={c.src} mask={c.mask} size={14} />
            <span>{c.title}</span>
          </span>
        ))}
        <div className="cs-user-text">{msg.text}</div>
      </div>
    </div>
  );
}

/* ================= 产物文件卡片：图标 + 信息 + 更多操作下拉 ================= */
function FileCard({ f, onPreview }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState(null); // fixed 定位坐标(脱离滚动容器裁切)
  const btnRef = useRef(null);

  /* 点击下拉外部任意位置时收起 */
  useClickOutside(open, (t) => t.closest("[data-file-drop]"), () => setOpen(false));

  /* 按按钮视口坐标计算下拉位置:fixed 定位可覆盖下方输入框 */
  const toggleMenu = () => {
    if (open) {
      setOpen(false);
      return;
    }
    const rect = btnRef.current
      ? btnRef.current.getBoundingClientRect()
      : { bottom: 0, left: 0 };
    setMenuPos({ top: rect.bottom + 8, left: rect.left });
    setOpen(true);
  };

  return (
    <div className="cs-file">
      <span className="cs-file-icon">
        <Icon src="./assets/uploads/icon/file-type/filled/code.svg" size={28} />
      </span>
      <span className="cs-file-info">
        {/* 文件名:不带扩展名;meta:文件类型大写(如 HTML),无扩展名时为空 */}
        <span className="cs-file-name">
          {f.name.slice(0, f.name.lastIndexOf(".") > 0 ? f.name.lastIndexOf(".") : undefined)}
        </span>
        <span className="cs-file-meta">
          {f.name.lastIndexOf(".") > 0
            ? f.name.slice(f.name.lastIndexOf(".") + 1).toUpperCase()
            : ""}
        </span>
      </span>
      {/* 打开方式下拉 */}
      <div className="cs-file-drop" data-file-drop>
        <button
          ref={btnRef}
          type="button"
          className={"cs-file-more" + (open ? " is-open" : "")}
          onClick={toggleMenu}
          aria-label="打开方式"
          aria-expanded={open}
        >
          <span>打开方式</span>
          <Icon
            name="triangle"
            size={8}
            className={"cs-file-caret" + (open ? " is-open" : "")}
          />
        </button>
        {open && menuPos ? (
          <div
            className="cs-file-menu cs-file-menu--fixed"
            style={{ top: menuPos.top, left: menuPos.left }}
          >
            <button
              type="button"
              className="cs-file-opt"
              onClick={() => {
                setOpen(false);
                if (onPreview) onPreview(f);
              }}
            >
              在线预览
            </button>
            <button type="button" className="cs-file-opt" onClick={() => setOpen(false)}>
              浏览器打开
            </button>
            <button type="button" className="cs-file-opt" onClick={() => setOpen(false)}>
              下载到本地
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ================= Agent 回复：流式生成 + 授权弹框等待 ================= */
function AgentRun({ msg, onGrow, onNeedPerm, permCmd, onPreview, stopGen, onGeneratingChange, onProgress }) {
  const blocks = msg.blocks;
  const total = blocks.length;
  const [cursor, setCursor] = useState(0); // 当前处理到的块下标（= 已完成块数）
  const [chars, setChars] = useState(0); // 当前块已打出的字符数
  const [readIdx, setReadIdx] = useState(0); // 读取文档面板已揭示的条目数
  const [perm, setPerm] = useState("none"); // 授权状态：none / waiting / allowed / always / rejected
  const [failed, setFailed] = useState(false); // 生成失败（任务中断）
  const [paused, setPaused] = useState(false); // 暂停中（冻结当前位置，不推进）

  const cur = cursor < total ? blocks[cursor] : null;
  const done = cursor >= total;
  const rejected = perm === "rejected";
  const completed = done && !rejected; // 任务完成（生成成功）

  /* 停止信号：stopGen 递增时暂停流式（冻结当前位置，不跳到结尾、不继续打印） */
  useEffect(() => {
    if (stopGen === undefined || stopGen === 0) return;
    if (done) return;
    setPaused(true);
  }, [stopGen]);

  /* 向父级报告生成状态：未完成且未暂停 = 生成中（驱动暂停按钮显隐） */
  const activelyGenerating = !done && !paused;
  useEffect(() => {
    if (onGeneratingChange) onGeneratingChange(activelyGenerating);
  }, [activelyGenerating, onGeneratingChange]);

  /* 流式进度(0~1) = (已完成块数 + 当前块内打字比例) / 总块数;
     表单/授权等待时光标停住 → 进度自然冻结;中止/失败不再上报
     供右侧蜂群面板(SwarmPanel)同步进度条动画 */
  const blockFrac = cur && cur.text ? Math.min(1, chars / cur.text.length) : 0;
  const streamProgress = total ? Math.min(1, (cursor + blockFrac) / total) : 0;
  const lastReport = useRef(-1);
  useEffect(() => {
    if (!onProgress) return;
    if (rejected) return; // 已中止:冻结在最后上报的进度
    if (
      Math.abs(streamProgress - lastReport.current) >= 0.01 ||
      (streamProgress >= 1 && lastReport.current < 1)
    ) {
      lastReport.current = streamProgress;
      onProgress(streamProgress);
    }
  }, [streamProgress]);

  /* 生成计时与 Token 消耗：未完成且未暂停时每 200ms 刷新，暂停/完成后冻结；重试时重启 */
  const [startTs, setStartTs] = useState(() => Date.now());
  const [nowTs, setNowTs] = useState(() => Date.now());
  useEffect(() => {
    if (done || paused) return;
    const t = window.setInterval(() => setNowTs(Date.now()), 200);
    return () => window.clearInterval(t);
  }, [done, paused]);
  const elapsedMs = Math.max(0, nowTs - startTs);
  const tokens = 1024 + Math.floor((elapsedMs / 1000) * 386);

  /* 光标进入新块时重置读取条目揭示进度 */
  useEffect(() => {
    setReadIdx(0);
  }, [cursor]);

  /* 蜂群模式判定(打字节奏/状态栏阶段共用) */
  const isSwarm = msg.meta && msg.meta.modeId === "swarm";
  /* 流式打字节奏:单Agent模式放慢(70ms 输出 2 字,便于阅读),蜂群模式保持 35ms/2字 */
  const typeInterval = isSwarm ? 35 : 70;

  /* 流式打字：逐字输出当前文本块，块间稍作停顿；暂停中冻结不推进。
     授权/表单等待块由下方挂起链路处理。
     读取文档块：先打标签文字，再逐条揭示文档相关内容，全部揭示后进入下一块。
     结构块（文件内容/产物汇总/产物文件）：整块淡入展示后推进 */
  useEffect(() => {
    if (paused) return; // 暂停中：不推进流式
    if (!cur || cur.type === "perm-wait" || cur.type === "form-wait") return;
    /* 文件内容块:按文本打印方式逐字流式输出(跨行累计字符),打完短暂停留后推进 */
    if (cur.type === "filecontent") {
      const fcLen = cur.lines.reduce((s, l) => s + l.replace(/^\u2022\s*/, "").length, 0);
      if (chars < fcLen) {
        const t = window.setTimeout(() => {
          setChars((c) => c + 2);
          if (onGrow) onGrow();
        }, typeInterval);
        return () => window.clearTimeout(t);
      }
      const t = window.setTimeout(() => {
        setCursor((c) => c + 1);
        setChars(0);
        if (onGrow) onGrow();
      }, 700);
      return () => window.clearTimeout(t);
    }
    if (!cur.text) {
      const t = window.setTimeout(() => {
        setCursor((c) => c + 1);
        if (onGrow) onGrow();
      }, 1000);
      return () => window.clearTimeout(t);
    }
    if (cur.reading) {
      if (chars < cur.text.length) {
        const t = window.setTimeout(() => {
          setChars((c) => c + 2);
          if (onGrow) onGrow();
        }, typeInterval);
        return () => window.clearTimeout(t);
      }
      if (readIdx < cur.reading.length) {
        const t = window.setTimeout(() => {
          setReadIdx((v) => v + 1);
          if (onGrow) onGrow();
        }, 1200);
        return () => window.clearTimeout(t);
      }
      const t = window.setTimeout(() => {
        setCursor((c) => c + 1);
        setChars(0);
        if (onGrow) onGrow();
      }, 700);
      return () => window.clearTimeout(t);
    }
    if (chars < cur.text.length) {
      const t = window.setTimeout(() => {
        setChars((c) => c + 2);
        if (onGrow) onGrow();
      }, typeInterval);
      return () => window.clearTimeout(t);
    }
    /* 失败注入点：冲刺文案打完后短暂等待 → 生成失败，任务中断 */
    if (cur.failHere) {
      const t = window.setTimeout(() => {
        setFailed(true);
        setCursor(total);
        if (onGrow) onGrow();
      }, 1500);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      setCursor((c) => c + 1);
      setChars(0);
      if (onGrow) onGrow();
    }, 220);
    return () => window.clearTimeout(t);
  }, [cursor, chars, readIdx, paused]);

  /* 流式推进到授权/表单等待块：置为等待态，并通知父级弹出弹框（输入框上方） */
  useEffect(() => {
    if (!cur || (cur.type !== "perm-wait" && cur.type !== "form-wait")) return;
    if (perm === "none") {
      setPerm("waiting");
      if (onNeedPerm) onNeedPerm(msg.id);
    }
  }, [cur, perm]);

  /* 授权决定回传：允许本次/始终运行 → 继续流式输出后续块；拒绝 → 跳过剩余内容，任务中止 */
  useEffect(() => {
    if (!permCmd || permCmd.msgId !== msg.id || perm !== "waiting") return;
    const d = permCmd.decision;
    if (d !== "allowed" && d !== "always" && d !== "rejected") return;
    const t = window.setTimeout(() => {
      if (d === "rejected") {
        setPerm("rejected");
        setCursor(total);
      } else {
        setPerm(d);
        setCursor((c) => c + 1);
        setChars(0);
      }
      if (onGrow) onGrow();
    }, 250);
    return () => window.clearTimeout(t);
  }, [permCmd, perm]);

  /* 状态栏阶段：蜂群模式直接显示生成中；单Agent按 思考→已思考→生成中 流转 */
  const thinkingIdx = blocks.findIndex((b) => b.endsThinking);
  const readingIdx = blocks.findIndex((b) => b.endsReading);
  const thinkingDone = thinkingIdx !== -1 && cursor > thinkingIdx;
  const readingDone = readingIdx !== -1 && cursor > readingIdx;

  /* 产物输出起点：光标到达文件内容块时，hideOnDone 节点（已探索/梳理段落）同步隐藏 */
  const artifactIdx = blocks.findIndex((b) => b.type === "filecontent");
  const artifactsStarted = artifactIdx !== -1 && cursor >= artifactIdx;

  const statusText = done
    ? rejected
      ? "已中止，用时 "
      : failed
        ? "生成失败，用时 "
        : "任务完成，用时 "
    : isSwarm
      ? "生成中，用时 "
      : !thinkingDone
        ? "思考中，用时 "
        : !readingDone
          ? "已思考，用时 "
          : "生成中，用时 ";

  /* 重试：重置整条生成流程（含授权弹框），计时与 Token 重新累计 */
  const retry = () => {
    setCursor(0);
    setChars(0);
    setReadIdx(0);
    setPerm("none");
    setFailed(false);
    setStartTs(Date.now());
    setNowTs(Date.now());
    if (onGrow) onGrow();
  };

  /* 流程状态（用于节点状态 className 辨别）：
     thinking 思考中 / perm-waiting 等待授权 / reading 已思考·读取文档 /
     generating 生成中 / completed 任务完成 / rejected 已中止 / failed 生成失败 */
  const phase = done
    ? rejected
      ? "rejected"
      : failed
        ? "failed"
        : "completed"
    : !thinkingDone
      ? "thinking"
      : !readingDone
        ? perm === "waiting"
          ? "perm-waiting"
          : "reading"
        : "generating";

  return (
    <div className={"cs-agent is-" + phase}>
      <span
        className={
          "cs-agent-avatar cs-agent-avatar--" + (failed ? "failed" : completed ? "completed" : "generating")
        }
      >
        {/* 任务完成 → 成功图标；生成失败 → 失败图标；其余 → 生成中动图 */}
        <img
          src={
            failed
              ? "./assets/uploads/fail.png"
              : completed
                ? "./assets/uploads/success.png"
                : "./assets/uploads/generating.webp"
          }
          alt=""
          className="cs-agent-img"
        />
      </span>
      <div className="cs-agent-main">
        <div className="cs-agent-head">
          <span className={"cs-head-status cs-head-status--" + phase}>
            <Icon src="./assets/uploads/clock.svg" size={12} />
            <span>
              {statusText}
              {(elapsedMs / 1000).toFixed(1)}s
            </span>
          </span>
          {/* 分隔图标：mask 模式跟随文字颜色，垂直居中，左间距 0.25rem */}
          <Icon
            mask="./assets/uploads/section-toggle.svg"
            size={12}
            className="cs-head-toggle"
          />
          <span className="cs-head-sep">|</span>
          <span className="cs-head-tokens">
            <Icon src="./assets/uploads/token.svg" size={12} />
            <span>已消耗Token {tokens.toLocaleString("en-US")}</span>
          </span>
        </div>

        {/* ---- 流式回答 + 授权等待 ---- */}
        <div className="cs-answer">
          {blocks.map((b, i) => {
            if (i > cursor) return null; // 尚未输出到的块
            if (b.transient && i < cursor) return null; // 阶段性节点完成后隐藏
            if (b.hideAfterForm && perm !== "none" && perm !== "waiting") return null; // 表单提交后隐藏（蜂群 intro）
            if (b.hideOnDone && !rejected && !failed && artifactsStarted) return null;
            if (b.noPerm && (rejected || failed)) return null;

            /* ---- 问题澄清卡片:整卡以「宽高从小变大」的入场动画出现(替代逐条打印) ---- */
            if (b.type === "qa-card") {
              return (
                <div className={"cs-qa-card " + (b.cls || "")} key={i}>
                  <div className="cs-qa-head">
                    <Icon src="./assets/uploads/category-content.svg" size={12} />
                    <span>{b.title}</span>
                  </div>
                  <div className="cs-qa-body">
                    {b.qa.map((item, k) => (
                      <div className="cs-qa-item" key={k}>
                        <p className="cs-qa-q">{item.q}</p>
                        <p className="cs-qa-a">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            /* ---- 技能调取 ---- */
            if (b.type === "skill") {
              const isCurS = i === cursor;
              const textS = isCurS ? b.text.slice(0, chars) : b.text;
              if (!textS) return null;
              return (
                <div className="cs-skill" key={i}>
                  {b.icon === "hand" ? (
                    <Icon name="hand" size={12} />
                  ) : (
                    <Icon src="./assets/uploads/skill.svg" size={12} />
                  )}
                  <span>{textS}{isCurS && chars < b.text.length ? <span className="cs-caret" /> : null}</span>
                </div>
              );
            }

            /* ---- 任务卡片:整卡以「宽高从小变大」的入场动画出现(同问题澄清卡片,速度稍慢) ---- */
            if (b.type === "task-card") {
              return (
                <div className={"cs-task-card " + (b.cls || "")} key={i}>
                  <div className="cs-task-head">
                    <Icon name="users" size={14} />
                    <span className="cs-task-team">{b.team}</span>
                    <span className="cs-task-sep">|</span>
                    <span className="cs-task-desc">{b.desc}</span>
                  </div>
                  <div className="cs-task-list">
                    {b.tasks.map((t, k) => (
                      <div className="cs-task-item" key={k}>
                        <span className="cs-task-text">{t.text}</span>
                        {t.assignee ? (
                          <span className="cs-task-assignee">
                            <img src={t.avatar} alt="" className="cs-task-assignee-avatar" />
                            <span>{t.assignee}</span>
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            /* ---- 专家/人员标签 ---- */
            if (b.type === "agent-tag") {
              return (
                <div className="cs-agent-tag-row" key={i}>
                  <div className="cs-agent-tag">
                    <span className="cs-agent-tag-icon">
                      <Icon src={b.avatar} size={28} />
                    </span>
                    <span className="cs-agent-tag-name">{b.name}</span>
                    <Icon src="./assets/uploads/connector-connected.svg" size={14} />
                  </div>
                </div>
              );
            }

            /* ---- 列表块（标题 + 黑点列表项） ---- */
            if (b.type === "list-block") {
              const isCurL = i === cursor;
              const itemCount = isCurL ? Math.min(b.items.length, Math.floor(chars / 6)) : b.items.length;
              return (
                <div className="cs-list-block" key={i}>
                  <p className="cs-list-block-title">{b.title}</p>
                  <ul className="cs-list-block-items">
                    {b.items.slice(0, itemCount).map((it, k) => (
                      <li className="cs-list-block-item" key={k}>{it}</li>
                    ))}
                  </ul>
                </div>
              );
            }

            /* ---- 带链接的文本:点击链接文本 → 在右侧预览打开该产物页签 ---- */
            if (b.type === "text-link") {
              const isCurTL = i === cursor;
              const textTL = isCurTL ? b.text.slice(0, chars) : b.text;
              if (!textTL && !isCurTL) return null;
              const showLink = !isCurTL || chars >= b.text.length;
              return (
                <p className="cs-text-link" key={i}>
                  {textTL}
                  {showLink ? (
                    <a
                      className="cs-doc-link"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onPreview) onPreview({ name: b.link });
                      }}
                    >
                      {b.link}
                    </a>
                  ) : null}
                  {isCurTL && chars < b.text.length ? <span className="cs-caret" /> : null}
                </p>
              );
            }

            /* ---- 核心结论/流程容器 ---- */
            if (b.type === "conclusion") {
              const isCurC = i === cursor;
              const contentC = isCurC ? b.content.slice(0, chars) : b.content;
              if (!contentC && isCurC && b.content) return null;
              if (!contentC && !isCurC && b.content) return null;
              return (
                <div className="cs-conclusion" key={i}>
                  <p className="cs-conclusion-title">{b.title}</p>
                  {b.content ? (
                    <p className="cs-conclusion-body">{contentC}{isCurC && chars < b.content.length ? <span className="cs-caret" /> : null}</p>
                  ) : null}
                </div>
              );
            }

            /* ---- 生成产物：文件内容 —— 按文本打印方式逐字流式输出(跨行累计偏移) ---- */
            if (b.type === "filecontent") {
              const isCurF = i === cursor;
              let offset = 0;
              return (
                <div className={"cs-fc " + (b.cls || "")} key={i}>
                  <div className="cs-fc-head">
                    <img
                      src="./assets/uploads/icon/file-type/filled/code.svg"
                      alt=""
                      width="20"
                      height="20"
                    />
                    <span>{b.title}</span>
                  </div>
                  <p className="cs-sum-title">文件内容</p>
                  <div className="cs-fc-body">
                    {b.lines.map((ln, k) => {
                      const line = ln.replace(/^\u2022\s*/, "");
                      const start = offset;
                      offset += line.length;
                      if (!isCurF) {
                        return (
                          <p className="cs-fc-line" key={k}>
                            <span className="cs-fc-bullet">•</span>
                            <span className="cs-fc-text">{line}</span>
                          </p>
                        );
                      }
                      /* 当前行按累计字符切片逐字揭示,行尾跟随打字光标 */
                      const shown = Math.max(0, Math.min(line.length, chars - start));
                      if (shown <= 0) return null;
                      const typing = shown < line.length || chars === offset;
                      return (
                        <p className="cs-fc-line" key={k}>
                          <span className="cs-fc-bullet">•</span>
                          <span className="cs-fc-text">
                            {line.slice(0, shown)}
                            {typing ? <span className="cs-caret" /> : null}
                          </span>
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            }

            /* ---- 生成产物：产物汇总（标题行，无卡片背景） ---- */
            if (b.type === "summary") {
              return (
                <p className={"cs-sum-title " + (b.cls || "")} key={i}>
                  {b.title}
                </p>
              );
            }

            /* ---- 生成产物：产物文件卡片（FileCard 子组件渲染，右侧为操作下拉） ---- */
            if (b.type === "artifacts") {
              return (
                <div className={"cs-files " + (b.cls || "")} key={i}>
                  {b.files.map((f) => (
                    <FileCard key={f.id} f={f} onPreview={onPreview} />
                  ))}
                </div>
              );
            }

            /* ---- 编辑统计:与产物文件卡片同款结构(图标 + 两行信息 + 操作) ---- */
            if (b.type === "edit-stats") {
              return (
                <div className="cs-files cs-edit-stats-wrap" key={i}>
                  <div className="cs-file cs-edit-stats">
                    <span className="cs-file-icon">
                      <Icon src="./assets/uploads/review-files.svg" size={28} />
                    </span>
                    <span className="cs-file-info">
                      <span className="cs-file-name">编辑了18个文本</span>
                      <span className="cs-edit-stats-pills">
                        <span className="cs-edit-pill cs-edit-pill--add">{b.additions}</span>
                        <span className="cs-edit-pill cs-edit-pill--del">{b.deletions}</span>
                      </span>
                    </span>
                    <div className="cs-edit-stats-actions">
                      <button type="button" className="cs-edit-btn cs-edit-btn--ghost">
                        撤销
                      </button>
                      <button type="button" className="cs-edit-btn cs-edit-btn--outline">
                        审核
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            /* 授权/表单等待块：等待期间由输入框上方的弹框承载；
               允许后不再渲染结果节点；拒绝（仅单Agent授权）→ 紧凑中止行 */
            if (b.type === "perm-wait" || b.type === "form-wait") {
              if (i === cursor) return null;
              if (b.type === "form-wait") return null; // 表单提交后不渲染
              if (perm !== "rejected") return null;
              return (
                <div className="cs-perm-done is-rejected" key={i}>
                  <Icon name="circle-alert" size={14} />
                  <span>已拒绝授权 · 任务已中止</span>
                </div>
              );
            }

            /* 图标状态行：已完成 → 全文；当前 → 逐字输出（带打字光标）；
               gradient 标记的文本以径向渐变颜色呈现；
               reading 块在状态行下方逐条输出文档相关内容 */
            if (b.type === "status") {
              const isCurS = i === cursor;
              const textS = isCurS ? b.text.slice(0, chars) : b.text;
              if (!textS) return null;
              const shownCount = isCurS ? readIdx : b.reading ? b.reading.length : 0;
              return (
                <div className={b.cls || ""} key={i}>
                  <div className="cs-stat">
                    <Icon name={b.icon} src={b.src} size={14} />
                    <span
                      className={
                        b.gradient ? "cs-stat-grad" : b.linear ? "cs-stat-linear" : ""
                      }
                    >
                      {textS}
                      {isCurS && chars < b.text.length ? <span className="cs-caret" /> : null}
                    </span>
                  </div>
                  {b.reading && shownCount > 0 ? (
                    <div className="cs-read">
                      {b.reading.slice(0, shownCount).map((d) => (
                        <div className="cs-read-item" key={d.name}>
                          <div className="cs-read-line">
                            <Icon name="file-text" size={14} />
                            <span className="cs-read-name">{d.name}</span>
                          </div>
                          <p className="cs-read-excerpt">{d.excerpt}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            }

            /* 文本块：已完成 → 全文；当前 → 按字符数切片（带打字光标） */
            const isCur = i === cursor;
            const text = isCur ? b.text.slice(0, chars) : b.text;
            if (!text) return null;
            return (
              <div
                className={(b.type === "li" ? "cs-answer-li" : "cs-answer-p") + " " + (b.cls || "")}
                key={i}
              >
                {b.type === "li" ? <span className="cs-answer-dot" /> : null}
                <span>
                  {text}
                  {isCur && chars < b.text.length ? <span className="cs-caret" /> : null}
                </span>
              </div>
            );
          })}

          {/* 拒绝授权后的收尾提示 */}
          {done && rejected ? (
            <div className="cs-answer-p cs-answer-muted">
              已拒绝授权，任务已中止。你可以在下方调整需求后重试。
            </div>
          ) : null}

          {/* 生成失败 · 任务中断提示 + 重试 */}
          {failed ? (
            <div className="cs-fail">
              <div className="cs-fail-main">
                <Icon name="circle-alert" size={15} />
                <span>生成失败：模型服务响应超时（504），任务已中断</span>
              </div>
              <button type="button" className="cs-fail-retry" onClick={retry}>
                重试
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ================= 蜂群产物预览:When2meet 小程序数据 ================= */



















/* 热力格颜色:空闲人数越多绿色越深(#64BB5C = var(--color-success),JSX 内联色值) */
function w2mCellBg(c) {
  return "rgba(100, 187, 92, " + (0.15 + (c / 5) * 0.7).toFixed(2) + ")";
}

/* ================= 蜂群产物:流式链接对应的预览页签内容 ================= */
/* kind=w2m 为小程序界面预览 */


/* markdown 类产物的文档页签渲染(复用单Agent文档页样式) */
function SwarmMdDoc({ def, name }) {
  return (
    <div className="cs-preview-page">
      <h2 className="cs-preview-name">{(def && def.title) || name}</h2>
      <p className="cs-preview-eyebrow">{(def && def.eyebrow) || "Markdown · 模拟预览"}</p>
      {(def && def.sections ? def.sections : []).map((s, k) => (
        <div className="cs-preview-sec" key={k}>
          <h3>{s.h}</h3>
          {s.p ? <p>{s.p}</p> : null}
          {s.list ? (
            <ul className="cs-md-list">
              {s.list.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/* ================= 会话页面 ================= */
export default function ChatSession({ messages, onReset, composer, stopGen, onGeneratingChange, swarmExtraChat, onSwarmViewChange, onFileAction }) {
  const listRef = useRef(null);
  const first = messages[0];

  /* 操作授权弹框：当前等待授权的消息 id + 回传给对应 AgentRun 的决定 */
  const [pendingMsgId, setPendingMsgId] = useState(null);
  const [permCmd, setPermCmd] = useState(null);
  const [allowOpen, setAllowOpen] = useState(false); // 「允许」下拉展开态

  /* 右侧预览面板：页签控制 —— 任务摘要 + 多个产物页签(流式链接/产物卡片点击时新增) */
  const [previewOpen, setPreviewOpen] = useState(false); // 预览面板是否显示
  const [openTabs, setOpenTabs] = useState([]); // 已打开的产物页签(file 对象,按 name 去重)
  const [activeTab, setActiveTab] = useState("summary"); // 当前选中页签："summary" | 产物名
  const [zoomOpen, setZoomOpen] = useState(false); // 缩放下拉
  const [moreOpen, setMoreOpen] = useState(false); // 更多操作下拉

  /* 蜂群模式判定（进入会话页不打开预览，点击弹框确认后才打开） */
  const isSwarmSession = first && first.meta && first.meta.modeId === "swarm";

  /* 当前激活的产物页签(activeTab 为任务摘要时为 null) */
  const activeFile = openTabs.find((t) => t.name === activeTab) || null;

  /* 蜂群文件预览激活态:任一产物页签处于激活;
     关闭全部页签/切回任务摘要 → 返回 SwarmPanel(隐藏不卸载,保留面板内部状态) */
  const swarmFileOpen = isSwarmSession && !!activeFile;

  /* 页签图标:产物注册表优先,再按扩展名回退(html → code,其余 → markdown) */
  const tabIcon = (name) =>
    (isSwarmSession && SWARM_ARTIFACTS[name] && SWARM_ARTIFACTS[name].icon) ||
    (/\.html?$/i.test(name)
      ? "./assets/uploads/icon/file-type/filled/code.svg"
      : "./assets/uploads/icon/file-type/filled/markdown.svg");

  /* 左侧流式进度 → 驱动右侧 SwarmPanel 的进度动画 */
  const [swarmProgress, setSwarmProgress] = useState(0);

  /* 点击产物「在线预览」或流式内容中的链接文本 → 新增(或激活)对应产物页签 */
  const handleFilePreview = (file) => {
    setOpenTabs((tabs) => (tabs.some((t) => t.name === file.name) ? tabs : [...tabs, file]));
    setActiveTab(file.name);
    setPreviewOpen(true);
  };

  /* 关闭产物页签:若关闭的是激活页签,回退到剩余最后一个,无剩余则回任务摘要 */
  const closeFileTab = (name) => {
    const rest = openTabs.filter((t) => t.name !== name);
    setOpenTabs(rest);
    if (activeTab === name) {
      setActiveTab(rest.length ? rest[rest.length - 1].name : "summary");
    }
  };

  /* 统一关闭所有下拉（允许/缩放/更多）：点击外部非下拉区域时收起 */
  useClickOutside(
    allowOpen || zoomOpen || moreOpen,
    (t) =>
      t.closest("[data-perm-drop]") ||
      t.closest("[data-zoom-drop]") ||
      t.closest("[data-more-drop]"),
    () => {
      setAllowOpen(false);
      setZoomOpen(false);
      setMoreOpen(false);
    }
  );

  /* 内容增长时贴底滚动；新消息发出时重置授权弹框状态 */
  const scrollToBottom = () => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    setPendingMsgId(null);
    setPermCmd(null);
    scrollToBottom();
  }, [messages.length]);

  /* 弹框按钮：拒绝 / 允许 / 表单提交 → 关闭弹框并把决定回传给等待中的 AgentRun */
  const decide = (decision) => {
    if (!pendingMsgId) return;
    setPermCmd({ msgId: pendingMsgId, decision });
    setPendingMsgId(null);
    setAllowOpen(false);
  };

  /* 蜂群配置表单弹框状态 */
  const [formPage, setFormPage] = useState(0);
  const [formAnswers, setFormAnswers] = useState({});
  /* 蜂群配置点「确定」后隐藏头部日历图标(cs-new) */
  const [csNewHidden, setCsNewHidden] = useState(false);

  /* 重置弹框时同步重置表单 */
  useEffect(() => {
    if (!pendingMsgId) {
      setFormPage(0);
      setFormAnswers({});
    }
  }, [pendingMsgId]);

  /* 表单提交 → 关闭弹框并把决定回传给等待中的 AgentRun；
     蜂群模式：确认后才打开右侧预览面板（选中任务摘要页签）；
     点「确定」时隐藏头部日历图标 cs-new（「跳过」不隐藏） */
  const submitForm = (isConfirm) => {
    decide("allowed");
    if (isSwarmSession) {
      setPreviewOpen(true);
      setActiveTab("summary");
      if (isConfirm) setCsNewHidden(true);
    }
  };

  /* 弹框内容取自等待授权消息里的等待块（授权 or 蜂群配置表单） */
  const pendingMsg = messages.find((m) => m.id === pendingMsgId);
  const waitBlock = pendingMsg
    ? pendingMsg.blocks.find((b) => b.type === "perm-wait" || b.type === "form-wait")
    : null;
  const isFormPopup = waitBlock && waitBlock.type === "form-wait";

  return (
    <div className="cs-wrap">
      <div className="cs-main">
        {/* 顶栏：显示器图标 + 会话标题 + 日历图标 */}
        <header className="cs-header">
          <div className="cs-header-main">
            <span className="cs-header-icon" aria-hidden="true">{MONITOR_ICON}</span>
            <h1 className="cs-title">{first ? short(first.text, 24) : "新会话"}</h1>
          </div>
          {csNewHidden ? null : (
            <img src="./assets/uploads/header-calendar.png" alt="" className="cs-new" />
          )}
        </header>

        {/* 消息流 */}
        <div className="cs-list" ref={listRef}>
          <div className="cs-inner">
            {messages.map((m, mi) =>
              m.role === "user" ? (
                <UserBubble key={m.id} msg={m} onFileAction={onFileAction} />
              ) : (
                <AgentRun
                  key={m.id}
                  msg={m}
                  onGrow={scrollToBottom}
                  onNeedPerm={setPendingMsgId}
                  permCmd={permCmd}
                  onPreview={handleFilePreview}
                  stopGen={mi === messages.length - 1 ? stopGen : undefined}
                  onGeneratingChange={mi === messages.length - 1 ? onGeneratingChange : undefined}
                  onProgress={
                    isSwarmSession && mi === messages.length - 1
                      ? setSwarmProgress
                      : undefined
                  }
                />
              )
            )}
          </div>
        </div>

        {/* 底部输入区 + 弹框（操作授权 / 蜂群配置表单，悬于输入框上方） */}
        <div className="cs-composer">
        {isFormPopup && waitBlock ? (
          /* ---- 蜂群配置表单弹框（多页 + 单选 + 翻页） ---- */
          <div className="cs-form-pop" role="dialog" aria-modal="false" aria-label="配置信息">
            {/* 上部：表单内容（分页显示，关闭按钮固定右上角） */}
            <div className="cs-form-body">
              <button
                type="button"
                className="cs-form-close"
                onClick={() => decide("rejected")}
                aria-label="关闭"
              >
                <Icon name="x" size={16} />
              </button>
              {waitBlock.pages.map((pg, pi) =>
                pi === formPage ? (
                  <div className="cs-form-page" key={pg.id}>
                    <p className="cs-form-title">{pg.title}</p>
                    <div className="cs-form-options">
                      {pg.options.map((opt) => {
                        const isSel = formAnswers[pg.id] === opt;
                        return (
                          <label
                            className={"cs-form-radio" + (isSel ? " is-checked" : "")}
                            key={opt}
                            onClick={() => setFormAnswers((a) => ({ ...a, [pg.id]: opt }))}
                          >
                            <span className="cs-radio-circle">
                              {isSel ? <Icon name="check" size={10} className="cs-radio-check" /> : null}
                            </span>
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ) : null
              )}
            </div>
            {/* 下部：翻页器 + 操作按钮 */}
            <div className="cs-form-foot">
              <div className="cs-form-pager">
                <button
                  type="button"
                  className="cs-form-pager-btn"
                  onClick={() => setFormPage((p) => Math.max(0, p - 1))}
                  aria-label="上一页"
                >
                  <Icon name="chevron-left" size={14} />
                </button>
                <span className="cs-form-pager-text">
                  {formPage + 1} / {waitBlock.pages.length}
                </span>
                <button
                  type="button"
                  className="cs-form-pager-btn"
                  onClick={() => setFormPage((p) => Math.min(p + 1, waitBlock.pages.length - 1))}
                  aria-label="下一页"
                >
                  <Icon name="chevron-right" size={14} />
                </button>
              </div>
              <div className="cs-form-btns">
                <button
                  type="button"
                  className="cs-form-btn"
                  onClick={() => submitForm(false)}
                >
                  跳过
                </button>
                <button type="button" className="cs-form-btn is-primary" onClick={() => submitForm(true)}>
                  确定
                </button>
              </div>
            </div>
          </div>
        ) : waitBlock ? (
          /* ---- 单Agent操作授权弹框 ---- */
          <div className="cs-perm-pop" role="dialog" aria-modal="false" aria-label="操作授权">
            <h3 className="cs-perm-pop-title">{waitBlock.title}</h3>
            <p className="cs-perm-pop-desc">{waitBlock.desc}</p>
            <div className="cs-perm-pop-actions">
              <button type="button" className="cs-perm-pop-deny" onClick={() => decide("rejected")}>
                拒绝
              </button>
              <div className="cs-perm-pop-allow" data-perm-drop>
                <button
                  type="button"
                  className="cs-perm-pop-allow-btn"
                  onClick={() => setAllowOpen((v) => !v)}
                >
                  <span>允许本次操作</span>
                  <Icon name="triangle" size={8} className="cs-perm-pop-caret" />
                </button>
                {allowOpen ? (
                  <div className="cs-perm-pop-menu">
                    <button type="button" className="cs-perm-pop-opt" onClick={() => decide("allowed")}>
                      允许本次操作
                    </button>
                    <button type="button" className="cs-perm-pop-opt" onClick={() => decide("always")}>
                      始终运行操作
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
        {composer}
        </div>
      </div>

      {/* 右侧面板:蜂群会话默认 SwarmPanel(任务摘要/群聊等);点击产物「在线预览」切换为文件预览,
          关闭文件页签返回 SwarmPanel —— 蜂群面板隐藏不卸载,内部状态(任务展开/群聊页签)保留;
          单Agent会话 → 公共预览模块 */}
      {previewOpen && isSwarmSession ? (
        <div className={"cs-swarm-slot" + (swarmFileOpen ? " cs-swarm-slot--hidden" : "")}>
          <SwarmPanel
            progress={swarmProgress}
            extraChat={swarmExtraChat}
            onViewChange={onSwarmViewChange}
            onOpenArtifact={handleFilePreview}
          />
        </div>
      ) : null}
      {previewOpen && (!isSwarmSession || swarmFileOpen) ? (
        <aside className="cs-preview" aria-label="预览面板">
          {/* ---- 公共头部导航 ---- */}
          <div className="cs-preview-head">
            <div className="cs-preview-head-left">
              <span className={"cs-preview-tab" + (activeTab === "files" ? " is-active" : "")}>
                <Icon src="./assets/uploads/tab-files.svg" size={16} />
                <span>项目文件</span>
              </span>
              <button
                type="button"
                className={"cs-preview-tab" + (activeTab === "summary" ? " is-active" : "")}
                onClick={() => setActiveTab("summary")}
              >
                <Icon name="file-text" size={14} />
                <span>任务摘要</span>
              </button>
              {/* 产物页签:多个并存,点击切换,X 关闭(关闭激活页签时回退) */}
              {openTabs.length ? <span className="cs-preview-vline" /> : null}
              {openTabs.map((t) => (
                <div
                  key={t.name}
                  className={"cs-preview-filetab" + (activeTab === t.name ? " is-active" : "")}
                >
                  <Icon src={tabIcon(t.name)} size={14} />
                  <span onClick={() => setActiveTab(t.name)}>{t.name}</span>
                  <button
                    type="button"
                    className="cs-preview-filetab-x"
                    onClick={() => closeFileTab(t.name)}
                    aria-label="关闭文件"
                  >
                    <Icon name="x" size={12} />
                  </button>
                </div>
              ))}
              <button type="button" className="cs-preview-iconbtn cs-preview-add" title="添加" aria-label="添加">
                <Icon src="./assets/uploads/add.svg" size={16} />
              </button>
            </div>
            <div className="cs-preview-head-right">
              <div className="cs-preview-iconbox">
                <Icon src="./assets/uploads/header-expand.svg" size={16} />
              </div>
              <button type="button" className="cs-preview-iconbtn" title="展开" aria-label="展开">
                <Icon src="./assets/uploads/header-calendar.png" size={16} />
              </button>
            </div>
          </div>

          {/* ---- 页签内容区：产物页签 → 操作栏+预览容器；任务摘要 → 空白 ---- */}
          {activeFile ? (
            <>
              {/* 操作栏 */}
              <div className="cs-preview-toolbar">
                <div className="cs-preview-toolbar-left">
                  <div className="cs-segmented">
                    <button type="button" className="cs-seg-item is-active" title="预览" aria-label="预览">
                      <Icon name="eye" size={14} />
                    </button>
                    <button type="button" className="cs-seg-item" title="代码" aria-label="代码">
                      <Icon src="./assets/uploads/category-dev.svg" size={14} />
                    </button>
                  </div>
                  <div className="cs-address">
                    <Icon name="folder-open" size={12} />
                    <span>D:\Projects\agent-demo\{activeFile.name}</span>
                  </div>
                </div>
                <div className="cs-preview-toolbar-right">
                  <button type="button" className="cs-preview-iconbtn" title="会话" aria-label="会话">
                    <Icon name="message-circle" size={16} />
                  </button>
                  <div className="cs-zoom" data-zoom-drop>
                    <button type="button" className="cs-zoom-btn" onClick={() => setZoomOpen((v) => !v)}>
                      <span>100%</span>
                      <Icon name="chevron-down" size={12} />
                    </button>
                    {zoomOpen ? (
                      <div className="cs-zoom-menu">
                        <button type="button" className="cs-zoom-opt">50%</button>
                        <button type="button" className="cs-zoom-opt">75%</button>
                        <button type="button" className="cs-zoom-opt is-active">100%</button>
                        <button type="button" className="cs-zoom-opt">125%</button>
                        <button type="button" className="cs-zoom-opt">150%</button>
                      </div>
                    ) : null}
                  </div>
                  <div className="cs-more" data-more-drop>
                    <button type="button" className="cs-preview-iconbtn cs-toolbar-openwith" onClick={() => setMoreOpen((v) => !v)} aria-label="更多">
                      <span>打开方式</span>
                      <Icon name="triangle" size={8} className="cs-file-caret" />
                    </button>
                    {moreOpen ? (
                      <div className="cs-more-menu">
                        <button type="button" className="cs-more-opt">在新窗口打开</button>
                        <button type="button" className="cs-more-opt">复制链接</button>
                        <button type="button" className="cs-more-opt">导出文件</button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* 预览容器 */}
              <div className="cs-preview-body">
                <div className="cs-preview-container">
                  {isSwarmSession ? (
                    /* 蜂群模式按产物类型渲染:When2meet.html(kind=w2m) → 小程序界面预览
                       (顶栏+活动信息+参与统计+最近动态+参与者+热力图+推荐时段+移动端+特性);
                       markdown 产物(编排计划/竞品分析/关键体验/QA 报告) → 文档页签视图 */
                    SWARM_ARTIFACTS[activeFile.name] &&
                    SWARM_ARTIFACTS[activeFile.name].kind === "w2m" ? (
                    <div className="cs-w2m">
                      {/* ---- 应用顶栏：品牌 + 分享/锁定操作 ---- */}
                      <header className="cs-w2m-topbar">
                        <div className="cs-w2m-brand">
                          <img className="cs-w2m-logo" src="./assets/uploads/progress-bird-complete.svg" alt="" aria-hidden="true" />
                          <span className="cs-w2m-brand-name">When2meet</span>
                          <span className="cs-w2m-brand-tag">排期投票 · v1.0</span>
                        </div>
                        <div className="cs-w2m-topbar-actions">
                          <button type="button" className="cs-w2m-ghost">
                            <Icon name="mail" size={14} />
                            <span>分享链接</span>
                          </button>
                          <button type="button" className="cs-w2m-solid">
                            <Icon name="check" size={14} />
                            <span>锁定最优时间</span>
                          </button>
                        </div>
                      </header>

                      {/* ---- 活动信息 ---- */}
                      <section className="cs-w2m-hero">
                        <div className="cs-w2m-hero-main">
                          <p className="cs-w2m-kicker">新功能评审会 · 60 分钟 · 全员投票中</p>
                          <h2 className="cs-w2m-title">找出大家共同有空的 1 小时</h2>
                          <p className="cs-w2m-sub">
                            创建者 项目总监 · 时区 GMT+8 · 投票截止 周五 18:00 · 参与者无需注册即可填写
                          </p>
                        </div>
                        <div className="cs-w2m-hero-side">
                          <span className="cs-w2m-side-num">5<i>/6</i></span>
                          <span className="cs-w2m-side-label">已填写</span>
                          <div className="cs-w2m-side-bar"><span style={{ width: "83%" }} /></div>
                          <span className="cs-w2m-side-deadline">距投票截止 2 天 6 小时</span>
                        </div>
                      </section>

                      {/* ---- 参与统计 ---- */}
                      <section className="cs-w2m-block">
                        <div className="cs-w2m-block-head">
                          <span className="cs-w2m-block-title">参与统计</span>
                          <span className="cs-w2m-block-extra">数据实时更新</span>
                        </div>
                        <div className="cs-w2m-statcards">
                          {W2M_STATS.map((s) => (
                            <div key={s.label} className="cs-w2m-statcard">
                              <span className="cs-w2m-statcard-num">
                                {s.num}{s.unit ? <i>{s.unit}</i> : null}
                              </span>
                              <span className="cs-w2m-statcard-label">{s.label}</span>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* ---- 最近动态 ---- */}
                      <section className="cs-w2m-block">
                        <div className="cs-w2m-block-head">
                          <span className="cs-w2m-block-title">最近动态</span>
                          <span className="cs-w2m-block-extra">填写与通知 · 时间倒序</span>
                        </div>
                        <div className="cs-w2m-feed">
                          {W2M_FEED.map((it) => (
                            <div key={it.who + it.time} className="cs-w2m-feed-item">
                              <img className="cs-w2m-feed-avatar" src={it.avatar} alt="" aria-hidden="true" />
                              <span className="cs-w2m-feed-text">
                                <b>{it.who}</b> {it.text}
                              </span>
                              <span className="cs-w2m-feed-time">{it.time}</span>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* ---- 参与者 ---- */}
                      <section className="cs-w2m-block">
                        <div className="cs-w2m-block-head">
                          <span className="cs-w2m-block-title">参与者</span>
                          <span className="cs-w2m-block-extra">结果自动保存 · 新成员可随时补填</span>
                        </div>
                        <div className="cs-w2m-members">
                          {W2M_MEMBERS.map((m) => (
                            <div key={m.name} className={"cs-w2m-member" + (m.done ? "" : " is-pending")}>
                              {m.avatar ? (
                                <img className="cs-w2m-member-avatar" src={m.avatar} alt="" aria-hidden="true" />
                              ) : (
                                <span className="cs-w2m-member-avatar cs-w2m-member-placeholder" aria-hidden="true">
                                  <Icon name="user-round" size={16} />
                                </span>
                              )}
                              <span className="cs-w2m-member-name">{m.name}</span>
                              <span className="cs-w2m-member-state">
                                <Icon name={m.done ? "check" : "user-round"} size={10} />
                                {m.done ? "已填" : "待填"}
                              </span>
                            </div>
                          ))}
                          <button type="button" className="cs-w2m-invite">
                            <Icon name="plus" size={12} />
                            <span>邀请成员</span>
                          </button>
                        </div>
                      </section>

                      {/* ---- 共同空闲热力图 ---- */}
                      <section className="cs-w2m-block">
                        <div className="cs-w2m-block-head">
                          <span className="cs-w2m-block-title">共同空闲热力图</span>
                          <div className="cs-w2m-legend" aria-hidden="true">
                            <span className="cs-w2m-legend-label">1 人</span>
                            {[1, 2, 3, 4, 5].map((c) => (
                              <span key={c} className="cs-w2m-legend-cell" style={{ background: w2mCellBg(c) }} />
                            ))}
                            <span className="cs-w2m-legend-label">5 人</span>
                          </div>
                        </div>
                        <div className="cs-w2m-grid">
                          <div className="cs-w2m-grid-row">
                            <span className="cs-w2m-grid-corner" />
                            {W2M_DAYS.map((d) => (
                              <span key={d} className="cs-w2m-grid-day">{d}</span>
                            ))}
                          </div>
                          {W2M_HOURS.map((h, hi) => (
                            <div key={h} className="cs-w2m-grid-row">
                              <span className="cs-w2m-grid-time">{h}</span>
                              {W2M_DATA[hi].map((c, di) => (
                                /* 最优格:周三(列 2)14:00(行 5)5 人全有空 */
                                <span
                                  key={di}
                                  className={"cs-w2m-grid-cell" + (hi === 5 && di === 2 ? " is-best" : "")}
                                  style={c ? { background: w2mCellBg(c) } : undefined}
                                  title={c + " 人有空"}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* ---- 推荐时段 ---- */}
                      <section className="cs-w2m-block">
                        <div className="cs-w2m-block-head">
                          <span className="cs-w2m-block-title">推荐时段</span>
                          <span className="cs-w2m-block-extra">基于已填空闲自动计算 · 按匹配度排序</span>
                        </div>
                        <div className="cs-w2m-recos">
                          {W2M_RECOS.map((r, i) => (
                            <div key={r.when} className={"cs-w2m-reco" + (i === 0 ? " is-top" : "")}>
                              <div className="cs-w2m-reco-main">
                                <span className="cs-w2m-reco-when">{r.when}</span>
                                <span className="cs-w2m-reco-note">{r.note}</span>
                              </div>
                              <span className="cs-w2m-reco-score">{r.score}</span>
                              <button type="button" className={i === 0 ? "cs-w2m-solid" : "cs-w2m-ghost"}>
                                {i === 0 ? "锁定并发起" : "发起会议"}
                              </button>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* ---- 移动端单日视图:手机框(周三各时段有空成员头像) + 说明 ---- */}
                      <section className="cs-w2m-block">
                        <div className="cs-w2m-block-head">
                          <span className="cs-w2m-block-title">移动端 · 单日视图</span>
                          <span className="cs-w2m-block-extra">手机端自适应布局</span>
                        </div>
                        <div className="cs-w2m-mobile">
                          <div className="cs-w2m-phone" aria-hidden="true">
                            <div className="cs-w2m-phone-head">
                              <span className="cs-w2m-phone-day">6/25 周三</span>
                              <span className="cs-w2m-phone-sub">全天可填</span>
                            </div>
                            <div className="cs-w2m-phone-body">
                              {W2M_HOURS.map((h, hi) => {
                                /* 手机端展示周三列(列 2):各时段有空成员头像,14:00 为最优 */
                                const c = W2M_DATA[hi][2];
                                const best = h === "14:00";
                                return (
                                  <div key={h} className={"cs-w2m-phone-row" + (best ? " is-best" : "")}>
                                    <span className="cs-w2m-phone-time">{h}</span>
                                    <span className="cs-w2m-phone-avatars">
                                      {W2M_MEMBERS.filter((m) => m.avatar).slice(0, c).map((m) => (
                                        <img key={m.name} src={m.avatar} alt="" />
                                      ))}
                                    </span>
                                    {best ? <span className="cs-w2m-phone-badge">5 人有空</span> : null}
                                  </div>
                                );
                              })}
                            </div>
                            <button type="button" className="cs-w2m-phone-btn">选择时间</button>
                          </div>
                          <ul className="cs-w2m-mobile-notes">
                            {W2M_MOBILE_NOTES.map((n) => (
                              <li key={n}>{n}</li>
                            ))}
                          </ul>
                        </div>
                      </section>

                      {/* ---- 特性胶囊 + 页脚 ---- */}
                      <section className="cs-w2m-feats">
                        {W2M_FEATS.map((f) => (
                          <span key={f.text} className="cs-w2m-feat">
                            <Icon name={f.icon} size={13} />
                            {f.text}
                          </span>
                        ))}
                      </section>
                      <footer className="cs-w2m-foot">
                        When2meet · 由 AgentBox 蜂群模式生成 · 单文件离线运行 · 无需注册即可填写
                      </footer>
                    </div>
                    ) : (
                      /* markdown 产物:文档页签视图 */
                      <SwarmMdDoc def={SWARM_ARTIFACTS[activeFile.name]} name={activeFile.name} />
                    )
                  ) : (
                    /* 单Agent模式：文档预览页面 */
                    <div className="cs-preview-page">
                      <h2 className="cs-preview-name">汇报演示 · When2meet 项目</h2>
                      <p className="cs-preview-eyebrow">
                        18 页{activeFile.size ? " · " + activeFile.size : ""} · 模拟预览
                      </p>
                      <div className="cs-preview-sec">
                        <h3>01 背景与目标</h3>
                        <p>会议时间协调长期依赖群内接龙，效率低且易遗漏。本章从用户调研数据出发，界定核心痛点与改进机会。</p>
                        <p>调研覆盖 500+ 活跃用户，发现平均创建一次多人会议需往返沟通 6.2 次、耗时 23 分钟，其中 78% 的用户期望系统自动推荐最优时段。</p>
                        {/* 调研数据统计卡片 */}
                        <div className="cs-doc-stats">
                          <div className="cs-doc-stat">
                            <span className="cs-doc-stat-num">500<i>+</i></span>
                            <span className="cs-doc-stat-label">调研活跃用户</span>
                          </div>
                          <div className="cs-doc-stat">
                            <span className="cs-doc-stat-num">6.2<i>次</i></span>
                            <span className="cs-doc-stat-label">平均往返沟通</span>
                          </div>
                          <div className="cs-doc-stat">
                            <span className="cs-doc-stat-num">23<i>分钟</i></span>
                            <span className="cs-doc-stat-label">单次排会耗时</span>
                          </div>
                          <div className="cs-doc-stat">
                            <span className="cs-doc-stat-num">78%</span>
                            <span className="cs-doc-stat-label">期望智能推荐</span>
                          </div>
                        </div>
                      </div>
                      <div className="cs-preview-sec">
                        <h3>02 用户画像</h3>
                        <p>核心用户分为三类：行政协调者（占比 35%）、项目经理（占比 40%）和跨组织参与者（占比 25%）。每类用户的创建频率、参与人数与决策链路各不相同。</p>
                        <p>高频协调者日均创建 3.5 场会议，对批量操作和模板复用诉求强烈；跨组织用户更关注免注册参与和时区自适应。</p>
                        {/* 用户构成占比条 */}
                        <div className="cs-doc-bars">
                          <div className="cs-doc-bar">
                            <span className="cs-doc-bar-label">项目经理</span>
                            <span className="cs-doc-bar-track"><span className="cs-doc-bar-fill" style={{ width: "40%" }} /></span>
                            <span className="cs-doc-bar-pct">40%</span>
                          </div>
                          <div className="cs-doc-bar">
                            <span className="cs-doc-bar-label">行政协调者</span>
                            <span className="cs-doc-bar-track"><span className="cs-doc-bar-fill" style={{ width: "35%" }} /></span>
                            <span className="cs-doc-bar-pct">35%</span>
                          </div>
                          <div className="cs-doc-bar">
                            <span className="cs-doc-bar-label">跨组织参与者</span>
                            <span className="cs-doc-bar-track"><span className="cs-doc-bar-fill" style={{ width: "25%" }} /></span>
                            <span className="cs-doc-bar-pct">25%</span>
                          </div>
                        </div>
                      </div>
                      <div className="cs-preview-sec">
                        <h3>03 首页交互改版（重点）</h3>
                        <p>重构首页信息架构，新增引导式创建流程与动效反馈，降低新用户上手成本，提升创建完成率。</p>
                        <p>改版重点包括：三步式创建向导（主题 → 参与人 → 时段候选）、实时参与度热力图、以及基于滑动操作的快捷时段标记。动效层面采用弹性过渡 + 骨架屏，首屏可交互时间从 2.1s 降至 0.8s。</p>
                      </div>
                      <div className="cs-preview-sec">
                        <h3>04 智慧推荐（重点）</h3>
                        <p>基于历史行为与偏好特征构建推荐策略，在时间候选、参与人与会议时长三个维度提供主动建议。</p>
                        <p>推荐算法融合协方差过滤（CF）与日程密度分析，对多人场景自动计算"最大公约数时段"并给出置信度评分。上线后推荐采纳率达到 62%，平均协调耗时从 23 分钟缩短至 8 分钟。</p>
                      </div>
                      <div className="cs-preview-sec">
                        <h3>05 竞品分析</h3>
                        <p>对标 Doodle、Calendly、When2meet 原版三款产品，从功能完整度、交互体验、价格策略三个维度横向对比。</p>
                        <p>Doodle 优势在于品牌认知度但移动端体验弱；Calendly 深度绑定日历但跨组织场景受限；原版 When2meet 简洁但缺乏智能推荐。改版方案取长补短，定位"轻量 + 智能"。</p>
                        {/* 竞品对比表:改版方案列高亮 */}
                        <table className="cs-doc-table">
                          <thead>
                            <tr>
                              <th>维度</th>
                              <th>Doodle</th>
                              <th>Calendly</th>
                              <th>原版</th>
                              <th className="is-hl">改版方案</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>注册门槛</td>
                              <td>需注册</td>
                              <td>强制账号</td>
                              <td>免注册</td>
                              <td className="is-hl">免注册免下载</td>
                            </tr>
                            <tr>
                              <td>日历集成</td>
                              <td>基础同步</td>
                              <td>一键直连</td>
                              <td>无</td>
                              <td className="is-hl">轻量适配</td>
                            </tr>
                            <tr>
                              <td>推荐能力</td>
                              <td>无</td>
                              <td>单向时段</td>
                              <td>无</td>
                              <td className="is-hl">共同空闲聚合推荐</td>
                            </tr>
                            <tr>
                              <td>移动体验</td>
                              <td>评分最低</td>
                              <td>中等</td>
                              <td>缺单日视图</td>
                              <td className="is-hl">单日视图 · 深色模式</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="cs-preview-sec">
                        <h3>06 信息架构</h3>
                        <p>站点地图从扁平 4 页扩展为三级 12 页结构，新增个人中心、模板库与数据看板模块。</p>
                        <p>页面跳转关系经过卡片分类法验证，核心路径（创建 → 分享 → 查看）不超过 2 次点击。</p>
                      </div>
                      <div className="cs-preview-sec">
                        <h3>07 交互流程</h3>
                        <p>梳理创建、参与、分享三大主流程共 18 个关键节点，标注异常分支与降级方案。</p>
                        <p>参与流程支持免注册预览 + 一键注册确认；分享流程生成短链自动适配 Open Graph 预览卡片。</p>
                      </div>
                      <div className="cs-preview-sec">
                        <h3>08 视觉规范</h3>
                        <p>建立色彩（品牌蓝 + 功能色 6 组）、字体（标题/正文双栈）与间距（8px 基线网格）三大系统。</p>
                        <p>暗色模式全覆盖，对比度均通过 WCAG AA 级认证。</p>
                      </div>
                      <div className="cs-preview-sec">
                        <h3>09 动效设计</h3>
                        <p>定义页面转场、组件微交互与状态反馈三层动效规范，统一使用 ease-out 缓动曲线。</p>
                        <p>关键动效包括：时段热力图渐入（400ms）、参与人头像弹入（弹性 + 150ms 延迟阶梯）、以及推荐结果高亮脉冲。</p>
                      </div>
                      <div className="cs-preview-sec">
                        <h3>10 数据看板</h3>
                        <p>定义核心指标：创建完成率、平均协调耗时、推荐采纳率、7 日留存。埋点覆盖 32 个关键事件。</p>
                        <p>看板支持按用户群、时间段与渠道三维筛选，数据延迟 T+1 更新。</p>
                      </div>
                      <div className="cs-preview-sec">
                        <h3>11 技术方案</h3>
                        <p>前端采用 React 18 + TypeScript，状态管理 Zustand，构建链 Vite。性能预算：首屏 JS ≤ 180KB（gzip）。</p>
                        <p>后端推荐服务使用 Python + Faiss 向量检索，P99 响应时间 ≤ 120ms。</p>
                      </div>
                      <div className="cs-preview-sec">
                        <h3>12 性能优化</h3>
                        <p>首屏加载通过代码分割 + 预加载关键路由实现；包体积优化包括 Tree Shaking（-23%）与图片 AVIF 格式迁移（-41%）。</p>
                        <p>Lighthouse 综合评分从 68 分提升至 94 分。</p>
                      </div>
                      <div className="cs-preview-sec">
                        <h3>13 A/B 实验</h3>
                        <p>设计两组实验：E1 测试新引导式创建流程 vs 旧流程；E2 测试推荐时段自动填充 vs 手动选择。</p>
                        <p>分流策略按用户 ID 哈希 50/50，实验周期 14 天，最小可检测效应 5%。</p>
                      </div>
                      <div className="cs-preview-sec">
                        <h3>14 数据验证</h3>
                        <p>通过 A/B 实验对比改版前后核心指标：创建时长中位数从 23 分钟降至 8 分钟（-65%）、七日留存从 34% 提升至 48%（+14pp）、分享率从 12% 提升至 19%（+7pp）。</p>
                        <p>所有指标均达到统计显著（p &lt; 0.01）。</p>
                        {/* 前后对比指标卡片 */}
                        <div className="cs-doc-metrics">
                          <div className="cs-doc-metric">
                            <span className="cs-doc-metric-delta">-65%</span>
                            <span className="cs-doc-metric-line">23 分钟 → 8 分钟</span>
                            <span className="cs-doc-metric-label">排会时长中位数</span>
                          </div>
                          <div className="cs-doc-metric">
                            <span className="cs-doc-metric-delta">+14pp</span>
                            <span className="cs-doc-metric-line">34% → 48%</span>
                            <span className="cs-doc-metric-label">七日留存</span>
                          </div>
                          <div className="cs-doc-metric">
                            <span className="cs-doc-metric-delta">+7pp</span>
                            <span className="cs-doc-metric-line">12% → 19%</span>
                            <span className="cs-doc-metric-label">分享率</span>
                          </div>
                        </div>
                      </div>
                      <div className="cs-preview-sec">
                        <h3>15 风险与应对</h3>
                        <p>识别三大风险：推荐准确率冷启动（缓解：人工规则兜底）、高并发创建（缓解：消息队列削峰）、跨时区歧义（缓解：IANA 时区数据库）。</p>
                      </div>
                      <div className="cs-preview-sec">
                        <h3>16 团队分工</h3>
                        <p>产品 2 人（需求 + 设计）、前端 3 人、后端 2 人、算法 1 人、测试 1 人。每日站会同步进度，双周迭代评审。</p>
                      </div>
                      <div className="cs-preview-sec">
                        <h3>17 排期计划</h3>
                        <p>三期迭代：Alpha（第 1-4 周，核心流程）、Beta（第 5-8 周，推荐系统）、GA（第 9-12 周，数据看板 + 性能优化）。</p>
                        <p>每期结束进行灰度发布，按 5% → 20% → 100% 逐步放量。</p>
                        {/* 里程碑阶段条 */}
                        <div className="cs-doc-phases">
                          <div className="cs-doc-phase">
                            <span className="cs-doc-phase-tag">Alpha</span>
                            <span className="cs-doc-phase-week">第 1-4 周</span>
                            <span className="cs-doc-phase-scope">核心流程：创建 / 分享 / 填写 / 汇总</span>
                          </div>
                          <div className="cs-doc-phase">
                            <span className="cs-doc-phase-tag">Beta</span>
                            <span className="cs-doc-phase-week">第 5-8 周</span>
                            <span className="cs-doc-phase-scope">推荐系统与日历深度集成</span>
                          </div>
                          <div className="cs-doc-phase">
                            <span className="cs-doc-phase-tag">GA</span>
                            <span className="cs-doc-phase-week">第 9-12 周</span>
                            <span className="cs-doc-phase-scope">数据看板与性能优化</span>
                          </div>
                        </div>
                      </div>
                      <div className="cs-preview-sec">
                        <h3>18 路线图与 Q&amp;A</h3>
                        <p>按季度滚动迭代：Q1 交互细化与推荐策略升级、Q2 开放 API 与日历深度集成、Q3 多语言与国际化。</p>
                        <p>预留 15 分钟 Q&amp;A 环节，欢迎就方案细节与排期展开讨论。</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* 任务摘要页签：空白内容区 */
            <div className="cs-preview-body cs-preview-blank">
              <div className="cs-preview-blank-inner">
                <p className="cs-preview-blank-text">任务摘要</p>
              </div>
            </div>
          )}
        </aside>
      ) : null}
    </div>
  );
}
