import React from "react";
import { useState } from "react";
import TaskTemplateCard, { TaskTemplateCardGroup } from "./index.jsx";

const CAPABILITIES = [
  { icon: "bot", title: "智能体编排", description: "按意图自动拆解任务，调度多个子智能体协同完成复杂流程。" },
  { icon: "workflow", title: "工作流引擎", description: "以节点化的方式编排步骤，支持条件分支、循环与人工审批。" },
  { icon: "database", title: "知识库检索", description: "接入企业文档与结构化数据，向量检索为回答提供可溯源依据。" },
  { icon: "shield-check", title: "权限与审计", description: "细粒度的权限控制与全链路操作审计，满足企业合规要求。" },
  { icon: "terminal", title: "代码执行沙箱", description: "在隔离环境中运行代码，安全地完成数据计算与格式转换。" },
  { icon: "chart-column", title: "数据洞察", description: "自动生成图表与结论摘要，把原始数据转化为可读的分析报告。" },
];

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

const EDGE_CASES = [
  { icon: "file-text", title: "这是一个非常非常长的标题用来验证单行省略号截断", description: "描述超过两行后同样被截断并显示省略号，这里刻意写一段较长的文字来触发该行为。", clickable: true },
  { icon: "rocket", title: "仅标题与描述", description: "标准三行结构，无额外内容。", clickable: true },
  { icon: "zap", title: "短描述", description: "触达更高效。", clickable: true },
  { title: "无图标", description: "图标为可选，缺省时不渲染第一行。", clickable: true },
  { icon: "lock", title: "静态卡片", description: "未传 onClick 时不响应悬停与键盘。", clickable: false },
];

const MATRIX_STATES = ["Default", "Hover", "静态（无交互）"];

function noop() {}

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

function Color(props) {
  return <ColorValue token={props.token} kind={props.kind} detail={props.detail} />;
}

function Same() {
  return <span className="btn-color-same">同 Default</span>;
}

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

export default function TaskTemplateCardPanel() {
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
