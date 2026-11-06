import { useState, useEffect, useRef } from "react";
import { Icon } from "../../components/Icon/index.jsx";
import {
  TABS,
  TASK_TOTAL,
  TASK_ICONS,
  TASKS,
  AGENTS,
  ARTIFACTS,
  CHAT_MESSAGES
} from "../../src/constants/swarmPanel.js";
import "./index.css";
















/* 正文首部的 @提及 文本渲染为蓝色 */
function renderChatPara(p) {
  const m = p.match(/^(@[^\s]+)(\s*)/);
  if (!m) return p;
  return (
    <>
      <span className="sp-chat-mention">{m[1]}</span>
      {p.slice(m[0].length)}
    </>
  );
}

export default function SwarmPanel(props) {
  // extraChat:父级注入的追加消息(左侧输入框发送后追加)
  // progress:外部同步进度(0~1,来自左侧流式进度);未提供时回退为内部自动动画
  // onViewChange:向上上报当前是否处于群聊(辩论)视图,输入框据此切换发送去向
  // onOpenArtifact:点击产物行 → 父级在右侧预览打开对应产物页签
  const { extraChat = [], progress: progressProp, onViewChange, onOpenArtifact } = props;
  // 默认选中第二个选项「任务摘要」
  const [tab, setTab] = useState("summary");
  // 右侧第二个图标(展开)带选中态,与左侧选项卡同款选中效果
  const [headerExpanded, setHeaderExpanded] = useState(false);
  // 默认展开第 3 项(代码开发),支持多项同时展开
  const [openTasks, setOpenTasks] = useState(["t-3"]);
  const toggleTask = (id) =>
    setOpenTasks((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  // 子智能体 / 群聊 视图切换
  const [agentView, setAgentView] = useState("agents");
  // 点击群聊卡片后,页签区新增「竞品研究群聊辩论」+ 加号图标
  const [chatTabAdded, setChatTabAdded] = useState(false);
  const openChatTab = () => {
    setChatTabAdded(true);
    setTab("debate");
  };

  // 上报群聊(辩论)视图状态:为 true 时左侧输入框的发送走右侧聊天追加
  useEffect(() => {
    if (onViewChange) onViewChange(tab === "debate");
  }, [tab, onViewChange]);

  // 群聊新增内容时,滚动容器贴底(整体内容上移,露出新消息)
  const bodyRef = useRef(null);
  useEffect(() => {
    if (tab !== "debate") return;
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [extraChat.length, tab]);

  // 进度驱动:外部同步(左侧流式进度)优先;无外部进度时回退为内部自动动画
  // (2s 后启动,7s 内从 12.5% 匀速前进到 100%)
  const synced = typeof progressProp === "number";
  const [selfProgress, setSelfProgress] = useState(1 / TASK_TOTAL);
  const progress = synced ? progressProp : selfProgress;
  useEffect(() => {
    if (synced) return; // 同步模式:进度由外部驱动,不启动内部动画
    let raf = null;
    let startTs = null;
    const startVal = 1 / TASK_TOTAL;
    const target = 1;
    const duration = 7000;
    const timeout = window.setTimeout(() => {
      const step = (ts) => {
        if (startTs === null) startTs = ts;
        const t = Math.min(1, (ts - startTs) / duration);
        setSelfProgress(startVal + (target - startVal) * t);
        if (t < 1) raf = window.requestAnimationFrame(step);
      };
      raf = window.requestAnimationFrame(step);
    }, 2000);
    return () => {
      window.clearTimeout(timeout);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [synced]);
  const doneCount = Math.min(TASK_TOTAL, Math.floor(progress * TASK_TOTAL + 0.0001));
  const inProgress = Math.min(2, TASK_TOTAL - doneCount);
  const waiting = TASK_TOTAL - doneCount - inProgress;

  // 进度跑满后先停留 1s(保持蓝色),再切换为完成态(绿色渐变 + 完成小鸟)
  const [finished, setFinished] = useState(false);
  const atEnd = progress >= 1;
  useEffect(() => {
    if (!atEnd) return;
    const t = window.setTimeout(() => setFinished(true), 1000);
    return () => window.clearTimeout(t);
  }, [atEnd]);

  return (
    <aside className={"sp-panel" + (tab === "debate" ? " sp-panel--wide" : "")}>
      {/* ---- 标题栏:左侧两个选项卡,右侧放大/收缩 ---- */}
      <header className="sp-header">
        <div className="sp-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={"sp-tab" + (tab === t.id ? " is-active" : "")}
              onClick={() => setTab(t.id)}
            >
              <Icon src={t.src} size={16} />
              <span>{t.label}</span>
            </button>
          ))}
          {/* 点击群聊卡片后新增的页签 + 加号 */}
          {chatTabAdded ? (
            <button
              type="button"
              className={"sp-tab" + (tab === "debate" ? " is-active" : "")}
              onClick={() => setTab("debate")}
            >
              <Icon name="user-round" size={16} />
              <span>竞品研究群聊辩论</span>
            </button>
          ) : null}
          {chatTabAdded ? (
            <button
              type="button"
              className="sp-action"
              aria-label="新增页签"
              title="新增页签"
            >
              <Icon name="plus" size={16} />
            </button>
          ) : null}
        </div>
        <div className="sp-actions">
          <button type="button" className="sp-action" aria-label="放大" title="放大">
            <Icon name="expand" size={16} />
          </button>
          <button
            type="button"
            className={"sp-action" + (headerExpanded ? " is-active" : "")}
            aria-label="日历"
            title="日历"
            aria-pressed={headerExpanded}
            onClick={() => setHeaderExpanded((v) => !v)}
          >
            {/* 自然尺寸渲染(不设 width/height) */}
            <img src="./assets/uploads/header-calendar.png" alt="" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* ---- 主内容区 ---- */}
      <div className="sp-body" ref={bodyRef}>
        {tab === "debate" ? (
          /* ---- 群聊辩论视图:胶囊搜索框 + 聊天对话列表 ---- */
          <div className="sp-chat">
            <label className="sp-chat-search">
              <Icon name="search" size={16} />
              <input
                className="sp-chat-search-input"
                placeholder="搜索群聊内容"
                aria-label="搜索群聊内容"
              />
            </label>
            <div className="sp-chat-list">
              {[...CHAT_MESSAGES, ...extraChat].map((msg) => (
                <div
                  key={msg.id}
                  className={
                    "sp-chat-item" + (msg.side === "right" ? " sp-chat-item--right" : "")
                  }
                >
                  <div className="sp-chat-item-head">
                    <img
                      className="sp-chat-item-avatar"
                      src={msg.avatar}
                      alt=""
                      aria-hidden="true"
                    />
                    <span className="sp-chat-item-role">{msg.role}</span>
                    <span className="sp-chat-item-time">{msg.time}</span>
                  </div>
                  <div className="sp-chat-item-body">
                    {msg.paragraphs.map((p, i) => (
                      <p key={i} className="sp-chat-item-p">
                        {renderChatPara(p)}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
        <>
        {/* 进展标题 + 向下箭头 */}
        <button type="button" className="sp-section-head">
          <span>进展</span>
          <Icon src="./assets/uploads/icon/section-arrow.svg" size={14} />
        </button>

        {/* 浅灰信息栏:上任务统计,下进度条(小鸟停在进度位置上) */}
        <div className="sp-info">
          <div className="sp-info-head">
            <span className="sp-info-title">8个任务</span>
            <div className="sp-info-stats">
              <span className="sp-stat">已完成 <b>{doneCount}</b></span>
              <span className="sp-stat">进行中 <b>{inProgress}</b></span>
              <span className="sp-stat">等待中 <b>{waiting}</b></span>
              <span className="sp-stat">异常 <b>0</b></span>
            </div>
          </div>
          <div className="sp-progress">
            <div className="sp-progress-track">
              <div
                className={"sp-progress-fill" + (finished ? " sp-progress-fill--done" : "")}
                style={{ width: progress * 100 + "%" }}
              />
            </div>
            <img
              className={"sp-progress-bird" + (finished ? " sp-progress-bird--done" : "")}
              src={
                finished
                  ? "./assets/uploads/progress-bird-complete.svg"
                  : "./assets/uploads/progress-bird.webp"
              }
              alt=""
              aria-hidden="true"
              style={{
                /* 两种状态共用同一钳制表达式:完成切换时 left 不变,
                   小鸟原地替换图片,不产生横向滑动 */
                left: "min(" + progress * 100 + "%, calc(100% - 36px))",
              }}
            />
          </div>
        </div>

        {/* 任务列表(浅灰信息栏外部):每项 loading + 标题 + 向下箭头,点击展开详情 */}
        <div className="sp-tasks">
            {TASKS.map((t) => {
              const open = openTasks.includes(t.id);
              // 已完成的任务(序号 <= doneCount)图标变为 step-done,其余保持 loading 旋转
              const taskNo = Number(t.id.slice(2));
              const isDone = taskNo <= doneCount;
              return (
                <div key={t.id} className={"sp-task" + (open ? " is-open" : "")}>
                  <button
                    type="button"
                    className="sp-task-head"
                    onClick={() => toggleTask(t.id)}
                    aria-expanded={open}
                  >
                    <Icon
                      src={isDone ? TASK_ICONS.done : TASK_ICONS.loading}
                      size={14}
                      className={isDone ? undefined : "sp-task-loading"}
                    />
                    <span className="sp-task-title">{t.title}</span>
                    <Icon src="./assets/uploads/icon/section-arrow.svg" size={14} className="sp-task-chev" />
                  </button>
                  {open ? (
                    <div className="sp-task-detail">
                      <img
                        className="sp-task-bird"
                        src="./assets/uploads/avatar-design.svg"
                        alt=""
                        aria-hidden="true"
                      />
                      <div className="sp-task-lines">
                        <span className="sp-task-line1">{t.line1}</span>
                        <span className="sp-task-line2">{t.line2}</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
        </div>

        {/* 子智能体/群聊 可切换,下方内容随视图变化 */}
        <div className="sp-agents">
          <div className="sp-agents-head">
            <button
              type="button"
              className={"sp-agents-switch" + (agentView === "agents" ? " is-active" : "")}
              onClick={() => setAgentView("agents")}
            >
              子智能体
            </button>
            <button
              type="button"
              className={"sp-agents-switch" + (agentView === "chat" ? " is-active" : "")}
              onClick={() => setAgentView("chat")}
            >
              群聊
            </button>
          </div>
          {agentView === "agents" ? (
            <div className="sp-agents-list">
              {AGENTS.map((a) => {
                // loading 图标随进度区间显示
                const busy = a.busy && doneCount >= a.busy[0] && doneCount < a.busy[1];
                return (
                  <div key={a.id} className="sp-agent">
                    <img
                      className="sp-agent-avatar"
                      src={a.avatar}
                      alt=""
                      aria-hidden="true"
                      style={{ backgroundColor: a.bg }}
                    />
                    <div className="sp-agent-lines">
                      <span className="sp-agent-line1">{a.name}</span>
                      <span className="sp-agent-line2">{a.duty}</span>
                    </div>
                    {busy ? (
                      <Icon
                        src="./assets/uploads/icon/step-loading.svg"
                        size={14}
                        className="sp-agent-loading"
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            /* 群聊视图:浅灰圆角卡片,左侧两行文本 + 右侧小鸟;点击后上方新增群聊页签 */
            <div
              className="sp-groupchat"
              role="button"
              tabIndex={0}
              onClick={openChatTab}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openChatTab();
              }}
            >
              <div className="sp-groupchat-text">
                <span className="sp-groupchat-line1">When2meet小程序开发群聊</span>
                <span className="sp-groupchat-line2">[3条] 当前进展: 竞品探究辩论</span>
              </div>
              <img
                className="sp-groupchat-bird"
                src="./assets/uploads/chat-preview-mascots.svg"
                alt=""
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        {/* 产物(距子智能体 32):标题 + 向下三角,4 个文件行;点击行 → 右侧预览打开对应产物页签 */}
        <div className="sp-artifacts">
          <button type="button" className="sp-artifacts-head">
            <span>产物</span>
            <Icon src="./assets/uploads/icon/section-arrow.svg" size={14} />
          </button>
          <div className="sp-artifacts-list">
            {ARTIFACTS.map((a) => (
              <div
                key={a.id}
                className="sp-artifact"
                role="button"
                tabIndex={0}
                onClick={() => onOpenArtifact && onOpenArtifact(a)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onOpenArtifact && onOpenArtifact(a);
                }}
              >
                <Icon src={a.src} size={16} />
                <span className="sp-artifact-name">{a.name}</span>
                {a.status && !finished ? (
                  <span className="sp-artifact-status">{a.status}</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        </>
        )}
      </div>
    </aside>
  );
}
