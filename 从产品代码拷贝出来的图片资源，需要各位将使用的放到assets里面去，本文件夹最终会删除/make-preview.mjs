#!/usr/bin/env node
// make-preview.mjs — 扫描本文件夹内的图片/图标资源,生成 resources.html 画廊页。
// 重新拷贝资源后,再跑一次:node make-preview.mjs

import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, extname, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

const IMG_EXTS = [".svg", ".png", ".webp", ".gif", ".jpg", ".jpeg", ".ico", ".bmp"];
const VIDEO_EXTS = [".mp4", ".webm"];

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "resources.html" || e.name === "make-preview.mjs") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(ROOT).map((abs) => ({
  rel: relative(ROOT, abs).split("\\").join("/"),
  size: statSync(abs).size,
  ext: extname(abs).toLowerCase(),
}));

const imgCount = files.filter((f) => IMG_EXTS.includes(f.ext)).length;
const videoCount = files.filter((f) => VIDEO_EXTS.includes(f.ext)).length;
const skipped = files.filter((f) => !IMG_EXTS.includes(f.ext) && !VIDEO_EXTS.includes(f.ext));

const groups = new Map();
for (const f of files) {
  if (!IMG_EXTS.includes(f.ext) && !VIDEO_EXTS.includes(f.ext)) continue;
  const dir = dirname(f.rel) === "." ? "(根目录)" : dirname(f.rel);
  if (!groups.has(dir)) groups.set(dir, []);
  groups.get(dir).push(f);
}

const enc = (p) => p.split("/").map(encodeURIComponent).join("/");
const kb = (n) => (n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`);

const cards = [...groups.entries()].sort().map(([dir, list]) => {
  const items = list.sort((a, b) => a.rel.localeCompare(b.rel)).map((f) => {
    const url = enc(f.rel);
    const media = VIDEO_EXTS.includes(f.ext)
      ? `<video src="${url}" preload="metadata" controls muted></video>`
      : `<img src="${url}" alt="${basename(f.rel)}" loading="lazy">`;
    return `<figure class="card" data-src="${url}" data-name="${basename(f.rel)}">
      <div class="thumb">${media}</div>
      <figcaption><span class="name" title="${basename(f.rel)}">${basename(f.rel)}</span><span class="meta">${kb(f.size)}</span></figcaption>
    </figure>`;
  }).join("\n");
  return `<section class="group"><h2>${dir}<small>${list.length}</small></h2><div class="grid">${items}</div></section>`;
}).join("\n");

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>资源预览</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font: 14px/1.6 system-ui, "Microsoft YaHei", sans-serif; color: #202124; background: #fff; }
  body.dark { background: #17181c; color: #e6e7eb; }
  body.checker { background: repeating-conic-gradient(#e8e8ec 0% 25%, #ffffff 0% 50%) 0 0 / 24px 24px; }
  header { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; gap: 16px; padding: 14px 24px; background: inherit; border-bottom: 1px solid rgba(128,128,140,.25); }
  header h1 { font-size: 18px; margin: 0; }
  header p { margin: 0; color: #7a7c85; font-size: 12px; }
  .modes { margin-left: auto; display: flex; gap: 6px; }
  .modes button { border: 1px solid rgba(128,128,140,.4); background: transparent; color: inherit; padding: 4px 12px; border-radius: 999px; cursor: pointer; font-size: 12px; }
  .modes button.on { background: #0a59f7; border-color: #0a59f7; color: #fff; }
  main { padding: 24px; }
  .group { margin-bottom: 36px; }
  .group h2 { font-size: 15px; margin: 0 0 12px; }
  .group h2 small { margin-left: 8px; color: #7a7c85; font-weight: normal; font-size: 12px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(128px, 1fr)); gap: 12px; }
  .card { margin: 0; border: 1px solid rgba(128,128,140,.25); border-radius: 10px; overflow: hidden; cursor: zoom-in; background: rgba(255,255,255,.6); }
  .thumb { height: 96px; display: flex; align-items: center; justify-content: center; padding: 8px; }
  .thumb img, .thumb video { max-width: 100%; max-height: 100%; object-fit: contain; }
  figcaption { display: flex; justify-content: space-between; gap: 8px; padding: 6px 8px; border-top: 1px solid rgba(128,128,140,.18); }
  .name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
  .meta { color: #7a7c85; font-size: 11px; flex: none; }
  #lightbox { position: fixed; inset: 0; z-index: 100; display: none; align-items: center; justify-content: center; background: rgba(0,0,0,.82); cursor: zoom-out; }
  #lightbox.open { display: flex; }
  #lightbox img { max-width: 92vw; max-height: 90vh; }
  #lightbox .cap { position: absolute; bottom: 20px; left: 0; right: 0; text-align: center; color: #fff; font-size: 13px; }
  footer { padding: 8px 24px 32px; color: #7a7c85; font-size: 12px; }
</style>
</head>
<body class="checker">
<header>
  <h1>资源预览</h1>
  <p>图片 ${imgCount} · 视频 ${videoCount}${skipped.length ? ` · 已跳过非媒体 ${skipped.length}(字体/css/js 等)` : ""}</p>
  <div class="modes">
    <button data-mode="checker" class="on">棋盘</button>
    <button data-mode="">浅色</button>
    <button data-mode="dark">深色</button>
  </div>
</header>
<main>
${cards}
</main>
<div id="lightbox"><img><div class="cap"></div></div>
<footer>重新拷贝资源后执行 node make-preview.mjs 刷新本页 · 挑选后的资源请拷贝到工程 assets/ 后执行 sync-assets</footer>
<script>
  var body = document.body;
  document.querySelectorAll(".modes button").forEach(function (b) {
    b.onclick = function () {
      document.querySelectorAll(".modes button").forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on");
      body.className = b.dataset.mode;
    };
  });
  var lb = document.getElementById("lightbox");
  var lbImg = lb.querySelector("img");
  var lbCap = lb.querySelector(".cap");
  document.querySelectorAll(".card").forEach(function (c) {
    c.onclick = function () {
      var v = c.querySelector("video");
      if (v) return;
      lbImg.src = c.dataset.src;
      lbCap.textContent = c.dataset.name;
      lb.classList.add("open");
    };
  });
  lb.onclick = function () { lb.classList.remove("open"); lbImg.src = ""; };
</script>
</body>
</html>
`;

writeFileSync(join(ROOT, "resources.html"), html, "utf8");
console.log(`RESULT: OK`);
console.log(`HTML: ${join(ROOT, "resources.html")}`);
console.log(`IMAGES: ${imgCount}  VIDEOS: ${videoCount}  SKIPPED: ${skipped.length}`);
console.log(`GROUPS: ${[...groups.keys()].sort().join(", ")}`);
