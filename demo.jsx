import { useState } from "react";
import SearchBar from "./components/SearchBar/index.jsx";
import "./demo.css";

const SIZES = [{value:"large",label:"Large · Filled"},{value:"small",label:"Small · Unfilled"}];
const STATES = ["Default", "Hover", "Focus", "Pressed", "Disabled"];
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
 {i===0?<th rowSpan={5} scope="rowgroup" className="btn-color-variant">{large?'Large · Filled':'Small · Unfilled'}</th>:null}
 <td className="btn-color-state">{state}{!large&&['Hover','Focus','Pressed'].includes(state)?<small>无专属外观</small>:null}</td>
 <td>{state==='Default'?(large?<Color token="--surface-container" detail="→ comp-background-tertiary · 浅色黑 5% / 深色白 5%"/>:<Color token="transparent" detail="透明，无填充" kind="transparent"/>):large&&['Hover','Pressed'].includes(state)?<Color token={state==='Hover'?'--color-interactive-hover':'--color-interactive-pressed'} detail={'叠加于 Default 底色 · 浅色黑 / 深色白 '+(state==='Hover'?'5%':'10%')}/>:<Same/>}</td>
 <td>{state==='Default'?<Color token="—" detail="无描边" kind="none"/>:large&&state==='Focus'?<Color token="--focus-ring" detail="内部 2px · 跟随主题蓝色 · 仅键盘聚焦"/>:<Same/>}</td>
 <td>{state==='Default'?<><Color token={large?'--text-secondary':'--color-font-tertiary'} detail={large?'占位文字 · 浅色黑 60% / 深色白 60%':'占位文字 · 浅色黑 40% / 深色白 40%'}/><Color token="--on-surface" detail="输入文字 · 浅色黑 90% / 深色白 90%"/><Color token="--text-secondary" detail="搜索 / 清空图标 · 浅色黑 60% / 深色白 60%"/></>:state==='Disabled'?<><Color token="--text-disabled" detail="占位 / 输入文字 · 浅色黑 20% / 深色白 20%"/><Color token="--color-icon-fourth" detail="搜索图标 · 浅色黑 20% / 深色白 20%；隐藏清空按钮"/></>:<Same/>}</td>
 </tr>);
}
export default function Demo(){
 const [size,setSize]=useState('large');
 const [disabled,setDisabled]=useState(false);
 const [value,setValue]=useState('');
 const [placeholder,setPlaceholder]=useState('请输入搜索内容');
 const [clearable,setClearable]=useState(true);
 const [position,setPosition]=useState('right');
 const [mode,setMode]=useState('controlled');
 const [initial,setInitial]=useState('');
 const [revision,setRevision]=useState(0);
 const [notice,setNotice]=useState('');
 function changeSize(next){setSize(next);setClearable(next==='large');}
 return <div className="demo-page">
 <header className="demo-header"><p className="demo-subtitle">SearchBar 搜索框 · Large / Small · Filled / Unfilled · 可配置清空按钮及位置 · 输入状态预览</p></header>
 <Section title="Configurator" description="实时输入体验交互；Small 默认无清空按钮，可显式开启。焦点描边仅在 Large 使用 Tab 聚焦时出现。">
 <div className="button-configurator"><div className="button-controls">
 <Select label="Size" value={size} onChange={changeSize} options={SIZES}/>
 <Select label="State" value={disabled?'disabled':'enabled'} onChange={v=>setDisabled(v==='disabled')} options={[{value:'enabled',label:'Enabled'},{value:'disabled',label:'Disabled'}]}/>
 <Select label="Value mode" value={mode} onChange={v=>{setMode(v);setNotice('');}} options={[{value:'controlled',label:'受控 · value'},{value:'uncontrolled',label:'非受控 · defaultValue'}]}/>
 <label className="button-control"><span>Placeholder</span><input value={placeholder} onChange={e=>setPlaceholder(e.target.value)} placeholder="请输入搜索内容"/></label>
 {mode==='controlled'?<label className="button-control"><span>Value</span><input value={value} onChange={e=>setValue(e.target.value)} placeholder="输入预览内容"/></label>:<div className="button-control"><label>Default value<input value={initial} onChange={e=>setInitial(e.target.value)}/></label><button className="search-demo-reset" onClick={()=>{setRevision(v=>v+1);setNotice('');}}>应用初始值</button><small>defaultValue 仅在初始化时生效。</small></div>}
 <Toggle label="清空按钮" value={clearable} onChange={setClearable}>{clearable?<Select label="Clear position" value={position} onChange={setPosition} options={[{value:'right',label:'Right · 右侧'},{value:'left',label:'Left · 左侧'}]}/>:null}</Toggle>
 </div><div className="button-configurator-preview search-demo-live"><span className="btn-lab-slotlabel">LIVE PREVIEW</span>
 <SearchBar key={mode+revision} size={size} disabled={disabled} placeholder={placeholder} clearable={clearable} clearPosition={position} {...(mode==='controlled'?{value,onChange:setValue}:{defaultValue:initial})} onSearch={v=>setNotice(v?'搜索：'+v:'请输入搜索内容')} onClear={()=>setNotice('已清空')}/>
 <span className="search-demo-notice" role="status">{notice||'输入关键词，按 Enter 搜索'}</span>
 </div></div></Section>
 <Section title="SearchBar" description="按尺寸比较 Enabled / Disabled。宽度由父容器决定，Size 同时决定填充与圆角。">
 <div className="search-demo-gallery">{SIZES.map(s=><div key={s.value} className="search-demo-specimen"><h3>{s.label}</h3><span className="btn-lab-slotlabel">Enabled</span><SearchBar size={s.value}/><span className="btn-lab-slotlabel">Disabled</span><SearchBar size={s.value} disabled/></div>)}</div></Section>
 <Section title="State matrix" description="静态标本不响应鼠标与键盘；Small 无 Hover / Focus / Pressed 专属外观。真实交互请使用 Configurator。">
 <div className="btn-table-wrap"><table className="btn-table search-demo-matrix"><thead><tr><th>Size / Variant</th>{STATES.map(s=><th key={s}>{s}</th>)}</tr></thead><tbody>{SIZES.map(s=><tr key={s.value}><th scope="row">{s.label}</th>{STATES.map(state=><td key={state}>{s.value==='small'&&['Hover','Focus','Pressed'].includes(state)?<span className="btn-color-same">— 无专属外观</span>:<div inert="" className={'search-demo-static search-demo-'+state.toLowerCase()}><SearchBar size={s.value} disabled={state==='Disabled'}/></div>}</td>)}</tr>)}</tbody></table></div></Section>
 <Section title="Input states" description="激活时保留占位文字；输入后文字使用 font-primary。Large 默认显示清空按钮，Small 默认隐藏。">
 <div className="btn-table-wrap"><table className="btn-table search-demo-input-states"><thead><tr><th>Size</th><th>激活 · 空值</th><th>输入中</th><th>输入完成</th></tr></thead><tbody>{SIZES.map(s=><tr key={s.value}><th>{s.label}</th>{['active','typing','done'].map(state=><td key={state}><div inert="" className={'search-demo-static search-demo-'+state}><SearchBar size={s.value} value={state==='active'?'':'搜索内容'}/></div></td>)}</tr>)}</tbody></table></div></Section>
 <Section title="Color spec" description="Variant → State → Background / Outline / Text。未变化项标记为“同 Default”；禁用时单独改变文字与图标颜色。">
 <div className="btn-table-wrap"><table className="btn-table btn-table--color"><thead><tr>{['Variant','State','Background','Outline','Text'].map(t=><th key={t}>{t}</th>)}</tr></thead><tbody>{SIZES.map(s=><ColorRows key={s.value} size={s.value}/>)}</tbody></table></div>
 <p className="demo-section-desc search-demo-footnote">光标：Large 使用 <code>--color-font-emphasize</code>，Small 使用 <code>--container-90</code>；输入完成后隐藏。Hover / Pressed 在默认底色上叠加。</p></Section>
 <Section title="Token contract" description="尺寸关联外观，不提供独立 Variant 或 Shape 属性。两种尺寸的图标均为 16px，间距 8px。">
 <div className="btn-table-wrap"><table className="btn-table btn-table--roomy"><thead><tr>{['Size','Height','Font / line-height','Padding','Icon / gap','Radius','Background'].map(t=><th key={t}>{t}</th>)}</tr></thead><tbody><tr><th>Large</th><td>40px</td><td>16px / 22px</td><td>9px / 12px</td><td>16px / 8px</td><td>24px</td><td><code>--surface-container</code></td></tr><tr><th>Small</th><td>36px</td><td>12px / 16px</td><td>9px / 12px</td><td>16px / 8px</td><td><code>--radius-md</code> · 6px</td><td>transparent</td></tr></tbody></table></div>
 <p className="demo-section-desc search-demo-footnote">宽度为父容器的 100%；支持通过 <code>className</code> / <code>style</code> 调整布局。自绘光标为 1.5 × 24px，圆角 0.75px。</p></Section>
 <Section title="API contract" description="输入、清空与回车均由真实组件处理。图标为固定资源，不提供替换属性。">
 <div className="btn-table-wrap"><table className="btn-table btn-table--roomy"><thead><tr><th>Props</th><th>契约</th></tr></thead><tbody><tr><th>value / onChange</th><td>受控值；输入和清空通过 onChange(value) 更新。</td></tr><tr><th>defaultValue</th><td>非受控初始值，不与 value 同时传入。</td></tr><tr><th>onSearch / onClear</th><td>Enter 返回当前值；清空后触发 onClear。</td></tr><tr><th>clearable / clearPosition</th><td>大小号均支持；有内容且未禁用时显示清空按钮。默认 Large 开启，Small 关闭。</td></tr><tr><th>disabled / placeholder</th><td>禁用输入与清空；空 placeholder 回退到组件默认文案。</td></tr><tr><th>className / style</th><td>宿主布局扩展，不作为视觉变体。</td></tr></tbody></table></div></Section>
 </div>;
}
