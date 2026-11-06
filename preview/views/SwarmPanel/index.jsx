import { useState, useEffect, useRef } from "react";
import { Icon } from "../../components/Icon/index.jsx";
import "./index.css";

/* 蜂群模式任务面板(固宽 650):标题栏(项目文件/任务摘要 + 放大/收缩) + 进展信息栏 */
const TABS = [
  { id: "files", label: "项目文件", src: "./assets/uploads/icon/tab-files.svg" },
  { id: "summary", label: "任务摘要", src: "./assets/uploads/icon/tab-summary.svg" },
];

/* 任务统计由 doneCount 派生(初始:已完成1/进行中2/等待5,动画推进至 8/0/0) */
const TASK_TOTAL = 8;

/* 任务列表:标题 + 展开详情(小鸟 + 上下两行文本,按场景填写);
   第 1 项已完成(step-done),其余进行/等待中(step-loading) */
const TASK_ICONS = {
  done: "./assets/uploads/icon/step-done.svg",
  loading: "./assets/uploads/icon/step-loading.svg",
};
const TASKS = [
  { id: "t-1", title: "制定编排计划与任务分配", icon: TASK_ICONS.done, line1: "已生成 8 个子任务并完成角色分配", line2: "规划节点耗时约 12 秒，等待调度开始" },
  { id: "t-2", title: "需求探索与竞品模式调研", icon: TASK_ICONS.loading, line1: "正在检索竞品资料与公开评测信息", line2: "已浏览 12 个网页，4 篇深度报告待提炼" },
  { id: "t-3", title: "代码开发", icon: TASK_ICONS.loading, line1: "正在实现页面与接口联调", line2: "6 个模块已完成 2 个，预计 3 分钟后进入自测" },
  { id: "t-4", title: "测试并输出报告", icon: TASK_ICONS.loading, line1: "等待开发完成后启动全量回归", line2: "计划覆盖 42 条用例，输出 Markdown 报告" },
  { id: "t-5", title: "根据测试报告修复缺陷", icon: TASK_ICONS.loading, line1: "等待测试报告产出缺陷清单", line2: "将按严重等级逐项修复并复验" },
  { id: "t-6", title: "流程总体串联并运行", icon: TASK_ICONS.loading, line1: "等待前序任务全部完成", line2: "将端到端运行完整流程并记录耗时" },
  { id: "t-7", title: "汇总流程", icon: TASK_ICONS.loading, line1: "等待各节点产出物就绪", line2: "将汇总执行日志、产物与关键指标" },
  { id: "t-8", title: "部署并复盘", icon: TASK_ICONS.loading, line1: "流程汇总通过后执行部署", line2: "部署完成将生成复盘文档与改进建议" },
];

/* 子智能体:圆形头像(各角色独立头像+底色) + 名称/职责两行文本;
   busy 为 loading 显示的进度区间 [起,止),随进度逐个出现/消失 */
const AGENTS = [
  { id: "a-1", name: "项目总监", duty: "项目整合汇总", avatar: "./assets/uploads/avatar-director.svg", bg: "#e0daff" },
  { id: "a-2", name: "UXUI设计专家", duty: "项目设计产出", avatar: "./assets/uploads/avatar-design.svg", bg: "#ffe3f8", busy: [1, 4] },
  { id: "a-3", name: "项目研究专家", duty: "制定商业策略", avatar: "./assets/uploads/avatar-research.svg", bg: "#fff0e3", busy: [1, 5] },
  { id: "a-4", name: "开发专家", duty: "技术代码实现", avatar: "./assets/uploads/avatar-develop.svg", bg: "#f4ffcb", busy: [4, 7] },
  { id: "a-5", name: "测试专家", duty: "项目缺陷修复", avatar: "./assets/uploads/avatar-test.svg", bg: "#d6e1f4", busy: [6, 8] },
];

/* 产物:md 文档与代码文件;进行中的文件在右侧浅灰标注 */
const ARTIFACTS = [
  { id: "f-1", name: "编排计划.md", src: "./assets/uploads/icon/file-type/filled/markdown.svg" },
  { id: "f-2", name: "竞品分析报告.md", src: "./assets/uploads/icon/file-type/filled/markdown.svg", status: "进行中" },
  { id: "f-3", name: "index.html", src: "./assets/uploads/icon/file-type/filled/code.svg", status: "进行中" },
];

/* 群聊辩论视图:搜索框 + 4 条聊天对话(头像/角色/时间/多段正文) */
const CHAT_MESSAGES = [
  {
    id: "m-1",
    role: "项目总监",
    avatar: "./assets/uploads/avatar-director.svg",
    time: "2026/06/20 12:20",
    paragraphs: [
      `@项目研究专家 竞品已经放出了'日历一键直连'的激进策略，明摆着是要通过堆砌功能圈地、抢占企业团队的市场份额。我们不能盲目做加法，所以我决定采用'极简轻量化'的错位竞争方案。`,
      `我需要你作为项目研究专家，首先完成任务 1（需求分析与竞品确立）。我们要明确，这个'极简轻量'不是单纯的简陋，而是要在操作效率上对竞品形成"无感收集" vs "繁琐填表"的压制，把 when2meet 排期小程序拉高到'秒级响应'和'全域协同'的维度。你这边怎么看？`,
    ],
  },
  {
    id: "m-2",
    role: "项目研究专家",
    avatar: "./assets/uploads/avatar-research.svg",
    time: "2026/06/20 12:43",
    paragraphs: [
      `@项目总监 明白。我刚刚交叉验证了竞品的动向，他们的'日历直连'确实对单人转化率拉动很大，但弱点在于功能越来越臃肿，而且交互同质化严重。`,
      `针对我们的'极简轻量化'策略，我将竞品分析的目标拆解为三个硬性指标：`,
      `市场挤压目标：在办公排期核心场景下，通过'极速轻量'概念强行拦截原本属于竞品的'跨部门协作'和'外部会议'客群。`,
      `体验提效目标：单次排会操作步数必须直接减半，通过拉高易用性和高频使用率（DAU）来摊平研发成本。`,
      `用户资产目标：利用极简交互体验捆绑后续的生态和服务，提升用户的全生命周期价值（LTV）。`,
      `老大，这个战略方向对齐的话，我马上输出深度分析文档，并转入任务 2 进行团队分工。`,
    ],
  },
  {
    id: "m-3",
    role: "UXUI设计专家",
    avatar: "./assets/uploads/avatar-design.svg",
    time: "2026/06/20 12:56",
    paragraphs: [
      `@项目研究专家 好，目标定得很准。那我们来看任务 2（提出更多体验侧诉求）。既然主打轻量化，这次我需要你的智囊团在做竞品分析时，帮我扒透核心的体验数据。我计划在主界面采用模块化的 Bento Box (便当盒) 布局来收纳高密度信息，配合带有未来感的深色模式。我需要明确：竞品在完整用户旅程（User Journey）中哪里存在断点？核心任务的交互层级最深到了哪一层？你打算怎么调度 Ethan（市场研究专家）、Claire（营销专家）和 Eric（商业策略专家）这三位，来为我的页面交互和视觉风格提供精准洞察？我需要听到具体的兵力部署。`,
    ],
  },
  {
    id: "m-4",
    role: "项目研究专家",
    avatar: "./assets/uploads/avatar-research.svg",
    time: "2026/06/20 13:23",
    paragraphs: [
      `@UXUI设计专家 收到。结合我们刚刚确立的'极简、轻量、体验'三大维度，我建议这样分工，今晚前我把任务正式下发给他们：`,
      `用户旅程维度分配给 Ethan（市场研究专家）：`,
      `任务：立刻去起底竞品'日历直连'的用户画像和交互断点。同时，帮我们摸清真实用户对 Bento Box 这种高密度轻量布局的偏好度，确保我们绘制用户体验旅程地图（User Journey Map）时精准避坑。`,
    ],
  },
];

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
  const { extraChat = [], progress: progressProp, onViewChange } = props;
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

        {/* 产物(距子智能体 32):标题 + 向下三角,3 个文件行 */}
        <div className="sp-artifacts">
          <button type="button" className="sp-artifacts-head">
            <span>产物</span>
            <Icon src="./assets/uploads/icon/section-arrow.svg" size={14} />
          </button>
          <div className="sp-artifacts-list">
            {[
              ...ARTIFACTS,
              /* 群聊信息执行后追加的产物 */
              ...(extraChat.length > 0
                ? [
                    {
                      id: "f-when2meet",
                      name: "when2meet.html",
                      src: "./assets/uploads/icon/file-type/filled/code.svg",
                    },
                  ]
                : []),
            ].map((a) => (
              <div key={a.id} className="sp-artifact">
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
