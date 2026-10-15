import ColorSpecTable, { color } from "../../../tooling/preview/color-spec.jsx";
import React, { useState } from "react";
import IconButton, { ICONS } from "../../components/IconButton/index.jsx";
const states = ["default", "hover", "pressed", "disabled"];
const variants = ["filled", "unfilled"];
function Select({ label, value, onChange, options }) {
  return <label className="button-control"><span>{label}</span><span className="button-select-wrap"><select value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o} value={o}>{o}</option>)}</select></span></label>;
}
function Table({ title, headers, rows }) {
  return <section className="demo-section"><h2 className="demo-section-name">{title}</h2><div className="btn-table-wrap"><table className="btn-table"><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i) => <tr key={i}>{r.map((v,j) => j ? <td key={j}>{v}</td> : <th scope="row" key={j}>{v}</th>)}</tr>)}</tbody></table></div></section>;
}
export default function Demo() {
  const [size,setSize] = useState("large");
  const [shape,setShape] = useState("square");
  const [variant,setVariant] = useState("unfilled");
  const [icon,setIcon] = useState("search");
  const [src,setSrc] = useState("");
  return <div className="demo-page"><header className="demo-header"><h2 className="preview-panel-title">IconButton 图标按钮</h2><p className="demo-subtitle">Filled / Unfilled · Large / Small · Round / Square · 2 × 2 × 2 自由组合 · 4 states</p></header>
    <section className="demo-section"><h2 className="demo-section-name">Configurator</h2><div className="button-configurator"><div className="button-controls">
      <Select label="尺寸 · size" value={size} onChange={setSize} options={["large","small"]}/>
      <Select label="样式 · variant" value={variant} onChange={setVariant} options={["filled","unfilled"]}/>
      <Select label="形状 · shape" value={shape} onChange={setShape} options={["round","square"]}/>
      <Select label="图标 · icon" value={icon} onChange={setIcon} options={Object.keys(ICONS)}/>
      <label className="button-control"><span>自定义 SVG · src</span><input value={src} onChange={e=>setSrc(e.target.value)} placeholder="留空使用所选图标"/></label>
    </div><div className="button-configurator-preview"><span className="btn-lab-slotlabel">LIVE PREVIEW</span><IconButton variant={variant} size={size} shape={shape} icon={icon} src={src || undefined}/></div></div><p className="demo-section-desc">体验真实悬浮与按下；各属性独立，切换不会重置其他选项。</p></section>
    <section className="demo-section"><h2 className="demo-section-name">Interactive gallery</h2><div className="icon-preview-gallery">{variants.map(variant => <div className="icon-preview-sample" key={variant}><h3>{variant === "filled" ? "Filled · 填充" : "Unfilled · 无填充"}</h3><div className="icon-preview-combinations"><span/><span>Round · 圆形</span><span>Square · 圆角</span>{["large","small"].map(size => <React.Fragment key={size}><span>{size === "large" ? "Large" : "Small"}</span>{["round","square"].map(shape => <div className="icon-preview-specimen" key={shape}><IconButton variant={variant} size={size} shape={shape} icon="search"/></div>)}</React.Fragment>)}</div></div>)}</div></section>
    <Table title="Shape" headers={["shape","圆角 token","实际值","组合"]} rows={[["round","--radius-full","9999px · 正圆","全部 size × variant"],["square","--radius-md","6px","全部 size × variant"]]}/>
    <Table title="State matrix" headers={["variant",...states]} rows={variants.map(variant=>[variant,...states.map(state=><span className="icon-preview-static" inert="" key={state}><IconButton variant={variant} disabled={state === "disabled"} className={`icon-preview-state--${state}`}/></span>)])}/>
    <ColorSpecTable textHeading="Icon" description="颜色由 variant 决定；Hover / Pressed 是叠加在 Default 上的交互层，Disabled 整体透明度为 50%。" groups={[
 ['Filled','--color-icon-primary','--color-background-primary','--on-primary-10','--on-primary-15'],
 ['Unfilled','transparent','--color-icon-primary','--color-interactive-hover','--color-interactive-pressed'],
 ].map(([name,bg,fg,hover,pressed])=>({name,rows:[
 {label:'Default',background:bg,outline:'none',text:fg},
 {label:'Hover',background:color(hover,'叠加于 Default 背景')},
 {label:'Pressed',background:color(pressed,'叠加于 Default 背景')},
 {label:'Disabled',note:'整体 opacity 50%'},
 ]}))} />
    <Table title="Token contract" headers={["size","外框","Icon","颜色 / 形状"]} rows={[["large","32 × 32px","16px","独立由 variant / shape 决定"],["small","28 × 28px","16px","独立由 variant / shape 决定"]]}/>
    <Table title="Asset contract" headers={["icon","资源目录","规则"]} rows={[["search（默认）、add、edit 等","assets/uploads/icon/function/","名称与文件名一致，所有组合可用"],["ariplane、pause、resume","assets/uploads/icon/send-button/","名称与文件名一致，所有组合可用"],["src","自定义 SVG URL / data URL","优先于 icon；CSS mask 跟随状态色"]]}/>
    <Table title="API contract" headers={["Props","默认值","说明"]} rows={[["variant","unfilled","filled / unfilled"],["size","large","large 外框 32px / small 外框 28px，图标均为 16px"],["shape","square","round / square，使用圆角 token"],["icon / src","search / 未设置","统一图标集；未知名称回退 search"],["disabled","false","禁用按钮并阻止点击；hover / pressed 由原生交互触发"],["id / className / style","未设置 / 空字符串 / 未设置","作用于根 button；保留内部类名，调用方行内样式优先"],["onClick","未设置","原生点击回调；其余原生按钮属性透传"]]}/>
  </div>;
}
