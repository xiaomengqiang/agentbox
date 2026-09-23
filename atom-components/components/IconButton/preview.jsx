import React, { useState } from "react";
import IconButton, { FUNCTION_ICONS, DIALOG_ICONS } from "./index.jsx";
const states = ["default", "hover", "pressed", "disabled"];
const samples = [
  { label: "普通 · Large", variant: "normal", size: "large", icon: "search" },
  { label: "普通 · Small", variant: "normal", size: "small", icon: "search" },
  { label: "对话框 · Primary", variant: "dialog", emphasis: "primary", icon: "airplane" },
  { label: "对话框 · Secondary", variant: "dialog", emphasis: "secondary", icon: "add" },
];
function Select({ label, value, onChange, options }) {
  return <label className="button-control"><span>{label}</span><span className="button-select-wrap"><select value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o} value={o}>{o}</option>)}</select></span></label>;
}
function Table({ title, headers, rows }) {
  return <section className="demo-section"><h2 className="demo-section-name">{title}</h2><div className="btn-table-wrap"><table className="btn-table"><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i) => <tr key={i}>{r.map((v,j) => j ? <td key={j}>{v}</td> : <th scope="row" key={j}>{v}</th>)}</tr>)}</tbody></table></div></section>;
}
const BASE_TOKEN_NOTES = {
  "--color-interactive-hover": "base · Light: --container-05 / Dark: --container-10",
  "--color-interactive-pressed": "base · Light: --container-10 / Dark: --container-15",
  "--color-icon-primary": "base · --primary-90",
  "--color-icon-secondary": "base · --primary-60",
  "--color-font-on-primary": "base · --on-primary；本组件 Dark 覆盖为 --black",
  "--on-primary-10": "base · 主色上的 10% 叠层；无对应语义 token",
  "--on-primary-15": "base · 主色上的 15% 叠层；无对应语义 token",
};
function Color({ value }) {
  if (!value) return <span className="btn-color-same">同 Default</span>;
  const special = value === "transparent" || value === "none";
  return <span className="btn-color-token"><i className={`btn-color-swatch${special ? ` btn-color-swatch--${value}` : ""}`} style={special ? undefined : { background: `var(${value})` }} /><code>{value}</code>{BASE_TOKEN_NOTES[value] && <small className="icon-token-reference">{BASE_TOKEN_NOTES[value]}</small>}</span>;
}
function ColorSpec() {
  const groups = [
    ["普通 · Large", "transparent", "--color-icon-primary", "--color-interactive-hover", "--color-interactive-pressed"],
    ["普通 · Small", "transparent", "--color-icon-secondary", "--color-interactive-hover", "--color-interactive-pressed"],
    ["对话框 · Primary", "--color-icon-primary", "--color-font-on-primary", "--on-primary-10", "--on-primary-15"],
    ["对话框 · Secondary", "transparent", "--color-icon-primary", "--color-interactive-hover", "--color-interactive-pressed"],
  ];
  return <section className="demo-section"><h2 className="demo-section-name">Color spec</h2><p className="demo-section-desc">Primary 的 Hover / Pressed 为背景叠层，深色主题图标使用 --black；Secondary 默认透明，Hover / Pressed 背景分别使用 --color-interactive-hover / --color-interactive-pressed，各状态图标均为 --color-icon-primary。</p><div className="btn-table-wrap"><table className="btn-table btn-table--color"><thead><tr>{["Variant", "State", "Background", "Outline", "Icon"].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{groups.map(([name,bg,fg,hover,pressed]) => states.map((state,i) => <tr key={name+state} className={i===0 ? "btn-color-group-start" : undefined}>{i===0 && <th className="btn-color-variant" rowSpan={states.length}>{name}</th>}<td>{state}{state==="disabled" && <small className="btn-table-src">opacity: 0.5</small>}</td><td><Color value={i===0 ? bg : state==="hover" ? hover : state==="pressed" ? pressed : null}/></td><td><Color value={i===0 ? "none" : null}/></td><td><Color value={i===0 ? fg : null}/></td></tr>))}</tbody></table></div></section>;
}
export default function Demo() {
  const [variant,setVariant] = useState("normal");
  const [size,setSize] = useState("large");
  const [emphasis,setEmphasis] = useState("primary");
  const [radius,setRadius] = useState(6);
  const [normalIcon,setNormalIcon] = useState("search");
  const [dialogIcon,setDialogIcon] = useState("airplane");
  const [src,setSrc] = useState("");
  const dialog = variant === "dialog";
  return <div className="demo-page"><header className="demo-header"><h2 className="preview-panel-title">IconButton 图标按钮</h2><p className="demo-subtitle">纯图标按钮 · 普通 Large / Small · 对话框 Primary / Secondary · 32px · 4 states</p></header>
    <section className="demo-section"><h2 className="demo-section-name">Configurator</h2><div className="button-configurator"><div className="button-controls">
      <Select label="类型 · variant" value={variant} onChange={setVariant} options={["normal","dialog"]}/>
      {!dialog && <Select label="尺寸 · size" value={size} onChange={setSize} options={["large","small"]}/>}
      {!dialog && <label className="button-control"><span>圆角 · radius / px</span><input type="number" min="0" max="16" value={radius} onChange={e => setRadius(Math.max(0,Math.min(16,Number(e.target.value))))}/></label>}
      {dialog && <Select label="样式 · emphasis" value={emphasis} onChange={v => {setEmphasis(v);setDialogIcon(v==="primary" ? "airplane" : "add");}} options={["primary","secondary"]}/>}
      <Select label="图标 · icon" value={dialog ? dialogIcon : normalIcon} onChange={dialog ? setDialogIcon : setNormalIcon} options={Object.keys(dialog ? DIALOG_ICONS : FUNCTION_ICONS)}/>
      <label className="button-control"><span>自定义 SVG · src（留空使用所选图标）</span><input value={src} onChange={e=>setSrc(e.target.value)} placeholder="SVG URL / data URL"/></label>
    </div><div className="button-configurator-preview"><span className="btn-lab-slotlabel">LIVE PREVIEW</span><IconButton variant={variant} size={size} emphasis={emphasis} radius={radius} icon={dialog ? dialogIcon : normalIcon} src={src || undefined} ariaLabel="预览图标操作"/></div></div></section>
    <section className="demo-section"><h2 className="demo-section-name">Interactive gallery</h2><div className="icon-preview-gallery">{samples.map(({label,...props})=><div className="icon-preview-sample" key={label}><span>{label}</span><IconButton {...props} ariaLabel={label}/><small>32 × 32 · {props.variant==="normal" && props.size==="large" ? "20" : "16"}px icon</small></div>)}</div></section>
    <Table title="State matrix" headers={["类型",...states]} rows={samples.map(({label,...props})=>[label,...states.map(s=><span className="icon-preview-static" inert="" key={s}><IconButton {...props} state={s} ariaLabel={`${label} ${s}`}/></span>)])}/>
    <ColorSpec/>
    <Table title="Token contract" headers={["类型","外框","Icon","Radius","默认颜色"]} rows={[
      ["普通 · Large","32 × 32px","20px","6px，可自定义","--color-icon-primary"],
      ["普通 · Small","32 × 32px","16px","6px，可自定义","--color-icon-secondary"],
      ["对话框 · Primary","32 × 32px","16px","50% · 正圆","同 Primary Button"],
      ["对话框 · Secondary","32 × 32px","16px","50% · 正圆","--color-icon-primary"],
    ]}/>
    <Table title="Asset contract" headers={["类型","资源目录","展示默认图标"]} rows={[["普通","assets/uploads/icon/function/","search；可选目录内全部图标"],["对话框","assets/uploads/icon/send button/","Primary: airplane（文件 ariplane.svg）；Secondary: add.svg"]]}/>
    <Table title="API contract" headers={["Props","说明"]} rows={[["variant / size / emphasis","normal 使用 large / small；dialog 使用 primary / secondary，图标始终 16px。"],["radius","普通款默认 6px，可修改；对话框始终正圆。"],["icon / src","使用对应资源目录；src 优先，用 mask 跟随状态色。"],["state / disabled","Configurator 不传 state，使用真实交互；disabled 始终阻止点击。显式 state 用于静态展示。"],["ariaLabel / onClick","提供动作名称与点击回调；其余原生属性透传至 button。"]]}/>
  </div>;
}
