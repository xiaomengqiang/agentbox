import React from "react";
import { useState } from "react";
import SearchBar from "./index.jsx";
//
const SIZES = [{value:"large",label:"Large · Filled"},{value:"small",label:"Small · Unfilled"}];
const STATES = ["Default", "Hover", "Disabled"];
function Section({title,description,children}) {
 return <section className="demo-section"><div className="demo-section-header"><h2 className="demo-section-name">{title}</h2></div><p className="demo-section-desc">{description}</p>{children}</section>;
}
function Select({label,value,onChange,options}) {
 return <label className="button-control"><span>{label}</span><span className="button-select-wrap"><select value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></span></label>;
}
function Toggle({label,value,onChange,children}) {
 return <div className="button-control"><span>{label}</span><div className="button-toggle-line"><span>{value?"开启":"关闭"}</span><label className="button-switch"><input type="checkbox" checked={value} onChange={e=>onChange(e.target.checked)} aria-label={label}/><span className="button-switch-track"/></label></div>{children}</div>;
}
function Color({token,detail,kind}) {
 return <><span className="btn-color-token"><i aria-hidden="true" className={'btn-color-swatch'+(kind?' btn-color-swatch--'+kind:'')} style={kind?undefined:{backgroundColor:`var(${token})`}}/><code>{token}</code></span><span className="btn-table-src">{detail}</span></>;
}
function Same(){return <span className="btn-color-same">同 Default</span>;}
function ColorRows({size}) {
 const large=size==='large';
 return STATES.map((state,i)=><tr key={state} className={i===0?'btn-color-group-start':undefined}>
 {i===0?<th rowSpan={STATES.length} scope="rowgroup" className="btn-color-variant">{large?'Large · Filled':'Small · Unfilled'}</th>:null}
 <td className="btn-color-state">{state}{!large&&state==='Hover'?<small>无专属外观</small>:null}</td>
 <td>{state==='Default'?(large?<Color token="--surface-container" detail="→ comp-background-tertiary · 浅色黑 5% / 深色白 10%"/>:<Color token="transparent" detail="透明，无填充" kind="transparent"/>):large&&state==='Hover'?<Color token="--color-interactive-hover" detail="叠加于 Default 底色 · 浅色黑 5% / 深色白 10%"/>:<Same/>}</td>
 <td>{state==='Default'?<Color token="—" detail="无描边" kind="none"/>:<Same/>}</td>
 <td>{state==='Default'?<><Color token="--text-tertiary" detail="占位文字 · 浅色黑 40% / 深色白 40%"/><Color token="--text-primary" detail="输入文字 · 浅色黑 90% / 深色白 90%"/><Color token="--color-icon-secondary" detail="搜索 / 清空图标 · 浅色黑 60% / 深色白 60%"/></>:state==='Disabled'?<><Color token="--text-disabled" detail="占位 / 输入文字 · 浅色黑 20% / 深色白 20%"/><Color token="--color-icon-fourth" detail="搜索图标 · 浅色黑 20% / 深色白 20%；隐藏清空按钮"/></>:<Same/>}</td>
 </tr>);
}
export default function Demo(){
 const [size,setSize]=useState('large');
 const [fontSize,setFontSize]=useState('--font-size-base');
 const [disabled,setDisabled]=useState(false);
 const [value,setValue]=useState('');
 const [placeholder,setPlaceholder]=useState('请输入搜索内容');
 const [clearable,setClearable]=useState(true);
 const [notice,setNotice]=useState('');
 function changeSize(next){setSize(next);setFontSize(next==='large'?'--font-size-base':'--font-size-sm');setClearable(next==='large');}
 return <div className="demo-page">
 <header className="demo-header"><h2 className="preview-panel-title">SearchBar 搜索框</h2><p className="demo-subtitle">SearchBar 搜索框 · Large / Small · Filled / Unfilled · 右侧清空按钮 · 输入状态预览</p></header>
 <Section title="Configurator" description="实时输入体验交互；Small 默认无清空按钮，可显式开启。无 Focus / Pressed 专属外观。">
 <div className="button-configurator"><div className="button-controls">
 <Select label="尺寸 · size" value={size} onChange={changeSize} options={SIZES}/>
 <Select label="字号 · fontSize" value={fontSize} onChange={setFontSize} options={[{value:'--font-size-sm',label:'--font-size-sm · 12px'},{value:'--font-size-base',label:'--font-size-base · 14px'},{value:'--font-size-md',label:'--font-size-md · 16px'},{value:'--font-size-lg',label:'--font-size-lg · 18px'}]}/>
 <Toggle label="禁用 · disabled" value={disabled} onChange={setDisabled}/>
 <label className="button-control"><span>占位文字 · placeholder</span><input value={placeholder} onChange={e=>setPlaceholder(e.target.value)} placeholder="请输入搜索内容"/></label>
 <label className="button-control"><span>输入值 · value</span><input value={value} onChange={e=>setValue(e.target.value)} placeholder="输入预览内容"/></label>
 <Toggle label="清空按钮 · clearable" value={clearable} onChange={setClearable}/>
 </div><div className="button-configurator-preview search-demo-live"><span className="btn-lab-slotlabel">LIVE PREVIEW</span>
 <SearchBar size={size} fontSize={fontSize} disabled={disabled} placeholder={placeholder} clearable={clearable} value={value} onChange={setValue} onSearch={v=>setNotice(v?'搜索：'+v:'请输入搜索内容')} onClear={()=>setNotice('已清空')}/>
 <span className="search-demo-notice" role="status">{notice||'输入关键词，按 Enter 搜索'}</span>
 </div></div></Section>
 <Section title="Interactive gallery" description="按尺寸体验输入与清空。宽度由父容器决定，Size 同时决定填充与圆角。">
 <div className="search-demo-gallery">{SIZES.map(s=><div key={s.value} className="search-demo-specimen"><h3>{s.label}</h3><span className="btn-lab-slotlabel">Enabled</span><SearchBar size={s.value}/></div>)}</div></Section>
 <Section title="State matrix" description="静态标本不响应鼠标与键盘；Small 无 Hover / Focus / Pressed 专属外观。真实交互请使用 Configurator。">
 <div className="btn-table-wrap"><table className="btn-table search-demo-matrix"><colgroup><col className="search-demo-size-column"/><col/><col/><col/></colgroup><thead><tr><th>Size / Variant</th>{STATES.map(s=><th key={s}>{s}</th>)}</tr></thead><tbody>{SIZES.map(s=><tr key={s.value}><th scope="row">{s.label}</th>{STATES.map(state=><td key={state}>{s.value==='small'&&state==='Hover'?<span className="btn-color-same">— 无专属外观</span>:<div inert="" className={'search-demo-static search-demo-'+state.toLowerCase()}><SearchBar size={s.value} disabled={state==='Disabled'}/></div>}</td>)}</tr>)}</tbody></table></div></Section>
 <Section title="Input states" description="激活时保留占位文字；输入后文字使用 text-primary。Large 默认显示清空按钮，Small 默认隐藏。">
 <div className="btn-table-wrap"><table className="btn-table search-demo-input-states"><colgroup><col className="search-demo-size-column"/><col/><col/><col/></colgroup><thead><tr><th>Size</th><th>激活 · 空值</th><th>输入中</th><th>输入完成</th></tr></thead><tbody>{SIZES.map(s=><tr key={s.value}><th scope="row">{s.label}</th>{['active','typing','done'].map(state=><td key={state}><div inert="" className={'search-demo-static search-demo-'+state}><SearchBar size={s.value} value={state==='active'?'':'搜索内容'}/></div></td>)}</tr>)}</tbody></table></div></Section>
 <Section title="Color spec" description="Variant → State → Background / Outline / Text。未变化项标记为“同 Default”；禁用时单独改变文字与图标颜色。">
 <div className="btn-table-wrap"><table className="btn-table btn-table--color"><thead><tr>{['Variant','State','Background','Outline','Text'].map(t=><th key={t}>{t}</th>)}</tr></thead><tbody>{SIZES.map(s=><ColorRows key={s.value} size={s.value}/>)}</tbody></table></div>
 <p className="demo-section-desc search-demo-footnote">光标：两种尺寸均使用 <code>--text-primary</code>（浅色黑 90%）；输入完成后隐藏。仅 Large Hover 在默认底色上叠加。</p></Section>
 <Section title="Token contract" description="尺寸关联外观，不提供独立 Variant 或 Shape 属性。Large 图标 16px，Small 图标 16px，间距均为 8px。">
 <div className="btn-table-wrap"><table className="btn-table btn-table--roomy"><thead><tr>{['Size','Height','Font / line-height','Padding','Icon / gap','Radius','Background'].map(t=><th key={t}>{t}</th>)}</tr></thead><tbody><tr><th>Large</th><td>40px</td><td>--font-size-base / 22px</td><td>9px / 12px</td><td>16px / 8px</td><td>24px</td><td><code>--surface-container</code></td></tr><tr><th>Small</th><td>36px</td><td>--font-size-sm / 16px</td><td>9px / 12px</td><td>16px / 8px</td><td><code>--radius-md</code> · 6px</td><td>transparent</td></tr></tbody></table></div>
 <p className="demo-section-desc search-demo-footnote">宽度为父容器的 100%；支持通过 <code>className</code> / <code>style</code> 调整布局。自绘光标宽 1.5px，Large 高 24px，Small 高 18px，圆角 0.75px；输入时持续闪烁。</p></Section>
 <Section title="API contract" description="输入、清空与回车均由真实组件处理。图标为固定资源，不提供替换属性。">
 <div className="btn-table-wrap"><table className="btn-table search-demo-api"><thead><tr><th>Props</th><th>契约</th></tr></thead><tbody><tr><th>value / onChange</th><td>受控值；输入和清空通过 onChange(value) 更新。</td></tr><tr><th>fontSize</th><td>字号 token；Large 默认 --font-size-base（14px），Small 默认 --font-size-sm（12px）。同步调整占位文字与输入文字，优先于 style.fontSize；不改变行高和光标高度。</td></tr><tr><th>defaultValue</th><td>非受控初始值，不与 value 同时传入。</td></tr><tr><th>onSearch / onClear</th><td>Enter 返回当前值；清空后触发 onClear。</td></tr><tr><th>clearable</th><td>固定右侧，仅使用 close.svg；大小号均支持；有内容且未禁用时显示清空按钮。默认 Large 开启，Small 关闭。</td></tr><tr><th>disabled / placeholder</th><td>禁用输入与清空；空 placeholder 回退到组件默认文案。</td></tr><tr><th>className / style</th><td>宿主布局扩展，不作为视觉变体。</td></tr></tbody></table></div></Section>
 </div>;
}
