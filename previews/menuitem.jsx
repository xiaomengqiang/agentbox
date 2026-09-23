import { useState } from "react";
import MenuItem from "../components/MenuItem/index.jsx";
const LEFT_FORMS = [{ value: "nav", label: "导航条目" }, { value: "history", label: "历史对话" }];
const NAV_STATES = [{ value: "default", label: "默认" }, { value: "hover", label: "悬浮" }, { value: "selected", label: "选中" }];
const NAV_ICONS = [
  { value: "./assets/uploads/icon/menuitem/menuitem-nav-new.svg", label: "新建对话" },
  { value: "./assets/uploads/icon/menuitem/menuitem-nav-schedule.svg", label: "定时任务" },
  { value: "./assets/uploads/icon/menuitem/menuitem-nav-plugin.svg", label: "插件" },
  { value: "./assets/uploads/icon/menuitem/menuitem-nav-more.svg", label: "更多" },
];
const HISTORY_STATES = [
  { value: "default", label: "默认" },
  { value: "hover", label: "悬浮" },
  { value: "generating", label: "生成中" },
  { value: "completed", label: "完成" },
  { value: "fault", label: "故障" },
  { value: "pending-auth", label: "待授权" },
];
const SMALL_DROPDOWN_STATES = [{ value: "default", label: "默认" }, { value: "hover", label: "悬浮" }, { value: "disabled", label: "禁用" }];
const MEDIUM_DROPDOWN_STATES = [{ value: "default", label: "默认" }, { value: "hover", label: "悬浮" }, { value: "selected", label: "选中" }, { value: "disabled", label: "禁用" }];
const MEDIUM_DROPDOWN_ICONS = [
  { value: "./assets/uploads/icon/menuitem/menuitem-dropdown-add.svg", label: "添加" },
  { value: "./assets/uploads/icon/menuitem/menuitem-dropdown-branch.svg", label: "分支" },
];
const RIGHT_VARIANTS = [{ value: "folder", label: "文件夹" }, { value: "file-level-1", label: "一级文件" }, { value: "file-level-2", label: "二级文件" }];
const FILE_STATES = [{ value: "default", label: "默认" }, { value: "hover", label: "悬浮" }, { value: "rename", label: "重命名" }, { value: "renaming", label: "重命名输入中" }, { value: "disabled", label: "禁用" }];

function Select({ label, value, onChange, options }) {
  return <label className="button-control"><span>{label}</span><span className="button-select-wrap"><select value={value} onChange={event => onChange(event.target.value)}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></span></label>;
}

function TextInput({ label, value, onChange }) {
  return <label className="button-control"><span>{label}</span><input value={value} onChange={event => onChange(event.target.value)} /></label>;
}

function UploadIcon({ label, onLoaded }) {
  return <label className="button-control menuitem-upload"><span>{label}</span><input type="file" accept=".svg,image/svg+xml" onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; if (!file || (file.type !== "image/svg+xml" && !/\.svg$/i.test(file.name))) return; const reader = new FileReader(); reader.onload = () => onLoaded(String(reader.result)); reader.readAsDataURL(file); }} /><small>上传后作为 iconSrc 传入</small></label>;
}

function Preview({ children }) {
  return <div className="button-configurator-preview inspection-live"><span className="btn-lab-slotlabel">LIVE PREVIEW</span><div className="inspection-specimen">{children}</div></div>;
}



function StateMatrix({ label, states, render, wide = false }) {
  const columns = `minmax(150px, 200px) repeat(${states.length}, minmax(${wide ? 650 : 324}px, 1fr))`;
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
function TokenPanel() { return <><ColorSpec groups={[{"name": "Nav", "rows": [["Default", "transparent", "none", "--on-surface", ""], ["Hover", "--color-interactive-hover", null, null, ""], ["Selected", "--color-interactive-hover", null, null, ""]]}, {"name": "History", "rows": [["Default", "transparent", "none", "--on-surface", ""], ["Hover", "--color-interactive-hover", null, null, ""], ["Generating", "--color-interactive-hover", null, null, "状态 SVG 使用资源原色"], ["Completed", "--color-interactive-hover", null, null, "状态 SVG 使用资源原色"], ["Fault", "--color-interactive-hover", null, null, "状态 SVG 使用资源原色"], ["Pending auth", "--color-interactive-hover", null, null, "状态 SVG 使用资源原色"]]}, {"name": "Dropdown · sm", "rows": [["Default", "transparent", "none", "--on-surface", ""], ["Hover", "--color-interactive-hover", null, null, ""], ["Disabled", null, null, null, "opacity: 0.5"]]}, {"name": "Dropdown · sm · Danger", "rows": [["Default", "transparent", "none", "#E02128", ""], ["Hover", "#FEE7E8", null, null, ""], ["Disabled", null, null, null, "opacity: 0.5"]]}, {"name": "Dropdown · md", "rows": [["Default", "--surface-container-lowest", "none", "--on-surface", ""], ["Hover", "--color-interactive-hover", null, null, ""], ["Selected", "--surface-container-lowest", null, null, "右侧 14px 勾选 SVG；悬停仍应用 Hover"], ["Disabled", null, null, null, "opacity: 0.5"]]}, {"name": "Folder / File", "rows": [["Default", "transparent", "none", "--on-surface", ""], ["Hover", "--color-interactive-hover", null, null, ""], ["Rename", "--color-interactive-hover", "--primary", null, "输入框 --surface-container-lowest；光标 --primary"], ["Renaming", "--color-interactive-hover", "--primary", null, "输入框 --surface-container-lowest；光标 --primary"], ["Disabled", null, null, "--text-disabled", "禁用文字色；不改变整体透明度"]]}]}/><ContractTable title="Token contract" headers={["Variant","Size","Content / spacing","Radius"]} rows={[["nav / history", "300 × 40px", "左右 12px；行距 12px", "--radius-container · 8px"], ["dropdown sm", "152 × 32px", "上下 4px / 左右 12px；图标资源 14px", "--radius-md · 6px"], ["dropdown md", "232 × 36px", "图标 17px；勾选 14px；间距 8px", "--radius-md · 6px"], ["folder / file", "602 × 40px", "一级文件图标左距 12px；二级 36px", "--radius-container · 8px"], ["rename input", "540 × 36px；一级文件宽 564px", "1px --primary 描边；内边距 8px", "--radius-action · 4px"]]}/><ContractTable title="Asset contract" headers={["Asset","Scope / path","Contract"]} rows={[["item.icon / iconSrc / rawIcon", "nav / dropdown", "iconSrc 优先；默认 mask 跟随文字色，rawIcon 保留资源原色"], ["expandIconSrc / collapseIconSrc / folderIconSrc", "folder", "缺省使用共享 Lucide 图标"], ["hoverCommentSrc / hoverMoreSrc", "folder / file，hover", "传入共享资源；它们是展示图标，无点击回调"], ["caretSrc", "folder / file，renaming", "可替换光标，缺省为品牌蓝竖线"], ["状态 / 勾选", "assets/uploads/icon/menuitem/", "History 状态图标及 dropdown md 勾选为固定资源"]]}/><ContractTable title="API contract" headers={["Props","Contract"]} rows={[["items / variant", "6 种形态；item.state 取值随形态变化，无统一五态。"], ["selectedId / defaultSelectedId", "nav 和 dropdown md 可展示选中；只有 nav 点击会自动更新内部选中值。"], ["onSelect", "仅 nav / history / dropdown；禁用只适用于 dropdown 的 item.disabled。"], ["expanded / defaultExpanded / onToggle", "仅 folder；item.expanded 优先，onToggle 返回更新后的 item。"], ["onRename", "文件 / 文件夹重命名草稿变化时返回 (item, newName)。"], ["plain", "仅 nav；当前默认容器已透明，无额外视觉差异。"], ["disabled", "文件项使用 state=\"disabled\"，文字禁用色；nav/history 不支持禁用。"]]}/></>; }

export default function Demo() {
  const [showNavIcon,setShowNavIcon] = useState(true);
  const [customAssets,setCustomAssets] = useState(false);
  const [assetOverrides,setAssetOverrides] = useState({});
  const [leftForm, setLeftForm] = useState("nav");
  const [leftState, setLeftState] = useState("default");
  const [leftLabel, setLeftLabel] = useState("新建对话");
  const [navIconSrc, setNavIconSrc] = useState(NAV_ICONS[0].value);
  const [dropdownSize, setDropdownSize] = useState("sm");
  const [dropdownState, setDropdownState] = useState("default");
  const [dropdownLabel, setDropdownLabel] = useState("新建对话");
  const [dropdownKind, setDropdownKind] = useState("general");
  const [dropdownIconSrc, setDropdownIconSrc] = useState(MEDIUM_DROPDOWN_ICONS[0].value);
  const [rightVariant, setRightVariant] = useState("folder");
  const [rightState, setRightState] = useState("default");
  const [rightLabel, setRightLabel] = useState("新建文件夹");
  const [folderExpanded, setFolderExpanded] = useState(true);
  const leftStates = leftForm === "history" ? HISTORY_STATES : NAV_STATES;
  const safeLeftState = leftStates.some(option => option.value === leftState) ? leftState : "default";
  const dropdownStates = dropdownSize === "sm" ? SMALL_DROPDOWN_STATES : MEDIUM_DROPDOWN_STATES;
  const safeDropdownState = dropdownStates.some(option => option.value === dropdownState) ? dropdownState : "default";
  const isDanger = dropdownSize === "sm" && dropdownKind === "warning";
  const navIconOptions = NAV_ICONS.some(option => option.value === navIconSrc) ? NAV_ICONS : [...NAV_ICONS, { value: navIconSrc, label: "已上传 SVG" }];
  const dropdownIconOptions = MEDIUM_DROPDOWN_ICONS.some(option => option.value === dropdownIconSrc) ? MEDIUM_DROPDOWN_ICONS : [...MEDIUM_DROPDOWN_ICONS, { value: dropdownIconSrc, label: "已上传 SVG" }];

  return <div className="demo-page">
    <header className="demo-header"><h2 className="preview-panel-title">MenuItem 菜单条目</h2><p className="demo-subtitle">MenuItem 菜单条目 · Nav / History / Dropdown / Folder / File level 1 / File level 2 · Sm / Md 仅用于 Dropdown · 按形态展示状态</p></header>

    <section className="demo-section">
      <div className="demo-section-header"><h2 className="demo-section-name">Configurator</h2><span className="demo-section-tag">左侧导航</span></div>
      <p className="demo-section-desc">通过 <code>variant</code> 选择导航条目或历史对话；历史对话归入左侧导航主题。</p>
      
      <div className="button-configurator">
        <div className="button-controls">
          <Select label="Variant · 小形态" value={leftForm} onChange={value => { setLeftForm(value); setLeftState("default"); }} options={LEFT_FORMS} />
          <Select label="State · 状态" value={safeLeftState} onChange={setLeftState} options={leftStates} />
          {leftForm === "nav" ? <><div className="button-control"><span>Leading icon</span><div className="button-toggle-line"><span>{showNavIcon?"开启":"关闭"}</span><label className="button-switch"><input aria-label="导航图标" type="checkbox" checked={showNavIcon} onChange={e=>setShowNavIcon(e.target.checked)}/><span className="button-switch-track"/></label></div></div>{showNavIcon&&<Select label="Icon · 图标" value={navIconSrc} onChange={value => { setNavIconSrc(value); setLeftLabel(NAV_ICONS.find(option => option.value === value)?.label || leftLabel); }} options={navIconOptions} />}<TextInput label="Label · 文本" value={leftLabel} onChange={setLeftLabel} />{showNavIcon&&<UploadIcon label="iconSrc · 上传 SVG" onLoaded={setNavIconSrc} />}</> : <TextInput label="Label · 文本" value={leftLabel} onChange={setLeftLabel} />}
        </div>
        <Preview code={`variant="${leftForm}" · state="${safeLeftState}"`}><MenuItem variant={leftForm} items={[{ id: "left", label: leftLabel, iconSrc: leftForm === "nav" && showNavIcon ? navIconSrc : undefined, state: safeLeftState === "default" ? undefined : safeLeftState }]} defaultSelectedId={safeLeftState === "selected" ? "left" : undefined} /></Preview>
      </div>
      <div className="menuitem-state-group">
        <h3 className="inspection-matrix-title">State matrix · 导航条目状态</h3>
        <StateMatrix label="Nav · 导航" states={NAV_STATES} wide={false} render={option=><MenuItem variant="nav" items={[{ id: option.value, label: leftLabel, iconSrc: navIconSrc, state: option.value === "default" ? undefined : option.value }]} defaultSelectedId={option.value === "selected" ? option.value : undefined} />}/>
      </div>
      <div className="menuitem-state-group">
        <h3 className="inspection-matrix-title">State matrix · 历史对话状态</h3>
        <StateMatrix label="History · 历史对话" states={HISTORY_STATES} wide={false} render={option=><MenuItem variant="history" items={[{ id: option.value, label: leftLabel, state: option.value === "default" ? undefined : option.value }]} />}/>
      </div>
    </section>

    <section className="demo-section">
      <div className="demo-section-header"><h2 className="demo-section-name">Configurator</h2><span className="demo-section-tag">下拉列表</span></div>
      <p className="demo-section-desc">小尺寸分为一般和警告样式；中尺寸可选择“添加”或“分支”前置图标。操作面板用于配置，下方完整展示各形态状态。</p>
      
      <div className="button-configurator">
        <div className="button-controls">
          <Select label="Size · 尺寸" value={dropdownSize} onChange={value => { setDropdownSize(value); setDropdownState("default"); }} options={[{ value: "sm", label: "小尺寸 · 152 × 32" }, { value: "md", label: "中尺寸 · 232 × 36" }]} />
          {dropdownSize === "sm" && <Select label="Style · 样式" value={dropdownKind} onChange={setDropdownKind} options={[{ value: "general", label: "一般" }, { value: "warning", label: "警告 · 卸载" }]} />}
          <Select label="State · 状态" value={safeDropdownState} onChange={setDropdownState} options={dropdownStates} />
          {dropdownSize === "md" && <><Select label="Icon · 前置图标" value={dropdownIconSrc} onChange={value => { setDropdownIconSrc(value); if (value === MEDIUM_DROPDOWN_ICONS[1].value) setDropdownLabel("feature/project-dashboard"); }} options={dropdownIconOptions} /><UploadIcon label="iconSrc · 上传 SVG" onLoaded={setDropdownIconSrc} /></>}
          <TextInput label="Label · 文本" value={dropdownLabel} onChange={setDropdownLabel} />
        </div>
        <Preview align="left" code={`variant="dropdown" · size="${dropdownSize}" · state="${safeDropdownState}"`}><MenuItem variant="dropdown" size={dropdownSize} items={[{ id: "dropdown", label: isDanger ? "卸载" : dropdownLabel, iconSrc: dropdownSize === "md" ? dropdownIconSrc : isDanger ? "./assets/uploads/icon/menuitem/menuitem-dropdown-danger.svg" : "./assets/uploads/icon/menuitem/menuitem-dropdown-small-general.svg", rawIcon: dropdownSize === "sm", danger: isDanger, disabled: safeDropdownState === "disabled", state: ["default", "disabled"].includes(safeDropdownState) ? undefined : safeDropdownState }]} defaultSelectedId={safeDropdownState === "selected" ? "dropdown" : undefined} /></Preview>
      </div>
      <div className="menuitem-state-group"><h3 className="inspection-matrix-title">State matrix · 小尺寸 · 一般</h3><StateMatrix label="Small · 一般" states={SMALL_DROPDOWN_STATES} wide={false} render={option=><MenuItem variant="dropdown" items={[{ id: option.value, label: "新建对话", iconSrc: "./assets/uploads/icon/menuitem/menuitem-dropdown-small-general.svg", rawIcon: true, disabled: option.value === "disabled", state: option.value === "hover" ? "hover" : undefined }]} />}/></div>
      <div className="menuitem-state-group"><h3 className="inspection-matrix-title">State matrix · 小尺寸 · 警告</h3><StateMatrix label="Small · 警告" states={SMALL_DROPDOWN_STATES} wide={false} render={option=><MenuItem variant="dropdown" items={[{ id: option.value, label: "卸载", iconSrc: "./assets/uploads/icon/menuitem/menuitem-dropdown-danger.svg", rawIcon: true, danger: true, disabled: option.value === "disabled", state: option.value === "hover" ? "hover" : undefined }]} />}/></div>
      <div className="menuitem-state-group"><h3 className="inspection-matrix-title">State matrix · 中尺寸</h3><StateMatrix label="Medium" states={MEDIUM_DROPDOWN_STATES} wide={false} render={option=><MenuItem variant="dropdown" size="md" items={[{ id: option.value, label: "添加到工作区", iconSrc: MEDIUM_DROPDOWN_ICONS[0].value, disabled: option.value === "disabled", state: option.value === "hover" ? "hover" : option.value === "selected" ? "selected" : undefined }]} defaultSelectedId={option.value === "selected" ? option.value : undefined} />}/></div>
    </section>

    <section className="demo-section">
      <div className="demo-section-header"><h2 className="demo-section-name">Configurator</h2><span className="demo-section-tag">右侧列表</span></div>
      <p className="demo-section-desc">通过 <code>variant</code> 选择文件夹、一级文件或二级文件；文件名和状态均可编辑。</p>
      
      <div className="button-configurator">
        <div className="button-controls">
          <Select label="Variant · 小形态" value={rightVariant} onChange={value => { setRightVariant(value); setRightLabel(value === "folder" ? "新建文件夹" : "产品需求文档.docx"); }} options={RIGHT_VARIANTS} />
          <Select label="State · 状态" value={rightState} onChange={setRightState} options={FILE_STATES} />
          <div className="button-control"><span>Custom assets</span><div className="button-toggle-line"><span>{customAssets?"开启":"关闭"}</span><label className="button-switch"><input aria-label="自定义列表资源" type="checkbox" checked={customAssets} onChange={e=>setCustomAssets(e.target.checked)}/><span className="button-switch-track"/></label></div></div>{customAssets&&(rightVariant==="folder"?["expandIconSrc","collapseIconSrc","folderIconSrc",...(rightState==="hover"?["hoverCommentSrc","hoverMoreSrc"]:[]),...(rightState==="renaming"?["caretSrc"]:[])]:rightState==="hover"?["hoverCommentSrc","hoverMoreSrc"]:rightState==="renaming"?["caretSrc"]:[]).map(prop=><TextInput key={prop} label={prop} value={assetOverrides[prop]||""} onChange={value=>setAssetOverrides(prev=>({...prev,[prop]:value}))}/>)}<TextInput label="Label · 文本" value={rightLabel} onChange={setRightLabel} />
          {rightVariant === "folder" && <div className="button-control"><span>Expanded · 展开 / 收起</span><div className="button-toggle-line"><span>{folderExpanded?"展开":"收起"}</span><label className="button-switch"><input aria-label="展开文件夹" type="checkbox" checked={folderExpanded} onChange={event=>setFolderExpanded(event.target.checked)}/><span className="button-switch-track"/></label></div></div>}
        </div>
        <Preview code={`variant="${rightVariant}" · state="${rightState}"`}><MenuItem {...(customAssets?assetOverrides:{})} variant={rightVariant} items={[{ id: "right", label: rightLabel, state: rightState === "default" ? undefined : rightState, expanded: rightVariant === "folder" ? folderExpanded : undefined }]} onRename={(item,name)=>setRightLabel(name)} onToggle={item => setFolderExpanded(item.expanded)} /></Preview>
      </div>
      {rightVariant === "folder" && <p className="demo-section-desc">容器内的第一个图标是展开 / 收起开关；点击它会触发 <code>onToggle</code>，并更新条目的 <code>expanded</code> 值。</p>}
      <div className="menuitem-state-group"><h3 className="inspection-matrix-title">State matrix · 全部状态</h3><StateMatrix label="文件列表" states={FILE_STATES} wide={true} render={option=><MenuItem variant={rightVariant} items={[{ id: option.value, label: rightLabel, state: option.value === "default" ? undefined : option.value }]} defaultExpanded />}/></div>
    </section>
    <TokenPanel />
  </div>;
}

