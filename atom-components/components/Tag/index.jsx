import React from "react";
import "./index.css";

export default function Tag({ variant = "default", size = "medium", shape = "round", icon, children, title, id, style, className = "" }) {
  return <span id={id} style={style} title={title} className={["tag", `tag--${variant}`, `tag--${size}`, `tag--${shape}`, className].filter(Boolean).join(" ")}>
    {icon && <span aria-hidden="true" className="tag__icon" style={{maskImage:`url("${icon}")`,WebkitMaskImage:`url("${icon}")`}} />}
    <span className="tag__label">{children}</span>
  </span>;
}

function formatDiffValue(value, sign) {
  const text = String(value);
  return (/^[+-]/.test(text) ? text : sign + text).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function DiffTags({ added, removed, gap = 4, id, style, className = "" }) {
  if (added == null && removed == null) return null;
  return <span id={id} className={["tag-diff-pair", className].filter(Boolean).join(" ")} style={{gap, ...style}}>
    {added != null && <Tag variant="green" size="small">{formatDiffValue(added, "+")}</Tag>}
    {removed != null && <Tag variant="red" size="small">{formatDiffValue(removed, "-")}</Tag>}
  </span>;
}
