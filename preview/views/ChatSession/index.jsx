import { useState, useEffect, useMemo, useRef } from "react";
import { Icon } from "../../components/Icon/index.jsx";
import "./index.css";

/* ================= 会话数据构造 ================= */

/* 截断长文本用于标题/引用 */
function short(text, n) {
  const t = (text || "").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}

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
        "01 背景与目标 —— 会议时间协调的痛点与机会",
        "02 用户画像 —— 目标人群与核心场景",
        "03 首页交互改版 —— 布局与动效方案（重点）",
        "04 智慧推荐 —— 推荐策略与算法链路（重点）",
        "05 数据验证 —— 核心指标与 A/B 结论",
        "…",
        "18 路线图与 Q&A —— 迭代计划与讨论",
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
      <div className="cs-user-bubble">{msg.text}</div>
      <p className="cs-user-meta">
        {msg.meta.modelLabel} · {msg.meta.modeLabel}
      </p>
    </div>
  );
}

/* ================= Agent 回复：流式生成 + 授权弹框等待 ================= */
function AgentRun({ msg, onGrow, onNeedPerm, permCmd }) {
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

            /* ---- 生成产物：产物文件卡片 ---- */
            if (b.type === "artifacts") {
              return (
                <div className={"cs-files " + (b.cls || "")} key={i}>
                  {b.files.map((f) => (
                    <div className="cs-file" key={f.id}>
                      <span className="cs-file-icon">
                        <Icon src={f.src} size={24} />
                      </span>
                      <span className="cs-file-info">
                        <span className="cs-file-name">{f.name}</span>
                        <span className="cs-file-meta">
                          {f.desc} · {f.size}
                        </span>
                      </span>
                      <button type="button" className="cs-file-btn" title="预览" aria-label="预览">
                        <Icon name="eye" size={14} />
                      </button>
                      <button type="button" className="cs-file-btn" title="下载" aria-label="下载">
                        <Icon name="download" size={14} />
                      </button>
                    </div>
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

  /* 点击下拉外部任意位置时收起「允许」下拉 */
  useEffect(() => {
    if (!allowOpen) return;
    const onDown = (e) => {
      if (!e.target.closest("[data-perm-drop]")) setAllowOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [allowOpen]);

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
      {/* 顶栏：会话标题 + 新对话 */}
      <header className="cs-header">
        <div className="cs-header-main">
          <h1 className="cs-title">{first ? short(first.text, 24) : "新会话"}</h1>
          <p className="cs-subtitle">
            {first ? first.meta.modelLabel + " · " + first.meta.modeLabel + " · " + first.meta.permissionLabel : ""}
          </p>
        </div>
        <button type="button" className="cs-new" onClick={onReset}>
          <Icon name="square-pen" size={15} />
          <span>新对话</span>
        </button>
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
                  <Icon
                    name="chevron-down"
                    size={16}
                    className={"cs-perm-pop-chev" + (allowOpen ? " is-open" : "")}
                  />
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
  );
}
