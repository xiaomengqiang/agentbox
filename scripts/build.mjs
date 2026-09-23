#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, registry, buildPage } from '../tooling/preview/bundler.mjs';

const args = process.argv.slice(2);
const help = 'Usage: node scripts/build.mjs <atom|large> <ComponentName|--gallery|--all> [--check]\n       node scripts/build.mjs --all [--check]';
if (args.includes('--help') || !args.length) { console.log(help); process.exit(args.length ? 0 : 1); }
const check = args.includes('--check');
const positional = args.filter(arg => arg !== '--check');
const levels = positional[0] === '--all' ? ['atom', 'large'] : [positional[0]];
if (levels.some(level => !['atom', 'large'].includes(level))) throw new Error(help);
const target = positional[0] === '--all' ? '--all' : positional[1];
if (!target || positional.length > (positional[0] === '--all' ? 1 : 2)) throw new Error(help);
const pending = [];
for (const level of levels) {
  const { folder, entries } = registry(level);
  if (!entries.length || new Set(entries.map(entry => entry.id)).size !== entries.length || new Set(entries.map(entry => entry.name)).size !== entries.length) throw new Error('Invalid registry: ' + folder);
  const selected = ['--all','--gallery'].includes(target) ? entries : entries.filter(entry => [entry.id,entry.name].includes(target));
  if (!selected.length) throw new Error(`Unknown component ${target}. Available: ${entries.map(entry => entry.name).join(', ')}`);
  const jobs = target === '--gallery' ? [] : selected.map(entry => ({ entries: [entry], output: path.join(ROOT, folder, 'components', entry.name, 'preview.html'), standalone: true }));
  if (['--all','--gallery'].includes(target)) jobs.push({ entries, output: path.join(ROOT, folder, 'index.html'), standalone: false });
  for (const job of jobs) {
    const result = buildPage(level, job.entries, job.output, job.standalone);
    pending.push({ ...job, ...result });
    console.log(`${check ? 'CHECK' : 'BUILD'} ${path.relative(ROOT, job.output)} (${result.modules} modules)`);
  }
}
// No existing page is touched until every requested output builds successfully.
for (const job of pending) {
  if (check) {
    if (!fs.existsSync(job.output) || fs.readFileSync(job.output,'utf8') !== job.html) throw new Error('Outdated preview: ' + job.output);
  } else if (!fs.existsSync(job.output) || fs.readFileSync(job.output,'utf8') !== job.html) {
    fs.writeFileSync(job.output + '.tmp', job.html);
    fs.renameSync(job.output + '.tmp', job.output);
  }
}
console.log(check ? 'PASS: generated previews match source' : `Done: ${pending.length} previews`);
