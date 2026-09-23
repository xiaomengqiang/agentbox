import React from "react";
import { useState } from "react";
import ArtifactSummary from "./index.jsx";

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

function Same() {
  return <span className="btn-color-same">同 Default</span>;
}

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

export default function ArtifactSummaryPanel() {
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
