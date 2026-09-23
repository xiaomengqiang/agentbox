import React, { useState } from "react";
import TextFields from "./index.jsx";
import { CompactBoolean } from "../../../tooling/preview/controls.jsx";

const variants = [["single", "Single · 单行输入"], ["multiline", "Multiline · 多行输入"], ["password", "Password · 密码"]];
function Section({ title, description, children }) {
  return <section className="demo-section"><div className="demo-section-header"><h2 className="demo-section-name">{title}</h2></div><p className="demo-section-desc">{description}</p>{children}</section>;
}
function Table({ headings, children, color = false }) {
  return <div className="btn-table-wrap"><table className={`btn-table${color ? " btn-table--color" : ""}`}><thead><tr>{headings.map(text => <th key={text}>{text}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}
function Swatch({ token, detail }) {
  return <><span className="btn-color-token"><i className="btn-color-swatch" style={{ backgroundColor: `var(${token})` }} /><code>{token}</code></span>{detail && <span className="btn-table-src">{detail}</span>}</>;
}
function ActionPlaceholder() {
  return <div className="tf-action-placeholder" aria-label="32px 操作区域占位" />;
}
export default function TextFieldsPreview() {
  const [variant, setVariant] = useState("single");
  const [width, setWidth] = useState(432);
  const [disabled, setDisabled] = useState(false);
  const [required, setRequired] = useState(false);
  const [hasHelper, setHasHelper] = useState(true);
  const [helperText, setHelperText] = useState("请填写此字段");
  const [error, setError] = useState(false);
  const [placeholder, setPlaceholder] = useState("请输入内容");
  const [label, setLabel] = useState("字段名称");
  const [value, setValue] = useState("");
  const [radius, setRadius] = useState(8);
  const [bordered, setBordered] = useState(true);
  const [maxHeight, setMaxHeight] = useState(140);
  const [showActionBar, setShowActionBar] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  return <div className="demo-page tf-demo">
    <header className="demo-header"><h1 className="preview-panel-title">TextFields 文本输入框</h1><p className="demo-subtitle">单行 / 多行 / Password · 数值宽度 · 必填与辅助说明 · Default / Hover / Active / Error / Disabled</p></header>
    <Section title="Configurator" description="选择输入类型，点击输入框体验 Active 描边与光标。Password 末尾图标切换明文和圆点。">
      <div className="button-configurator">
        <div className="button-controls">
          <label className="button-control"><span>输入类型 · variant</span><span className="button-select-wrap"><select value={variant} onChange={event => { setVariant(event.target.value); setValue(""); }}>{variants.map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select></span></label>
          {variant === "multiline" && <>
            <label className="button-control"><span>圆角 · radius</span><span className="button-select-wrap"><select value={radius} onChange={event => setRadius(Number(event.target.value))}><option value={8}>8px</option><option value={14}>14px</option></select></span></label>
            <CompactBoolean label="显示边框 · bordered" value={bordered} onChange={setBordered} />
            <CompactBoolean label="底部操作区 · showActionBar" value={showActionBar} onChange={setShowActionBar} />
            <label className="button-control"><span>整体最大高度 · maxHeight <small>px</small></span><input type="number" min={140} value={maxHeight} onChange={event => setMaxHeight(Math.max(140, Number(event.target.value) || 140))} /></label>
          </>}
          <label className="button-control"><span>宽度 · width <small>px</small></span><input type="number" min="120" step="1" value={width} onChange={event => setWidth(Math.max(120, Number(event.target.value) || 120))} /></label>
          <CompactBoolean label="禁用输入 · disabled" value={disabled} onChange={setDisabled} />
          <CompactBoolean label="显示标题 · showLabel" value={showLabel} onChange={setShowLabel} />
          <CompactBoolean label="标题必填标记 · required" value={required} onChange={setRequired} />
          {variant !== "multiline" && <div><CompactBoolean label="辅助说明 · helperText" value={hasHelper} onChange={setHasHelper} />{hasHelper && <label className="button-control tf-helper-control"><span>辅助文案 · helperText</span><input value={helperText} onChange={event => setHelperText(event.target.value)} /></label>}</div>}
          <CompactBoolean label="错误状态 · error" value={error} onChange={setError} />
          <label className="button-control"><span>占位文案 · placeholder</span><input value={placeholder} onChange={event => setPlaceholder(event.target.value)} /></label>
          {showLabel && <label className="button-control"><span>标题文案 · label</span><input value={label} onChange={event => setLabel(event.target.value)} placeholder="留空隐藏标题" /></label>}
        </div>
        <div className="button-configurator-preview tf-live"><span className="btn-lab-slotlabel">LIVE PREVIEW</span><TextFields variant={variant} showLabel={showLabel} radius={radius} bordered={bordered} maxHeight={maxHeight} showActionBar={showActionBar} actionBar={<ActionPlaceholder />} width={width} disabled={disabled} required={required} helperText={hasHelper ? helperText : ""} error={error} placeholder={placeholder} label={label} value={value} onChange={setValue} /></div>
      </div>
    </Section>
    <Section title="Interactive gallery" description="单行文字左右内边距为 16px，密码左侧 16px、图标右侧 12px。多行文字距外框 16px，可选底部操作区。">
      <div className="tf-gallery">{variants.map(([key, text]) => <article className="tf-card" key={key}><h3>{text}</h3><div className="tf-card-content"><TextFields variant={key} width={432} label={key === "password" ? "密码" : "字段名称"} placeholder={key === "password" ? "请输入密码" : "请输入内容"} helperText={key === "password" ? "点击眼睛图标显示或隐藏密码" : "支持输入、选择和编辑文字"} /></div></article>)}</div>
    </Section>
    <Section title="Multiline layouts" description="多行整体最小 140px，默认最大 140px；增大 maxHeight 后可随内容增长。滚动条悬浮在右侧 16px 留白中，出现时文字宽度不变；超过后滚动文字，蓝色矩形为底部操作区占位。">
      <div className="tf-gallery tf-multiline-gallery">{[
        { title: "Outlined · 8px 有边框", radius: 8, bordered: true, showActionBar: false },
        { title: "Shadow · 14px 无边框阴影", radius: 14, bordered: false, showActionBar: false },
        { title: "Actions · 8px 底部操作区", radius: 8, bordered: true, showActionBar: true },
        { title: "Overflow · 14px 超出最大高度", radius: 14, bordered: true, showActionBar: true, defaultValue: Array.from({ length: 12 }, (_, i) => `第 ${i + 1} 行：滚动查看完整文字内容。`).join("\n") },
      ].map(({ title, ...props }) => <article className="tf-card" key={title}><h3>{title}</h3><div className="tf-card-content"><TextFields variant="multiline" width={432} label="说明" helperText="整体最大高度 140px" actionBar={<ActionPlaceholder />} {...props} /></div></article>)}</div>
    </Section>
    <Section title="State matrix" description="Active 表示正在编辑，描边加深，悬浮时保持；没有独立 Press 或 Focus 外观。静态标本不接受交互。">
      <Table headings={["Type", "Default", "Hover", "Active", "Error", "Disabled"]}>{variants.map(([key, text]) => <tr key={key}><th>{text}</th>{["default", "hover", "active", "error", "disabled"].map(state => <td key={state}><div className={`tf-specimen tf-force-${state}`} inert=""><TextFields variant={key} width={240} label="字段名称" defaultValue={state === "default" ? "" : key === "password" ? "Password123" : "输入内容"} error={state === "error"} disabled={state === "disabled"} helperText={state === "error" ? "请检查输入内容" : "辅助说明"} /></div></td>)}</tr>)}</Table>
    </Section>
    <Section title="Color spec" description="三种类型使用同一配色；有边框时错误描边在编辑时保留；多行关闭边框后各状态均不绘制边框。背景始终为 background_primary。">
      <Table color headings={["Variant", "State", "Background", "Outline", "Text"]}>
        <tr><th rowSpan="5" className="btn-color-variant">Single / Multiline / Password</th><th>Default</th><td><Swatch token="--color-background-primary" detail="Light --white / Dark --black" /></td><td><Swatch token="--color-comp-border" detail="--container-15" /></td><td><Swatch token="--text-primary" detail="输入文字 / 光标" /><Swatch token="--text-tertiary" detail="placeholder / helper" /><Swatch token="--color-icon-primary" detail="Password 图标" /></td></tr>
        <tr><th>Hover</th><td>同 Default</td><td><Swatch token="--color-comp-border-hover" detail="--container-20" /></td><td>同 Default</td></tr>
        <tr><th>Active</th><td>同 Default</td><td><Swatch token="--container-40" detail="base token · 中性加深描边" /></td><td>同 Default</td></tr>
        <tr><th>Error</th><td>同 Default</td><td><Swatch token="--error" /></td><td><Swatch token="--text-error" detail="辅助说明；输入文字同 Default" /></td></tr>
        <tr><th>Disabled</th><td>同 Default</td><td>同 Default；error=true 时保留错误描边</td><td><Swatch token="--text-disabled" detail="文字与辅助说明" /><span className="btn-color-same">Password 图标同 Default</span></td></tr>
      </Table>
    </Section>
    <Section title="Token contract" description="输入格式参考 SearchBar Large；width 属于可配置 API。">
      <Table headings={["Property", "Value", "Rule"]}>
        <tr><th>Height</th><td>单行 / 密码 40px</td><td>多行随内容增长，maxHeight 默认整体 140px，包含内边距和操作区；不含 label；多行没有 helper。</td></tr>
        <tr><th>Single / Password</th><td>9px 16px / gap 8px / radius 24px</td><td>密码图标右侧 12px</td></tr>
        <tr><th>Multiline padding</th><td>12px 8px 8px</td><td>文字块再加左右各 8px，即文字距外框 16px</td></tr>
        <tr><th>Multiline radius / actions</th><td>8px 或 14px / 32px</td><td>操作区与文字间距 8px，操作区左右距外框 8px</td></tr>
        <tr><th>Multiline unbordered shadow</th><td>0 2px 12px 0</td><td>--shadow-card → --shadow-sm；Light #000000 / 6%，Dark #000000 / 30%</td></tr>
        <tr><th>Input / Placeholder</th><td>14px / 22px</td><td>--font-body-md，行高 22px</td></tr>
        <tr><th>Scrollbar</th><td>4px · overlay</td><td>位于右侧 8+8px 留白中间，中心距右边缘 8px，不占文字宽度；可拖动</td></tr>
        <tr><th>Caret</th><td>1.5 × 24px，rx 0.75</td><td>--text-primary，跟随插入点、换行与滚动；选中文字时隐藏</td></tr>
        <tr><th>Action placeholder</th><td>32px / 12px radius</td><td>--brand-20 填充，--radius-xl；仅预览占位</td></tr>
        <tr><th>Password dots</th><td>8 × 8px，间距 2px</td><td>隐藏密码时用圆点显示；与文字插入点和滚动同步</td></tr>
        <tr><th>Password icon</th><td>20 × 20px</td><td>assets/uploads/icon/password/show.svg、hide.svg</td></tr>
        <tr><th>Label / Helper</th><td>14px / 12px</td><td>上下间隔各 8px；Helper 左右 margin / padding 为 0</td></tr>
      </Table>
    </Section>
    <Section title="API contract" description="类型使用 variant；多行专属配置只在 multiline 时生效。">
      <Table headings={["Props", "Contract"]}>
        <tr><th>variant / width</th><td>single | multiline | password；width 为数字，单位 px，默认 432，窄容器内自动收缩。</td></tr>
        <tr><th>radius / bordered</th><td>仅多行：圆角 8 或 14，默认 8；边框开关默认 true，关闭后各状态均不绘制描边，使用 --shadow-card 阴影。</td></tr>
        <tr><th>maxHeight</th><td>仅多行：整体最大高度，默认 140px；最小 140px。超过后滚动文字区。</td></tr>
        <tr><th>showActionBar / actionBar</th><td>仅多行：显示底部 32px 区域，默认 false；actionBar 接收自定义内容。蓝色占位仅用于预览；disabled 时该区域不可交互。</td></tr>
        <tr><th>disabled / required</th><td>禁用输入与密码按钮；required 显示必填星号并启用原生必填约束。</td></tr>
        <tr><th>showLabel / label / placeholder / helperText / error</th><td>标题、占位、辅助说明；showLabel 控制标题显示；helperText 仅支持单行与密码，多行不显示 helper。error 控制错误样式。</td></tr>
        <tr><th>value / defaultValue / onChange</th><td>受控 / 非受控；所有类型统一 onChange(value, event)。</td></tr>
        <tr><th>id / name / autoComplete / maxLength / ariaLabel</th><td>原生表单与无障碍属性；无 label 时可提供 ariaLabel。</td></tr>
        <tr><th>onFocus / onBlur</th><td>输入事件回调；不增加独立视觉状态。</td></tr>
      </Table>
    </Section>
  </div>;
}
