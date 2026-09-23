import { useEffect, useState } from "react";
import "./demo.css";
import ArtifactSummary from "./components/ArtifactSummary/index.jsx";
import TaskTemplateCard, { TaskTemplateCardGroup } from "./components/TaskTemplateCard/index.jsx";
import TaskCard, { TaskCardGroup } from "./components/TaskCard/index.jsx";
import { Icon } from "./assets/shared/icons.js";

/* ==========================================================================
   数据
   ========================================================================== */

const CAPABILITIES = [
  { icon: "bot", title: "智能体编排", description: "按意图自动拆解任务，调度多个子智能体协同完成复杂流程。" },
  { icon: "workflow", title: "工作流引擎", description: "以节点化的方式编排步骤，支持条件分支、循环与人工审批。" },
  { icon: "database", title: "知识库检索", description: "接入企业文档与结构化数据，向量检索为回答提供可溯源依据。" },
  { icon: "shield-check", title: "权限与审计", description: "细粒度的权限控制与全链路操作审计，满足企业合规要求。" },
  { icon: "terminal", title: "代码执行沙箱", description: "在隔离环境中运行代码，安全地完成数据计算与格式转换。" },
  { icon: "chart-column", title: "数据洞察", description: "自动生成图表与结论摘要，把原始数据转化为可读的分析报告。" },
];

/* 图标取自 Lucide；icon 字段同时供构建期扫描注入图标节点 */
const ICON_CHOICES = [
  { icon: "sparkles", label: "sparkles · 生成" },
  { icon: "bot", label: "bot · 智能体" },
  { icon: "file-text", label: "file-text · 文档" },
  { icon: "rocket", label: "rocket · 发布" },
  { icon: "database", label: "database · 数据" },
  { icon: "shield-check", label: "shield-check · 安全" },
  { icon: "zap", label: "zap · 高效" },
  { icon: "lock", label: "lock · 权限" },
];

/* 定时任务标签可选图标；icon 字段同时供构建期扫描注入图标节点 */
const TASK_LABEL_ICONS = [
  { icon: "calendar-clock", label: "calendar-clock · 周期" },
  { icon: "repeat", label: "repeat · 重复" },
  { icon: "clock", label: "clock · 时间" },
  { icon: "timer", label: "timer · 计时" },
  { icon: "database", label: "database · 数据" },
  { icon: "file-text", label: "file-text · 文档" },
  { icon: "zap", label: "zap · 自动" },
];

/* 定时任务卡片展示数据 */
const TASK_CARDS = [
  {
    title: "每周项目周报汇总",
    label: "周报",
    labelIcon: "calendar-clock",
    description: "每周一自动汇总上周进展，生成周报并同步到项目群。",
    schedule: "每周一 09:00",
    nextRun: "2026/09/28 09:00",
    checked: true,
  },
  {
    title: "客户数据每日备份",
    label: "备份",
    labelIcon: "database",
    description: "每天凌晨将客户库增量备份到对象存储，保留最近 30 天。",
    schedule: "每天 02:00",
    nextRun: "2026/09/24 02:00",
    checked: true,
  },
  {
    title: "竞品动态监测",
    label: "监测",
    labelIcon: "repeat",
    description: "定时抓取竞品更新并生成摘要，发现重大变动时推送到群。",
    schedule: "每 6 小时",
    nextRun: "2026/09/23 18:00",
    checked: false,
  },
];

/* 边界场景：长文案 / 无标签 / 开关状态 */
const TASK_EDGE_CASES = [
  {
    caption: "超长标题 + 超长描述",
    props: {
      title: "这是一个非常非常长的定时任务标题用来验证单行省略号截断",
      label: "长标题",
      labelIcon: "zap",
      description:
        "描述超过两行后同样被截断并显示省略号，这里刻意写一段较长的文字来触发两行省略的行为，确保底部信息行不会被挤出卡片。",
      schedule: "每个工作日的上午九点整",
      nextRun: "2026/09/24 09:00",
      checked: true,
    },
  },
  {
    caption: "无标签（唯一可缺省的字段）",
    props: {
      title: "季度数据归档",
      description: "每季度末把历史数据归档到冷存储，并生成归档报告。",
      schedule: "每季度末 23:00",
      nextRun: "2026/12/31 23:00",
      checked: false,
    },
  },
  {
    caption: "开关禁用",
    props: {
      title: "已归档任务",
      label: "已归档",
      labelIcon: "clock",
      description: "任务归档后开关不可操作。",
      schedule: "每周日 23:00",
      nextRun: "—",
      disabled: true,
      checked: false,
    },
  },
];

const EDGE_CASES = [
  { icon: "file-text", title: "这是一个非常非常长的标题用来验证单行省略号截断", description: "描述超过两行后同样被截断并显示省略号，这里刻意写一段较长的文字来触发该行为。", clickable: true },
  { icon: "rocket", title: "仅标题与描述", description: "标准三行结构，无额外内容。", clickable: true },
  { icon: "zap", title: "短描述", description: "触达更高效。", clickable: true },
  { title: "无图标", description: "图标为可选，缺省时不渲染第一行。", clickable: true },
  { icon: "lock", title: "静态卡片", description: "未传 onClick 时不响应悬停与键盘。", clickable: false },
];

const MATRIX_STATES = ["Default", "Hover", "静态（无交互）"];

/* ArtifactSummary 色彩规格：Element → State → Background / Outline / Text */
const ARTIFACT_COLOR_ROWS = [
  {
    variant: "Card",
    state: "Default",
    background: { token: "#FFFFFF", color: "#FFFFFF", detail: "#FFFFFF" },
    outline: { token: "--color-background-tertiary", color: "#E5E5EA", detail: "#E5E5EA · 1px" },
    text: { token: "--color-font-primary", color: "rgba(0,0,0,0.90)", detail: "标题与操作文字" },
  },
  {
    variant: "Icon well",
    state: "Default",
    background: { token: "#F1F3F5", color: "#F1F3F5", detail: "#F1F3F5 · 100%" },
    outline: { token: "—", kind: "none", detail: "无描边" },
    text: { token: "--color-icon-primary", color: "rgba(0,0,0,0.90)", detail: "图标颜色" },
  },
  {
    variant: "Secondary text",
    state: "Default",
    background: { token: "transparent", kind: "transparent", detail: "透明" },
    outline: { token: "—", kind: "none", detail: "无描边" },
    text: { token: "--color-font-secondary", color: "rgba(0,0,0,0.60)", detail: "文件类型文字" },
  },
  {
    variant: "Diff add",
    state: "Default",
    background: { token: "#D5F2DC", color: "#D5F2DC", detail: "#D5F2DC" },
    outline: { token: "—", kind: "none", detail: "无描边" },
    text: { token: "#01802B", color: "#01802B", detail: "#01802B" },
  },
  {
    variant: "Diff remove",
    state: "Default",
    background: { token: "#FCE3E0", color: "#FCE3E0", detail: "#FCE3E0" },
    outline: { token: "—", kind: "none", detail: "无描边" },
    text: { token: "#BF0A1C", color: "#BF0A1C", detail: "#BF0A1C" },
  },
];

function noop() {}

/* ==========================================================================
   通用小组件
   ========================================================================== */

function Section(props) {
  return (
    <section className="demo-section">
      <div className="demo-section-header">
        <h2 className="demo-section-name">{props.title}</h2>
        {props.tag ? <span className="demo-section-tag">{props.tag}</span> : null}
      </div>
      <p className="demo-section-desc">{props.description}</p>
      {props.children}
    </section>
  );
}

function Select(props) {
  return (
    <label className="button-control">
      <span>{props.label}</span>
      <span className="button-select-wrap">
        <select value={props.value} onChange={(e) => props.onChange(e.target.value)}>
          {props.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </span>
    </label>
  );
}

function Toggle(props) {
  return (
    <div className="button-control">
      <span>{props.label}</span>
      <div className="button-toggle-line">
        <span>{props.value ? "开启" : "关闭"}</span>
        <label className="button-switch">
          <input
            type="checkbox"
            checked={props.value}
            onChange={(e) => props.onChange(e.target.checked)}
            aria-label={props.label}
          />
          <span className="button-switch-track" />
        </label>
      </div>
    </div>
  );
}

/* 色彩单元格：色板 + token + 解析说明。
   色板取值优先级：kind（透明 / 无描边）> color（字面色值）> var(token)。 */
function ColorValue(props) {
  const literal = props.color ? props.color : "var(" + props.token + ")";
  return (
    <>
      <span className="btn-color-token">
        <i
          aria-hidden="true"
          className={"btn-color-swatch" + (props.kind ? " btn-color-swatch--" + props.kind : "")}
          style={props.kind ? undefined : { backgroundColor: literal }}
        />
        <code>{props.token}</code>
      </span>
      <span className="btn-table-src">{props.detail}</span>
    </>
  );
}

/* 语义 token 写法（token 走 var()），供 TaskTemplateCard 规格表使用 */
function Color(props) {
  return <ColorValue token={props.token} kind={props.kind} detail={props.detail} />;
}

function Same() {
  return <span className="btn-color-same">同 Default</span>;
}

/* 一个单元格：same 标记 / 单值 / 多值纵向堆叠 */
function ColorCell({ value }) {
  if (value === "same") return <Same />;
  const values = Array.isArray(value) ? value : [value];
  return (
    <div className="input-demo-color-stack">
      {values.map((item, index) => (
        <ColorValue key={(item.token || item.kind || "value") + "-" + index} {...item} />
      ))}
    </div>
  );
}

/* 色彩规格表：Variant → State → Background / Outline / Text，未变化项标记“同 Default” */
function ColorSpecSection({ description, rows }) {
  return (
    <Section title="Color spec" description={description}>
      <div className="btn-table-wrap">
        <table className="btn-table btn-table--color">
          <thead>
            <tr>
              <th>Variant</th>
              <th>State</th>
              <th>Background</th>
              <th>Outline</th>
              <th>Text</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const first = index === 0 || rows[index - 1].variant !== row.variant;
              const span = rows.filter((item) => item.variant === row.variant).length;
              return (
                <tr key={row.variant + "-" + row.state} className={first ? "btn-color-group-start" : undefined}>
                  {first ? (
                    <th className="btn-color-variant" scope="rowgroup" rowSpan={span}>{row.variant}</th>
                  ) : null}
                  <td className="btn-color-state">
                    {row.state}
                    {row.note ? <small>{row.note}</small> : null}
                  </td>
                  <td><ColorCell value={row.background} /></td>
                  <td><ColorCell value={row.outline} /></td>
                  <td><ColorCell value={row.text} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

/* 主题：切换 <html> 的 .dark 并持久化 */
const THEME_KEY = "agentbox-theme";

function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) === "dark";
    } catch (e) {
      return false;
    }
  });
  useEffect(() => {
    try {
      document.documentElement.classList.toggle("dark", dark);
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch (e) {
      /* 无 DOM / 存储环境时忽略 */
    }
  }, [dark]);
  return [dark, setDark];
}

/* ==========================================================================
   ArtifactSummary 面板
   ========================================================================== */

function ArtifactSummaryPanel() {
  const [fileType, setFileType] = useState("PPTX");
  const [notice, setNotice] = useState("");
  const [undone, setUndone] = useState(false);

  const file = {
    title:
      fileType === "DOCX"
        ? "项目方案说明文档.docx"
        : fileType === "PDF"
          ? "产品需求说明书.pdf"
          : "文件名称.PPTX",
    fileType,
  };

  return (
    <div className="demo-panel">
      <div className="demo-panel-head">
        <h2 className="demo-panel-name">ArtifactSummary 产物汇总</h2>
        <p className="demo-panel-summary">
          文件附件 + 代码修改两张卡片 · 宽度跟随父容器 · 标题单行省略 · 复用 Button / DropdownButton / DiffTags
        </p>
      </div>

      <Section
        title="Configurator"
        tag="实时配置"
        description="宽度跟随父容器；文件类型图标来自现有文件类型资源，代码图标暂用 Lucide 占位。"
      >
        <div className="button-configurator">
          <div className="button-controls">
            <Select
              label="文件类型"
              value={fileType}
              onChange={setFileType}
              options={[
                { value: "PPTX", label: "PPTX" },
                { value: "PDF", label: "PDF" },
                { value: "DOCX", label: "DOCX" },
              ]}
            />
          </div>
          <div className="button-configurator-preview asm-demo-live">
            <span className="btn-lab-slotlabel">LIVE PREVIEW</span>
            <ArtifactSummary
              file={file}
              changes={{ fileCount: 3, added: 128, removed: 64 }}
              onOpen={() => setNotice("已触发打开方式")}
              onUndo={() => {
                setUndone(true);
                setNotice("已撤销代码修改");
              }}
              onReview={() => setNotice("已触发审核")}
            />
            <p className="demo-note" role="status">
              {undone ? "代码修改已撤销" : notice || "点击卡片右侧操作体验回调"}
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="Gallery · 卡片状态"
        tag="默认 / 长文案 / +0"
        description="两张卡片始终成组出现：文件产物在上、代码修改在下，间距 8px。"
      >
        <div className="demo-grid demo-grid-2">
          <div className="demo-item">
            <h3 className="demo-item-title">默认产物</h3>
            <ArtifactSummary
              file={{ title: "文件名称.PPTX", fileType: "PPTX" }}
              changes={{ fileCount: 3, added: 128, removed: 64 }}
            />
          </div>
          <div className="demo-item">
            <h3 className="demo-item-title">长文件名与零变更</h3>
            <ArtifactSummary
              file={{ title: "这是一个非常长的文件名称用于验证单行省略效果的演示文件.PPTX", fileType: "PPTX" }}
              changes={{ fileCount: 0, added: 0, removed: 0 }}
            />
          </div>
        </div>
      </Section>

      <ColorSpecSection
        description="Element → State → Background / Outline / Text。未变化项标记为“同 Default”。"
        rows={ARTIFACT_COLOR_ROWS}
      />

      <Section
        title="Token contract"
        description="布局、卡片、图标位与操作区的取值与规则。"
      >
        <div className="btn-table-wrap">
          <table className="btn-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Value</th>
                <th>Rule</th>
              </tr>
            </thead>
            <tbody>
              <tr><th>Layout</th><td>100% width · vertical</td><td>标题与卡片、卡片之间均为 8px</td></tr>
              <tr><th>Card</th><td>80px · 16px padding · 16px radius</td><td>白色底、tertiary 描边、无阴影</td></tr>
              <tr><th>Icon well</th><td>48 × 48px · 12px radius</td><td>背景 #F1F3F5，图标 28px</td></tr>
              <tr><th>Actions</th><td>DropdownButton XS · Button Small</td><td>撤销与审核间距 8px</td></tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="API contract"
        description="展示与交互均由真实组件处理；操作区回调由宿主决定后续行为。"
      >
        <div className="btn-table-wrap">
          <table className="btn-table">
            <thead>
              <tr><th>Prop</th><th>Contract</th></tr>
            </thead>
            <tbody>
              <tr><th>file</th><td>title、fileType、iconSrc；文件类型自动匹配图标。</td></tr>
              <tr><th>changes</th><td>fileCount、added、removed；0 值保留为 +0 / -0。</td></tr>
              <tr><th>onOpen / onUndo / onReview</th><td>分别响应打开方式、撤销和审核操作。</td></tr>
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

/* ==========================================================================
   TaskTemplateCard 面板
   ========================================================================== */

function TaskTemplateCardColorRows() {
  const rows = [
    { state: "Default" },
    { state: "Hover" },
    { state: "静态", note: "未传 onClick" },
  ];

  return rows.map((row, i) => (
    <tr key={row.state} className={i === 0 ? "btn-color-group-start" : undefined}>
      {i === 0 ? (
        <th rowSpan={rows.length} scope="rowgroup" className="btn-color-variant">
          TaskTemplateCard
          <span className="btn-table-src">唯一形态，无 variant / size / shape</span>
        </th>
      ) : null}
      <td className="btn-color-state">
        {row.state}
        {row.note ? <small>{row.note}</small> : null}
      </td>
      <td>
        {row.state === "Default" ? (
            <Color token="--surface-container-lowest" detail="卡片底色 · 浅色 #FFF / 深色深色面 · 叠加液态玻璃（内高光 + 背景折射 blur 4px）" />
        ) : (
          <Same />
        )}
      </td>
      <td>
        {row.state === "Default" ? (
          <Color token="—" detail="无描边 · 无外阴影 · 仅顶部 1px 玻璃内高光 inset 0 1px 1px #FFF" kind="none" />
        ) : row.state === "Hover" ? (
          <Color token="—" detail="无描边 · 抬起阴影 0 8px 24px rgba(0,0,0,8%)、玻璃内高光保留" kind="none" />
        ) : (
          <Same />
        )}
      </td>
      <td>
        {row.state === "Default" ? (
          <>
            <Color token="--container" detail="标题 · container 100% · 浅色 #000000 / 深色 #FFFFFF" />
            <Color token="--container-50" detail="描述 · 浅色黑 50% / 深色白 50%" />
            <Color token="--color-icon-tertiary" detail="图标 · 浅色黑 40% / 深色白 40%" />
          </>
        ) : (
          <Same />
        )}
      </td>
    </tr>
  ));
}

function TaskTemplateCardPanel() {
  const [icon, setIcon] = useState("sparkles");
  const [title, setTitle] = useState("智能体编排");
  const [description, setDescription] = useState("按意图自动拆解任务，调度多个子智能体协同完成复杂流程。");
  const [clickable, setClickable] = useState(true);

  const iconOptions = [{ value: "", label: "无图标" }].concat(
    ICON_CHOICES.map((c) => ({ value: c.icon, label: c.label }))
  );

  return (
    <div className="demo-panel">
      <div className="demo-panel-head">
        <h2 className="demo-panel-name">TaskTemplateCard 定时任务模版卡片</h2>
        <p className="demo-panel-summary">
          32px 线性图标 + 标题 + 描述 · 可点击 / 静态 · 2 states（Default / Hover）
        </p>
      </div>

      <Section
        title="Configurator"
        description="实时调整 props；Icon 取自 Lucide，可关闭为无图标。卡片宽度由所在网格列决定，此处按单卡 320px 呈现。"
      >
        <div className="button-configurator">
          <div className="button-controls">
            <Select label="Icon" value={icon} onChange={setIcon} options={iconOptions} />
            <label className="button-control">
              <span>Title</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="请输入标题" />
            </label>
            <label className="button-control">
              <span>Description</span>
              <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="请输入描述" />
            </label>
            <Toggle label="可点击" value={clickable} onChange={setClickable} />
          </div>
          <div className="button-configurator-preview ttc-demo-live">
            <span className="btn-lab-slotlabel">LIVE PREVIEW</span>
            <div className="ttc-demo-specimen">
              <TaskTemplateCard
                icon={icon || undefined}
                title={title}
                description={description}
                onClick={clickable ? noop : undefined}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="组件陈列"
        description="真实组件在卡片组中的排布：水平自动换行、间距 16px；窄容器下降为两列，保证一行最少两张。"
      >
        <div className="ttc-demo-gallery">
          <div className="ttc-demo-block">
            <span className="btn-lab-slotlabel">TaskTemplateCardGroup · 一行三张</span>
            <TaskTemplateCardGroup>
              {CAPABILITIES.map((item) => (
                <TaskTemplateCard
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  onClick={noop}
                />
              ))}
            </TaskTemplateCardGroup>
          </div>
          <div className="ttc-demo-block">
            <span className="btn-lab-slotlabel">内容边界 · 长标题 / 无描述 / 无图标 / 静态</span>
            <TaskTemplateCardGroup>
              {EDGE_CASES.map((item) => (
                <TaskTemplateCard
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  onClick={item.clickable ? noop : undefined}
                />
              ))}
            </TaskTemplateCardGroup>
          </div>
        </div>
      </Section>

      <Section
        title="State matrix"
        description="静态标本不接收指针事件；只有 Default / Hover 两个状态，悬浮复用组件自身的抬起阴影，不另造外观。"
      >
        <div className="btn-table-wrap">
          <table className="btn-table ttc-matrix">
            <thead>
              <tr>
                <th>TaskTemplateCard</th>
                {MATRIX_STATES.map((s) => <th key={s}>{s}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">可点击 · 32px 图标</th>
                <td>
                  <div className="ttc-matrix-cell">
                    <TaskTemplateCard icon="sparkles" title="智能体编排" description="按意图自动拆解任务，调度多个子智能体协同完成复杂流程。" onClick={noop} />
                  </div>
                </td>
                <td>
                  <div className="ttc-matrix-cell ttc-force-hover">
                    <TaskTemplateCard icon="sparkles" title="智能体编排" description="按意图自动拆解任务，调度多个子智能体协同完成复杂流程。" onClick={noop} />
                  </div>
                </td>
                <td>
                  <div className="ttc-matrix-cell">
                    <TaskTemplateCard icon="sparkles" title="智能体编排" description="按意图自动拆解任务，调度多个子智能体协同完成复杂流程。" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="demo-note">
          组件只有默认与悬浮两个状态：悬停只抬起阴影 <code>0 8px 24px rgba(0,0,0,8%)</code>，填充色与描边保持不变，没有 Pressed / Focus / Disabled 专属外观；未传 onClick 即进入静态模式，连悬浮态也不出现。
        </p>
      </Section>

      <Section
        title="Color spec"
        description="层级为 Variant → State → Background / Outline / Text；未变化项标记为“同 Default”。组件只有这一种形态，无 variant / size / shape。"
      >
        <div className="btn-table-wrap">
          <table className="btn-table btn-table--color">
            <thead>
              <tr>{["Variant", "State", "Background", "Outline", "Text"].map((t) => <th key={t}>{t}</th>)}</tr>
            </thead>
            <tbody><TaskTemplateCardColorRows /></tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Token contract"
        description="布局、间距、圆角与排印取值；圆角 24px 超出 radius 刻度，取固定值。"
      >
        <div className="btn-table-wrap">
          <table className="btn-table btn-table--roomy">
            <thead>
              <tr>{["项目", "取值", "Token"].map((t) => <th key={t}>{t}</th>)}</tr>
            </thead>
            <tbody>
              <tr><th>卡片内边距</th><td>上下 20px / 左右 24px</td><td><code>--spacing-5</code> · <code>--spacing-6</code></td></tr>
              <tr><th>内容行间距</th><td>20px</td><td><code>--spacing-5</code></td></tr>
              <tr><th>卡片圆角</th><td>24px</td><td>固定值（超出 <code>--radius-3xl</code> 20px 刻度）</td></tr>
              <tr><th>卡片组间距</th><td>16px</td><td><code>--spacing-4</code></td></tr>
              <tr><th>卡片组列宽</th><td><code>minmax(min(280px, calc(50% - 8px)), 1fr)</code></td><td>一行最少两张</td></tr>
              <tr><th>图标</th><td>32px 线性图标</td><td>固定尺寸</td></tr>
              <tr><th>标题</th><td>20px / 1.375 · Medium · 单行省略</td><td><code>--font-title-sm</code> · <code>--font-weight-medium</code></td></tr>
              <tr><th>描述</th><td>14px / 24px · Medium · 两行省略</td><td><code>--font-body-md</code> · <code>--font-weight-medium</code></td></tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="API contract"
        description="展示与交互均由真实组件处理；组件不提供 size / variant / shape / disabled / 受控属性。"
      >
        <div className="btn-table-wrap">
          <table className="btn-table btn-table--roomy">
            <thead>
              <tr><th>Props</th><th>契约</th></tr>
            </thead>
            <tbody>
              <tr><th>icon</th><td>Lucide 图标名，渲染 32px 线性图标；缺省时不渲染图标行。</td></tr>
              <tr><th>title</th><td>标题文案，单行超出显示省略号。</td></tr>
              <tr><th>description</th><td>描述文案，最多两行超出显示省略号；缺省时不渲染。</td></tr>
              <tr><th>onClick</th><td>传入即整卡可点击：悬停抬起阴影、键盘 Enter / Space 等价点击；缺省为静态展示。</td></tr>
              <tr><th>className</th><td>宿主布局扩展，不作为视觉变体。</td></tr>
              <tr><th>TaskTemplateCardGroup.children</th><td>一组 TaskTemplateCard；负责 16px 间距与自动换行。</td></tr>
              <tr><th>不提供的轴</th><td>无 size / variant / shape / disabled，也不暴露受控状态。</td></tr>
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

/* ==========================================================================
   TaskCard 面板
   ========================================================================== */

/* 色彩规格：Variant → State → Background / Outline / Text，未变化项标记「同 Default」
   （与 TaskTemplateCard 的 Color spec 同形式：色板 + token + 解析说明） */
function TaskCardColorRows() {
  const rows = [
    { state: "Default", note: "卡片本体" },
    { state: "Hover", note: "传入 onClick 时" },
    { state: "标签", note: "原子 Tag · icon 形态" },
    { state: "开关 · 关", note: "原子 Toggle" },
    { state: "开关 · 开", note: "原子 Toggle" },
    { state: "开关 · 禁用", note: "原子 Toggle · 整体 50%" },
  ];

  const cells = {
    Default: {
      background: { token: "--surface-container-lowest", detail: "卡片底色 · Light #FFFFFF / Dark #000000 · 叠加液态玻璃（内高光 + 背景折射 blur 4px）" },
      outline: { token: "—", kind: "none", detail: "无描边 · 无外阴影 · 仅顶部 1px 玻璃内高光 inset 0 1px 1px #FFF" },
      text: [
        { token: "--container", detail: "标题 · container 100% · Light #000000 / Dark #FFFFFF" },
        { token: "--container-50", detail: "描述 · Light 黑 50% / Dark 白 50%" },
        { token: "--container-30", detail: "底部信息行（含时间图标）· Light 黑 30% / Dark 白 30%" },
      ],
    },
    Hover: {
      outline: { token: "—", kind: "none", detail: "无描边 · 抬起阴影 0 8px 24px rgba(0,0,0,8%)、玻璃内高光保留（与 TaskTemplateCard 同规格）" },
    },
    标签: {
      background: { token: "--container-05", detail: "标签底 · Light 黑 5% / Dark 白 5%" },
      outline: { token: "—", kind: "none", detail: "无描边" },
      text: [
        { token: "--color-font-primary", detail: "文字 12px · Light 黑 90% / Dark 白 90%" },
        { token: "--color-icon-primary", detail: "图标 14px · 同上" },
      ],
    },
    "开关 · 关": {
      background: [
        { token: "--color-comp-background-secondary", detail: "轨道 · Light 黑 10% / Dark 白 10%" },
        { token: "--color-interactive-hover", detail: "悬浮叠加 · Light 黑 5% / Dark 白 10%" },
      ],
      outline: { token: "--color-comp-background-tertiary", detail: "滑块外圈 1px · Light 黑 5% / Dark 白 10%" },
      text: { token: "--color-comp-background-primary", detail: "滑块 · Light #FFFFFF / Dark 恒白" },
    },
    "开关 · 开": {
      background: [
        { token: "--color-comp-background-emphasize", detail: "轨道 · Light #0A59F7 / Dark #317AF7" },
        { token: "--color-interactive-pressed", detail: "按下叠加 · Light 黑 10% / Dark 白 15%" },
      ],
      outline: { token: "—", kind: "none", detail: "滑块描边转为透明" },
      text: { token: "--color-comp-background-primary", detail: "滑块 · Light #FFFFFF / Dark 恒白" },
    },
    "开关 · 禁用": {
      background: { token: "--color-comp-background-secondary", detail: "轨道保持所在状态色 · 叠加透明度 50%" },
      outline: { token: "--color-comp-background-tertiary", detail: "滑块外圈保持 · 叠加透明度 50%" },
      text: { token: "--color-comp-background-primary", detail: "滑块 · 叠加透明度 50%" },
    },
  };

  return rows.map((row, i) => {
    const cell = cells[row.state] || {};
    return (
      <tr key={row.state} className={i === 0 ? "btn-color-group-start" : undefined}>
        {i === 0 ? (
          <th rowSpan={rows.length} scope="rowgroup" className="btn-color-variant">
            TaskCard
            <span className="btn-table-src">short / long 两形态同色 · 无 size / shape</span>
          </th>
        ) : null}
        <td className="btn-color-state">
          {row.state}
          {row.note ? <small>{row.note}</small> : null}
        </td>
        <td>{cell.background ? <ColorCell value={cell.background} /> : <Same />}</td>
        <td>{cell.outline ? <ColorCell value={cell.outline} /> : <Same />}</td>
        <td>{cell.text ? <ColorCell value={cell.text} /> : <Same />}</td>
      </tr>
    );
  });
}

/* 布局 token 契约 */
const TASK_TOKEN_ROWS = [
  ["卡片内边距", "上下 20px / 左右 24px", "--spacing-5 · --spacing-6"],
  ["short：标题行 ↔ 标签", "12px", "--spacing-3"],
  ["short：标题组 ↔ 描述 ↔ 底部信息行", "20px", "--spacing-5"],
  ["short：标题 ↔ 开关", "16px", "--spacing-4"],
  ["long：标题 ↔ 标签", "12px", "--spacing-3"],
  ["long：标题行 ↔ 描述", "12px", "--spacing-3"],
  ["long：描述 ↔ 底部信息行", "20px", "--spacing-5（行距两段不同，故不用统一 gap）"],
  ["long：开关靠最右", "margin-left: auto", "标题按内容宽度紧贴标签，多余空间让给开关"],
  ["底部信息行：图标 ↔ 文字", "4px", "--spacing-1"],
  ["底部信息行：左右分布", "space-between", "左「时间周期」/ 右「下次执行」"],
  ["卡片圆角", "24px", "固定值（超出 --radius-3xl 20px 刻度，与 TaskTemplateCard 同族）"],
  ["可点击悬浮阴影", "0 8px 24px rgba(0,0,0,8%)", "与 TaskTemplateCard 同规格（模糊 24 / Y 8 / 黑 8%）；与玻璃内高光叠加，未传 onClick 的静态卡没有悬浮态"],
  ["底色材质（液态玻璃）", "blur 4px（Chromium 追加 #glass-xs 折射）+ inset 0 1px 1px #FFF", "来自 Pixso 导出：innerShadow y 1 / 白 / blur 1、背景模糊 4；模糊档位同设计系统 glass-xs；底色不透明时折射作用于卡片背后、不可见"],
  ["标题", "20px / 1.375 · Medium · 单行省略", "--font-title-sm · --font-weight-medium"],
  ["描述", "14px / 24px · Medium · 最多两行省略（单行 24px / 两行 48px）", "--font-body-md · --font-weight-medium"],
  ["底部信息行", "14px / 1.375 · Regular", "--font-body-md · --line-height-snug · --font-weight-regular"],
  ["时间图标", "14px 线性图标", "固定尺寸，颜色随底部信息行"],
  ["短卡组（TaskCardGroup）", "minmax(min(280px, calc(50% - 8px)), 1fr) · 间距 16px", "--spacing-4 · 一行最少两张"],
];

/* 形态差异 */
const TASK_VARIANT_ROWS = [
  ["short（默认）", "窄卡 · 内容垂直叠放", "标题行（标题 + 右侧开关）→ 12px → 标签 → 20px → 描述 → 20px → 底部信息行；多张短卡用 TaskCardGroup 横向排列，间距 16px"],
  ["long", "宽卡 · 首行并列", "标题 / 标签 / 开关 并列一行（标题 ↔ 标签 12px，开关最右）→ 12px → 描述 → 20px → 底部信息行"],
];

function TaskCardPanel() {
  const [variant, setVariant] = useState("short");
  const [title, setTitle] = useState("每周项目周报汇总");
  const [label, setLabel] = useState("周报");
  const [labelIcon, setLabelIcon] = useState("calendar-clock");
  const [description, setDescription] = useState("每周一自动汇总上周进展，生成周报并同步到项目群。");
  const [schedule, setSchedule] = useState("每周一 09:00");
  const [nextRun, setNextRun] = useState("2026/09/28 09:00");
  const [enabled, setEnabled] = useState(true);
  const [clickable, setClickable] = useState(true);

  return (
    <div className="demo-panel">
      <div className="demo-panel-head">
        <h2 className="demo-panel-name">TaskCard 定时任务卡片</h2>
        <p className="demo-panel-summary">
          short（横向排列的窄卡组）/ long（首行标题 + 标签 + 开关并列）· 标题 / 标签 / 描述 / 时间周期与下次执行 · 复用原子 Toggle / Tag · 可点击（hover 抬起阴影）/ 静态
        </p>
      </div>

      <Section
        title="Configurator"
        tag="实时配置"
        description="实时调整 props；开关走受控用法（与下方预览联动）。只有标签可能缺省 —— 标签留空即整个标签不渲染；标题 / 描述 / 执行时间 / 下次执行是固定内容，由宿主始终提供。"
      >
        <div className="button-configurator">
          <div className="button-controls">
            <Select
              label="形态"
              value={variant}
              onChange={setVariant}
              options={[
                { value: "short", label: "short · 垂直短卡" },
                { value: "long", label: "long · 横向长卡" },
              ]}
            />
            <Select
              label="标签图标"
              value={labelIcon}
              onChange={setLabelIcon}
              options={TASK_LABEL_ICONS.map((c) => ({ value: c.icon, label: c.label }))}
            />
            <label className="button-control">
              <span>Title</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="请输入标题" />
            </label>
            <label className="button-control">
              <span>标签</span>
              <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="留空则不渲染标签" />
            </label>
            <label className="button-control">
              <span>Description</span>
              <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="如 每周一自动汇总上周进展…" />
            </label>
            <label className="button-control">
              <span>执行时间</span>
              <input value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="如 每周一 09:00" />
            </label>
            <label className="button-control">
              <span>下次执行</span>
              <input value={nextRun} onChange={(e) => setNextRun(e.target.value)} placeholder="如 2026/09/28 09:00" />
            </label>
            <Toggle label="开关" value={enabled} onChange={setEnabled} />
            <Toggle label="可点击" value={clickable} onChange={setClickable} />
          </div>
          <div className="button-configurator-preview tc-demo-live">
            <span className="btn-lab-slotlabel">LIVE PREVIEW</span>
            <div className={"tc-demo-specimen tc-demo-specimen--" + variant}>
              <TaskCard
                variant={variant}
                title={title}
                label={label || undefined}
                labelIcon={labelIcon}
                description={description || undefined}
                schedule={schedule || undefined}
                nextRun={nextRun || undefined}
                checked={enabled}
                onChange={setEnabled}
                onClick={clickable ? noop : undefined}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="组件陈列"
        description="短卡横向排列：由 TaskCardGroup 负责自动换行与 16px 间距，窄容器下降为两列、保证一行最少两张；长卡是宽卡，直接纵向排列。short 用于信息密度高的卡片墙，long 用于列表中的宽行。"
      >
        <div className="tc-demo-gallery">
          <div className="tc-demo-block">
            <span className="btn-lab-slotlabel">variant=&quot;short&quot; · 横向排列的短卡组（间距 16px）· 传 onClick：悬浮抬起阴影</span>
            <TaskCardGroup>
              {TASK_CARDS.map((item) => (
                <TaskCard
                  key={item.title}
                  variant="short"
                  title={item.title}
                  label={item.label}
                  labelIcon={item.labelIcon}
                  description={item.description}
                  schedule={item.schedule}
                  nextRun={item.nextRun}
                  defaultChecked={item.checked}
                  onClick={noop}
                />
              ))}
            </TaskCardGroup>
          </div>

          <div className="tc-demo-block">
            <span className="btn-lab-slotlabel">variant=&quot;long&quot; · 宽卡（标题 / 标签 / 开关 并列一行）· 传 onClick：悬浮抬起阴影</span>
            <div className="tc-demo-list">
              {TASK_CARDS.map((item) => (
                <TaskCard
                  key={item.title}
                  variant="long"
                  title={item.title}
                  label={item.label}
                  labelIcon={item.labelIcon}
                  description={item.description}
                  schedule={item.schedule}
                  nextRun={item.nextRun}
                  defaultChecked={item.checked}
                  onClick={noop}
                />
              ))}
            </div>
          </div>

          <div className="tc-demo-block">
            <span className="btn-lab-slotlabel">内容边界 · 长文案 / 无标签 / 开关禁用</span>
            <div className="tc-demo-list">
              {TASK_EDGE_CASES.map((item) => (
                <div className="tc-demo-case" key={item.caption}>
                  <span className="tc-demo-caption">{item.caption}</span>
                  <TaskCard {...item.props} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="形态对照"
        description="两种形态共用同一套内容与原子组件，只改变首行的排布方式；底部信息行的样式完全一致。"
      >
        <div className="btn-table-wrap">
          <table className="btn-table btn-table--roomy">
            <thead>
              <tr>{["variant", "排布", "内容顺序"].map((t) => <th key={t}>{t}</th>)}</tr>
            </thead>
            <tbody>
              {TASK_VARIANT_ROWS.map((row) => (
                <tr key={row[0]}>
                  <th>{row[0]}</th>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Color spec"
        description="层级为 Variant → State → Background / Outline / Text；未变化项标记为“同 Default”。两形态同色，无 size / shape；卡片与 TaskTemplateCard 同状态模型 —— 只有默认与悬浮两个状态，可点击（传 onClick）时悬浮抬起一层阴影，颜色与 Default 完全一致，交互反馈的颜色仍来自内部原子 Toggle 与 Tag。"
      >
        <div className="btn-table-wrap">
          <table className="btn-table btn-table--color">
            <thead>
              <tr>{["Variant", "State", "Background", "Outline", "Text"].map((t) => <th key={t}>{t}</th>)}</tr>
            </thead>
            <tbody><TaskCardColorRows /></tbody>
          </table>
        </div>
        <p className="demo-note">
          实色为 token 解析链末端取值：<code>--surface-container-lowest → --color-background-primary → --white / --black</code>、
          <code>--container</code>（container 100%，最实的文字层 · Light <code>#000000</code> / Dark <code>#FFFFFF</code>）、
          <code>--color-comp-background-emphasize → --brand</code>（Light <code>#0A59F7</code> / Dark <code>#317AF7</code>）；
          <code>--container-*</code> 为递归混合色，Light 用黑、Dark 用白按百分比叠加。悬浮是卡片唯一的交互态，且不改变任何颜色：只抬起阴影 <code>0 8px 24px rgba(0,0,0,8%)</code>，背景与文字都与 Default 完全一致，没有 Pressed / Focus 专属外观。
        </p>
      </Section>

      <Section title="Token contract" description="布局、间距、圆角与排印取值。">
        <div className="btn-table-wrap">
          <table className="btn-table btn-table--roomy">
            <thead>
              <tr>{["项目", "取值", "Token"].map((t) => <th key={t}>{t}</th>)}</tr>
            </thead>
            <tbody>
              {TASK_TOKEN_ROWS.map((row) => (
                <tr key={row[0]}>
                  <th>{row[0]}</th>
                  <td>{row[1]}</td>
                  <td><code>{row[2]}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="API contract"
        description="缺省即静态容器；传入 onClick 才整卡可点击（悬浮抬起阴影、键盘 Enter / Space 等价点击）。不提供 size / shape / disabled（开关的 disabled 由原子 Toggle 透传）。"
      >
        <div className="btn-table-wrap">
          <table className="btn-table btn-table--roomy">
            <thead>
              <tr><th>Props</th><th>契约</th></tr>
            </thead>
            <tbody>
              <tr><th>variant</th><td><code>&quot;short&quot;</code>（默认，窄卡）· <code>&quot;long&quot;</code>（宽卡，首行并列）；非法值回退为 short。</td></tr>
              <tr><th>title</th><td>标题文案，单行超出显示省略号；始终渲染。</td></tr>
              <tr><th>label / labelIcon</th><td>标签文案与图标。label 是唯一可缺省的内容字段，缺省时整个标签不渲染；labelIcon 默认 <code>calendar-clock</code>。</td></tr>
              <tr><th>description</th><td>描述文案，最多两行超出省略；固定内容，宿主始终提供。</td></tr>
              <tr><th>schedule / nextRun</th><td>底部信息行的左右两端（时间周期 / 下次执行）；固定内容，宿主始终提供，信息行固定渲染。</td></tr>
              <tr><th>nextRunLabel</th><td>「下次执行」前缀，默认 <code>下次执行</code>。</td></tr>
              <tr><th>checked / defaultChecked</th><td>透传原子 Toggle：传 checked 为受控，否则用 defaultChecked 非受控。</td></tr>
              <tr><th>onChange</th><td><code>(next, event) =&gt; void</code>，开关切换回调。</td></tr>
              <tr><th>disabled</th><td>仅禁用开关，不影响卡片其他部分的展示。</td></tr>
              <tr><th>onClick</th><td>传入即整卡可点击，与 TaskTemplateCard 同规格：悬浮抬起阴影 <code>0 8px 24px rgba(0,0,0,8%)</code>、键盘 Enter / Space 等价点击、根节点带 <code>role=&quot;button&quot;</code> 与 <code>tabIndex=0</code>；点击卡内开关不触发整卡点击。缺省为静态展示。</td></tr>
              <tr><th>className</th><td>宿主布局扩展，不作为视觉变体。</td></tr>
              <tr><th>TaskCardGroup.children</th><td>一组短卡；负责 16px 间距、自动换行与「一行最少两张」。</td></tr>
              <tr><th>不提供的轴</th><td>无 size / shape、无 loading / error 状态。</td></tr>
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

/* ==========================================================================
   组件注册表 + 页面壳
   ========================================================================== */

const COMPONENTS = [
  { id: "artifact-summary", label: "ArtifactSummary", Panel: ArtifactSummaryPanel },
  { id: "task-template-card", label: "TaskTemplateCard", Panel: TaskTemplateCardPanel },
  { id: "task-card", label: "TaskCard", Panel: TaskCardPanel },
];

export default function Demo() {
  const [dark, setDark] = useTheme();
  const [activeTab, setActiveTab] = useState(COMPONENTS[0].id);

  // Tab 键盘导航：方向键循环，Home / End 跳转首尾
  const handleTabKey = (event) => {
    const index = COMPONENTS.findIndex((c) => c.id === activeTab);
    let next = null;
    if (event.key === "ArrowRight") next = (index + 1) % COMPONENTS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + COMPONENTS.length) % COMPONENTS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = COMPONENTS.length - 1;
    if (next === null) return;
    event.preventDefault();
    setActiveTab(COMPONENTS[next].id);
  };

  return (
    <div className="demo-page">
      <header className="demo-header">
        <div className="demo-headline">
          <div className="demo-title">
            <img src="./assets/uploads/logo.svg" alt="logo" style={{ width: 28, height: 28 }} />
            <span>组件预览</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={dark}
            aria-label={dark ? "切换为浅色主题" : "切换为深色主题"}
            className="demo-theme-toggle"
            onClick={() => setDark(!dark)}
          >
            <span className={dark ? "" : "is-on"}><Icon name="sun" size={16} /></span>
            <span className={dark ? "is-on" : ""}><Icon name="moon" size={16} /></span>
          </button>
        </div>
        <p className="demo-subtitle">Agentbox 组件预览 · ArtifactSummary / TaskTemplateCard / TaskCard</p>
      </header>

      <div className="demo-tabs" role="tablist" aria-label="组件列表" onKeyDown={handleTabKey}>
        {COMPONENTS.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            id={"tab-" + c.id}
            className="demo-tab"
            aria-selected={activeTab === c.id}
            aria-controls={"panel-" + c.id}
            tabIndex={activeTab === c.id ? 0 : -1}
            onClick={() => setActiveTab(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 面板常驻挂载，切换 Tab 时保留各自配置 */}
      {COMPONENTS.map((c) => {
        const Panel = c.Panel;
        return (
          <div
            key={c.id}
            role="tabpanel"
            id={"panel-" + c.id}
            aria-labelledby={"tab-" + c.id}
            hidden={activeTab !== c.id}
          >
            <Panel />
          </div>
        );
      })}
    </div>
  );
}
