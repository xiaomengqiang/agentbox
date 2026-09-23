import { useState } from "react";
import "./demo.css";
import MenuItem from "./index.jsx";

const LEFT_FORMS = [{ value: "nav", label: "导航条目" }, { value: "history", label: "历史对话" }];
const NAV_STATES = [{ value: "default", label: "默认" }, { value: "hover", label: "悬浮" }, { value: "selected", label: "选中" }];
const NAV_ICONS = [
  { value: "./assets/uploads/menuitem-nav-new.svg", label: "新建对话" },
  { value: "./assets/uploads/menuitem-nav-schedule.svg", label: "定时任务" },
  { value: "./assets/uploads/menuitem-nav-plugin.svg", label: "插件" },
  { value: "./assets/uploads/menuitem-nav-more.svg", label: "更多" },
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
  { value: "./assets/uploads/menuitem-dropdown-add.svg", label: "添加" },
  { value: "./assets/uploads/menuitem-dropdown-branch.svg", label: "分支" },
];
const RIGHT_VARIANTS = [{ value: "folder", label: "文件夹" }, { value: "file-level-1", label: "一级文件" }, { value: "file-level-2", label: "二级文件" }];
const FILE_STATES = [{ value: "default", label: "默认" }, { value: "hover", label: "悬浮" }, { value: "rename", label: "重命名" }, { value: "renaming", label: "重命名输入中" }, { value: "disabled", label: "禁用" }];

function Select({ label, value, onChange, options }) {
  return <label className="menuitem-control"><span>{label}</span><select value={value} onChange={event => onChange(event.target.value)}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function TextInput({ label, value, onChange }) {
  return <label className="menuitem-control"><span>{label}</span><input value={value} onChange={event => onChange(event.target.value)} /></label>;
}

function UploadIcon({ label, onLoaded }) {
  return <label className="menuitem-control menuitem-upload"><span>{label}</span><input type="file" accept=".svg,image/svg+xml" onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; if (!file || (file.type !== "image/svg+xml" && !/\.svg$/i.test(file.name))) return; const reader = new FileReader(); reader.onload = () => onLoaded(String(reader.result)); reader.readAsDataURL(file); }} /><small>上传后作为 iconSrc 传入</small></label>;
}

function Preview({ children, code, align = "center" }) {
  return <div className={`menuitem-live menuitem-live--${align}`}><div>{children}</div><code>{code}</code></div>;
}

function TokenPanel() {
  const colorRows = [
    ["导航 / 历史", "Default", "transparent", "--on-surface"], ["导航 / 历史", "Hover / Selected / 状态", "--color-interactive-hover", "--on-surface"],
    ["下拉 · 一般", "Default", "transparent", "--on-surface"], ["下拉 · 一般", "Hover", "--color-interactive-hover", "--on-surface"],
    ["下拉 · 警告", "Default", "transparent", "--mi-danger-font / --mi-danger-icon"], ["下拉 · 警告", "Hover", "--mi-danger-container", "同 Default"],
    ["全部形态", "Disabled", "同 Default", "--text-disabled / opacity: 0.5"], ["中尺寸选中", "Selected", "--surface-container-lowest", "指定 14px 蓝色勾选 SVG"],
  ];
  const contracts = [["nav / history", "300 × 40px", "--radius-container · 8px", "12px", "--on-surface"], ["dropdown sm", "152 × 32px", "--radius-md · 6px", "12px", "--on-surface / --mi-danger-font"], ["dropdown md", "232 × 36px", "--radius-md · 6px", "12px", "--on-surface"], ["folder / file", "602 × 40px", "--radius-container · 8px", "12px / 36px", "--on-surface"]];
  return <div className="menuitem-contract">
    <section className="menuitem-token-panel"><h2>Color spec</h2><p>形态和状态决定背景与文本、图标的语义色；未变化项会沿用静止态。</p><div className="menuitem-table-wrap"><table className="menuitem-table"><thead><tr><th>Variant</th><th>State</th><th>Background</th><th>Text / icon</th></tr></thead><tbody>{colorRows.map(row => <tr key={row.join()}>{row.map(cell => <td key={cell}>{cell.startsWith("--") ? <code>{cell}</code> : cell}</td>)}</tr>)}</tbody></table></div></section>
    <section className="menuitem-token-panel"><h2>Token contract</h2><p>尺寸与圆角是固定组件契约；色彩由主题 token 提供，图标跟随条目文字的 <code>currentColor</code>。</p><div className="menuitem-table-wrap"><table className="menuitem-table"><thead><tr><th>Variant</th><th>Size</th><th>Radius</th><th>Inset</th><th>Text / icon</th></tr></thead><tbody>{contracts.map(row => <tr key={row[0]}>{row.map(cell => <td key={cell}>{cell.startsWith("--") ? <code>{cell}</code> : cell}</td>)}</tr>)}</tbody></table></div></section>
  </div>;
}

export default function Demo() {
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

  return <div className="menuitem-demo-page">
    <header className="menuitem-demo-header"><h1>MenuItem 菜单条目</h1><p>Nav / History / Dropdown / File list · 6 种形态 · 导航 3 状态、历史对话 6 状态、文件列表 5 状态。</p></header>

    <section className="menuitem-demo-section">
      <div className="menuitem-section-heading"><h2>左侧导航</h2><span>variant="nav" / "history"</span></div>
      <p>通过 `variant` 选择导航条目或历史对话；历史对话归入左侧导航主题。</p>
      <h3 className="menuitem-configurator-title">Configurator</h3>
      <div className="menuitem-configurator">
        <div className="menuitem-controls">
          <Select label="Variant · 小形态" value={leftForm} onChange={value => { setLeftForm(value); setLeftState("default"); }} options={LEFT_FORMS} />
          <Select label="State · 状态" value={safeLeftState} onChange={setLeftState} options={leftStates} />
          {leftForm === "nav" ? <><Select label="Icon · 图标" value={navIconSrc} onChange={value => { setNavIconSrc(value); setLeftLabel(NAV_ICONS.find(option => option.value === value)?.label || leftLabel); }} options={navIconOptions} /><TextInput label="Label · 文本" value={leftLabel} onChange={setLeftLabel} /><UploadIcon label="iconSrc · 上传 SVG" onLoaded={setNavIconSrc} /></> : <TextInput label="Label · 文本" value={leftLabel} onChange={setLeftLabel} />}
        </div>
        <Preview code={`variant="${leftForm}" · state="${safeLeftState}"`}><MenuItem variant={leftForm} items={[{ id: "left", label: leftLabel, iconSrc: leftForm === "nav" ? navIconSrc : undefined, state: safeLeftState === "default" ? undefined : safeLeftState }]} defaultSelectedId={safeLeftState === "selected" ? "left" : undefined} /></Preview>
      </div>
      <div className="menuitem-state-group">
        <h3>导航条目状态</h3>
        <div className="menuitem-state-matrix">{NAV_STATES.map(option => <div className="menuitem-state-sample" key={option.value}><span>{option.label}</span><MenuItem variant="nav" items={[{ id: option.value, label: leftLabel, iconSrc: navIconSrc, state: option.value === "default" ? undefined : option.value }]} defaultSelectedId={option.value === "selected" ? option.value : undefined} /></div>)}</div>
      </div>
      <div className="menuitem-state-group">
        <h3>历史对话状态</h3>
        <div className="menuitem-state-matrix">{HISTORY_STATES.map(option => <div className="menuitem-state-sample" key={option.value}><span>{option.label}</span><MenuItem variant="history" items={[{ id: option.value, label: leftLabel, state: option.value === "default" ? undefined : option.value }]} /></div>)}</div>
      </div>
    </section>

    <section className="menuitem-demo-section">
      <div className="menuitem-section-heading"><h2>下拉列表</h2><span>variant="dropdown"</span></div>
      <p>小尺寸分为一般和警告样式；中尺寸可选择“添加”或“分支”前置图标。操作面板用于配置，下方完整展示各形态状态。</p>
      <h3 className="menuitem-configurator-title">Configurator</h3>
      <div className="menuitem-configurator">
        <div className="menuitem-controls">
          <Select label="Size · 尺寸" value={dropdownSize} onChange={value => { setDropdownSize(value); setDropdownState("default"); }} options={[{ value: "sm", label: "小尺寸 · 152 × 32" }, { value: "md", label: "中尺寸 · 232 × 36" }]} />
          {dropdownSize === "sm" && <Select label="Style · 样式" value={dropdownKind} onChange={setDropdownKind} options={[{ value: "general", label: "一般" }, { value: "warning", label: "警告 · 卸载" }]} />}
          <Select label="State · 状态" value={safeDropdownState} onChange={setDropdownState} options={dropdownStates} />
          {dropdownSize === "md" && <><Select label="Icon · 前置图标" value={dropdownIconSrc} onChange={value => { setDropdownIconSrc(value); if (value === MEDIUM_DROPDOWN_ICONS[1].value) setDropdownLabel("feature/project-dashboard"); }} options={dropdownIconOptions} /><UploadIcon label="iconSrc · 上传 SVG" onLoaded={setDropdownIconSrc} /></>}
          <TextInput label="Label · 文本" value={dropdownLabel} onChange={setDropdownLabel} />
        </div>
        <Preview align="left" code={`variant="dropdown" · size="${dropdownSize}" · state="${safeDropdownState}"`}><MenuItem variant="dropdown" size={dropdownSize} items={[{ id: "dropdown", label: isDanger ? "卸载" : dropdownLabel, iconSrc: dropdownSize === "md" ? dropdownIconSrc : isDanger ? "./assets/uploads/menuitem-dropdown-danger.svg" : "./assets/uploads/menuitem-dropdown-small-general.svg", rawIcon: dropdownSize === "sm", danger: isDanger, disabled: safeDropdownState === "disabled", state: ["default", "disabled"].includes(safeDropdownState) ? undefined : safeDropdownState }]} defaultSelectedId={safeDropdownState === "selected" ? "dropdown" : undefined} /></Preview>
      </div>
      <div className="menuitem-state-group"><h3>小尺寸 · 一般</h3><div className="menuitem-state-matrix">{SMALL_DROPDOWN_STATES.map(option => <div className="menuitem-state-sample" key={option.value}><span>{option.label}</span><MenuItem variant="dropdown" items={[{ id: option.value, label: "新建对话", iconSrc: "./assets/uploads/menuitem-dropdown-small-general.svg", rawIcon: true, disabled: option.value === "disabled", state: option.value === "hover" ? "hover" : undefined }]} /></div>)}</div></div>
      <div className="menuitem-state-group"><h3>小尺寸 · 警告</h3><div className="menuitem-state-matrix">{SMALL_DROPDOWN_STATES.map(option => <div className="menuitem-state-sample" key={option.value}><span>{option.label}</span><MenuItem variant="dropdown" items={[{ id: option.value, label: "卸载", iconSrc: "./assets/uploads/menuitem-dropdown-danger.svg", rawIcon: true, danger: true, disabled: option.value === "disabled", state: option.value === "hover" ? "hover" : undefined }]} /></div>)}</div></div>
      <div className="menuitem-state-group"><h3>中尺寸</h3><div className="menuitem-state-matrix">{MEDIUM_DROPDOWN_STATES.map(option => <div className="menuitem-state-sample" key={option.value}><span>{option.label}</span><MenuItem variant="dropdown" size="md" items={[{ id: option.value, label: "添加到工作区", iconSrc: MEDIUM_DROPDOWN_ICONS[0].value, disabled: option.value === "disabled", state: option.value === "hover" ? "hover" : option.value === "selected" ? "selected" : undefined }]} defaultSelectedId={option.value === "selected" ? option.value : undefined} /></div>)}</div></div>
    </section>

    <section className="menuitem-demo-section">
      <div className="menuitem-section-heading"><h2>右侧列表</h2><span>variant="folder" / "file-level-*"</span></div>
      <p>通过 `variant` 选择文件夹、一级文件或二级文件；文件名和状态均可编辑。</p>
      <h3 className="menuitem-configurator-title">Configurator</h3>
      <div className="menuitem-configurator">
        <div className="menuitem-controls">
          <Select label="Variant · 小形态" value={rightVariant} onChange={value => { setRightVariant(value); setRightLabel(value === "folder" ? "新建文件夹" : "产品需求文档.docx"); }} options={RIGHT_VARIANTS} />
          <Select label="State · 状态" value={rightState} onChange={setRightState} options={FILE_STATES} />
          <TextInput label="Label · 文本" value={rightLabel} onChange={setRightLabel} />
          {rightVariant === "folder" && <label className="menuitem-control menuitem-toggle"><span>expanded · 展开 / 收起</span><input type="checkbox" checked={folderExpanded} onChange={event => setFolderExpanded(event.target.checked)} /><b>{folderExpanded ? "展开" : "收起"}</b></label>}
        </div>
        <Preview code={`variant="${rightVariant}" · state="${rightState}"`}><MenuItem variant={rightVariant} items={[{ id: "right", label: rightLabel, state: rightState === "default" ? undefined : rightState, expanded: rightVariant === "folder" ? folderExpanded : undefined }]} onToggle={item => setFolderExpanded(item.expanded)} /></Preview>
      </div>
      {rightVariant === "folder" && <p className="menuitem-prop-hint">容器内的第一个图标是展开 / 收起开关；点击它会触发 <code>onToggle</code>，并更新条目的 <code>expanded</code> 值。</p>}
      <div className="menuitem-state-group"><h3>全部状态</h3><div className="menuitem-state-matrix menuitem-state-matrix--single">{FILE_STATES.map(option => <div className="menuitem-state-sample" key={option.value}><span>{option.label}</span><MenuItem variant={rightVariant} items={[{ id: option.value, label: rightLabel, state: option.value === "default" ? undefined : option.value }]} defaultExpanded /></div>)}</div></div>
    </section>
    <TokenPanel />
  </div>;
}
