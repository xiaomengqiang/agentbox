import ColorSpecTable, { color } from "../../../tooling/preview/color-spec.jsx";
import React from "react";
import { useState } from "react";
import SearchBar from "../../components/SearchBar/index.jsx";
//
const SIZES = [{value:"medium",label:"Medium · 14px"},{value:"small",label:"Small · 12px"}];
const VARIANTS = [{value:"filled",label:"Filled"},{value:"unfilled",label:"Unfilled"}];
const COMBINATIONS = SIZES.flatMap(s=>VARIANTS.map(v=>({...s,variant:v.value,key:`${s.value}-${v.value}`,label:`${s.label} · ${v.label}`})));
const STATES = ["Default", "Typing", "Filled", "Disabled"];
function Section({title,description,children}) {
 return <section className="demo-section"><div className="demo-section-header"><h2 className="demo-section-name">{title}</h2></div><p className="demo-section-desc">{description}</p>{children}</section>;
}
function Select({label,value,onChange,options}) {
 return <label className="button-control"><span>{label}</span><span className="button-select-wrap"><select value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></span></label>;
}
function Toggle({label,value,onChange,children}) {
 return <div className="button-control"><span>{label}</span><div className="button-toggle-line"><span>{value?"开启":"关闭"}</span><label className="button-switch"><input type="checkbox" checked={value} onChange={e=>onChange(e.target.checked)} aria-label={label}/><span className="button-switch-track"/></label></div>{children}</div>;
}
const LONG_QUERY = "搜索项目中的全部设计文档与历史记录，包含组件尺寸、状态、颜色规范以及跨团队协作反馈 / SearchBarLongUnbrokenQuery0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function LongTextExample({size,variant,label}) {
 const [value,setValue]=useState(LONG_QUERY);
 return <article className="search-demo-specimen search-demo-edge">
  <h3>{label} · Long text</h3>
  <div className="search-demo-edge-field"><SearchBar size={size} variant={variant} value={value} onChange={setValue}/></div>
  <button type="button" className="search-demo-reset" onClick={()=>setValue(LONG_QUERY)}>重置长文本</button>
 </article>;
}
export default function Demo(){
 const [size,setSize]=useState('medium');
 const [variant,setVariant]=useState('filled');
 const [disabled,setDisabled]=useState(false);
 const [value,setValue]=useState('');
 const [placeholder,setPlaceholder]=useState('请输入搜索内容');
 const [clearable,setClearable]=useState(true);
 const [notice,setNotice]=useState('');
 return <div className="demo-page">
 <header className="demo-header"><h2 className="preview-panel-title">SearchBar 搜索框</h2><p className="demo-subtitle">SearchBar 搜索框 · Medium / Small · Filled / Unfilled · 右侧清空按钮 · 输入状态预览</p></header>
 <Section title="Configurator" description="实时输入体验交互；所有尺寸均默认支持清空，尺寸与填充独立组合。Typing 与 Default 外观一致，仅增加原生光标；无独立 Focus 外观。">
 <div className="button-configurator"><div className="button-controls">
 <Select label="尺寸 · size" value={size} onChange={setSize} options={SIZES.map(s=>({...s,label:s.label.split(' · ')[0]}))}/>
 <Select label="填充样式 · variant" value={variant} onChange={setVariant} options={VARIANTS}/>
 <Toggle label="禁用 · disabled" value={disabled} onChange={setDisabled}/>
 <label className="button-control"><span>占位文字 · placeholder</span><input value={placeholder} onChange={e=>setPlaceholder(e.target.value)} placeholder="请输入搜索内容"/></label>
 <label className="button-control"><span>输入值 · value</span><input value={value} onChange={e=>setValue(e.target.value)} placeholder="输入预览内容"/></label>
 <Toggle label="清空按钮 · clearable" value={clearable} onChange={setClearable}/>
 </div><div className="button-configurator-preview search-demo-live"><span className="btn-lab-slotlabel">LIVE PREVIEW</span>
 <SearchBar size={size} variant={variant} disabled={disabled} placeholder={placeholder} clearable={clearable} value={value} onChange={setValue} onSearch={v=>setNotice(v?'搜索：'+v:'请输入搜索内容')} onClear={()=>setNotice('已清空')}/>
 <span className="search-demo-notice" role="status">{notice||'输入关键词，按 Enter 搜索'}</span>
 </div></div></Section>
 <Section title="Interactive gallery" description="保留两种样式用于交互检查，尺寸跟随上方 size。输入、Enter 搜索、Tab 到清空按钮，再用 Enter 或 Space 清空。">
 <div className="search-demo-gallery">{VARIANTS.map(v=><div key={v.value} className="search-demo-specimen"><h3>{v.label}</h3><SearchBar size={size} variant={v.value} onSearch={v=>setNotice('搜索：'+v)} onClear={()=>setNotice('已清空')}/></div>)}</div></Section>
 <Section title="State matrix" description="完整展示 2 × 2 组合。Typing 沿用 Default 外观，仅展示静态光标示意；Filled 有值且不显示光标。标本不可交互，真实原生光标请在上方检查。">
 <div className="btn-table-wrap"><table className="btn-table search-demo-matrix"><thead><tr><th>Size / Variant</th>{STATES.map(s=><th key={s}>{s}</th>)}</tr></thead><tbody>{COMBINATIONS.map(s=><tr key={s.key}><th scope="row">{s.label}</th>{STATES.map(state=><td key={state}><div inert="" className={'search-demo-static search-demo-'+state.toLowerCase()}><SearchBar size={s.value} variant={s.variant} value={['Typing','Filled','Disabled'].includes(state)?'搜索内容':''} disabled={state==='Disabled'}/></div></td>)}</tr>)}</tbody></table></div></Section>
 <Section title="Edge cases" description="超长文字 · 尺寸跟随 Configurator。点击输入框并移动光标到末尾，检查单行横向滚动、选区和清空；文字不换行，搜索图标与清空按钮保持可见。">
 <div className="search-demo-gallery">{VARIANTS.map(v=><LongTextExample key={v.value} size={size} variant={v.value} label={v.label}/>)}</div>
 </Section>
 <ColorSpecTable textHeading="Text / Icon" description="两种尺寸共用颜色；Typing / Filled 不改变颜色，禁用时单独改变文字与图标。原生光标使用 --text-primary。" groups={VARIANTS.map(v=>({name:v.label,rows:[
 {label:'Default',background:v.value==='filled'?'--surface-container':'transparent',outline:'none',text:[color('--text-tertiary','占位文字'),color('--text-primary','输入文字 / 光标'),color('--color-icon-secondary','搜索 / 清空图标')]},
 {label:'Typing'}, {label:'Filled'},
 {label:'Disabled',text:[color('--text-disabled','占位 / 输入文字'),color('--color-icon-fourth','搜索图标；隐藏清空按钮')]},
 ]}))} />
 <Section title="Token contract" description="size × variant 独立组合；所有尺寸文字字重为 regular（400），图标 16px，间距 8px，水平内边距 12px。">
 <div className="btn-table-wrap"><table className="btn-table"><thead><tr><th>Size</th><th>Height</th><th>Font size / line-height</th></tr></thead><tbody><tr><th>medium</th><td>40px</td><td>--font-body-md · 14px / 22px</td></tr><tr><th>small</th><td>36px</td><td>--font-body-sm · 12px / 18px</td></tr></tbody></table></div>
 <p className="demo-section-desc">Filled：圆角 24px，背景 --surface-container；Unfilled：圆角 --radius-md（6px），背景透明。宽度为父容器的 100%，style 可调整布局。</p></Section>
 <Section title="API contract" description="输入、清空与回车均由真实组件处理。图标为固定资源，不提供替换属性。">
 <div className="btn-table-wrap"><table className="btn-table search-demo-api"><thead><tr><th>Props</th><th>契约</th></tr></thead><tbody><tr><th>value / onChange</th><td>受控值；输入和清空通过 onChange(value) 更新。</td></tr><tr><th>size / variant</th><td>medium 14px、small 12px；均支持 filled / unfilled，无独立字号属性。</td></tr><tr><th>defaultValue</th><td>非受控初始值，不与 value 同时传入。</td></tr><tr><th>onSearch / onClear</th><td>Enter 返回当前值；输入法组字期间不提交；清空后触发 onClear 并恢复输入焦点。</td></tr><tr><th>clearable</th><td>固定右侧，仅使用 close.svg；所有尺寸均支持；有内容且未禁用时显示清空按钮。所有尺寸默认开启。</td></tr><tr><th>disabled / placeholder</th><td>禁用输入与清空；placeholder 支持空字符串。</td></tr><tr><th>id / className / style</th><td>应用于根 div；追加类名，调用方行内样式优先。</td></tr></tbody></table></div></Section>
 </div>;
}
