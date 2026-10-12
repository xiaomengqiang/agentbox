import React, { useState } from "react";
import MenuItem, { MenuRow } from "../../components/MenuItem/index.jsx";
import ColorSpec, { color } from "../../../tooling/preview/color-spec.jsx";
import "./preview.css";

const SIZES = ["large", "medium", "small"];
const VARIANTS = ["default", "error"];
const LEVELS = ["level-1", "level-2"];
const DELETE_ICON = "./assets/uploads/icon/function/delete.svg";
const ICON_COLUMNS = [{ leading: true, trailing: true }, { leading: true, trailing: false }, { leading: false, trailing: true }, { leading: false, trailing: false }];
const STATES = ["default", "hover", "renaming"];
const ICONS = [
  { value: "./assets/uploads/icon/sidebar/new_chat.svg", label: "new_chat" },
  { value: "./assets/uploads/icon/sidebar/folder_close.svg", label: "folder_close" },
  { value: "./assets/uploads/icon/sidebar/folder_open.svg", label: "folder_open" },
  { value: "./assets/uploads/icon/sidebar/scheduled_task.svg", label: "scheduled_task" },
  { value: "./assets/uploads/icon/sidebar/plugin.svg", label: "plugin" },
  { value: "./assets/uploads/icon/sidebar/more_round.svg", label: "more_round" },
  { value: "./assets/uploads/icon/sidebar/More.svg", label: "More" },
  { value: "./assets/uploads/icon/function/delete.svg", label: "delete" },
  { value: "./assets/uploads/icon/function/add.svg", label: "add" },
];
const options = values => values.map(value => ({ value, label: value }));

function Select({ label, value, onChange, options: values }) {
  return <label className="button-control"><span>{label}</span><span className="button-select-wrap"><select value={value} onChange={event => onChange(event.target.value)}>{values.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></span></label>;
}
function Toggle({ label, value, onChange }) {
  return <div className="button-control"><span>{label}</span><div className="button-toggle-line"><span>{value ? "开启" : "关闭"}</span><label className="button-switch"><input type="checkbox" aria-label={label} checked={value} onChange={event => onChange(event.target.checked)} /><span className="button-switch-track" /></label></div></div>;
}
function Table({ title, headers, rows }) {
  return <section className="demo-section"><div className="demo-section-header"><h2 className="demo-section-name">{title}</h2></div><div className="btn-table-wrap"><table className="btn-table"><thead><tr>{headers.map(header => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th scope="row" key={j}>{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div></section>;
}

const TEXT_LIMIT_CASES = [
  { name: "超长中文", text: "这是一个非常长的菜单名称用于检查侧边栏中文标题在空间不足时是否正确截断并保留右侧更多操作图标", level: "level-1", icons: true },
  { name: "连续英文 / ID", text: "fyq8ug0q9iug-qugqjg-g09qu1234567890abcdefghijklmnopqrstuvwxyz", level: "level-1", icons: true },
  { name: "中英混合 / 文件名", text: "2026年第四季度产品设计评审_MenuItem_Final_Final_v12.fig", level: "level-1", icons: true },
  { name: "Emoji / 标点", text: "📁 项目资料 · Design review / 设计评审（最终确认版本）✅✨📎", level: "level-1", icons: true },
  { name: "纯文本 / 无图标", text: "只有文字的超长条目名称用来检查关闭所有图标后文本是否充分使用可用宽度", level: "level-1", icons: false },
  { name: "单字", text: "文", level: "level-1", icons: true },
];
function TextLimits() {
  return <section className="demo-section menuitem-text-limits">
    <div className="demo-section-header"><h2 className="demo-section-name">Text limits</h2></div>
    <p className="demo-section-desc">固定 Large，比较 160 / 240 / 320px 三种宽度。长文本右侧渐隐，悬浮条目时循环滚动全文，离开后复位；More 保持独立。非空名称可双击测试长文本重命名，Enter 或点击外部保存。</p>
    <div className="menuitem-charts">{["large"].map(size => <div key={size}>
      <h3 className="menuitem-chart-title">{size}</h3>
      <div className="btn-table-wrap"><table className="btn-table menuitem-limit-table">
        <thead><tr><th>文本场景</th>{[160,240,320].map(width => <th key={width}>{width}px</th>)}</tr></thead>
        <tbody>{TEXT_LIMIT_CASES.map(test => <tr key={test.name}><th scope="row">{test.name}</th>{[160,240,320].map(width => <td key={width}><MenuItem size={size} level={test.level} dropdownIcon={test.icons} leadingIcon={test.icons} trailingIcon={test.icons} renameable style={{width}} items={[{id:test.name,label:test.text}]} /></td>)}</tr>)}</tbody>
      </table></div>
    </div>)}</div>
  </section>;
}

export default function Demo() {
  const [size, setSize] = useState("large");
  const [variant, setVariant] = useState("default");
  const [level, setLevel] = useState("level-1");
  const [leadingIcon, setLeadingIcon] = useState(true);
  const [trailingIcon, setTrailingIcon] = useState(true);
  const [dropdownIcon, setDropdownIcon] = useState(true);
  const [label, setLabel] = useState("新建对话");
  const [iconSrc, setIconSrc] = useState(ICONS[0].value);
  const [expanded, setExpanded] = useState(false);
  const [errorLabel, setErrorLabel] = useState("删除");
  const [errorIconSrc, setErrorIconSrc] = useState(DELETE_ICON);
  const [errorTrailingIcon, setErrorTrailingIcon] = useState(false);
  const [renameable, setRenameable] = useState(false);
  const currentTrailingIcon = variant === "error" ? errorTrailingIcon : trailingIcon;
  const currentLabel = variant === "error" ? errorLabel : label;
  const currentIconSrc = variant === "error" ? errorIconSrc : iconSrc;
  const item = { id: "preview", label: currentLabel, iconSrc: currentIconSrc, expanded };
  return <div className="demo-page">
    <header className="demo-header"><h2 className="preview-panel-title">MenuItem 菜单条目</h2><p className="demo-subtitle">Large / Medium / Small · Default / Error · 前置图标、层级、展开图标、右侧图标独立组合 · Default / Hover</p></header>
    <section className="demo-section">
      <div className="demo-section-header"><h2 className="demo-section-name">Configurator</h2></div>
      <p className="demo-section-desc">层级控制缩进，展开图标由独立开关控制。一级带箭头时整行可展开；二级保留一个图标位的缩进。右侧 More 独立响应悬浮与点击。</p>
      <div className="button-configurator">
        <div className="button-controls">
          <Select label="尺寸 · size" value={size} onChange={setSize} options={options(SIZES)} />
          <Select label="样式 · variant" value={variant} onChange={setVariant} options={options(VARIANTS)} />
          <Select label="层级 · level" value={level} onChange={setLevel} options={options(LEVELS)} />
          <Toggle label="展开图标 · dropdownIcon" value={dropdownIcon} onChange={setDropdownIcon} />
          <div className="menuitem-control-stack"><Toggle label="前置图标 · leadingIcon" value={leadingIcon} onChange={setLeadingIcon} />{leadingIcon && <Select label="图标资源 · items[].iconSrc" value={currentIconSrc} onChange={variant === "error" ? setErrorIconSrc : setIconSrc} options={ICONS} />}</div>
          <Toggle label="右侧图标 · trailingIcon" value={currentTrailingIcon} onChange={variant === "error" ? setErrorTrailingIcon : setTrailingIcon} />
          <Toggle label="允许重命名 · renameable" value={renameable} onChange={setRenameable} />
          <label className="button-control"><span>文本 · items[].label</span><input value={currentLabel} onChange={event => (variant === "error" ? setErrorLabel : setLabel)(event.target.value)} /></label>
        </div>
        <div className="button-configurator-preview menuitem-live"><span className="btn-lab-slotlabel">LIVE PREVIEW</span><MenuItem id="menuitem-live" renameable={renameable} onRename={(item, name) => (variant === "error" ? setErrorLabel : setLabel)(name)} size={size} variant={variant} level={level} dropdownIcon={dropdownIcon} leadingIcon={leadingIcon} trailingIcon={currentTrailingIcon} items={[item]} onToggle={next => setExpanded(next.expanded)} /></div>
      </div>
    </section>
    <section className="demo-section">
      <div className="demo-section-header"><h2 className="demo-section-name">Variant combinations</h2><span className="demo-section-tag">{variant}</span></div>
      <p className="demo-section-desc">按 size 分组；行 = 层级 × 箭头开关，列 = 前置图标 × 右侧图标。样式跟随配置器，每个尺寸 16 种组合。</p>
      <div className="menuitem-charts">{SIZES.map(chartSize => <div className="menuitem-chart" key={chartSize}>
        <h3 className="menuitem-chart-title">{chartSize}<span>{chartSize === "large" ? "40" : chartSize === "medium" ? "36" : "32"}px · icon {chartSize === "small" ? "14" : "16"}px</span></h3>
        <div className="btn-table-wrap"><table className="btn-table menuitem-combination-table">
          <thead><tr><th scope="col">Level</th><th scope="col">前置箭头</th>{ICON_COLUMNS.map(({leading, trailing}) => <th scope="col" key={`${leading}-${trailing}`}>前置 icon {leading ? "开" : "关"}<span className="menuitem-column-detail">右侧 icon {trailing ? "开" : "关"}</span></th>)}</tr></thead>
          <tbody>{LEVELS.flatMap(chartLevel => [true, false].map((disclosure, index) => <tr key={`${chartLevel}-${disclosure}`}>
            {index === 0 && <th scope="rowgroup" rowSpan={2}>{chartLevel}</th>}
            <th scope="row">{disclosure ? "开" : "关"}</th>
            {ICON_COLUMNS.map(({leading, trailing}) => <td key={`${leading}-${trailing}`}><MenuItem renameable={renameable} size={chartSize} variant={variant} level={chartLevel} dropdownIcon={disclosure} leadingIcon={leading} trailingIcon={trailing} items={[{id:"combination", label:variant === "error" ? "删除" : "菜单条目", iconSrc:variant === "error" ? DELETE_ICON : ICONS[0].value}]} /></td>)}
          </tr>))}</tbody>
        </table></div>
      </div>)}</div>
    </section>
    <section className="demo-section">
      <div className="demo-section-header"><h2 className="demo-section-name">State matrix</h2><span className="demo-section-tag">medium · 36px</span></div>
      <p className="demo-section-desc">固定同一尺寸和图标布局，对比 Default / Error 的默认、悬浮和重命名输入态；输入态可点击输入，使用与配置器一致的原生光标；未聚焦时不显示光标。</p>
      <div className="btn-table-wrap menuitem-state-table"><table className="btn-table"><thead><tr><th>Variant</th>{STATES.map(state => <th key={state}>{state}</th>)}</tr></thead><tbody>{VARIANTS.map(matrixVariant => <tr key={matrixVariant}><th scope="row">{matrixVariant}</th>{STATES.map(state => <td key={state}><div inert={state === "renaming" ? undefined : ""}>{state === "renaming" ? <div className={`mi-menu mi-menu-medium mi-menu-${matrixVariant} mi-preview-renaming`}><MenuRow initialEditing inputAutoFocus={false} level="level-1" dropdownIcon={false} leadingIcon item={{id:"rename-state",label:"",iconSrc:matrixVariant === "error" ? DELETE_ICON : ICONS[0].value}} /></div> : <MenuItem size="medium" variant={matrixVariant} level="level-1" dropdownIcon={false} leadingIcon items={[{id:"state",label:matrixVariant === "error" ? "删除" : "菜单条目",iconSrc:matrixVariant === "error" ? DELETE_ICON : ICONS[0].value}]} className={`mi-preview-${state}`} />}</div></td>)}</tr>)}</tbody></table></div>
    </section>
    <TextLimits />
    <ColorSpec textHeading="Text / Icon" description="两种样式均无默认背景；状态层不累加。Error 的文字与前置图标为红色；右侧 More 独立使用 secondary / primary 图标色。" groups={VARIANTS.map(value => ({ name: value, rows: [
      { label: "Default", background: "transparent", outline: "none", text: [color(value === "error" ? "--color-error" : "--on-surface", "文字"), color(value === "error" ? "--color-error" : "--color-icon-primary", "前置图标 / 展开箭头"), color("--color-icon-secondary", "More；仅悬浮自身时使用 --color-icon-primary")] },
      { label: "Hover", background: color(value === "error" ? "--color-error-container" : "--color-interactive-hover", "叠加于透明背景") },
      { label: "Renaming", background: [color(value === "error" ? "--color-error-container" : "--color-interactive-hover", "条目保持 Hover"), color("transparent", "输入框无填充")], outline: color("--brand", "输入框 1px 描边 · 100% 品牌色"), text: [color("--on-surface", "输入文字"), color("--brand", "原生光标"), color(value === "error" ? "--color-error" : "--color-icon-primary", "左侧图标保持原色")] },
    ] }))} />
    <Table title="Token contract" headers={["Size / Property", "Height / Icon", "Spacing / Typography", "Radius"]} rows={[
      ["large", "40px / 16px", "左右 12px；gap 8px；文字 14px / 21px · Regular 400", "--radius-container · 8px"],
      ["medium", "36px / 16px", "左右 12px；gap 8px；文字 14px / 21px · Regular 400", "--radius-md · 6px"],
      ["small", "32px / 14px", "左右 12px；gap 8px；文字 12px / 18px · Regular 400", "--radius-md · 6px"],
      ["level-2", "保留当前 size 的箭头占位", "关闭箭头时左距 36 / 36 / 34px；开启箭头再增加 24 / 24 / 22px", "同尺寸定义"],
      ["long text", "右侧 24px 渐隐；仅溢出时启用", "悬浮以 35px/s 循环滚动，两段文字间隔 32px；离开复位", "—"],
      ["rename input", "上下右距外框 2px；1px brand 描边及品牌色光标", "文字沿用 size；外框维持 Hover；brand 即 100% 品牌主色", "外框圆角减 2px：6 / 4 / 4px"],
      ["width / rows", "宽度跟随父容器，默认 100%", "条目间距默认 0；容器 style 可设置 gap", "—"],
    ]} />
    <Table title="Asset contract" headers={["部位", "资源", "行为"]} rows={[
      ["前置图标", "items[].iconSrc；默认 sidebar/new_chat.svg", "CSS mask：icon-primary；Error 使用 color-error；关闭时移除"],
      ["展开图标", "function/arrow_right.svg / arrow_down.svg", "dropdownIcon 独立控制；两个层级均可开启或关闭"],
      ["右侧图标区域", "assets/uploads/icon/sidebar/More.svg", "24×24px 热区；默认 icon-secondary，仅悬浮 More 时 icon-primary；独立点击回调"],
    ]} />
    <Table title="API contract" headers={["API", "Contract"]} rows={[
      ["size / variant / level / dropdownIcon / leadingIcon / trailingIcon", "独立属性轴，所有 96 种组合均支持；更改一项不重置其他项"],
      ["items", "条目字段 id / label / iconSrc / expanded；没有选中或历史状态分支"],
      ["renameable / onRename", "开启后双击名称清空并聚焦输入框；Enter 或失焦提交；空白不改名；输入框替换文字和 More，左侧图标保留"],
      ["defaultExpanded / onToggle", "展开可受控或非受控；一级带箭头时点击整行展开；二级点击箭头展开，回传含新 expanded 的 item"],
      ["onSelect / onTrailingAction", "普通条目内容触发 onSelect；More 独立触发 onTrailingAction，不触发展开或选择"],
      ["id / className / style", "作用于列表根容器；style 优先；预览状态由 preview.css 控制，不是组件属性"],
    ]} />
  </div>;
}
