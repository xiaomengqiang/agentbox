/* ===================== 常量:蜂群任务面板(SwarmPanel) ===================== */

/* 蜂群模式任务面板(固宽 650):标题栏(项目文件/任务摘要 + 放大/收缩) + 进展信息栏 */
export const TABS = [
  { id: "files", label: "项目文件", src: "./assets/uploads/icon/tab-files.svg" },
  { id: "summary", label: "任务摘要", src: "./assets/uploads/icon/tab-summary.svg" },
];

/* 任务统计由 doneCount 派生(初始:已完成1/进行中2/等待5,动画推进至 8/0/0) */
export const TASK_TOTAL = 8;

/* 任务列表:标题 + 展开详情(小鸟 + 上下两行文本,按场景填写);

   第 1 项已完成(step-done),其余进行/等待中(step-loading) */
export const TASK_ICONS = {
  done: "./assets/uploads/icon/step-done.svg",
  loading: "./assets/uploads/icon/step-loading.svg",
};

export const TASKS = [
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

/* 产物:与流式内容链接一致的四个蜂群产出文件;

/* 群聊辩论视图:搜索框 + 4 条聊天对话(头像/角色/时间/多段正文) */
export const CHAT_MESSAGES = [
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

/*    busy 为 loading 显示的进度区间 [起,止),随进度逐个出现/消失 */
export const AGENTS = [
  { id: "a-1", name: "项目总监", duty: "项目整合汇总", avatar: "./assets/uploads/avatar-director.svg", bg: "#e0daff" },
  { id: "a-2", name: "UXUI设计专家", duty: "项目设计产出", avatar: "./assets/uploads/avatar-design.svg", bg: "#ffe3f8", busy: [1, 4] },
  { id: "a-3", name: "项目研究专家", duty: "制定商业策略", avatar: "./assets/uploads/avatar-research.svg", bg: "#fff0e3", busy: [1, 5] },
  { id: "a-4", name: "开发专家", duty: "技术代码实现", avatar: "./assets/uploads/avatar-develop.svg", bg: "#f4ffcb", busy: [4, 7] },
  { id: "a-5", name: "测试专家", duty: "项目缺陷修复", avatar: "./assets/uploads/avatar-test.svg", bg: "#d6e1f4", busy: [6, 8] },
];

/* 进行中的文件在右侧浅灰标注 */
export const ARTIFACTS = [
  { id: "f-1", name: "编排计划.md", src: "./assets/uploads/icon/file-type/filled/markdown.svg" },
  { id: "f-2", name: "竞品分析报告.md", src: "./assets/uploads/icon/file-type/filled/markdown.svg", status: "进行中" },
  { id: "f-3", name: "关键体验的编排计划.md", src: "./assets/uploads/icon/file-type/filled/markdown.svg", status: "进行中" },
  { id: "f-4", name: "When2meet.html", src: "./assets/uploads/icon/file-type/filled/code.svg", status: "进行中" },
];
