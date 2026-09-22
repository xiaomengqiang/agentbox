import { useState } from "react";
import "./demo.css";
import IconState from "./components/IconState/index.jsx";

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
  return <label className="iconstate-control"><span>{label}</span><select value={value} onChange={event => onChange(event.target.value)}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
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
  return <label className="iconstate-control iconstate-upload"><span>{label}</span><input type="file" accept=".svg,image/svg+xml" onChange={event => uploadSvg(event, onLoaded, onError)} /><small>{error || (uploaded ? `已载入 ${uploaded.name}` : "选择 SVG 后自动切换为自定义图标")}</small></label>;
}

function StateGallery({ variant, icon, src, iconSize, frameColor, iconColor }) {
  return <div className="iconstate-state-grid">{STATES.map(item => <div className="iconstate-state-card" key={item.value} inert=""><IconState variant={variant} icon={icon} src={src} iconSize={iconSize} frameColor={frameColor} iconColor={iconColor} state={item.value} ariaLabel={`${variant} ${item.label}`} /><span>{item.label}</span></div>)}</div>;
}

export default function Demo() {
  const [columnIcon, setColumnIcon] = useState("search");
  const [columnSize, setColumnSize] = useState(20);
  const [columnState, setColumnState] = useState("default");
  const [columnUpload, setColumnUpload] = useState(null);
  const [columnError, setColumnError] = useState("");
  const [dialogIcon, setDialogIcon] = useState("dialog-glyph");
  const [dialogState, setDialogState] = useState("default");
  const [frameMode, setFrameMode] = useState("gray");
  const [customColor, setCustomColor] = useState("#0A59F7");
  const frameColor = frameMode === "custom" ? customColor : frameMode;
  const columnSrc = columnIcon === "custom" ? columnUpload?.src : undefined;
  const columnOptions = [...COLUMN_ICONS.map(icon => ({ value: icon, label: icon })), ...(columnUpload ? [{ value: "custom", label: `上传 · ${columnUpload.name}` }] : [])];

  return <div className="demo-page">
    <header className="demo-header"><h1 className="demo-title">IconState 图标状态</h1><p className="demo-subtitle">两类图标分别配置；选择项直接传给 IconState 的 props。</p></header>

    <section className="demo-section">
      <div className="demo-section-header"><h2 className="demo-section-name">栏目 icon</h2><span className="demo-section-tag">Square · 32px</span></div>
      <p className="demo-section-desc">选择状态、20px / 16px 图标尺寸和内置图标，也可以上传自己的 SVG。</p>
      <div className="iconstate-configurator">
        <div className="iconstate-controls">
          <Select label="State · 状态" value={columnState} onChange={setColumnState} options={STATES} />
          <Select label="Icon size · 图标大小" value={String(columnSize)} onChange={value => setColumnSize(Number(value))} options={[{ value: "20", label: "20px" }, { value: "16", label: "16px" }]} />
          <Select label="Icon · 图标" value={columnIcon} onChange={setColumnIcon} options={columnOptions} />
          <UploadControl label="Upload SVG · 上传图标" uploaded={columnUpload} error={columnError} onError={setColumnError} onLoaded={file => { setColumnUpload(file); setColumnIcon("custom"); setColumnError(""); }} />
        </div>
        <div className="iconstate-live"><span className="iconstate-live-label">LIVE PREVIEW</span><IconState variant="square" icon={columnIcon} src={columnSrc} iconSize={columnSize} state={columnState} ariaLabel={`栏目 ${columnIcon} ${columnState}`} /><code>variant="square" · iconSize={'{'}{columnSize}{'}'} · state="{columnState}"</code></div>
      </div>
      <h3 className="iconstate-gallery-title">State matrix · {columnIcon === "custom" ? columnUpload?.name : columnIcon}</h3>
      <StateGallery variant="square" icon={columnIcon} src={columnSrc} iconSize={columnSize} />
    </section>

    <section className="demo-section">
      <div className="demo-section-header"><h2 className="demo-section-name">对话框 icon</h2><span className="demo-section-tag">Circle · 32px</span></div>
      <p className="demo-section-desc">圆形框颜色、状态和图标可选择。灰色默认透明，悬浮和激活使用 5% 黑色背景。</p>
      <div className="iconstate-configurator">
        <div className="iconstate-controls">
          <Select label="Frame color · 框颜色" value={frameMode} onChange={setFrameMode} options={[{ value: "gray", label: "灰色" }, { value: "black", label: "黑色" }, { value: "custom", label: "自定义颜色" }]} />
          {frameMode === "custom" ? <label className="iconstate-control"><span>Custom color · 自定义色值</span><input type="color" value={customColor} onChange={event => setCustomColor(event.target.value)} /></label> : null}
          <Select label="State · 状态" value={dialogState} onChange={setDialogState} options={STATES} />
          <Select label="Icon · 图标" value={dialogIcon} onChange={setDialogIcon} options={DIALOG_ICONS} />
        </div>
        <div className="iconstate-live"><span className="iconstate-live-label">LIVE PREVIEW</span><IconState variant="circle" icon={dialogIcon} frameColor={frameColor} state={dialogState} ariaLabel={`对话框 ${DIALOG_ICONS.find(item => item.value === dialogIcon)?.label} ${dialogState}`} /><code>variant="circle" · icon="{dialogIcon}" · frameColor="{frameColor}" · state="{dialogState}"</code></div>
      </div>
      <h3 className="iconstate-gallery-title">State matrix · {DIALOG_ICONS.find(item => item.value === dialogIcon)?.label}</h3>
      <StateGallery variant="circle" icon={dialogIcon} frameColor={frameColor} />
    </section>
  </div>;
}
