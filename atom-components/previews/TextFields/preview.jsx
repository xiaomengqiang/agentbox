import ColorSpecTable, { color, same } from "../../../tooling/preview/color-spec.jsx";
import React, { useState } from "react";
import TextFields from "../../components/TextFields/index.jsx";
import { CompactBoolean } from "../../../tooling/preview/controls.jsx";

const variants = [["single", "Single · 单行输入"], ["multiline", "Multiline · 多行输入"], ["password", "Password · 密码"]];
function Section({ title, description, children }) {
  return <section className="demo-section"><div className="demo-section-header"><h2 className="demo-section-name">{title}</h2></div><p className="demo-section-desc">{description}</p>{children}</section>;
}
function Table({ headings, children, color = false, matrix = false }) {
  return <div className="btn-table-wrap"><table className={`btn-table${color ? " btn-table--color" : ""}${matrix ? " tf-state-table" : ""}`}><thead><tr>{headings.map(text => <th key={text}>{text}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}
function StressField({ validateLength = false, defaultValue = "", ...props }) {
  const [value, setValue] = useState(defaultValue);
  const overLimit = validateLength && value.length > props.maxLength;
  return <TextFields width={240} {...props} value={value} onChange={setValue}
    error={validateLength ? overLimit : props.error}
    helperText={validateLength
      ? overLimit ? `已超出 ${value.length - props.maxLength} 个字符，请删减。` : `字数符合要求，最多 ${props.maxLength} 个字符。`
      : props.helperText} />;
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
  const [radius, setRadius] = useState("--radius-container");
  const [minHeight, setMinHeight] = useState(140);
  const [maxLength, setMaxLength] = useState(500);
  const [maxHeight, setMaxHeight] = useState(140);
  return <div className="demo-page tf-demo">
    <header className="demo-header"><h1 className="preview-panel-title">TextFields 文本输入框</h1><p className="demo-subtitle">单行 / 多行 / Password · 数值宽度 · 必填与辅助说明 · Default / Hover / Active / Error / Disabled</p></header>
    <Section title="Configurator" description="选择输入类型，点击输入框体验 Active 描边与光标。Password 末尾图标切换明文和圆点。error 开关仅用于模拟外观；实际接入由调用方传入动态校验结果。">
      <div className="button-configurator">
        <div className="button-controls">
          <label className="button-control"><span>输入类型 · variant</span><span className="button-select-wrap"><select value={variant} onChange={event => { setVariant(event.target.value); setValue(""); }}>{variants.map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select></span></label>
          {variant === "multiline" && <>
            <label className="button-control"><span>圆角 token · radius</span><input value={radius} pattern="--[a-zA-Z][a-zA-Z0-9_-]*" onChange={event => setRadius(event.target.value)} placeholder="--radius-container" /><small>默认 --radius-container（8px），仅接受 token 名称</small></label>
            <label className="button-control"><span>最小高度 · minHeight <small>px</small></span><input type="number" min={38} value={minHeight} onChange={event => setMinHeight(Math.max(38, Number(event.target.value) || 38))} /></label>
            <label className="button-control"><span>最多字符 · maxLength</span><input type="number" min={0} value={maxLength} onChange={event => setMaxLength(Math.max(0, Number(event.target.value) || 0))} /></label>
            <label className="button-control"><span>整体最大高度 · maxHeight <small>px</small></span><input type="number" min={38} value={maxHeight} onChange={event => setMaxHeight(Math.max(38, Number(event.target.value) || 38))} /></label>
          </>}
          <label className="button-control"><span>宽度 · width <small>px</small></span><input type="number" min="120" step="1" value={width} onChange={event => setWidth(Math.max(120, Number(event.target.value) || 120))} /></label>
          <CompactBoolean label="禁用输入 · disabled" value={disabled} onChange={setDisabled} />
          <CompactBoolean label="标题必填标记 · required" value={required} onChange={setRequired} />
          <div><CompactBoolean label="辅助说明 · helperText" value={hasHelper} onChange={setHasHelper} />{hasHelper && <label className="button-control tf-helper-control"><span>辅助文案 · helperText</span><input value={helperText} onChange={event => setHelperText(event.target.value)} /></label>}</div>
          <CompactBoolean label="模拟错误外观 · error" value={error} onChange={setError} />
          <label className="button-control"><span>占位文案 · placeholder</span><input value={placeholder} onChange={event => setPlaceholder(event.target.value)} /></label>
          <label className="button-control"><span>标题文案 · label</span><input value={label} onChange={event => setLabel(event.target.value)} placeholder="留空隐藏标题" /></label>
        </div>
        <div className="button-configurator-preview tf-live"><span className="btn-lab-slotlabel">LIVE PREVIEW</span><TextFields variant={variant} radius={radius} minHeight={minHeight} maxHeight={maxHeight} maxLength={variant === "multiline" ? maxLength : undefined} width={width} disabled={disabled} required={required} helperText={hasHelper ? helperText : ""} error={error} placeholder={placeholder} label={label} value={value} onChange={setValue} /></div>
      </div>
    </Section>
    <Section title="Interactive gallery" description="单行文字左右内边距为 16px，密码左侧 16px、图标右侧 12px。多行文字左右距外框 16px。">
      <div className="tf-gallery">{variants.map(([key, text]) => <article className="tf-card" key={key}><h3>{text}</h3><div className="tf-card-content"><TextFields variant={key} width={432} label={key === "password" ? "密码" : "字段名称"} placeholder={key === "password" ? "请输入密码" : "请输入内容"} helperText={key === "password" ? "点击眼睛图标显示或隐藏密码" : "支持输入、选择和编辑文字"} /></div></article>)}</div>
    </Section>
    <Section title="Multiline layouts" description="多行仅保留有边框样式。minHeight / maxHeight 控制高度范围；滚动时文字在外框顶部直接裁切；右下角原生手柄可在 minHeight / maxHeight 范围内调整高度。">
      <div className="tf-gallery tf-multiline-gallery">{[
        { title: "Outlined · --radius-container" },
        { title: "Character count · 实时字数", minHeight: 100, maxHeight: 220, maxLength: 100, defaultValue: "输入内容，实时查看字数。" },
        { title: "Overflow · 滚动裁切", defaultValue: Array.from({ length: 12 }, (_, i) => `第 ${i + 1} 行：滚动查看完整文字内容。`).join("\n") },
      ].map(({ title, ...props }) => <article className="tf-card" key={title}><h3>{title}</h3><div className="tf-card-content"><TextFields variant="multiline" width={432} label="说明" {...props} /></div></article>)}</div>
    </Section>
    <Section title="State matrix" description="Active 使用 brand 蓝色 1px 内描边与 2px 外圈，悬浮时保持；没有独立 Press 或 Focus 外观。静态标本不接受交互。">
      <Table matrix headings={["Type", "Default", "Hover", "Active", "Error", "Disabled"]}>{variants.map(([key, text]) => <tr key={key}><th>{text}</th>{["default", "hover", "active", "error", "disabled"].map(state => <td key={state}><div className={`tf-specimen tf-force-${state}`} inert=""><TextFields variant={key} width={240} label="字段名称" defaultValue={state === "default" ? "" : key === "password" ? "Password123" : "输入内容"} error={state === "error"} disabled={state === "disabled"} helperText={state === "error" ? "请检查输入内容" : "辅助说明"} /></div></td>)}</tr>)}</Table>
    </Section>
    <Section title="Text stress cases" description="240px 窄输入框中的文字极限场景。可直接编辑、选择、滚动和切换密码显隐，检查换行、裁切与计数；溢出的单行 / 密码左右边缘、多行上下边缘显示渐变，滚动到头后对应边缘恢复清晰；字数按 UTF-16 单位计算。">
      <div className="tf-gallery tf-text-stress-gallery">{[
        { title: "Long placeholder · 超长占位", label: "占位文字", placeholder: "请输入完整的项目名称和详细描述，用于检查空输入框中的长占位文字", helperText: "输入文字后占位消失，清空后恢复。" },
        { title: "Single overflow · 单行溢出", label: "长文本", defaultValue: "这是一段远超输入框宽度的单行内容，用于检查左右移动光标和选中文字时的水平滚动。", helperText: "点击后用 Home / End 或方向键查看两端。" },
        { title: "Long password · 长密码", variant: "password", label: "密码", defaultValue: "Wi1!".repeat(16), helperText: "仅为演示密码；检查长圆点序列、水平滚动与显隐切换。" },
        { title: "Long helper · 长说明与计数", variant: "multiline", label: "补充说明", maxLength: 120, defaultValue: "辅助说明与计数同时出现。", helperText: "这是一段较长的辅助说明，用于检查多行换行时，右侧计数是否保持完整，左侧辅助说明是否正常换行。" },
        { title: "Unbroken text · 连续英文", variant: "multiline", label: "连续字符串", defaultValue: "VeryLongUnbrokenIdentifier0123456789".repeat(12), helperText: "检查无空格字符串的换行和垂直滚动。" },
        { title: "At limit · 达到上限", variant: "multiline", label: "最多 40 个字符", maxLength: 40, defaultValue: "文字上限".repeat(10), helperText: "已达上限，删除后可继续输入。" },
        { title: "Over limit · 外部值超限", variant: "multiline", label: "超限初始值", maxLength: 40, defaultValue: "超限内容".repeat(12), validateLength: true },
        { title: "Mixed text · 中英与 emoji", variant: "multiline", label: "混合字符", maxLength: 80, defaultValue: "中文 English 123 😀\n第二行：标点，符号 !?", helperText: "😀 按 2 个 UTF-16 单位计数；可继续输入或粘贴。" },
      ].map(({ title, ...props }) => <article className="tf-card" key={title}><h3>{title}</h3><div className="tf-card-content"><StressField {...props} /></div></article>)}</div>
    </Section>
    <ColorSpecTable textHeading="Text / Icon" description="Single / Multiline / Password 共用颜色；错误描边在编辑时保留，Disabled 与 Error 可叠加。" groups={[{name:'Single / Multiline / Password',rows:[
 {label:'Default',background:'--color-background-primary',outline:'--color-comp-border',text:[color('--text-primary','标题 / 输入文字 / 光标'),color('--text-tertiary','占位文字 / helper / 字数'),color('--color-icon-primary','Password 图标'),color('--text-error','必填标记')]},
 {label:'Hover',outline:'--color-comp-border-hover'},
 {label:'Active',outline:[color('--brand','1px 内描边'),color('--brand-10','2px 外圈；不占布局空间')]},
 {label:'Error',outline:'--error',text:[color('--text-error','辅助说明 / 字数；输入文字与图标同 Default')]},
 {label:'Disabled',outline:same('error=true 时保留 Error 描边'),text:[color('--text-disabled','标题、输入、占位文字、辅助说明、必填标记与字数'),same('Password 图标颜色保持 Default')]},
 ]}]} />
    <Section title="Token contract" description="输入格式参考 SearchBar Large；width 属于可配置 API。">
      <Table headings={["Property", "Value", "Rule"]}>
        <tr><th>Height</th><td>单行 / 密码 40px</td><td>多行随内容增长，minHeight / maxHeight 默认均为 140px，包含内边距；不含 label、helper 与计数。</td></tr>
        <tr><th>Single / Multiline / Password</th><td>9px 16px / gap 8px / radius 24px</td><td>密码图标右侧 12px</td></tr>
        <tr><th>Multiline padding</th><td>8px 16px</td><td>滚动区域内边距 8px 16px；顶部留白随文字滚走</td></tr>
        <tr><th>Multiline radius</th><td>--radius-container（8px）</td><td>各状态使用 1px 内描边</td></tr>
        <tr><th>Input / Placeholder</th><td>14px / 22px · regular</td><td>使用 --font-body-md；字重 400</td></tr>
        <tr><th>Overflow fade</th><td>12px · --spacing-3</td><td>仅遮罩溢出的输入内容边缘；随滚动显隐，不影响边框、密码按钮或辅助说明。</td></tr>
        <tr><th>Scrollbar</th><td>4px · overlay</td><td>位于右侧 8+8px 留白中间，中心距右边缘 8px，顶部留 8px、底部留 16px，避开缩放手柄；不占文字宽度，可拖动</td></tr>
        <tr><th>Resize grip</th><td>原生右下角斜线手柄</td><td>垂直拖动，遵循高度范围；禁用时隐藏。默认最小与最大均为 140px，需要增大 maxHeight 才有可调整空间。</td></tr>
        <tr><th>Caret</th><td>浏览器原生光标</td><td>尺寸随字体与系统设置适配；--text-primary，所有输入类型统一使用。</td></tr>
        <tr><th>Character count</th><td>12px / 18px · regular</td><td>设置 maxLength 的多行输入在框外 supporting text 行右侧显示 x/xx；辅助说明与计数之间留 16px（--spacing-4），整行左右无内边距，不占输入框高度。</td></tr>
        <tr><th>Password dots</th><td>8px 圆点 / 4px 净距</td><td>--spacing-2 / --spacing-1；固定 12px 字符步进，垂直居中；底层使用原生 password 输入。</td></tr>
        <tr><th>Password icon</th><td>20 × 20px</td><td>assets/uploads/icon/password/show.svg、hide.svg</td></tr>
        <tr><th>Label / Helper</th><td>14px / 12px</td><td>标题距框 8px；Helper 行距框 4px（--spacing-1），左右 padding 为 0，辅助说明与计数之间 gap 为 16px（--spacing-4）</td></tr>
      </Table>
    </Section>
    <Section title="API contract" description="类型使用 variant；多行专属配置只在 multiline 时生效。">
      <Table headings={["Props", "Contract"]}>
        <tr><th>variant / width</th><td>single | multiline | password；width 为数字，单位 px，默认 432，窄容器内自动收缩。</td></tr>
        <tr><th>radius</th><td>仅多行：默认 --radius-container（8px），仅接受 CSS token 名称；数字和 CSS 长度无效时回退默认 token。</td></tr>
        <tr><th>minHeight / maxHeight</th><td>仅多行：默认均为 140px，最小 38px；helper 与计数不计入高度。maxHeight 小于 minHeight 时按 minHeight 生效。高度不含标题。</td></tr>
        <tr><th>maxLength</th><td>最大输入长度，默认不限；配置器多行示例为 500，可调整。遵循原生 UTF-16 长度计数，外部赋值不自动截断。多行有上限时在框外辅助说明行右侧显示实时 x/xx；超限显示错误色。</td></tr>
        <tr><th>className / style</th><td>追加到根节点的类名与样式；调用方样式优先。</td></tr>
        <tr><th>disabled / required</th><td>禁用输入与密码按钮；required 在标题后显示必填星号并启用原生必填约束。</td></tr>
        <tr><th>label / placeholder / helperText / error</th><td>标题、占位、辅助说明；label 留空隐藏标题；helperText 支持所有类型。error 接收当前校验结果，随调用方更新立即切换；不缓存错误，也不限定校验规则。配置器开关与状态矩阵仅模拟外观，超限交互示例按当前字数动态校验。</td></tr>
        <tr><th>value / defaultValue / onChange</th><td>受控 / 非受控；所有类型统一 onChange(value, event)。</td></tr>
        <tr><th>onFocus / onBlur</th><td>输入事件回调；不增加独立视觉状态。</td></tr>
      </Table>
    </Section>
  </div>;
}
