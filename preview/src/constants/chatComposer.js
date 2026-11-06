/* ===================== 常量:输入框(ChatComposer)配置数据 ===================== */

/* ================= 配置数据（下拉选项） ================= */
export const AGENT_MODES = [
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
    src: "./assets/uploads/multi-agent-mode.svg",
    desc: "由多个子Agent分工协作完成任务，适合结构复杂或需要协同处理的场景",
  },
];

export const PERMISSIONS = [
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
export const RUNTIMES = [
  {
    id: "local",
    label: "本地",
    icon: "hard-drive",
    src: "./assets/uploads/icon/prompt-input/local_mode.svg",
    desc: "项目运行于本地电脑，数据与文件存储在本地设备中",
  },
  {
    id: "cloud",
    label: "云端模式",
    icon: "cloud",
    src: "./assets/uploads/icon/prompt-input/cloud_mode.svg",
    desc: "项目运行于一体机云端环境，数据与文件存储在一体机中",
  },
];

/* 模型数据来自外部（可覆盖），此处为默认模拟数据；auto 恒为第一项。
   src 指向 assets/uploads 下的真实品牌 logo（优先展示），icon 作为无图兜底 */
export const DEFAULT_MODELS = [
  { id: "deepseek", label: "Deepseek-V4-Flash", src: "./assets/uploads/deepseek.png", icon: "cpu" },
  { id: "glm-52", label: "GLM-5.2", src: "./assets/uploads/glm.png", icon: "brain" },
  { id: "glm-5v", label: "GLM-5v-Turbo", src: "./assets/uploads/glm.png", icon: "zap" },
  { id: "minimax-m3", label: "MiniMax-M3", src: "./assets/uploads/minimax.png", icon: "layers" },
];

export const SPACES = [
  { id: "onboard", name: "项目新手引导" },
  { id: "personal", name: "个人工作" },
  { id: "onboard-duplicate", name: "项目新手引导" },
];

export const ATTACH_ITEMS = [
  { id: "file", label: "上传文件", icon: "paperclip" },
  { id: "code", label: "粘贴代码", icon: "braces" },
  { id: "text", label: "粘贴文本", icon: "type" },
];

/* 纯浏览器拿不到本地绝对路径：用最近目录模拟系统目录选择器（真实桌面端换 Electron showOpenDialog 即可） */
export const MOCK_DIRS = [
  { id: "dir-1", path: "C:\\Workspace\\agent-demo" },
  { id: "dir-2", path: "D:\\Projects\\glm-copilot" },
  { id: "dir-3", path: "C:\\Users\\demo\\Documents\\chat-agent" },
];

/* 上传限制:单次对话最多 20 个附件,单个文件最大 100MB */
export const MAX_UPLOAD_FILES = 20;

export const MAX_UPLOAD_SIZE = 100 * 1024 * 1024;

/* 复用行：图标 + 左对齐标题 + 右对齐正文 */
export const ADD_FILE_CMD = { id: "add-file", title: "添加文件", icon: "paperclip" };

export const SLASH_SKILLS = [
  { id: "file-summary", title: "文件总结", icon: "file-text", desc: "提炼文档要点并生成结构化总结" },
  {
    id: "doc-convert",
    title: "文档转换",
    icon: "file-output",
    desc: "支持在 Word、Excel、PDF、Markdown 与图片之间批量互转，自动保留目录、表格与样式排版，转换结果可直接预览下载",
  },
  { id: "data-analyze", title: "数据分析", icon: "chart-column", desc: "透视数据并输出图表与业务洞察" },
];

export const SLASH_EXPERTS = [
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
export const ADD_ROOTS = [
  { key: "add-file", title: "添加文件", icon: "paperclip" },
  { key: "skill", title: "技能", icon: "wrench", src: "./assets/uploads/skill.svg" },
  { key: "expert", title: "专家", icon: "user-round" },
  { key: "connector", title: "连接器", icon: "plug", src: "./assets/uploads/connector.svg" },
];

export const ADD_CHILDREN = [
  { id: "add-upload", title: "上传文件", icon: "paperclip" },
  { id: "add-code", title: "粘贴代码", icon: "braces" },
  { id: "add-text", title: "粘贴文本", icon: "type" },
];

/* 技能二级：含搜索 + 底部管理项 */
export const SKILL_CHILDREN = [
  {
    id: "doc-summary",
    title: "文档总结",
    icon: "file-text",
    desc: "分析文档内容并提取核心信息，生成结构化摘要、关键结论和重点事项，帮助快速理解长篇资料。",
  },
  {
    id: "doc-convert-2",
    title: "文档转换",
    icon: "file-output",
    desc: "支持不同格式文档之间的转换与整理，保持原始内容结构并适配新的使用场景。",
  },
  {
    id: "data-analyze-2",
    title: "数据分析",
    icon: "chart-column",
    desc: "分析结构化数据并发现关键趋势，支持数据整理、统计分析和结果总结。",
  },
];

/* 技能类胶囊:图标固定为 skill.svg 的形状(经 mask 跟随胶囊蓝色),无关闭按钮 */
export const SKILL_CHIP_MASK = "./assets/uploads/skill.svg";

export const EXPERT_CHILDREN = [
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
export const CONN_CHILDREN = [
  { id: "conn-github", title: "GitHub", icon: "git-branch", src: "./assets/uploads/github.png" },
  { id: "conn-txdocs", title: "腾讯文档", icon: "file-spreadsheet", src: "./assets/uploads/txdocs.png" },
];

export const ADD_LEVELS = {
  "add-file": { key: "add-file", title: "添加文件", items: ADD_CHILDREN },
  skill: { key: "skill", title: "技能", items: SKILL_CHILDREN, searchable: true, manage: true },
  expert: { key: "expert", title: "专家", items: EXPERT_CHILDREN },
  connector: { key: "connector", title: "连接器", items: CONN_CHILDREN },
};
