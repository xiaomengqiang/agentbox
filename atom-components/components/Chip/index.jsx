import React, { useState } from "react";
import "./index.css";

export default function Chip({ selected = false, disabled = false, icon, children, onClick, id, style, className = "", title }) {
  return <button type="button" id={id} style={style} title={title}
    className={["chip", selected && "chip--selected", disabled && "chip--disabled", className].filter(Boolean).join(" ")}
    disabled={disabled} aria-pressed={selected} onClick={onClick}>
    {icon && <span aria-hidden="true" className="chip__icon" style={{maskImage:`url("${icon}")`,WebkitMaskImage:`url("${icon}")`}} />}
    <span className="chip__label">{children}</span>
  </button>;
}

export function ChipGroup({ items = [], value, defaultValue, onChange, gap = 8, id, style, className = "" }) {
  const [innerValue, setInnerValue] = useState(() => defaultValue !== undefined ? defaultValue : items[0]?.id ?? null);
  const current = value !== undefined ? value : innerValue;
  const selected = key => current === key;
  function choose(item) {
    if (item.disabled) return;
    const next = item.id;
    if (value === undefined) setInnerValue(next);
    onChange?.(next, item);
  }
  return <div id={id} className={["chip-group", className].filter(Boolean).join(" ")} style={{gap, ...style}}>
    {items.map(item => <Chip key={item.id} icon={item.icon} title={item.title || item.label} selected={selected(item.id)} disabled={item.disabled} onClick={() => choose(item)}>{item.label}</Chip>)}
  </div>;
}
