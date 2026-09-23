const fs=require('fs'),vm=require('vm');
const path=require('path'); const root=path.resolve(__dirname,'..');
function load(name,requireFn){const module={exports:{}};new Function('module','exports','require',fs.readFileSync(path.join(root,'assets/library',name),'utf8'))(module,module.exports,requireFn);return module.exports;}
const React=load('react.production.min.js');const Babel=load('babel.min.js');
let count=0;let hookIndex=0;let overrides={};const context={React:{...React,useState:v=>{const i=hookIndex++;return [Object.hasOwn(overrides,i)?overrides[i]:(typeof v==='function'?v():v),()=>{}]},useEffect:()=>{}},ReactDOM:{createRoot:()=>({render:()=>count++})},document:{getElementById:()=>({})},console};context.window=context;
vm.createContext(context);
const html=fs.readFileSync(path.join(root,'index.components.html'),'utf8');
for(const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){if(m[1].includes('src='))continue;vm.runInContext(m[1].includes('text/babel')?Babel.transform(m[2],{presets:['react']}).code:m[2],context);}
if(count!==1||!context.PreviewDemos.iconstate||!context.PreviewDemos.menuitem)throw Error('Missing gallery or previews');
// Render both preview trees with deterministic hook values to detect unresolved names.
function walk(el){if(!el||typeof el!=='object')return;if(Array.isArray(el)){el.forEach(walk);return;}if(typeof el.type==='function')walk(el.type(el.props));else walk(el.props?.children);}
for(const id of ['iconstate','menuitem']){hookIndex=0;overrides={};walk(context.PreviewDemos[id]());}
let cases=0;
for(const icon of ['dialog-glyph','dialog-pause','dialog-add'])for(const state of ['auto','default','hover','active','disabled'])for(const frame of ['gray','black','custom']){hookIndex=0;overrides={8:icon,9:state,10:frame};walk(context.PreviewDemos.iconstate());cases++;}
for(const left of ['nav','history'])for(const size of ['sm','md'])for(const variant of ['folder','file-level-1','file-level-2'])for(const state of ['default','hover','rename','renaming','disabled']){hookIndex=0;overrides={1:true,3:left,7:size,12:variant,13:state};walk(context.PreviewDemos.menuitem());cases++;}
console.log(`PASS: ${cases} representative configuration combinations render.`);
console.log('PASS: scripts compile and execute; IconState and MenuItem preview trees render.');
