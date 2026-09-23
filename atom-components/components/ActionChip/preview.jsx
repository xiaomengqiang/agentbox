import React, { useState } from "react";
import ActionChip from "./index.jsx";

const examples = [{ icon: "skill", title: "Skill · 技能", label: "网页设计" }, { icon: "connector", title: "Connector · 连接器", label: "连接器" }, { icon: "expert", title: "Expert · 专家", label: "设计专家" }];
function Table({ heads, children, color = false }) {
  return <div className="preview-table-wrap"><table className={`preview-table ${color ? "preview-table--color" : ""}`}><thead><tr>{heads.map(head => <th key={head}>{head}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}
function Token({ name, note }) {
  return <><span className="ac-token"><i style={{ background: `var(${name})` }} /><code>{name}</code></span>{note && <small className="ac-token-note">{note}</small>}</>;
}
export default function Demo() {
  const [icon, setIcon] = useState("skill");
  const [label, setLabel] = useState("网页设计");
  return <div className="demo-page">
    <header className="demo-header"><h2 className="preview-panel-title">ActionChip 操作块</h2><p className="demo-subtitle">必选前置图标 · label / icon · 内容自适应 · Default / Hover</p></header>
    <section className="demo-section">
      <div className="demo-section-header"><h2 className="demo-section-name">Configurator</h2><span className="demo-section-tag">实时配置</span></div>
      <p className="demo-section-desc">选择图标并编辑标签。悬浮操作块时，前置图标原位切换为 close，文字和宽度保持不变。</p>
      <div className="preview-configurator"><div className="preview-controls">
        <label className="button-control"><span>图标 · icon</span><span className="button-select-wrap"><select value={icon} onChange={event => setIcon(event.target.value)}>{examples.map(item => <option key={item.icon} value={item.icon}>{item.icon}</option>)}</select></span></label>
        <label className="button-control"><span>标签 · label</span><input value={label} onChange={event => setLabel(event.target.value)} /></label>
      </div><div className="preview-live"><ActionChip icon={icon} label={label} /></div></div>
    </section>
    <section className="demo-section"><div className="demo-section-header"><h2 className="demo-section-name">Interactive gallery</h2><span className="demo-section-tag">3 icons</span></div><p className="demo-section-desc">使用指定的本地图标；移入体验 close，移出恢复原图标。</p><div className="ac-gallery">{examples.map(item => <div className="demo-item" key={item.icon}><h3 className="demo-item-title">{item.title}</h3><div className="ac-gallery-specimen"><ActionChip {...item} /></div></div>)}</div></section>
    <section className="demo-section preview-contract"><h2 className="demo-section-name">State matrix</h2><p className="preview-summary">仅 Default 与 Hover 两种视觉状态；静态标本不响应鼠标。</p><Table heads={["Icon", "Default", "Hover"]}>{examples.map(item => <tr key={item.icon}><th>{item.icon}</th><td className="ac-static" inert=""><ActionChip {...item} /></td><td className="ac-static ac-force-hover" inert=""><ActionChip {...item} /></td></tr>)}</Table></section>
    <section className="demo-section preview-contract"><h2 className="demo-section-name">Color spec</h2><Table color heads={["Variant", "State", "Background", "Outline", "Text / Icon"]}>
      <tr className="preview-group-start"><th rowSpan={2} className="preview-variant">ActionChip</th><td>Default</td><td><Token name="--color-comp-emphasize-tertiary" note="→ --brand-10 · Light / Dark" /></td><td>无</td><td><Token name="--color-font-emphasize" /><Token name="--color-icon-emphasize" /></td></tr>
      <tr><td>Hover</td><td><Token name="--color-interactive-hover" note="叠加于 Default；Light → --container-05 / Dark → --container-10" /></td><td>同 Default</td><td>同 Default；图标切换 close</td></tr>
    </Table></section>
    <section className="demo-section preview-contract"><h2 className="demo-section-name">Token contract</h2><Table heads={["Property", "Value", "Token / rule"]}>
      <tr><th>Height</th><td>24px</td><td>固定高度</td></tr><tr><th>Typography</th><td>12px / 20px · Medium</td><td><code>--font-size-sm / --font-weight-medium</code></td></tr><tr><th>Icon / gap</th><td>14px / 4px</td><td>前置图标始终保留；close 原位替换</td></tr><tr><th>Padding / radius</th><td>0 8px / full</td><td><code>--radius-full</code></td></tr>
    </Table></section>
    <section className="demo-section preview-contract"><h2 className="demo-section-name">Asset contract</h2><Table heads={["Icon", "Source", "Usage"]}>{examples.map(item => <tr key={item.icon}><th>{item.icon}</th><td><code>assets/uploads/icon/prompt input/{item.icon}.svg</code></td><td>Default 前置图标</td></tr>)}<tr><th>close</th><td><code>assets/uploads/icon/function/close.svg</code></td><td>Hover 替换图标</td></tr></Table></section>
    <section className="demo-section preview-contract"><h2 className="demo-section-name">API contract</h2><Table heads={["Prop", "Contract"]}><tr><th>icon</th><td>skill / connector / expert；默认 skill。空值或无效值回退到 skill，始终显示图标。</td></tr><tr><th>label</th><td>标签文案；宽度随内容自适应，在父容器受限时省略。</td></tr><tr><th>onClick</th><td>点击整个操作块触发回调，由宿主决定移除等行为。</td></tr><tr><th>className</th><td>根按钮扩展类名。</td></tr></Table><p className="preview-summary">键盘导航保留焦点提示；没有独立 Pressed 样式或 width 配置。</p></section>
  </div>;
}
