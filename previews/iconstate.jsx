import { useState } from "react";
import IconState from "../components/IconState/components/IconState/index.jsx";
const STATES = [
  { value: "default", label: "默认" },
  { value: "hover", label: "悬浮" },
  { value: "active", label: "点击 / 激活" },
  { value: "disabled", label: "禁用" },
];
const COLUMN_ICONS = ["search", "menu", "columns", "fullscreen", "sidebar"];
const DIALOG_ICONS = [
  { value: "dialog-glyph", label: "发送" },
  { value: "dialog-pause", label: "暂停" },
  { value: "dialog-add", label: "加号" },
];

function Select({ label, value, onChange, options }) {
  return <label className="button-control"><span>{label}</span><span className="button-select-wrap"><select value={value} onChange={event => onChange(event.target.value)}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></span></label>;
}

function uploadSvg(event, onLoaded, onError) {
  const file = event.target.files?.[0];
  if (!file) return;
  event.target.value = "";
  if (file.type !== "image/svg+xml" && !/\.svg$/i.test(file.name)) {
    onError("请选择 SVG 文件。");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => onLoaded({ name: file.name, src: String(reader.result) });
  reader.onerror = () => onError("读取 SVG 失败，请重试。");
  reader.readAsDataURL(file);
}

function UploadControl({ label, uploaded, onLoaded, error, onError }) {
  return <label className="button-control iconstate-upload"><span>{label}</span><input type="file" accept=".svg,image/svg+xml" onChange={event => uploadSvg(event, onLoaded, onError)} /><small>{error || (uploaded ? `已载入 ${uploaded.name}` : "选择 SVG 后自动切换为自定义图标")}</small></label>;
}

function StateGallery({ variant, icon, src, iconSize, frameColor, iconColor }) {
 return <StateMatrix label={variant==='square'?'Square · 栏目图标':'Circle · 对话框图标'} states={STATES} render={item=><IconState variant={variant} icon={icon} src={src} iconSize={iconSize} frameColor={frameColor} iconColor={iconColor} state={item.value} ariaLabel={`${variant} ${item.label}`}/>}/>;
}



function StateMatrix({ label, states, render, wide = false }) {
  const columns = `minmax(150px, 200px) repeat(${states.length}, minmax(${wide ? 650 : 180}px, 1fr))`;
  return <div className="btn-matrix"><section className="btn-matrix-group">
    <div className="btn-matrix-grouphead"><span className="btn-matrix-groupname">{label}</span><span className="btn-matrix-groupspec">静态标本 · 不响应鼠标与键盘</span></div>
    <div className="btn-matrix-row btn-matrix-row-head" style={{gridTemplateColumns:columns}}><div className="btn-matrix-label"/>{states.map(state=><div className="btn-matrix-cell" key={state.value}><span className="btn-matrix-state">{state.label}</span></div>)}</div>
    <div className="btn-matrix-row" style={{gridTemplateColumns:columns}}><div className="btn-matrix-label"><span className="btn-matrix-variant">{label}</span></div>{states.map(state=><div className="btn-matrix-cell" key={state.value} inert="">{render(state)}</div>)}</div>
  </section></div>;
}

function SpecColor({value, detail}) {
 if (!value) return <span className="btn-color-same">同 Default</span>;
 const special=value==='transparent'||value==='none';
 return <><span className="btn-color-token"><i aria-hidden="true" className={'btn-color-swatch'+(special?' btn-color-swatch--'+value:'')} style={special?undefined:{backgroundColor:value.startsWith('--')?`var(${value})`:value}}/><code>{value==='none'?'无描边':value}</code></span>{detail&&<span className="btn-table-src">{detail}</span>}</>;
}
function ContractTable({title,description,headers,rows}) {
 return <section className="demo-section"><div className="demo-section-header"><h2 className="demo-section-name">{title}</h2></div><p className="demo-section-desc">{description}</p><div className="btn-table-wrap"><table className="btn-table"><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((v,j)=>j===0?<th key={j} scope="row">{v}</th>:<td key={j}>{v}</td>)}</tr>)}</tbody></table></div></section>;
}
function ColorSpec({groups}) {
 return <section className="demo-section"><div className="demo-section-header"><h2 className="demo-section-name">Color spec</h2></div><p className="demo-section-desc">Variant → State → Background / Outline / Text。未变化项沿用 Default；SVG 原色不随 token 重着色。</p><div className="btn-table-wrap"><table className="btn-table btn-table--color"><thead><tr>{['Variant','State','Background','Outline','Text / Icon'].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{groups.map(group=>group.rows.map((row,i)=><tr key={group.name+row[0]} className={i===0?'btn-color-group-start':undefined}>{i===0&&<th className="btn-color-variant" rowSpan={group.rows.length} scope="rowgroup">{group.name}</th>}<td className="btn-color-state">{row[0]}{row[4]&&<small>{row[4]}</small>}</td>{[1,2,3].map(j=><td key={j}><SpecColor value={row[j]} detail={row[j]==='--on-surface'||row[j]==='--color-icon-primary'?'浅色黑 90% / 深色白 90%':row[j]==='--container-05'?'浅色黑 5% / 深色白 5%':row[j]==='--color-interactive-hover'?'浅色黑 5% / 深色白 10%':undefined}/></td>)}</tr>))}</tbody></table></div></section>;
}
function TokenPanel() { return <><ColorSpec groups={[{"name": "Square", "rows": [["Default", "transparent", "none", "--color-icon-primary", ""], ["Hover", "--container-05", null, null, ""], ["Active", "--container-05", null, null, ""], ["Focus", null, "--focus-ring", null, "1px 焦点轮廓，偏移 2px"], ["Disabled", null, null, null, "opacity: 0.5"]]}, {"name": "Circle · Gray", "rows": [["Default", "transparent", "none", "--color-icon-primary", ""], ["Hover", "--container-05", null, null, ""], ["Active", "--container-05", null, null, ""], ["Focus", null, "--focus-ring", null, "1px 焦点轮廓，偏移 2px"], ["Disabled", null, null, null, "opacity: 0.5"]]}, {"name": "Circle · Black", "rows": [["Default", "--black", "none", "--on-primary", ""], ["Hover", null, null, null, ""], ["Active", null, null, null, ""], ["Focus", null, "--focus-ring", null, "1px 焦点轮廓，偏移 2px"], ["Disabled", null, null, null, "opacity: 0.5"]]}, {"name": "Circle · Custom（品牌色示例）", "rows": [["Default", "var(--brand)", "none", "--on-primary", ""], ["Hover", "--on-primary-10", null, null, ""], ["Active", "--on-primary-10", null, null, ""], ["Focus", null, "--focus-ring", null, "1px 焦点轮廓，偏移 2px"], ["Disabled", null, null, null, "opacity: 0.5"]]}, {"name": "Circle · Pause", "rows": [["Default", "--black", "none", "--white", "SVG 原色"], ["Hover", null, null, null, ""], ["Active", null, null, null, ""], ["Disabled", "#E5E5EA", null, "transparent", "专属 SVG，opacity: 1"]]}]}/><ContractTable title="Token contract" headers={["Variant","Size","Content / spacing","Radius"]} rows={[["square", "size 默认 32px；可配置", "iconSize 默认 20px", "--radius-md · 6px"], ["circle", "size 默认 32px；可配置", "默认 32px；加号 active 默认 23px", "50%"], ["Focus", "--outline-width-focus · 1px", "--outline-offset-gap · 2px", "--focus-ring"]]}/><ContractTable title="Asset contract" headers={["Asset","Scope / path","Contract"]} rows={[["Square", "assets/uploads/icon/iconstate/", "内置搜索、菜单、分栏、全屏、侧栏；支持上传 SVG"], ["Circle", "同一共享资源目录", "发送 / 暂停 / 加号；暂停禁用和加号激活使用专属资源"]]}/><ContractTable title="API contract" headers={["Props","Contract"]} rows={[["state / disabled / active", "state 优先，其次 disabled、active；Auto 不传 state，跟随真实鼠标交互。"], ["size / iconSize", "数值 px；图标尺寸不传时使用各形态默认值。"], ["src / icon", "仅 square 接受 src，优先于 icon；circle 仅发送、暂停、加号。"], ["frameColor / iconColor", "仅 circle；暂停图标忽略这两项，使用原始资源。"], ["onClick / ariaLabel", "点击回调；ariaLabel 提供具体操作名称。"]]}/></>; }

export default function Demo() {
  const [frameSize,setFrameSize] = useState(32);
  const [circleIconSize,setCircleIconSize] = useState(0);
  const [foreground,setForeground] = useState("");
  const [columnIcon, setColumnIcon] = useState("search");
  const [columnSize, setColumnSize] = useState(20);
  const [columnState, setColumnState] = useState("auto");
  const [columnUpload, setColumnUpload] = useState(null);
  const [columnError, setColumnError] = useState("");
  const [dialogIcon, setDialogIcon] = useState("dialog-glyph");
  const [dialogState, setDialogState] = useState("auto");
  const [frameMode, setFrameMode] = useState("gray");
  const [customColor, setCustomColor] = useState("#0A59F7");
  const frameColor = frameMode === "custom" ? customColor : frameMode;
  const columnSrc = columnIcon === "custom" ? columnUpload?.src : undefined;
  const columnOptions = [...COLUMN_ICONS.map(icon => ({ value: icon, label: icon })), ...(columnUpload ? [{ value: "custom", label: `上传 · ${columnUpload.name}` }] : [])];

  return <div className="demo-page">
    <header className="demo-header"><p className="demo-subtitle">IconState 图标状态 · Square / Circle · 可配置尺寸与资源 · 4 种显式状态及键盘 Focus</p></header>

    <section className="demo-section">
      <div className="demo-section-header"><h2 className="demo-section-name">Configurator</h2><span className="demo-section-tag">Square · 32px</span></div>
      <p className="demo-section-desc">选择状态、20px / 16px 图标尺寸和内置图标，也可以上传自己的 SVG。</p>
      <div className="button-configurator">
        <div className="button-controls"><label className="button-control"><span>Size · 外框 px</span><input type="number" min="16" max="96" value={frameSize} onChange={e=>setFrameSize(Math.max(16,Math.min(96,Number(e.target.value)||32)))}/></label>
          <Select label="State · 状态" value={columnState} onChange={setColumnState} options={[{value:"auto",label:"Auto · 真实交互"},...STATES]} />
          <Select label="Icon size · 图标大小" value={String(columnSize)} onChange={value => setColumnSize(Number(value))} options={[{ value: "20", label: "20px" }, { value: "16", label: "16px" }]} />
          <Select label="Icon · 图标" value={columnIcon} onChange={setColumnIcon} options={columnOptions} />
          <UploadControl label="Upload SVG · 上传图标" uploaded={columnUpload} error={columnError} onError={setColumnError} onLoaded={file => { setColumnUpload(file); setColumnIcon("custom"); setColumnError(""); }} />
        </div>
        <div className="button-configurator-preview inspection-live"><span className="btn-lab-slotlabel">LIVE PREVIEW</span><IconState variant="square" icon={columnIcon} src={columnSrc} iconSize={columnSize} size={frameSize} state={columnState==="auto"?undefined:columnState} ariaLabel={`栏目 ${columnIcon} ${columnState}`} /></div>
      </div>
      <h3 className="inspection-matrix-title">State matrix · {columnIcon === "custom" ? columnUpload?.name : columnIcon}</h3>
      <StateGallery variant="square" icon={columnIcon} src={columnSrc} iconSize={columnSize} />
    </section>

    <section className="demo-section">
      <div className="demo-section-header"><h2 className="demo-section-name">Configurator</h2><span className="demo-section-tag">Circle · 32px</span></div>
      <p className="demo-section-desc">圆形框颜色、状态和图标可选择。灰色默认透明，悬浮和激活使用 5% 黑色背景。</p>
      <div className="button-configurator">
        <div className="button-controls"><label className="button-control"><span>Size · 外框 px</span><input type="number" min="16" max="96" value={frameSize} onChange={e=>setFrameSize(Math.max(16,Math.min(96,Number(e.target.value)||32)))}/></label>
          {dialogIcon!=="dialog-pause"&&<Select label="Frame color · 框颜色" value={frameMode} onChange={setFrameMode} options={[{ value: "gray", label: "灰色" }, { value: "black", label: "黑色" }, { value: "custom", label: "自定义颜色" }]} />}
          {dialogIcon!=="dialog-pause" && frameMode === "custom" ? <label className="button-control"><span>Custom color · 自定义色值</span><input type="color" value={customColor} onChange={event => setCustomColor(event.target.value)} /></label> : null}
          <Select label="State · 状态" value={dialogState} onChange={setDialogState} options={[{value:"auto",label:"Auto · 真实交互"},...STATES]} />
          <label className="button-control"><span>Icon size · 0 为自动</span><input type="number" min="0" max="96" value={circleIconSize} onChange={e=>setCircleIconSize(Math.max(0,Math.min(96,Number(e.target.value))))}/></label>{dialogIcon!=="dialog-pause"&&<label className="button-control"><span>Icon color · 空值使用默认</span><input value={foreground} onChange={e=>setForeground(e.target.value)} placeholder="var(--color-icon-primary)"/></label>}<Select label="Icon · 图标" value={dialogIcon} onChange={setDialogIcon} options={DIALOG_ICONS} />
        </div>
        <div className="button-configurator-preview inspection-live"><span className="btn-lab-slotlabel">LIVE PREVIEW</span><IconState variant="circle" icon={dialogIcon} frameColor={frameColor} size={frameSize} iconSize={circleIconSize||undefined} iconColor={foreground||undefined} state={dialogState==="auto"?undefined:dialogState} ariaLabel={`对话框 ${DIALOG_ICONS.find(item => item.value === dialogIcon)?.label} ${dialogState}`} /></div>
      </div>
      <h3 className="inspection-matrix-title">State matrix · {DIALOG_ICONS.find(item => item.value === dialogIcon)?.label}</h3>
      <StateGallery variant="circle" icon={dialogIcon} frameColor={frameColor} />
    </section>
    <TokenPanel />
  </div>;
}

