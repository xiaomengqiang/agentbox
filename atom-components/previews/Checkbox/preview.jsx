import ColorSpecTable, { color, same } from "../../../tooling/preview/color-spec.jsx";
import React, { useState } from "react";
import Checkbox from "../../components/Checkbox/index.jsx";
import { CompactBoolean, ContractTable } from "../../../tooling/preview/controls.jsx";

const shapes = ["square", "circle"];
const states = [
  { name: "Unchecked", checked: false },
  { name: "Checked", checked: true },
  { name: "Disabled · unchecked", checked: false, disabled: true },
  { name: "Disabled · checked", checked: true, disabled: true },
];

export default function Demo() {
  const [shape, setShape] = useState("square");
  const [disabled, setDisabled] = useState(false);
  const [label, setLabel] = useState("允许通知");
  const [checked, setChecked] = useState(false);

  return <div className="demo-page">
    <header className="demo-header">
      <h2 className="preview-panel-title">Checkbox 勾选组件</h2>
      <p className="demo-subtitle">Checkbox 勾选组件 · Square / Circle · 可选文字 · 未选中 / 选中 / 禁用</p>
    </header>

    <section className="demo-section">
      <div className="demo-section-header"><h2 className="demo-section-name">Configurator</h2><span className="demo-section-tag">实时配置</span></div>
      <p className="demo-section-desc">点击预览或按 Space / Enter 切换勾选；禁用时保留当前选中状态。清空文字可查看纯选择框。</p>
      <div className="preview-configurator">
        <div className="preview-controls">
          <label className="button-control"><span>形状 · shape</span><span className="button-select-wrap"><select value={shape} onChange={event => setShape(event.target.value)}><option value="square">Square · 方形</option><option value="circle">Circle · 圆形</option></select></span></label>
          <CompactBoolean label="禁用 · disabled" value={disabled} onChange={setDisabled} />
          <label className="button-control"><span>文字 · label</span><input value={label} onChange={event => setLabel(event.target.value)} placeholder="可留空" /></label>
        </div>
        <div className="preview-live"><Checkbox shape={shape} disabled={disabled} label={label || undefined} checked={checked} onChange={setChecked} /></div>
      </div>
    </section>

    <section className="demo-section">
      <h2 className="demo-section-name">Interactive gallery</h2>
      <div className="demo-grid demo-grid-2">{shapes.map(item => <div className="demo-card cbx-gallery-card" key={item}>
        <h3 className="demo-card-title">{item === "square" ? "Square · 方形" : "Circle · 圆形"}</h3>
        <div className="cbx-gallery-specimens"><Checkbox shape={item} label="允许通知" /><Checkbox shape={item} defaultChecked label="自动同步" /></div>
      </div>)}</div>
    </section>

    <section className="demo-section">
      <h2 className="demo-section-name">State matrix</h2>
      <p className="demo-section-desc">静态标本展示两种形状的选中与禁用外观；Hover / Pressed 没有额外颜色变化。</p>
      <div className="preview-table-wrap"><table className="preview-table cbx-matrix"><thead><tr><th>Shape</th>{states.map(state => <th key={state.name}>{state.name}</th>)}</tr></thead><tbody>{shapes.map(item => <tr key={item}><th>{item === "square" ? "Square" : "Circle"}</th>{states.map(state => <td key={state.name}><div inert=""><Checkbox shape={item} checked={state.checked} disabled={state.disabled} label="选项" /></div></td>)}</tr>)}</tbody></table></div>
    </section>

    <ColorSpecTable textHeading="Text / Mark" description="Checked / Unchecked 分组；Square / Circle 共用颜色，Disabled 对整体应用 40% 不透明度。" groups={[false,true].map(selected=>({name:selected?'Checked':'Unchecked',rows:[
 {label:'Default',background:selected?'--color-comp-background-emphasize':'--color-fg-unchecked',outline:selected?'--color-comp-background-emphasize':'--color-icon-tertiary',text:[color('--on-surface','文字'),...(selected?[color('--white','勾；明暗一致；内描边 --container-05，阴影 --container-10')]:[])]},
 {label:'Hover / Pressed'},
 {label:'Focus',outline:[same('保留 Default 描边'),color('--focus-ring','选择框外部焦点环')]},
 {label:'Disabled',note:'整体 opacity 40%'},
 ]}))} />

    <section className="demo-section preview-contract">
      <h2 className="demo-section-name">Token contract</h2>
      <ContractTable rows={<>
        <tr><th>Control</th><td>24 × 24px / 20 × 20px</td><td>命中容器 / 可视选择框；描边 <code>--border-width-thin</code></td></tr>
        <tr><th>Shape</th><td>Square 4px / Circle full</td><td><code>--radius-sm</code> / <code>--radius-full</code></td></tr>
        <tr><th>Label</th><td>正文 / 8px 间距</td><td><code>--font-body-md</code> / <code>--spacing-2</code></td></tr>
        <tr><th>Mark</th><td>15px icon / 2px stroke</td><td>共享 check 图标；<code>--container-05</code> 内描边，<code>--container-10</code> 阴影（base.css）</td></tr>
        <tr><th>Motion</th><td>颜色、透明度、缩放</td><td><code>--duration-fast</code> / <code>--ease-standard</code> / <code>--ease-out</code></td></tr>
      </>} />
    </section>

    <section className="demo-section preview-contract">
      <h2 className="demo-section-name">API contract</h2>
      <div className="preview-table-wrap"><table className="preview-table preview-api"><thead><tr><th>Prop</th><th>Contract</th></tr></thead><tbody>
        <tr><th>shape</th><td><code>square</code> 或 <code>circle</code>，默认 square；两种形状均为多选语义。</td></tr>
        <tr><th>disabled</th><td>默认 false；禁用鼠标和键盘切换，移出 Tab 顺序，保留选中状态。</td></tr>
        <tr><th>label</th><td>右侧文字，可省略；配置器清空文字后只显示选择框。</td></tr>
        <tr><th>checked / defaultChecked</th><td>受控值 / 非受控初始值；配置器中的选中状态通过实际交互切换。</td></tr>
        <tr><th>onChange</th><td>接收下一选中状态 boolean；Space / Enter 与点击行为一致。</td></tr>
      </tbody></table></div>
    </section>
  </div>;
}
