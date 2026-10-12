import ColorSpecTable, { color } from "../../../tooling/preview/color-spec.jsx";
import React from "react";
import { useState } from "react";
import Segmented from "../../components/Segmented/index.jsx";
const VARIANTS = [
  { value: "text", label: "Text" },
  { value: "icon", label: "Icon" },
];
const SHAPES = [{ value: "round", label: "Round" }, { value: "square", label: "Square" }];
const SIZES = [{ value: "large", label: "Large" }, { value: "medium", label: "Medium" }];
const ICONS = ["layout-grid", "list", "code", "columns-2", "image"];
const VIEW_ICONS = [
  <span style={{ width: 14, height: 14, display: "block", backgroundColor: "currentColor", mask: 'url("./assets/uploads/icon/view/code_preview.svg") center / contain no-repeat', WebkitMask: 'url("./assets/uploads/icon/view/code_preview.svg") center / contain no-repeat' }} />,
  <span style={{ width: 14, height: 14, display: "block", backgroundColor: "currentColor", mask: 'url("./assets/uploads/icon/view/code.svg") center / contain no-repeat', WebkitMask: 'url("./assets/uploads/icon/view/code.svg") center / contain no-repeat' }} />,
];
const INTERACTION_STATES = ["Default", "Hover", "Pressed", "Disabled"];

function Section({ title, description, children }) {
  return (
    <section className="demo-section">
      <div className="demo-section-header"><h2 className="demo-section-name">{title}</h2></div>
      <p className="demo-section-desc">{description}</p>
      {children}
    </section>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="button-control">
      <span>{label}</span>
      <span className="button-select-wrap">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </span>
    </label>
  );
}

function stateClass(state) {
  return state === "Default" ? "" : `seg-demo-force-${state.toLowerCase()}`;
}

const TEXT_OPTIONS = ["最近", "收藏", "共享"];
const withIcons = (labels) => labels.map((label, index) => ({ value: label, label, icon: ICONS[index % ICONS.length] }));
const ICON_OPTIONS = ["预览", "代码"].map((label, index) => ({ value: label, label, icon: VIEW_ICONS[index] }));
const COUNTS = [2, 3, 4, 5].map(value => ({ value: String(value), label: `${value} 项` }));

function Toggle({ label, value, onChange }) {
  return <div className="button-control">
    <span>{label}</span>
    <div className="button-toggle-line"><span>{value ? "开启" : "关闭"}</span>
      <label className="button-switch">
        <input type="checkbox" checked={value} onChange={event => onChange(event.target.checked)} aria-label={label} />
        <span className="button-switch-track" />
      </label>
    </div>
  </div>;
}

export default function Demo() {
  const [variant, setVariant] = useState("text");
  const [shape, setShape] = useState("round");
  const [size, setSize] = useState("large");
  const [count, setCount] = useState(3);
  const [showIcon, setShowIcon] = useState(false);
  const [value, setValue] = useState("view-0");
  const options = Array.from({ length: count }, (_, index) => ({
    value: `view-${index}`,
    label: `视图 ${index + 1}`,
    ...(variant === "icon" || showIcon ? { icon: variant === "icon" ? VIEW_ICONS[index % VIEW_ICONS.length] : ICONS[index % ICONS.length] } : {}),
  }));
  const changeCount = next => {
    const nextCount = Number(next);
    setCount(nextCount);
    if (Number(value.slice(5)) >= nextCount) setValue("view-0");
  };
  return (
    <div className="demo-page">
      <header className="demo-header"><h2 className="preview-panel-title">Segmented 分段按钮</h2><p className="demo-subtitle">Segmented 分段按钮 · Text / Icon · Round / Square · Text Large / Medium · Icon 32px · 2–5 项 · 可选前缀图标 · 4 states</p></header>
      <Section title="Configurator" description="选择类型、尺寸、形状和分段数量；Text 可开关前缀图标，点击分段切换选中项。">
        <div className="button-configurator">
          <div className="button-controls">
            <Select label="内容类型 · variant" value={variant} onChange={setVariant} options={VARIANTS} />
            {variant === "text" ? <Select label="尺寸 · size" value={size} onChange={setSize} options={SIZES} /> : <div className="button-control"><span>尺寸</span><span>固定 · 32px</span></div>}
            <Select label="形状 · shape" value={shape} onChange={setShape} options={SHAPES} />
            <Select label="数量 · Count" value={String(count)} onChange={changeCount} options={COUNTS} />
            {variant === "text" && <Toggle label="前缀图标" value={showIcon} onChange={setShowIcon} />}
          </div>
          <div className="button-configurator-preview seg-demo-live">
            <span className="btn-lab-slotlabel">LIVE PREVIEW</span>
            <Segmented block={variant === "text"} options={options} variant={variant} shape={shape} size={size} value={value} onChange={setValue} />
          </div>
        </div>
      </Section>
      <Section title="Interactive gallery" description="Text 支持 36 / 44px，可选前缀图标；Icon 固定 32px。两种类型均可选择 Round / Square。">
        {[32, 36, 44].map(height => <React.Fragment key={height}>
          <h3 className="seg-gallery-heading">{height === 32 ? "Icon · 32px" : height === 36 ? "Medium · 36px" : "Large · 44px"}</h3>
          <div className="seg-demo-gallery">
            {SHAPES.flatMap(({ value: shape, label }) => (height === 32 ? ["icon"] : ["text", "prefix"]).map(kind =>
              <article className="seg-demo-card" key={`${shape}-${kind}`}>
                <h3>{label} · {kind === "icon" ? "Icon" : kind === "prefix" ? "Text · 前缀图标" : "Text"}</h3>
                <Segmented size={height === 36 ? "medium" : "large"} shape={shape} variant={kind === "icon" ? "icon" : "text"} options={kind === "icon" ? ICON_OPTIONS : kind === "prefix" ? withIcons(TEXT_OPTIONS) : TEXT_OPTIONS} />
              </article>
            ))}
          </div>
        </React.Fragment>)}
      </Section>
      <Section title="Width examples" description="默认随内容；block 填满容器；style.width 手动指定。Text 分段等分；Icon 每段固定 36px，不随容器拉伸或压缩，显式 style 优先。">
        <div className="seg-demo-gallery">
          {["text", "icon"].flatMap(variant => ["auto", "block", "manual"].map(mode => <article className="seg-demo-card" key={`${variant}-${mode}`}>
            <h3>{variant === "text" ? "Text" : "Icon"} · {mode === "auto" ? "随内容" : mode === "block" ? "填满容器" : "手动 240px"}</h3>
            <Segmented variant={variant} options={variant === "icon" ? ICON_OPTIONS : TEXT_OPTIONS} block={mode === "block"} style={mode === "manual" ? { width: 240 } : undefined} />
          </article>))}
        </div>
      </Section>
      <Section title="State matrix" description="固定第二段为未选中目标；标本覆盖全部高度、形状与内容组合。">
        <div className="btn-table-wrap"><table className="btn-table seg-demo-matrix">
          <thead><tr><th>Variant / Shape / Size</th>{INTERACTION_STATES.map(state => <th key={state}>{state}</th>)}</tr></thead>
          <tbody>{VARIANTS.flatMap(item => SHAPES.flatMap(shape => (item.value === "icon" ? [32] : [36, 44]).map(height =>
            <tr key={`${item.value}-${shape.value}-${height}`}>
              <th>{item.label} / {shape.label} / {height === 32 ? "32px" : height === 36 ? "Medium" : "Large"}</th>
              {INTERACTION_STATES.map(state => <td key={state}><div className={`seg-demo-static ${stateClass(state)}`} inert="">
                <Segmented variant={item.value} shape={shape.value} size={height === 36 ? "medium" : "large"} options={item.value === "icon" ? ICON_OPTIONS : ["选中", "未选中"]} disabled={state === "Disabled"} />
              </div></td>)}
            </tr>
          )))}</tbody>
        </table></div>
      </Section>
      <ColorSpecTable textHeading="Text / Icon" description="轨道与选中段分别记录；尺寸与形状共用颜色，文字和图标使用各自语义 token。" groups={[
 {name:'Track',rows:[{label:'Default',background:'--color-comp-background-tertiary',outline:'none',text:color('不适用','轨道没有独立文字')}]},
 ...VARIANTS.flatMap(item=>[false,true].map(selected=>({name:`${item.label} · ${selected?'Selected':'Unselected'}`,rows:[
 {label:'Default',background:selected?'--surface-container-lowest':'transparent',outline:'none',text:item.value==='icon'?color(selected?'--color-icon-primary':'--color-icon-secondary','图标'):[color(selected?'--color-font-primary':'--color-font-secondary','文字'),color(selected?'--color-icon-primary':'--color-icon-secondary','前置图标')]},
 {label:'Hover',background:selected?null:'--color-interactive-hover'},
 {label:'Pressed',background:selected?null:'--color-interactive-pressed'},
 {label:'Disabled',text:color('--text-disabled','文字与图标')},
 ]}))),
 ]} />
      <Section title="Token contract" description="Text 高度为 36 / 44px，Icon 固定 32px；形状只决定圆角。">
        <div className="btn-table-wrap"><table className="btn-table btn-table--roomy">
          <thead><tr><th>Variant / height</th><th>Track padding</th><th>Inner height</th><th>Font</th><th>Text icon / Icon only</th><th>Shapes</th></tr></thead>
          <tbody>{[32, 36, 44].map(height => <tr key={height}><th>{height === 32 ? "Icon" : "Text"} / {height}px</th><td>{height === 44 ? 4 : 2}px</td><td>{height - (height === 44 ? 8 : 4)}px</td><td>{height === 32 ? "—" : "14px"}</td><td>{height === 32 ? "14px" : "16px"}</td><td>Round / Square</td></tr>)}</tbody>
        </table></div>
        <div className="btn-table-wrap"><table className="btn-table btn-table--roomy">
          <thead><tr><th>shape</th><th>Track radius</th><th>Segment radius</th><th>Combinations</th></tr></thead>
          <tbody><tr><th>round</th><td>24px</td><td>24px</td><td>Text 36 / 44px；Icon 32px</td></tr><tr><th>square</th><td>8px</td><td>6px</td><td>Text 36 / 44px；Icon 32px</td></tr></tbody>
        </table></div>
      </Section>
      <Section title="API contract" description="选项使用数组，支持字符串、数字或含 value、label、icon、disabled、ariaLabel 的对象。">
        <div className="btn-table-wrap"><table className="btn-table btn-table--roomy">
          <thead><tr><th>Props</th><th>Contract</th></tr></thead>
          <tbody>
            <tr><th>options</th><td>默认 []。使用 data.map(item =&gt; (&#123; value: item.id, label: item.name &#125;))；value 唯一且稳定。</td></tr>
            <tr><th>shape / size</th><td>round / square 与尺寸独立。Text：large 为 44px（默认），medium 为 36px；Icon 忽略 size，固定 32px。</td></tr>
            <tr><th>variant</th><td>text / icon，默认 text。每项 icon 提供图标；Icon 无图标时保留标签。</td></tr>
            <tr><th>block / style.width</th><td>默认随内容，block 为 100%；style.width 可传数字或 CSS 宽度，优先于 block。Icon 每个按钮固定 36px，默认总宽为 36 × 数量 + 4px；修改轨道宽度不改变按钮宽度。</td></tr>
            <tr><th>value / defaultValue</th><td>受控 / 非受控选中值；未指定时选中首项。</td></tr>
            <tr><th>disabled / options[].disabled</th><td>整组 / 单项禁用。</td></tr>
            <tr><th>onChange / onSegmentClick</th><td>选中值改变回调 value；点击可用项回调 (value, index)。</td></tr>
            <tr><th>id / className / style</th><td>作用于根节点；追加类名，调用方行内样式优先。</td></tr>
          </tbody>
        </table></div>
        <pre className="seg-demo-code"><code>{`const options = data.map(item => ({ value: item.id, label: item.name }));
<Segmented options={options} shape="square" size="large" />
<Segmented options={options} block />
<Segmented options={options} style={{ width: 320 }} />`}</code></pre>
      </Section>
    </div>
  );
}
