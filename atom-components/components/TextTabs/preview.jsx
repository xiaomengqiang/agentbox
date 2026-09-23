import React from "react";
import { useState } from "react";
import TextTabs from "./index.jsx";
import { CompactBoolean, ContractTable } from "../../../tooling/preview/controls.jsx";
export default function TextTabsDemo(){
  const [count,setCount]=useState(4);
  const labels=['全部','图片','视频','我的收藏','最近浏览','文档','音乐','更多'];
  const items=labels.slice(0,count).map((label,id)=>({id,label}));
  return <div className="demo-page">
    <header className="demo-header"><h2 className="preview-panel-title">TextTabs 文字标签</h2><p className="demo-subtitle">TextTabs 文字标签 · Count · 文字自适应宽度 · 默认 18px / 间距 24px</p></header>
    <section className="demo-section"><h2 className="demo-section-name">Configurator</h2><div className="preview-configurator"><div className="preview-controls"><label className="button-control"><span>Count · 标签数量</span><span className="button-select-wrap"><select value={count} onChange={event=>setCount(Number(event.target.value))}>{[2,3,4,5,6,7,8].map(value=><option key={value} value={value}>{value}</option>)}</select></span></label></div><div className="preview-live"><TextTabs items={items}/></div></div><p className="demo-note">点击标签或使用左右方向键、Home / End 切换。</p></section>
    <section className="demo-section preview-contract"><h2 className="demo-section-name">Token contract</h2><ContractTable rows={<><tr><th>Font size</th><td>18px · fontSize 使用字号 token</td><td><code>--font-subtitle-lg / --font-size-lg</code></td></tr><tr><th>Gap</th><td>24px · gap 可覆盖</td><td><code>--spacing-6</code></td></tr><tr><th>Item width</th><td>fit-content · 无内边距</td><td>贴合当前文字宽度，单行显示</td></tr><tr><th>Unselected / Hover</th><td>Regular</td><td><code>--text-placeholder / --text-secondary</code></td></tr><tr><th>Selected</th><td>Bold · 浅色黑 / 深色白</td><td><code>--font-weight-bold</code></td></tr><tr><th>Keyboard focus</th><td>焦点描边</td><td><code>--focus-ring</code></td></tr></>}/></section>
    <section className="demo-section preview-contract"><h2 className="demo-section-name">API contract</h2><ContractTable rows={<><tr><th>items</th><td>Array&lt;{'{ id, label }'}&gt;</td><td>数量由 items.length 决定；空数组不渲染</td></tr><tr><th>fontSize</th><td>string</td><td>项目 --font-size-* token 名称；默认 --font-size-lg；无效值回退默认字号</td></tr><tr><th>gap</th><td>number | string</td><td>数字单位 px；支持 CSS 长度；预览保持默认值</td></tr><tr><th>activeId / defaultActiveId</th><td>受控 / 非受控选中项</td><td>默认第一项；移除当前项后回到第一项</td></tr><tr><th>onChange</th><td>(item) =&gt; void</td><td>返回完整 item</td></tr></>}/></section>
  </div>;
}
