import ColorSpecTable, { color } from "../../../tooling/preview/color-spec.jsx";
import React, { useState } from "react";
import Tab from "../../components/Tab/index.jsx";
import { CompactBoolean, ContractTable } from "../../../tooling/preview/controls.jsx";

const labels = ['全部', '图片', '视频', '我的收藏', '最近浏览', '文档', '音乐', '更多'];
const makeItems = (count, withIcon = false) => Array.from({ length: count }, (_, index) => ({
  id: `tab-${index + 1}`,
  label: labels[index % labels.length],
  icon: withIcon ? <span className="tt-demo-icon" /> : undefined,
  children: <div className="tt-demo-content"><p>这里是「{labels[index % labels.length]}」的内容</p></div>,
}));

export default function TabDemo() {
  const [count, setCount] = useState(4);
  const [size, setSize] = useState('large');
  const [withIcon, setWithIcon] = useState(false);
  return <div className="demo-page">
    <header className="demo-header"><h2 className="preview-panel-title">Tab 标签</h2><p className="demo-subtitle">Large / Medium · 可选前置图标 · 文字自适应宽度 · 标签与内容联动</p></header>
    <section className="demo-section"><h2 className="demo-section-name">Configurator</h2>
      <p className="tt-config-description">调整尺寸、标签数量和前置图标，点击标签切换下方内容。</p>
      <div className="preview-configurator"><div className="preview-controls">
        <label className="button-control"><span>尺寸 · size</span><span className="button-select-wrap"><select value={size} onChange={event => setSize(event.target.value)}>{['large', 'medium'].map(value => <option key={value} value={value}>{value}</option>)}</select></span></label>
        <label className="button-control"><span>标签数量 · count</span><span className="button-select-wrap"><select value={count} onChange={event => setCount(Number(event.target.value))}>{[2, 3, 4, 5, 6, 7, 8, 12, 16].map(value => <option key={value} value={value}>{value}</option>)}</select></span></label>
        <CompactBoolean label="前置图标 · items[].icon" value={withIcon} onChange={setWithIcon} />
      </div><div className="preview-live"><Tab items={makeItems(count, withIcon)} size={size} /></div></div>
    </section>
    <section className="demo-section"><h2 className="demo-section-name">Interactive gallery</h2><div className="tt-demo-gallery">{['large', 'medium'].flatMap(value => [false, true].map(icon => <article className="tt-demo-card" key={`${value}-${icon}`}><h3>{value} · {icon ? '前置图标' : '纯文字'}</h3><Tab size={value} items={makeItems(3, icon)} /></article>))}</div></section>
    <section className="demo-section"><h2 className="demo-section-name">Overflow · 标签溢出</h2><p className="tt-config-description">点击左右箭头滚动标签；到达边缘后对应箭头和渐变隐藏。滚动不会切换当前内容。</p><div className="tt-demo-card"><Tab items={makeItems(16, true)} /></div></section>
    <ColorSpecTable textHeading="Text / Icon" description="两种尺寸共用颜色；前置图标跟随文字。内容占位框仅用于预览，不是组件默认样式。" groups={[
 {name:'Unselected',rows:[{label:'Default',background:'transparent',outline:'none',text:'--text-placeholder'},{label:'Hover',text:'--text-secondary'},{label:'Focus',outline:'--focus-ring'}]},
 {name:'Selected',rows:[{label:'Default',note:'Bold',background:'transparent',outline:'none',text:[color('#000000','Light · 选中文字与图标'),color('--white','Dark · 选中文字与图标')]},{label:'Hover'},{label:'Focus',outline:'--focus-ring'}]},
 {name:'Scroll button',rows:[{label:'Default',note:'unfilled / small / round',background:'transparent',outline:'none',text:'--color-icon-primary'},{label:'Hover',background:color('--color-interactive-hover','叠加于 Default')},{label:'Pressed',background:color('--color-interactive-pressed','叠加于 Default')}]},
 {name:'Content',rows:[{label:'Default',background:'transparent',outline:'none',text:'--text-primary'}]},
 {name:'Preview placeholder',rows:[{label:'Default',background:'--brand-10',outline:color('--brand','2px dashed'),text:'--brand'}]},
 ]}><p className="color-spec-footnote">溢出使用透明度遮罩：边缘 32px 全透明，至 56px 渐变为不透明；不叠加背景色，箭头不受影响。</p></ColorSpecTable>
    <section className="demo-section preview-contract"><h2 className="demo-section-name">Token contract</h2><ContractTable rows={<>
      <tr><th>large</th><td>字号 18px / 行高 28px · 间距 24px</td><td><code>--font-subtitle-lg / --spacing-6</code></td></tr>
      <tr><th>medium</th><td>字号 16px / 行高 24px · 间距 20px</td><td><code>--font-subtitle-md / --spacing-5</code></td></tr>
      <tr><th>Icon</th><td>large 18px / medium 16px · 图文间距 8px</td><td><code>--spacing-2</code> · 跟随 currentColor</td></tr>
      <tr><th>Content placeholder</th><td>brand-10 底色 · brand 100% / 2px dashed</td><td><code>--brand-10 / --brand</code> · 仅预览示例</td></tr>
      <tr><th>Item width</th><td>fit-content · 无内边距</td><td>贴合当前文字宽度，单行显示</td></tr>
      <tr><th>Unselected / Hover</th><td>Regular</td><td><code>--text-placeholder / --text-secondary</code></td></tr>
      <tr><th>Selected</th><td>Bold · 浅色黑 / 深色白</td><td><code>--font-weight-bold</code></td></tr>
    </>} /></section>
    <section className="demo-section preview-contract"><h2 className="demo-section-name">Asset contract</h2><ContractTable rows={<tr><th>示例前置图标</th><td>search.svg</td><td><code>assets/uploads/icon/function/search.svg</code> · CSS mask / currentColor；业务通过 items[].icon 传入节点</td></tr>} /></section>
    <section className="demo-section preview-contract"><h2 className="demo-section-name">API contract</h2><ContractTable rows={<>
      <tr><th>items</th><td>Array&lt;{'{ id, label, icon?, children? }'}&gt;</td><td>通过循环生成；数量由 items.length 决定；空数组不渲染</td></tr>
      <tr><th>items[].icon</th><td>ReactNode</td><td>每项可选前置图标；与文字同色，尺寸跟随 size</td></tr>
      <tr><th>items[].children</th><td>ReactNode</td><td>当前标签下方的联动内容；切换时卸载旧内容</td></tr>
      <tr><th>size</th><td>large | medium</td><td>默认 large；字号与间距随尺寸一起变化</td></tr>
      <tr><th>activeId / defaultActiveId</th><td>受控 / 非受控选中项</td><td>默认第一项；非受控模式移除当前项后回到第一项</td></tr>
      <tr><th>onChange</th><td>(item) =&gt; void</td><td>返回完整 item</td></tr>
      <tr><th>id / style / className</th><td>string / CSSProperties / string</td><td>可选，作用于根元素</td></tr>
    </>} /><pre className="tt-demo-code"><code>{`const items = data.map(item => ({
  id: item.id,
  label: item.title,
  icon: item.icon,
  children: <div>{item.content}</div>,
}));

<Tab items={items} size="large" />`}</code></pre></section>
  </div>;
}
