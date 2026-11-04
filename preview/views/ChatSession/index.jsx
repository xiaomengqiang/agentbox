import { useState, useEffect, useMemo, useRef } from "react";
import { Icon } from "../../components/Icon/index.jsx";
import "./index.css";

/* ================= 会话数据构造 ================= */

/* 截断长文本用于标题/引用 */
function short(text, n) {
  const t = (text || "").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}

/* 用户提供的内联 SVG 图标（含嵌入 PNG base64），直接渲染为 <svg> 而非 <img> */
const PROJECT_FILES_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><image x="0" y="0" width="16" height="16" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIUlEQVR4Ae3gAZAkSZIkSRKLqpm7R0REZmZmVlVVVVV3d3d3d/fMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMdHd3d3dXV1VVVVVmZkZGRIS7m5kKz0xmV3d1d3dPz8zMzMxMovj3Qfz7IOBm4CZgD/gH4GbgJl40dwh4R+AdgX8APgt4R+AdedH8svj3Qfz7IP59EPBGwIsBdwA/CrwR8GK8aP5BwBsBLwbcAfwo8EbAi/Gi+Qfx74P490H8+yDg/YE3Bv4B+Czg/YE35kXzowJuBm7iij8CbgZu4kVzh/j3Qfz78I+dsRKT5tp2pAAAAABJRU5ErkJggg=="/></svg>';

const ZOOM_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><image x="0" y="0" width="32" height="32" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACcUlEQVR4Ae3gAZAkSZIkSRKLqpm7R0REZmZmVlVVVVV3d3d3d/fMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMdHd3d3dXV1VVVVVmZkZGRIS7m5kKz0xmV3d1d3dPz8zMzMxMovjvhfjvhfjvhfjvhfjvhfjvhfjvhfjvhfiXLYCX5jktgb/mOb0Kz2kJPBFY8oIh/mUvDXwI8CTgHM/2PTzbAnhHnu1m4Gbgu4E/4gVD/MteBXg9YAP4JuB2XribgQ8BzgN/CPwRLxjiX/YqwCOB3wQ+BPgm4Haev5uBDwG+CXhd4EnAH/GCIf5lrwI8Evge4GbgQ4BvAm7nOd0MfAjwTcDtwHsBTwL+iBcM8S97FeCRwPdwxc3AhwDfBNzOFTcDHwJ8E3A7V7wX8DfAX/OCIV40C2DJs90MvDnwTVzx6cD3ALfzr4P474X474X4t7kZeEfgK7ji04HvAW7n2RbAkhcO8S97aeClgO/hipuBDwG+CbidK24GPgT4JuB2rngv4EnAH/GCIf5lrwI8Evge4GbgQ4BvAm7nOd0MfAjwTcDtwHsBTwL+iBcM8S97FeCRwG8CHwJ8E3A7z9/NwIcA3wS8LvAk4I94wRD/slcBXhU4BXwTcDsv3M3AhwBHwG8Af8QLhviXvQrw3sDtwO08248CS57tvXi208AjgW8C/poXDPEvWwCPAhY8pz/iOb00sOA5/TWw5AVD/PdC/PdC/PdC/PdC/PdC/PdC/PdC/PfiHwHUwU0hBnrcswAAAABJRU5ErkJggg=="/></svg>';

/* 依据发送载荷构造一次 Agent 回复：结构化回答块流。
   块类型："p" 段落 / "li" 列表项 / "status" 图标状态行（随流式逐字输出）/
   "perm-wait" 授权等待标记 — 流式输出到该块时挂起，授权弹框在输入框上方弹出，
   允许后继续输出其后的块；拒绝则跳过剩余内容，任务中止。 */
export function buildAgentReply(payload) {
  /* 失败注入：用户消息包含「失败 / 中断 / fail」时，冲刺阶段打完文案后触发生成失败（测试失败流程） */
  const failMode = /失败|中断|fail/i.test(payload.text || "");

  const blocks = [
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
      type: "perm-wait",
      cls: "cs-node-permission",
      title: "操作授权",
      desc: "申请新建GitHub仓库【When2meet】，并将该项目部署至个人网站/测试环境",
      short: "新建GitHub仓库【When2meet】",
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
    {
      type: "status",
      cls: "cs-node-sprint",
      src: "./assets/uploads/bird.webp",
      text: "咻一一青鸟正在最终冲刺中......",
      linear: true,
      transient: true, // 生成完成后隐藏该节点
      failHere: failMode, // 失败模式：冲刺文案打完后触发生成失败，任务中断
    },
    /* ---- 以下为生成产物输出：文件内容 → 产物汇总 → 产物文件 ---- */
    {
      type: "filecontent",
      cls: "cs-node-filecontent",
      noPerm: true, // 拒绝授权时不输出
      title: "汇报演示.html · HTML",
      lines: [
        "# 汇报演示 · When2meet 项目",
        "01 背景与目标 —— 会议时间协调痛点与改进机会",
        "02 用户画像 —— 目标人群与核心使用场景",
        "03 首页交互改版 —— 布局与动效方案（重点）",
        "04 智慧推荐 —— 推荐策略与算法链路（重点）",
        "05 竞品分析 —— Doodle、Calendly 功能对比",
        "06 信息架构 —— 站点地图与页面跳转关系",
        "07 交互流程 —— 创建/参与/分享三大主流程",
        "08 视觉规范 —— 色彩、字体与间距系统",
        "09 动效设计 —— 微交互与转场动效规范",
        "10 数据看板 —— 关键指标定义与埋点方案",
        "11 技术方案 —— 前端架构与性能预算",
        "12 性能优化 —— 首屏加载与包体积优化",
        "13 A/B 实验 —— 实验设计与分流策略",
        "14 数据验证 —— 核心指标与 A/B 结论",
        "15 风险与应对 —— 识别、评估与缓解措施",
        "16 团队分工 —— 角色职责与协作机制",
        "17 排期计划 —— 三期迭代里程碑",
        "18 路线图与 Q&A —— 长期规划与讨论",
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
      files: [
        {
          id: "art-1",
          name: "汇报演示.html",
          desc: "18 页汇报演示文件",
          size: "86.5 KB",
          src: "./assets/uploads/file-doc.svg",
        },
      ],
    },
  ];

  return { blocks, failMode };
}

/* ================= 用户消息气泡 ================= */
function UserBubble({ msg }) {
  const chips = msg.chips || [];
  const files = msg.files || [];
  return (
    <div className="cs-user-wrap">
      {chips.length > 0 || files.length > 0 ? (
        <div className="cs-user-attach">
          {chips.map((c) => (
            <span className="cs-user-chip" key={c.id}>
              <Icon name={c.icon} size={12} />
              {c.title}
            </span>
          ))}
          {files.map((f) => (
            <span className="cs-user-chip" key={f.id}>
              <Icon src={f.src} size={12} />
              {f.name}
            </span>
          ))}
        </div>
      ) : null}
      <div className="cs-user-bubble">
        {/* 标签：图标 + 文档总结（图标 0.875rem） */}
        <span className="cs-user-tag">
          <Icon name="file-text" size={14} />
          <span>文档总结</span>
        </span>
        <div className="cs-user-text">{msg.text}</div>
      </div>
    </div>
  );
}

/* ================= 产物文件卡片：图标 + 信息 + 更多操作下拉 ================= */
function FileCard({ f, onPreview }) {
  const [open, setOpen] = useState(false);

  /* 点击下拉外部任意位置时收起 */
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!e.target.closest("[data-file-drop]")) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div className="cs-file">
      <span className="cs-file-icon">
        <Icon src={f.src} size={28} />
      </span>
      <span className="cs-file-info">
        <span className="cs-file-name">{f.name}</span>
        <span className="cs-file-meta">
          {f.desc} · {f.size}
        </span>
      </span>
      {/* 打开方式下拉 */}
      <div className="cs-file-drop" data-file-drop>
        <button
          type="button"
          className={"cs-file-more" + (open ? " is-open" : "")}
          onClick={() => setOpen((v) => !v)}
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
        {open ? (
          <div className="cs-file-menu">
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
function AgentRun({ msg, onGrow, onNeedPerm, permCmd, onPreview }) {
  const blocks = msg.blocks;
  const total = blocks.length;
  const [cursor, setCursor] = useState(0); // 当前处理到的块下标（= 已完成块数）
  const [chars, setChars] = useState(0); // 当前块已打出的字符数
  const [readIdx, setReadIdx] = useState(0); // 读取文档面板已揭示的条目数
  const [perm, setPerm] = useState("none"); // 授权状态：none / waiting / allowed / always / rejected
  const [failed, setFailed] = useState(false); // 生成失败（任务中断）

  const cur = cursor < total ? blocks[cursor] : null;
  const done = cursor >= total;
  const rejected = perm === "rejected";
  const completed = done && !rejected; // 任务完成（生成成功）

  /* 生成计时与 Token 消耗：未完成时每 200ms 刷新（等待授权期间同样计时），完成后冻结；重试时重启 */
  const [startTs, setStartTs] = useState(() => Date.now());
  const [nowTs, setNowTs] = useState(() => Date.now());
  useEffect(() => {
    if (done) return;
    const t = window.setInterval(() => setNowTs(Date.now()), 200);
    return () => window.clearInterval(t);
  }, [done]);
  const elapsedMs = Math.max(0, nowTs - startTs);
  const tokens = 1024 + Math.floor((elapsedMs / 1000) * 386);

  /* 光标进入新块时重置读取条目揭示进度 */
  useEffect(() => {
    setReadIdx(0);
  }, [cursor]);

  /* 流式打字：逐字输出当前文本块，块间稍作停顿；授权等待块由下方授权链路处理。
     读取文档块：先打标签文字，再逐条揭示文档相关内容，全部揭示后进入下一块。
     结构块（文件内容/产物汇总/产物文件）：整块淡入展示后推进 */
  useEffect(() => {
    if (!cur || cur.type === "perm-wait") return;
    if (!cur.text) {
      const t = window.setTimeout(() => {
        setCursor((c) => c + 1);
        if (onGrow) onGrow();
      }, 700);
      return () => window.clearTimeout(t);
    }
    if (cur.reading) {
      if (chars < cur.text.length) {
        const t = window.setTimeout(() => {
          setChars((c) => c + 2);
          if (onGrow) onGrow();
        }, 16);
        return () => window.clearTimeout(t);
      }
      if (readIdx < cur.reading.length) {
        const t = window.setTimeout(() => {
          setReadIdx((v) => v + 1);
          if (onGrow) onGrow();
        }, 900);
        return () => window.clearTimeout(t);
      }
      const t = window.setTimeout(() => {
        setCursor((c) => c + 1);
        setChars(0);
        if (onGrow) onGrow();
      }, 500);
      return () => window.clearTimeout(t);
    }
    if (chars < cur.text.length) {
      const t = window.setTimeout(() => {
        setChars((c) => c + 2);
        if (onGrow) onGrow();
      }, 16);
      return () => window.clearTimeout(t);
    }
    /* 失败注入点：冲刺文案打完后短暂等待 → 生成失败，任务中断 */
    if (cur.failHere) {
      const t = window.setTimeout(() => {
        setFailed(true);
        setCursor(total);
        if (onGrow) onGrow();
      }, 1200);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      setCursor((c) => c + 1);
      setChars(0);
      if (onGrow) onGrow();
    }, 140);
    return () => window.clearTimeout(t);
  }, [cursor, chars, readIdx]);

  /* 流式推进到授权等待块：置为等待态，并通知父级弹出操作授权弹框（输入框上方） */
  useEffect(() => {
    if (!cur || cur.type !== "perm-wait") return;
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

  /* 状态栏阶段：思考中 → 已思考（思考块完成，含授权与读取文档期间）→ 生成中（读取块完成）→ 任务完成/已中止 */
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
            if (b.transient && i < cursor) return null; // 阶段性节点（思考/读取/冲刺）完成后隐藏
            if (b.hideOnDone && !rejected && !failed && artifactsStarted) return null; // 产物开始输出时隐藏（已探索/梳理段落）；失败/中止时保留
            if (b.noPerm && (rejected || failed)) return null; // 拒绝授权/生成失败时不输出产物相关块

            /* ---- 生成产物：文件内容预览 ---- */
            if (b.type === "filecontent") {
              return (
                <div className={"cs-fc " + (b.cls || "")} key={i}>
                  <div className="cs-fc-head">
                    <Icon name="file-code" size={14} />
                    <span>{b.title}</span>
                  </div>
                  <p className="cs-sum-title">文件内容</p>
                  <div className="cs-fc-body">
                    {b.lines.map((ln, k) => (
                      <p className="cs-fc-line" key={k}>
                        {ln}
                      </p>
                    ))}
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

            /* 授权等待块：等待期间由输入框上方的弹框承载；
               允许（本次/始终）后不再渲染授权结果节点，直接继续流式输出；
               拒绝 → 紧凑结果行提示任务中止 */
            if (b.type === "perm-wait") {
              if (i === cursor) return null;
              if (perm !== "rejected") return null;
              return (
                <div className={"cs-perm-done is-rejected " + (b.cls || "")} key={i}>
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

/* ================= 会话页面 ================= */
export default function ChatSession({ messages, onReset, composer }) {
  const listRef = useRef(null);
  const first = messages[0];

  /* 操作授权弹框：当前等待授权的消息 id + 回传给对应 AgentRun 的决定 */
  const [pendingMsgId, setPendingMsgId] = useState(null);
  const [permCmd, setPermCmd] = useState(null);
  const [allowOpen, setAllowOpen] = useState(false); // 「允许」下拉展开态

  /* 右侧预览面板：当前预览的产物文件 */
  const [previewFile, setPreviewFile] = useState(null);
  const [zoomOpen, setZoomOpen] = useState(false); // 缩放下拉
  const [moreOpen, setMoreOpen] = useState(false); // 更多操作下拉

  /* 统一关闭所有下拉（允许/缩放/更多）：点击外部非下拉区域时收起 */
  useEffect(() => {
    if (!allowOpen && !zoomOpen && !moreOpen) return;
    const onDown = (e) => {
      if (
        !e.target.closest("[data-perm-drop]") &&
        !e.target.closest("[data-zoom-drop]") &&
        !e.target.closest("[data-more-drop]")
      ) {
        setAllowOpen(false);
        setZoomOpen(false);
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [allowOpen, zoomOpen, moreOpen]);

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

  /* 弹框按钮：拒绝 / 允许本次操作 / 始终运行操作 → 关闭弹框并把决定回传给等待中的 AgentRun */
  const decide = (decision) => {
    if (!pendingMsgId) return;
    setPermCmd({ msgId: pendingMsgId, decision });
    setPendingMsgId(null);
    setAllowOpen(false);
  };

  /* 弹框内容取自等待授权消息里的 perm-wait 块 */
  const pendingMsg = messages.find((m) => m.id === pendingMsgId);
  const permBlock = pendingMsg
    ? pendingMsg.blocks.find((b) => b.type === "perm-wait")
    : null;

  return (
    <div className="cs-wrap">
      <div className="cs-main">
        {/* 顶栏：会话标题 + 日历图标 */}
        <header className="cs-header">
          <div className="cs-header-main">
            <h1 className="cs-title">{first ? short(first.text, 24) : "新会话"}</h1>
          </div>
          <img src="./assets/uploads/header-calendar.png" alt="" className="cs-new" />
        </header>

        {/* 消息流 */}
        <div className="cs-list" ref={listRef}>
          <div className="cs-inner">
            {messages.map((m) =>
              m.role === "user" ? (
                <UserBubble key={m.id} msg={m} />
              ) : (
                <AgentRun
                  key={m.id}
                  msg={m}
                  onGrow={scrollToBottom}
                  onNeedPerm={setPendingMsgId}
                  permCmd={permCmd}
                  onPreview={setPreviewFile}
                />
              )
            )}
          </div>
        </div>

        {/* 底部输入区（由 ChatWorkspace 注入）+ 操作授权弹框（悬于输入框上方） */}
        <div className="cs-composer">
        {permBlock ? (
          <div className="cs-perm-pop" role="dialog" aria-modal="false" aria-label="操作授权">
            <h3 className="cs-perm-pop-title">{permBlock.title}</h3>
            <p className="cs-perm-pop-desc">{permBlock.desc}</p>
            <div className="cs-perm-pop-actions">
              {/* 拒绝：次级按钮 */}
              <button type="button" className="cs-perm-pop-deny" onClick={() => decide("rejected")}>
                拒绝
              </button>
              {/* 允许：下拉选择框（允许本次操作 / 始终运行操作） */}
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
                    <button
                      type="button"
                      className="cs-perm-pop-opt"
                      onClick={() => decide("allowed")}
                    >
                      允许本次操作
                    </button>
                    <button
                      type="button"
                      className="cs-perm-pop-opt"
                      onClick={() => decide("always")}
                    >
                      始终运行操作
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
        {composer}
        <p className="cs-footnote">内容由 AI 生成，请仔细核实 · Enter 发送 / Shift + Enter 换行</p>
        </div>
      </div>

      {/* 右侧预览面板：点击产物卡片下拉的「在线预览」打开 */}
      {previewFile ? (
        <aside className="cs-preview" aria-label="文件预览">
          {/* ---- 头部 ---- */}
          <div className="cs-preview-head">
            <div className="cs-preview-head-left">
              <span className="cs-preview-tab">
                <Icon src="./assets/uploads/tab-files.svg" size={16} />
                <span>项目文件</span>
              </span>
              <button type="button" className="cs-preview-tab">
                <Icon name="file-text" size={14} />
                <span>任务摘要</span>
              </button>
              <span className="cs-preview-vline" />
              <div className="cs-preview-filetab">
                <Icon src={previewFile.src} size={14} />
                <span>{previewFile.name}</span>
                <button
                  type="button"
                  className="cs-preview-filetab-x"
                  onClick={() => setPreviewFile(null)}
                  aria-label="关闭文件"
                >
                  <Icon name="x" size={12} />
                </button>
              </div>
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

          {/* ---- 操作栏 ---- */}
          <div className="cs-preview-toolbar">
            <div className="cs-preview-toolbar-left">
              {/* 类似 ant Segmented：预览(眼睛) / 代码(dev) */}
              <div className="cs-segmented">
                <button type="button" className="cs-seg-item is-active" title="预览" aria-label="预览">
                  <Icon name="eye" size={14} />
                </button>
                <button type="button" className="cs-seg-item" title="代码" aria-label="代码">
                  <Icon src="./assets/uploads/category-dev.svg" size={14} />
                </button>
              </div>
              {/* 地址栏 */}
              <div className="cs-address">
                <Icon name="folder-open" size={12} />
                <span>D:\Projects\agent-demo\{previewFile.name}</span>
              </div>
            </div>
            <div className="cs-preview-toolbar-right">
              <button type="button" className="cs-preview-iconbtn" title="会话" aria-label="会话">
                <Icon name="message-circle" size={16} />
              </button>
              {/* 缩放下拉 */}
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
              {/* 更多操作下拉：与 cs-file-more 同款（打开方式 + 倒三角） */}
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

          {/* ---- 预览容器 ---- */}
          <div className="cs-preview-body">
            <div className="cs-preview-container">
              <div className="cs-preview-page">
                <h2 className="cs-preview-name">汇报演示 · When2meet 项目</h2>
                <p className="cs-preview-eyebrow">18 页 · {previewFile.size} · 模拟预览</p>

                <div className="cs-preview-sec">
                  <h3>01 背景与目标</h3>
                  <p>会议时间协调长期依赖群内接龙，效率低且易遗漏。本章从用户调研数据出发，界定核心痛点与改进机会。</p>
                  <p>调研覆盖 500+ 活跃用户，发现平均创建一次多人会议需往返沟通 6.2 次、耗时 23 分钟，其中 78% 的用户期望系统自动推荐最优时段。</p>
                </div>

                <div className="cs-preview-sec">
                  <h3>02 用户画像</h3>
                  <p>核心用户分为三类：行政协调者（占比 35%）、项目经理（占比 40%）和跨组织参与者（占比 25%）。每类用户的创建频率、参与人数与决策链路各不相同。</p>
                  <p>高频协调者日均创建 3.5 场会议，对批量操作和模板复用诉求强烈；跨组织用户更关注免注册参与和时区自适应。</p>
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
                </div>

                <div className="cs-preview-sec">
                  <h3>18 路线图与 Q&amp;A</h3>
                  <p>按季度滚动迭代：Q1 交互细化与推荐策略升级、Q2 开放 API 与日历深度集成、Q3 多语言与国际化。</p>
                  <p>预留 15 分钟 Q&amp;A 环节，欢迎就方案细节与排期展开讨论。</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
