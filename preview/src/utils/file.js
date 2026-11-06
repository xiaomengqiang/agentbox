/* ===================== 工具:文件类型/图标/容量 ===================== */

/* ============ 通用行渲染与文件工具 ============ */
/* 文件卡片：取扩展名 / 图标 / 可读容量 */
export function fileTypeOf(name) {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop().toUpperCase() : "FILE";
}

/* 文件类型 → filled 填充风格彩色图标(图片类型特殊:显示上传的具体图片) */
export const FILE_ICONS = {
  word: "./assets/uploads/icon/file-type/filled/docx.svg",
  sheet: "./assets/uploads/icon/file-type/filled/sheet.svg",
  slide: "./assets/uploads/icon/file-type/filled/ppt.svg",
  pdf: "./assets/uploads/icon/file-type/filled/pdf.svg",
  csv: "./assets/uploads/icon/file-type/filled/cvs.svg",
  markdown: "./assets/uploads/icon/file-type/filled/markdown.svg",
  text: "./assets/uploads/icon/file-type/filled/txt.svg",
  audio: "./assets/uploads/icon/file-type/filled/music.svg",
  video: "./assets/uploads/icon/file-type/filled/video.svg",
  zip: "./assets/uploads/icon/file-type/filled/zip.svg",
  code: "./assets/uploads/icon/file-type/filled/code.svg",
  unknown: "./assets/uploads/icon/file-type/filled/unkown.svg",
};

export const IMAGE_EXTS = ["PNG", "JPG", "JPEG", "GIF", "WEBP", "SVG", "BMP"];

/* 扩展名 → FILE_ICONS key */
export const EXT_ICON_KEYS = {
  DOC: "word", DOCX: "word", DOT: "word", DOTX: "word", RTF: "word", ODT: "word",
  XLS: "sheet", XLSX: "sheet", XLT: "sheet", ODS: "sheet",
  PPT: "slide", PPTX: "slide", POT: "slide", POTX: "slide", ODP: "slide",
  PDF: "pdf", CSV: "csv",
  MD: "markdown", MDX: "markdown", MARKDOWN: "markdown",
  TXT: "text", LOG: "text",
  MP3: "audio", WAV: "audio", FLAC: "audio", AAC: "audio", OGG: "audio", M4A: "audio",
  MP4: "video", AVI: "video", MOV: "video", MKV: "video", WEBM: "video", FLV: "video",
  ZIP: "zip", RAR: "zip", "7Z": "zip", TAR: "zip", GZ: "zip", TGZ: "zip", BZ2: "zip",
  JS: "code", TS: "code", JSX: "code", TSX: "code", JSON: "code", HTML: "code", CSS: "code",
  SCSS: "code", PY: "code", JAVA: "code", C: "code", CPP: "code", H: "code", CS: "code",
  GO: "code", RS: "code", PHP: "code", SH: "code", XML: "code", YML: "code", YAML: "code",
};

export function isImageFile(name) {
  return IMAGE_EXTS.includes(fileTypeOf(name));
}

export function fileSrcOf(name) {
  const key = EXT_ICON_KEYS[fileTypeOf(name)];
  return FILE_ICONS[key || "unknown"];
}

export function fmtSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
