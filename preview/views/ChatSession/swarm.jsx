/* ============================================================
 * 蜂群模式 · 流式生成模块
 * 表单提交后的完整多专家协作流程
 * ============================================================ */

/* 蜂群模式配置表单页面定义 */
export const SWARM_FORM_PAGES = [
  {
    id: "approval",
    title: "开发完成后部署前需要等待进行人工审批放行吗？",
    type: "radio",
    options: ["需要", "不需要"],
  },
  {
    id: "env",
    title: "选择部署环境？",
    type: "radio",
    options: ["测试环境", "生产环境"],
  },
];

/* 依据发送载荷构造蜂群模式的前置流式块序列（表单前） */
export function buildSwarmBlocks(payload) {
  return [
    {
      type: "p",
      cls: "cs-node-intro",
      text: "好的，请提供以下信息，我将开发这个小程序。",
      hideAfterForm: true, // 表单提交后隐藏该节点
    },
    {
      type: "form-wait",
      cls: "cs-node-form",
      pages: SWARM_FORM_PAGES,
    },
  ];
}

/* 表单提交后的完整协作流程块（由 index.jsx 在表单通过后拼接） */
export function buildSwarmFlowBlocks(payload) {
  return [
    /* ---- 问题澄清卡片 ---- */
    {
      type: "qa-card",
      cls: "cs-node-qa",
      title: "问题澄清",
      qa: [
        { q: "技术形态用那种？", a: "单文件 Web App" },
        { q: "开发完成后部署前需要等待进行人工审批放行吗？", a: "需要" },
      ],
    },
    /* ---- 探索 ---- */
    {
      type: "status",
      cls: "cs-node-explore",
      src: "./assets/uploads/search.svg",
      text: "已探索 3 个文件，2 个列表",
      fontSize: "sm",
      color: "secondary",
    },
    /* ---- 拆解段落 ---- */
    {
      type: "p",
      cls: "cs-node-decompose-p",
      text: "收到，我先拆解下咱们的核心目标和任务，并且接下来我将创建任务并分派团队成员。",
    },
    /* ---- 技能调取 ---- */
    { type: "skill", text: "已调取1个技能" },
    /* ---- 任务卡片 ---- */
    {
      type: "task-card",
      cls: "cs-node-tasks",
      team: "Agent Team",
      desc: "创建任务并分派团队成员",
      tasks: [
        { text: "任务1：制定编排计划与任务分配" },
        { text: "任务2：需求探索与竞品模式调研", assignee: "项目研究专家", avatar: "./assets/uploads/avatar-research.svg" },
        { text: "任务3：输出交互与界面设计", assignee: "UXUI设计专家", avatar: "./assets/uploads/avatar-design.svg" },
        { text: "任务4：代码开发", assignee: "开发专家", avatar: "./assets/uploads/avatar-develop.svg" },
        { text: "任务5：测试并输出报告", assignee: "测试专家", avatar: "./assets/uploads/avatar-test.svg" },
        { text: "任务6：修复缺陷", assignee: "开发专家", avatar: "./assets/uploads/avatar-develop.svg" },
        { text: "任务7：汇总流程并复盘", assignee: "项目总监", avatar: "./assets/uploads/avatar-director.svg" },
      ],
    },
    { type: "skill", text: "已调取1个技能" },
    /* ---- 项目总监标签 ---- */
    { type: "agent-tag", name: "项目总监", avatar: "./assets/uploads/avatar-director.svg" },
    /* ---- 专家列表 ---- */
    {
      type: "list-block",
      title: "本项目将由4类专家协作完成：",
      items: [
        "研究专家负责需求与竞品模式",
        "UX/UI设计师负责流程和界面",
        "开发专家负责功能实现与缺陷修复",
        "测试专家负责验证与质量报告",
      ],
    },
    /* ---- 编排计划链接 ---- */
    { type: "text-link", text: "已经拆解需求并完成计划分配，输出 ", link: "编排计划.md" },
    { type: "p", text: "下一步，项目研究专家将开始需求探索与竞品模式调研。" },
    /* ---- 研究专家标签 ---- */
    { type: "agent-tag", name: "项目研究专家", avatar: "./assets/uploads/avatar-research.svg" },
    /* ---- 核心结论 ---- */
    {
      type: "conclusion",
      title: "核心结论",
      content: "产品应围绕「无需注册、快速填写、结果清晰」展开",
    },
    {
      type: "conclusion",
      title: "最合适的核心流程是：",
      content: "创建活动 → 分享链接 → 输入姓名 → 选择空闲时间 → 自动汇总 → 推荐共同时间 → 主办者确认",
    },
    /* ---- 竞品报告链接 ---- */
    { type: "text-link", text: "已经完成竞品研究并传递给UXUI设计专家，输出 ", link: "竞品分析报告.md" },
    { type: "p", text: "UXUI设计专家将开始根据竞品调研报告同步开始页面设计。" },
    /* ---- UXUI专家标签 ---- */
    { type: "agent-tag", name: "UXUI设计专家", avatar: "./assets/uploads/avatar-design.svg" },
    /* ---- 设计方案 ---- */
    {
      type: "list-block",
      title: "界面设计方案已完成：",
      items: [
        "创建活动",
        "参与者加入",
        "日历时间选择",
        "共同时间热力图",
        "推荐时间",
        "移动端单日视图",
        "空状态和错误状态",
      ],
    },
    /* ---- 关键体验 ---- */
    {
      type: "conclusion",
      title: "关键体验：",
      content: "参与者无需注册；选择结果自动保存；所有人共同有空的时间会被突出显示。",
    },
    { type: "text-link", text: "已经拆解需求并完成计划分配，输出 ", link: "编排计划.md" },
    /* ---- 开发专家（第一轮） ---- */
    { type: "agent-tag", name: "开发专家", avatar: "./assets/uploads/avatar-develop.svg" },
    {
      type: "list-block",
      title: "本轮已实现：",
      items: [
        "创建和分享活动",
        "多人填写空闲时间",
        "自动保存和同步",
        "共同时间热力图",
        "推荐30/60/90分钟时间",
        "桌面端和移动端适配",
      ],
    },
    { type: "text-link", text: "开发已完成，进入测试阶段，输出 ", link: "When2meet.html" },
    /* ---- 测试专家 ---- */
    { type: "agent-tag", name: "测试专家", avatar: "./assets/uploads/avatar-test.svg" },
    { type: "text-link", text: "测试已通过，发现2个p1问题并返还给开发专家进行修改，输出 ", link: "QA_report.md" },
    /* ---- 开发专家（修复轮） ---- */
    { type: "agent-tag", name: "开发专家", avatar: "./assets/uploads/avatar-develop.svg" },
    /* ---- 授权 ---- */
    { type: "skill", icon: "hand", text: "用户已授权" },
    /* ---- 项目完成 ---- */
    { type: "p", text: "项目已完成并部署" },
    {
      type: "list-block",
      title: "最终结果",
      items: [
        "7个项目阶段全部完成",
        "40项核心测试全部通过",
        "高优先级缺陷清零",
        "线上版本运行正常",
      ],
    },
    {
      type: "conclusion",
      title: "产物汇总",
      content: "",
    },
  ];
}
