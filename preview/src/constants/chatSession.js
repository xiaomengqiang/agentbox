/* ===================== 常量:会话页(ChatSession) ===================== */

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

/* 用户提供的内联 SVG 图标（含嵌入 PNG base64），直接渲染为 <svg> 而非 <img> */
export const PROJECT_FILES_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><image x="0" y="0" width="16" height="16" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIUlEQVR4Ae3gAZAkSZIkSRKLqpm7R0REZmZmVlVVVVV3d3d3d/fMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMdHd3d3dXV1VVVVVmZkZGRIS7m5kKz0xmV3d1d3dPz8zMzMxMovj3Qfz7IOBm4CZgD/gH4GbgJl40dwh4R+AdgX8APgt4R+AdedH8svj3Qfz7IP59EPBGwIsBdwA/CrwR8GK8aP5BwBsBLwbcAfwo8EbAi/Gi+Qfx74P490H8+yDg/YE3Bv4B+Czg/YE35kXzowJuBm7iij8CbgZu4kVzh/j3Qfz78I+dsRKT5tp2pAAAAABJRU5ErkJggg=="/></svg>';

export const ZOOM_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><image x="0" y="0" width="32" height="32" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACcUlEQVR4Ae3gAZAkSZIkSRKLqpm7R0REZmZmVlVVVVV3d3d3d/fMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMdHd3d3dXV1VVVVVmZkZGRIS7m5kKz0xmV3d1d3dPz8zMzMxMovjvhfjvhfjvhfjvhfjvhfjvhfjvhfjvhfiXLYCX5jktgb/mOb0Kz2kJPBFY8oIh/mUvDXwI8CTgHM/2PTzbAnhHnu1m4Gbgu4E/4gVD/MteBXg9YAP4JuB2XribgQ8BzgN/CPwRLxjiX/YqwCOB3wQ+BPgm4Haev5uBDwG+CXhd4EnAH/GCIf5lrwI8Evge4GbgQ4BvAm7nOd0MfAjwTcDtwHsBTwL+iBcM8S97FeCRwPdwxc3AhwDfBNzOFTcDHwJ8E3A7V7wX8DfAX/OCIV40C2DJs90MvDnwTVzx6cD3ALfzr4P474X474X4t7kZeEfgK7ji04HvAW7n2RbAkhcO8S97aeClgO/hipuBDwG+CbidK24GPgT4JuB2rngv4EnAH/GCIf5lrwI8Evge4GbgQ4BvAm7nOd0MfAjwTcDtwHsBTwL+iBcM8S97FeCRwG8CHwJ8E3A7z9/NwIcA3wS8LvAk4I94wRD/slcBXhU4BXwTcDsv3M3AhwBHwG8Af8QLhviXvQrw3sDtwO08248CS57tvXi208AjgW8C/poXDPEvWwCPAhY8pz/iOb00sOA5/TWw5AVD/PdC/PdC/PdC/PdC/PdC/PdC/PdC/PfiHwHUwU0hBnrcswAAAABJRU5ErkJggg=="/></svg>';

/* 参与者(已填 5 人 + 待填 1 人,热力图人数与之对应);

/* 日期列(周一 ~ 周六)与时间行(9:00 ~ 20:00 整点) */
export const W2M_DAYS = ["6/23 周一", "6/24 周二", "6/25 周三", "6/26 周四", "6/27 周五", "6/28 周六"];

export const W2M_HOURS = ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

/* 各格空闲人数(0~5):行=时间,列=日期;

/* 推荐时段:峰值与热力图一致(周三 14:00 = 5 人;周五 16:00 / 周二 10:00 = 4 人) */
export const W2M_RECOS = [
  { when: "周三 6/25 14:00 – 15:00", note: "已填 5/5 人全有空", score: "100%" },
  { when: "周五 6/27 16:00 – 17:00", note: "4/5 人有空 · 项目总监冲突", score: "80%" },
  { when: "周二 6/24 10:00 – 11:00", note: "4/5 人有空 · 测试专家冲突", score: "80%" },
];

/* 特性胶囊:图标取自产物内已注入的 Lucide 表 */
export const W2M_FEATS = [
  { icon: "zap", text: "单次排会操作步数减半" },
  { icon: "table", text: "共同时间自动汇总" },
  { icon: "users", text: "免注册 · 全员协同" },
  { icon: "settings-2", text: "移动端单日视图适配" },
];

/* 参与统计卡片(unit 为数值后缀,如 秒/分钟/个) */
export const W2M_STATS = [
  { num: "83%", unit: "", label: "已填率" },
  { num: "42", unit: "秒", label: "平均填表耗时" },
  { num: "6", unit: "分钟", label: "最快响应" },
  { num: "4", unit: "个", label: "覆盖部门" },
];

/* 最近动态(时间倒序):who 为人,avatar 复用成员头像 */
export const W2M_FEED = [
  { who: "项目研究专家", avatar: "./assets/uploads/avatar-research.svg", text: "完成了空闲时间填写", time: "12 分钟前" },
  { who: "UXUI设计专家", avatar: "./assets/uploads/avatar-design.svg", text: "完成了空闲时间填写", time: "35 分钟前" },
  { who: "开发专家", avatar: "./assets/uploads/avatar-develop.svg", text: "完成了空闲时间填写", time: "1 小时前" },
  { who: "测试专家", avatar: "./assets/uploads/avatar-test.svg", text: "完成了空闲时间填写", time: "2 小时前" },
  { who: "项目总监", avatar: "./assets/uploads/avatar-director.svg", text: "创建了投票并分享链接", time: "昨天 16:20" },
];

/* 移动端单日视图说明 */
export const W2M_MOBILE_NOTES = [
  "手机打开分享链接即可填写，无需下载 App、无需注册",
  "单日视图纵向排列时间槽，拇指单手可达",
  "填写结果自动保存，实时与桌面端同步",
  "深色模式自动跟随系统设置",
];

/* 蜂群产物注册表:key 为流式内容中的链接文本;

   待填成员无头像,渲染中性占位图标(避免内联大图) */
export const W2M_MEMBERS = [
  { name: "项目总监", avatar: "./assets/uploads/avatar-director.svg", done: true },
  { name: "项目研究专家", avatar: "./assets/uploads/avatar-research.svg", done: true },
  { name: "UXUI设计专家", avatar: "./assets/uploads/avatar-design.svg", done: true },
  { name: "开发专家", avatar: "./assets/uploads/avatar-develop.svg", done: true },
  { name: "测试专家", avatar: "./assets/uploads/avatar-test.svg", done: true },
  { name: "市场负责人", avatar: null, done: false },
];

/*  周三 14:00 为 5 人全员有空的最优格 */
export const W2M_DATA = [
  [1, 0, 1, 0, 0, 0],
  [3, 4, 2, 1, 2, 0],
  [2, 3, 3, 2, 1, 0],
  [0, 1, 0, 0, 0, 0],
  [2, 3, 4, 2, 3, 1],
  [4, 4, 5, 3, 4, 2],
  [3, 2, 4, 4, 4, 1],
  [2, 3, 3, 2, 4, 0],
  [3, 4, 4, 1, 3, 1],
  [1, 2, 2, 0, 1, 0],
  [0, 1, 1, 0, 0, 0],
  [0, 0, 1, 0, 0, 0],
];

/*    其余按 title/eyebrow/sections(h 标题 + p 段落 + list 列表)渲染文档视图 */
export const SWARM_ARTIFACTS = {
  "编排计划.md": {
    icon: "./assets/uploads/icon/file-type/filled/markdown.svg",
    title: "编排计划 · When2meet 项目",
    eyebrow: "8 个子任务 · 5 位子智能体 · Markdown",
    sections: [
      {
        h: "01 项目目标",
        p: "以「无需注册、快速填写、结果清晰」为核心，交付单文件离线可运行的会议时间协调小程序，把一次多人排会的协调耗时从 23 分钟压缩到 3 分钟以内。",
      },
      {
        h: "02 任务拆解",
        p: "共拆解 8 个子任务，按依赖关系串并混合编排：",
        list: [
          "任务 1：制定编排计划与任务分配 —— 项目总监",
          "任务 2：需求探索与竞品模式调研 —— 项目研究专家",
          "任务 3：输出交互与界面设计 —— UXUI 设计专家",
          "任务 4：代码开发 —— 开发专家",
          "任务 5：测试并输出报告 —— 测试专家",
          "任务 6：根据测试报告修复缺陷 —— 开发专家",
          "任务 7：汇总流程并复盘 —— 项目总监",
          "任务 8：部署上线并归档产物 —— 项目总监",
        ],
      },
      {
        h: "03 里程碑与耗时",
        list: [
          "编排规划：约 12 秒（生成 8 个子任务并完成角色分配）",
          "调研与设计：约 2 分钟（竞品分析 → 界面方案 → 关键体验）",
          "开发实现：约 3 分钟（7 个页面模块 + 汇总推荐逻辑）",
          "测试回归：约 1 分钟（40 项用例 + 2 个 P1 缺陷修复）",
          "部署上线：约 40 秒（单文件构建并通过人工审批放行）",
        ],
      },
      {
        h: "04 协作机制",
        p: "子智能体在群聊中同步进展并开展方案辩论，关键节点交由用户授权放行；每个环节的产物（文档 / 代码 / 报告）沿任务链传递，最终汇总至项目总监复盘归档。",
      },
    ],
  },
  "竞品分析报告.md": {
    icon: "./assets/uploads/icon/file-type/filled/markdown.svg",
    title: "竞品分析报告 · 会议时间协调工具",
    eyebrow: "3 款对标产品 · 4 个维度 · Markdown",
    sections: [
      {
        h: "01 对比对象",
        p: "选取 Doodle、Calendly 与 when2meet 原版三款产品，覆盖海外市场头部工具与经典轻量工具。",
      },
      {
        h: "02 对比维度",
        list: [
          "注册门槛：Doodle 需注册 · Calendly 强制账号 · 原版免注册",
          "日历集成：竞品主推「一键直连」，依赖账号体系与授权链路",
          "推荐能力：Calendly 仅单向时段，均缺少共同空闲聚合推荐",
          "移动体验：Doodle 移动端评分最低，原版缺少单日视图",
        ],
      },
      {
        h: "03 核心结论",
        p: "竞品已放出「日历一键直连」的激进策略，本质是通过堆砌功能圈地、抢占企业团队市场。我们不做盲目加法，采用「极简轻量化」错位竞争：以「无感收集 vs 繁琐填表」压制其交互链路，把产品拉高到「秒级响应 + 全域协同」维度。",
      },
      {
        h: "04 三个硬性指标",
        list: [
          "市场挤压：在办公排期核心场景拦截竞品的跨部门协作与外部会议客群",
          "体验提效：单次排会操作步数直接减半，以易用性拉动高频使用（DAU）",
          "用户资产：以极简体验捆绑后续生态与服务，提升全生命周期价值（LTV）",
        ],
      },
    ],
  },
  "关键体验的编排计划.md": {
    icon: "./assets/uploads/icon/file-type/filled/markdown.svg",
    title: "关键体验编排计划",
    eyebrow: "界面方案 · 关键体验 · 验收标准 · Markdown",
    sections: [
      {
        h: "01 关键体验目标",
        list: [
          "参与者无需注册，打开链接即可填写",
          "选择结果自动保存，中断后可恢复",
          "所有人共同有空的时间突出显示",
        ],
      },
      {
        h: "02 核心流程编排",
        p: "围绕一条零门槛主链路编排页面与状态：",
        list: [
          "创建活动 → 分享链接 → 输入姓名 → 选择空闲时间",
          "自动汇总 → 推荐共同时间 → 主办者确认",
        ],
      },
      {
        h: "03 页面模块排布",
        list: [
          "创建活动（主办者视图）",
          "参与者加入（免注册）",
          "日历时间选择（桌面网格 / 移动端单日）",
          "共同时间热力图与推荐时间",
          "空状态与错误状态（链接失效、填写截止）",
        ],
      },
      {
        h: "04 验收标准",
        list: [
          "单次排会操作 ≤ 3 步，首屏可交互 < 1 秒",
          "共同空闲推荐命中率 ≥ 90%",
          "移动端单手可完成全部填写动作",
        ],
      },
    ],
  },
  "QA_report.md": {
    icon: "./assets/uploads/icon/file-type/filled/markdown.svg",
    title: "测试报告 · When2meet v1.0",
    eyebrow: "40 项用例 · 2 个 P1 缺陷已修复 · Markdown",
    sections: [
      {
        h: "01 测试范围",
        p: "覆盖创建 / 分享、参与者填写、自动保存、共同时间汇总、推荐时段与移动端适配六大模块，共 40 项核心用例。",
      },
      {
        h: "02 缺陷与修复",
        list: [
          "P1-01：移动端 320px 宽度下 30 分钟格错位 —— 已修复并回归通过",
          "P1-02：跨时区场景下截止时间边界溢出 1 小时 —— 已修复并回归通过",
        ],
      },
      {
        h: "03 回归结论",
        p: "两个 P1 缺陷返还开发专家修复后，全量回归 40 项用例全部通过，高优先级缺陷清零，线上版本运行正常。",
      },
    ],
  },
  "When2meet.html": {
    icon: "./assets/uploads/icon/file-type/filled/code.svg",
    kind: "w2m", // 小程序界面预览(见下方 cs-w2m 视图)
  },
};
