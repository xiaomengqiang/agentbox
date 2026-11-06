/* ===================== 工具:文本处理 ===================== */

/* 截断长文本用于标题/引用 */
export function short(text, n) {
  const t = (text || "").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}
