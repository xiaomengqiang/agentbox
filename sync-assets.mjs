#!/usr/bin/env node
// sync-assets.mjs — push the project-root assets/ (single source of truth)
// into every scaffold's assets/ folder.
//
// Scaffolds are auto-discovered: every first-level directory next to this
// script that contains a demo.jsx entry. Override with --targets "a,b".
//
// The copy is one-way (root assets → scaffold assets), overwrite in place,
// no deletions: files removed from the source must be removed from the
// scaffold assets manually (keeps accidental data loss impossible).
//
// Usage:
//   node sync-assets.mjs
//   node sync-assets.mjs --targets preview,preview-components
//
// Output (agent-parseable):
//   RESULT: OK
//   SOURCE: <abs path>
//   SYNCED: <scaffold> (<n> files), <scaffold> (<n> files)
//   RESULT: FAIL | <reason>

import { existsSync, readdirSync, statSync, cpSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function fail(reason) {
  console.log(`RESULT: FAIL | ${reason}`);
  process.exit(1);
}

const args = process.argv.slice(2);
const targetsIdx = args.findIndex((a) => a === "--targets");
const explicitTargets = targetsIdx !== -1 ? args[targetsIdx + 1] : undefined;
if (targetsIdx !== -1 && !explicitTargets) fail("Missing value for --targets");

const SOURCE = join(__dirname, "assets");
if (!existsSync(SOURCE) || !statSync(SOURCE).isDirectory()) {
  fail(`source not found: ${SOURCE}`);
}

const scaffolds = explicitTargets
  ? explicitTargets.split(",").map((s) => s.trim()).filter(Boolean)
  : readdirSync(__dirname, { withFileTypes: true })
      .filter((e) => e.isDirectory() && existsSync(join(__dirname, e.name, "demo.jsx")))
      .map((e) => e.name);

if (scaffolds.length === 0) fail("no scaffolds found (no first-level dir with demo.jsx)");

function countFiles(dir) {
  let n = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) n += countFiles(join(dir, entry.name));
    else n++;
  }
  return n;
}

try {
  const total = countFiles(SOURCE);
  const synced = [];
  for (const name of scaffolds) {
    const dest = join(__dirname, name, "assets");
    cpSync(SOURCE, dest, { recursive: true, force: true });
    synced.push(`${name} (${countFiles(dest)} files)`);
  }
  console.log("RESULT: OK");
  console.log(`SOURCE: ${SOURCE} (${total} files)`);
  console.log(`SYNCED: ${synced.join(", ")}`);
} catch (err) {
  fail(err.message);
}
