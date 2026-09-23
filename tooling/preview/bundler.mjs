import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(import.meta.url);
const Babel = require(path.join(ROOT, 'assets/library/babel.min.js'));
const iconTable = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/library/lucide-icon-nodes.json'), 'utf8'));
const read = file => fs.readFileSync(file, 'utf8');
const relative = file => path.relative(ROOT, file).split(path.sep).join('/');
const mime = { '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');

export function registry(level) {
  const folder = level === 'atom' ? 'atom-components' : 'large-components';
  return { folder, entries: JSON.parse(read(path.join(ROOT, folder, 'registry.json'))) };
}

export function buildPage(level, entries, output, standalone) {
  const { folder } = registry(level);
  const modules = new Map();
  const dependencies = new Set();
  const iconNames = new Set(['sun', 'moon']);
  const outputDir = path.dirname(output);
  const url = file => encodeURI(path.relative(outputDir, file).split(path.sep).join('/'));
  function asset(file) {
    if (!fs.existsSync(file)) throw new Error(`Missing asset: ${relative(file)}`);
    dependencies.add(file);
    return mime[path.extname(file)] ? `data:${mime[path.extname(file)]};base64,${fs.readFileSync(file).toString('base64')}` : url(file);
  }
  function load(file) {
    if (modules.has(file)) return relative(file);
    dependencies.add(file);
    let source = read(file);
    const record = { code: '', imports: {}, css: [] };
    modules.set(file, record);
    // Literal icon names also cover configurator choices and dynamically selected names.
    for (const match of source.matchAll(/["']([a-z][a-z0-9-]+)["']/g)) if (iconTable[match[1]]) iconNames.add(match[1]);
    source = source.replace(/(["'])\.\/assets\/([^"'\n]+)\1/g, (whole, quote, name) => {
      const file = path.join(ROOT, 'assets', name);
      return JSON.stringify(fs.existsSync(file) && fs.statSync(file).isFile() ? asset(file) : url(file));
    });
    const ast = Babel.transform(source, { ast: true, code: false, plugins: ['syntax-jsx'] }).ast;
    for (const node of ast.program.body) {
      if (!['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(node.type) || !node.source) continue;
      const spec = node.source.value;
      if (spec === 'react') { record.imports[spec] = 'react'; continue; }
      if (!spec.startsWith('.')) throw new Error(`Unsupported dependency ${spec} in ${relative(file)}`);
      const dep = path.resolve(path.dirname(file), spec);
      if (path.extname(dep) === '.css') { record.css.push(dep); record.imports[spec] = 'css'; }
      else record.imports[spec] = load(dep);
    }
    record.code = Babel.transform(source, { filename: relative(file), presets: ['react'], plugins: ['transform-modules-commonjs'], comments: false, compact: false }).code;
    return relative(file);
  }
  function css(file, seen = new Set()) {
    if (seen.has(file)) return '';
    seen.add(file); dependencies.add(file);
    let source = read(file);
    source = source.replace(/@import\s+(?:url\(\s*)?["']([^"']+)["']\s*\)?\s*;/g,
      (_, name) => css(path.resolve(path.dirname(file), name), seen));
    return source.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g, (whole, quote, name) => {
      if (/^(data:|https?:|#)/.test(name)) return whole;
      return `url("${asset(path.resolve(path.dirname(file), decodeURI(name)))}")`;
    });
  }
  function moduleCss(file, visited = new Set(), styles = new Set()) {
    if (visited.has(file)) return styles;
    visited.add(file);
    const record = modules.get(file);
    for (const id of Object.values(record.imports)) if (!['css', 'react'].includes(id)) moduleCss(path.join(ROOT, id), visited, styles);
    record.css.forEach(file => styles.add(file));
    return styles;
  }
  const galleryId = load(path.join(ROOT, 'tooling/preview/Gallery.jsx'));
  const demos = entries.map(entry => {
    const directory = path.join(ROOT, folder, 'components', entry.name);
    const file = path.join(directory, 'preview.jsx');
    return { ...entry, directory, file, module: load(file) };
  });
  const foundation = ['base', 'light', 'theme', 'dark', 'glass'].map(name => css(path.join(ROOT, 'assets/style', name + '.css'))).join('\n');
  const common = css(path.join(ROOT, 'tooling/preview', level + '.css'));
  const panels = demos.map(demo => {
    const seen = new Set();
    const implementation = [...moduleCss(demo.file)].map(file => css(file, seen)).join('\n');
    return `@scope (.preview-${demo.id}) {\n${implementation}\n${css(path.join(demo.directory, 'preview.css'), seen)}\n}`;
  }).join('\n');
  const icons = Object.fromEntries([...iconNames].sort().map(name => [name, iconTable[name]]));
  const wrappers = [...modules].map(([file, record]) => {
    const prelude = /assets\/shared\/(?:large-)?icons\.js$/.test(relative(file)) ? `const LUCIDE = ${JSON.stringify(icons)};\n` : '';
    return `${JSON.stringify(relative(file))}: function(module, exports, require) {\n${prelude}${record.code}\n}`;
  }).join(',\n');
  const maps = Object.fromEntries([...modules].map(([file, record]) => [relative(file), record.imports]));
  const title = level === 'atom' ? 'Atom Components' : 'Large Components';
  const boot = `const factories = {${wrappers}};\nconst imports = ${JSON.stringify(maps)};\nconst cache = {};
function load(id) {
  if (id === 'react') return React;
  if (id === 'css') return {};
  if (cache[id]) return cache[id].exports;
  if (!factories[id]) throw new Error('Missing module: ' + id);
  const module = cache[id] = { exports: {} };
  factories[id](module, module.exports, name => load(imports[id][name]));
  return module.exports;
}
const entries = ${JSON.stringify(demos.map(({ id, name, module }) => ({ id, name, module })))}.map(entry => ({ ...entry, Demo: load(entry.module).default }));
window.PreviewDemos = Object.fromEntries(entries.map(entry => [entry.id, entry.Demo]));
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(load(${JSON.stringify(galleryId)}).default, { entries, title: ${JSON.stringify(title)}, standalone: ${standalone}, panelClassName: ${JSON.stringify(level === "large" ? "demo-page" : "")} }));`;
  if (boot.includes('</script>')) throw new Error('Unsafe closing script tag in source');
  const filters = ['xs', 'sm', 'md', 'lg', 'xl'].map((name, i) => `<filter id="glass-${name}"><feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise"/><feGaussianBlur in="noise" stdDeviation="3" result="smooth"/><feDisplacementMap in="SourceGraphic" in2="smooth" scale="${[8,15,25,35,50][i]}" xChannelSelector="R" yChannelSelector="G"/></filter>`).join('');
  const document = `<!DOCTYPE html>
<!-- Generated by scripts/build.mjs. Edit component source, not this file. -->
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(standalone ? entries[0].name + ' · ' + title : title)}</title>
<script src="${url(path.join(ROOT,'assets/library/react.production.min.js'))}"></script>
<script src="${url(path.join(ROOT,'assets/library/react-dom.production.min.js'))}"></script>
<style>${foundation}\n${common}\n${panels}\n${css(path.join(ROOT,'tooling/preview/shell.css'))}</style>
</head><body><svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${filters}</defs></svg><div id="root"></div>
<script>${boot}</script></body></html>\n`;
  return { html: document, dependencies: [...dependencies].map(relative).sort(), modules: modules.size };
}
