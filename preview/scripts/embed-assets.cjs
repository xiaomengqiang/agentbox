// Run after building: node preview/scripts/embed-assets.cjs
// Resolves image/mask resources inside JSX strings and embeds the runtime.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const target = path.join(root, 'index.components.html');
const Babel = require(path.join(root, 'assets/library/babel.min.js'));
let html = fs.readFileSync(target, 'utf8');
const mime = { '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif' };
const refs = new Set(html.match(/(?:\.\/)?assets\/uploads\/[^\s"'`<>)}]+/g) || []);
for (const ref of refs) {
  const file = path.resolve(root, ref);
  if (!fs.existsSync(file)) throw new Error('Missing preview asset: ' + ref);
  const type = mime[path.extname(file).toLowerCase()];
  if (!type) throw new Error('Unsupported preview asset: ' + ref);
  const data = 'data:' + type + ';base64,' + fs.readFileSync(file).toString('base64');
  html = html.split(ref).join(data);
}
// Compile JSX ahead of time so the standalone page needs no Babel runtime.
html = html.replace(/<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/, (_, code) =>
  '<script>' + Babel.transform(code, { presets: ['react'], compact: true, sourceMaps: false }).code.replace(/<\/script/gi, '<\\/script') + '</script>');
html = html.replace(/<script src="\.\/assets\/library\/([^"]+)"><\/script>/g, (_, name) => {
  if (name === 'babel.min.js') return '';
  return '<script>' + fs.readFileSync(path.join(root, 'assets/library', name), 'utf8').replace(/<\/script/gi, '<\\/script') + '</script>';
});
if (/(?:\.\/)?assets\/uploads\//.test(html)) throw new Error('External image references remain');
if (/<script[^>]+src=/.test(html)) throw new Error('External runtime scripts remain');
fs.writeFileSync(target, html);
console.log('Embedded ' + refs.size + ' image/icon resources and React runtime; JSX precompiled.');
