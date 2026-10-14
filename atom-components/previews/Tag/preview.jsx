import ColorSpecTable from "../../../tooling/preview/color-spec.jsx";
import React, { useState } from "react";
import Tag from "../../components/Tag/index.jsx";
import { CompactBoolean, ContractTable } from "../../../tooling/preview/controls.jsx";
const icons = {"Audio_list": "./assets/uploads/icon/FileType/outlined/Audio_list.svg", "code": "./assets/uploads/icon/FileType/outlined/code.svg", "docx": "./assets/uploads/icon/FileType/outlined/docx.svg", "folder": "./assets/uploads/icon/FileType/outlined/folder.svg", "image": "./assets/uploads/icon/FileType/outlined/image.svg", "markdown": "./assets/uploads/icon/FileType/outlined/markdown.svg", "pdf": "./assets/uploads/icon/FileType/outlined/pdf.svg", "ppt": "./assets/uploads/icon/FileType/outlined/ppt.svg", "sheet": "./assets/uploads/icon/FileType/outlined/sheet.svg", "txt": "./assets/uploads/icon/FileType/outlined/txt.svg", "video": "./assets/uploads/icon/FileType/outlined/video.svg", "zip": "./assets/uploads/icon/FileType/outlined/zip.svg"};
function Select({label,value,onChange,options}) { return <label className="button-control"><span>{label}</span><span className="button-select-wrap"><select value={value} onChange={e=>onChange(e.target.value)}>{options.map(v=><option key={v}>{v}</option>)}</select></span></label>; }
export default function TagDemo() {
 const [variant,setVariant]=useState("default"),[size,setSize]=useState("medium"),[shape,setShape]=useState("round"),[icon,setIcon]=useState(false),[iconName,setIconName]=useState("code");
 return <div className="demo-page">
 <header className="demo-header"><h2 className="preview-panel-title">Tag 标签</h2><p className="demo-subtitle">Default / Green / Red · Medium / Small · Round / Square · 可选前置图标 · 静态展示</p></header>
 <section className="demo-section"><h2 className="demo-section-name">Configurator</h2><div className="preview-configurator"><div className="preview-controls">
 <Select label="尺寸 · size" value={size} onChange={setSize} options={["medium","small"]}/><Select label="形状 · shape" value={shape} onChange={setShape} options={["round","square"]}/><Select label="样式 · variant" value={variant} onChange={setVariant} options={["default","green","red"]}/><CompactBoolean label="前置图标 · icon" value={icon} onChange={setIcon}/>{icon&&<Select label="图标资源 · icon" value={iconName} onChange={setIconName} options={Object.keys(icons)}/>}
 </div><div className="preview-live"><Tag variant={variant} size={size} shape={shape} icon={icon?icons[iconName]:undefined}>标签文字</Tag></div></div></section>
 <section className="demo-section"><h2 className="demo-section-name">Variant matrix</h2><p className="demo-section-desc">variant × shape · 尺寸与图标跟随 Configurator。</p><div className="preview-table-wrap"><table className="preview-table tag-variant-matrix"><thead><tr><th scope="col">Variant / Shape</th><th scope="col">round</th><th scope="col">square</th></tr></thead><tbody>{["default","green","red"].map(v=><tr key={v}><th scope="row">{v}</th>{["round","square"].map(s=><td key={s}><Tag variant={v} shape={s} size={size} icon={icon?icons[iconName]:undefined}>标签文字</Tag></td>)}</tr>)}</tbody></table></div></section>
 <ColorSpecTable textHeading="Text / Icon" description="静态展示组件，仅 Default；尺寸、形状与图标不改变颜色，图标跟随文字。" groups={[
 {name:'Default',rows:[{label:'Default',background:'--container-05',outline:'none',text:'--color-font-primary'}]},
 {name:'Green',rows:[{label:'Default',background:'--color-success-container',outline:'none',text:'--color-success'}]},
 {name:'Red',rows:[{label:'Default',background:'--color-error-container',outline:'none',text:'--color-error'}]},
 ]} />
 <section className="demo-section"><h2 className="demo-section-name">Token contract</h2><ContractTable rows={<><tr><th>medium</th><td>14px / 22px · 高 24px</td><td>左右 8px · 图标 14px</td></tr><tr><th>small</th><td>12px / 18px · 高 20px</td><td>左右 6px · 图标 12px</td></tr><tr><th>shape</th><td>round / square</td><td>--radius-full / --radius-badge（4px）</td></tr><tr><th>gap</th><td>4px</td><td>图文间距</td></tr></>}/></section>
 <section className="demo-section"><h2 className="demo-section-name">Asset contract</h2><p>icon 接收 assets/uploads/icon/FileType/outlined/ 下的 SVG 资源 URL；省略时隐藏，使用 currentColor。</p></section>
 </div>;
}
