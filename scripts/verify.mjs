#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { ROOT, registry } from '../tooling/preview/bundler.mjs';
const require = createRequire(import.meta.url);
const React = require(path.join(ROOT, 'assets/library/react.production.min.js'));
const args = process.argv.slice(2);
const help = 'Usage: node scripts/verify.mjs [--all | atom|large ComponentName|--gallery|--all]';
if (args.includes('--help')) { console.log(help); process.exit(0); }
const levels = !args.length || args[0] === '--all' ? ['atom','large'] : [args[0]];
if (levels.some(level => !['atom','large'].includes(level))) throw new Error(help);
const target = args[1] || '--all';
let cases = 0;
function verify(file, ids) {
  const html = fs.readFileSync(file,'utf8');
  let hookIndex = 0, overrides = {}, rendered, nodes = 0;
  const context = {
    React: { ...React,
      useState: value => [Object.hasOwn(overrides, hookIndex) ? overrides[hookIndex++] : (hookIndex++, typeof value === 'function' ? value() : value), () => {}],
      useEffect: () => {}, useLayoutEffect: () => {}, useRef: value => ({ current: value }), useId: () => `verify-${hookIndex++}`,
      useMemo: fn => fn(), useCallback: fn => fn,
    },
    ReactDOM: { createRoot: () => ({ render: tree => { rendered = tree; } }) },
    document: { getElementById: () => ({}) },
    location: { hash: '' }, history: { replaceState() {} }, localStorage: { getItem: () => null }, console,
  };
  context.window = context;
  vm.createContext(context);
  for (const script of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) if (!script[1].includes('src=')) vm.runInContext(script[2], context, { filename: path.relative(ROOT,file) });
  if (!rendered) throw new Error('Gallery did not mount: ' + file);
  const registered = Object.keys(context.PreviewDemos).sort();
  if (JSON.stringify(registered) !== JSON.stringify([...ids].sort())) throw new Error('Unexpected component registry: ' + file);
  function walk(element) {
    if (!element || typeof element !== 'object') return;
    if (Array.isArray(element)) { element.forEach(walk); return; }
    nodes++;
    if (typeof element.type === 'function') walk(element.type(element.props));
    else walk(element.props?.children);
  }
  hookIndex = 0; walk(rendered);
  for (const id of ids) { hookIndex = 0; overrides = {}; walk(context.PreviewDemos[id]()); }
  if (ids.includes('iconstate')) for (const icon of ['dialog-glyph','dialog-pause','dialog-add']) for (const state of ['auto','default','hover','active','disabled']) for (const frame of ['gray','black','custom']) {
    hookIndex=0; overrides={8:icon,9:state,10:frame}; walk(context.PreviewDemos.iconstate()); cases++;
  }
  if (ids.includes('menuitem')) for (const left of ['nav','history']) for (const size of ['sm','md']) for (const variant of ['folder','file-level-1','file-level-2']) for (const state of ['default','hover','rename','renaming','disabled']) {
    hookIndex=0; overrides={1:true,3:left,7:size,12:variant,13:state}; walk(context.PreviewDemos.menuitem()); cases++;
  }
  // External runtime/font paths must work from both gallery and deeply nested previews.
  for (const match of html.matchAll(/(?:src="|url\(")([^"\)]+)(?:"|\))/g)) {
    if (/^(data:|https?:|#)/.test(match[1]) || match[1].includes('${')) continue;
    const resolved=path.resolve(path.dirname(file),decodeURI(match[1]));
    if (!fs.existsSync(resolved)) throw new Error('Broken output asset: '+match[1]+' in '+file);
  }
  console.log(`PASS ${path.relative(ROOT,file)}: ${ids.length} components, ${nodes} nodes`);
}
for (const level of levels) {
  const { folder, entries } = registry(level);
  const selected = ['--all','--gallery'].includes(target) ? entries : entries.filter(entry => [entry.id, entry.name].includes(target));
  if (!selected.length) throw new Error('Unknown component: ' + target);
  if (target !== '--gallery') for (const entry of selected) verify(path.join(ROOT,folder,'components',entry.name,'preview.html'),[entry.id]);
  if (['--all','--gallery'].includes(target)) verify(path.join(ROOT,folder,'index.html'),entries.map(entry => entry.id));
}
console.log(`PASS: runtime rendering and local asset paths; ${cases} additional configuration cases`);
