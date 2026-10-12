import React, { useState, useRef, useEffect } from "react";
import "./index.css";

const DEFAULT_ICON = "./assets/uploads/icon/sidebar/new_chat.svg";
const MORE_ICON = "./assets/uploads/icon/sidebar/More.svg";
const COLLAPSED_ICON = "./assets/uploads/icon/function/arrow_right.svg";
const EXPANDED_ICON = "./assets/uploads/icon/function/arrow_down.svg";

function MenuIcon({ src, className = "" }) {
  return <span className={`mi-icon ${className}`} aria-hidden="true" style={{
    WebkitMaskImage: `url("${src}")`, maskImage: `url("${src}")`,
  }} />;
}

function MenuLabel({ name, onDoubleClick }) {
  const viewport = useRef(null);
  const content = useRef(null);
  const [metrics, setMetrics] = useState({ overflow: false, distance: 0 });
  useEffect(() => {
    const box = viewport.current;
    const text = content.current;
    if (!box || !text) return;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      const width = text.getBoundingClientRect().width;
      const overflow = width > box.clientWidth + 1;
      const distance = width + 32;
      setMetrics(previous => previous.overflow === overflow && previous.distance === distance ? previous : { overflow, distance });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    observer.observe(text);
    measure();
    document.fonts?.ready.then(measure);
    return () => { disposed = true; observer.disconnect(); };
  }, [name]);
  return <span ref={viewport} className={`mi-label${metrics.overflow ? " mi-label-overflow" : ""}`} onDoubleClick={onDoubleClick}
    style={{ "--mi-scroll-distance": `${-metrics.distance}px`, "--mi-scroll-duration": `${Math.max(6, metrics.distance / 35)}s` }}>
    <span className="mi-label-track"><span ref={content} className="mi-label-copy">{name}</span>{metrics.overflow && <span className="mi-label-copy" aria-hidden="true">{name}</span>}</span>
  </span>;
}

export default function MenuItem({
  id,
  className = "",
  style,
  items = [],
  size = "large",
  variant = "default",
  level = "level-1",
  dropdownIcon = true,
  leadingIcon = true,
  trailingIcon = false,
  renameable = false,
  onRename,
  defaultExpanded = false,
  onSelect,
  onToggle,
  onTrailingAction,
}) {
  return <div id={id} className={["mi-menu", `mi-menu-${size}`, `mi-menu-${variant}`, className].filter(Boolean).join(" ")} style={style} role="list">
    {items.map(item => <MenuRow key={item.id} item={item} level={level} dropdownIcon={dropdownIcon} leadingIcon={leadingIcon} trailingIcon={trailingIcon}
      renameable={renameable} onRename={onRename} defaultExpanded={defaultExpanded} onSelect={onSelect} onToggle={onToggle} onTrailingAction={onTrailingAction} />)}
  </div>;
}

export function MenuRow({ initialEditing = false, inputAutoFocus = true, renameable, onRename, item, level, dropdownIcon, leadingIcon, trailingIcon, defaultExpanded, onSelect, onToggle, onTrailingAction }) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const [editing, setEditing] = useState(initialEditing);
  const [draft, setDraft] = useState("");
  const [renamed, setRenamed] = useState(null);
  const editingRef = useRef(initialEditing);
  const clickTimer = useRef(null);
  useEffect(() => () => clearTimeout(clickTimer.current), []);
  const name = renamed?.source === item.label ? renamed.value : item.label;
  const currentItem = { ...item, label: name };
  const expanded = item.expanded ?? internalExpanded;
  function beginRename(event) {
    if (!renameable) return;
    event.preventDefault();
    event.stopPropagation();
    clearTimeout(clickTimer.current);
    editingRef.current = true;
    setDraft("");
    setEditing(true);
  }
  function finishRename() {
    if (initialEditing) return; // Keep the documentation specimen in editing mode.
    if (!editingRef.current) return;
    editingRef.current = false;
    setEditing(false);
    if (!draft.trim() || draft === name) return;
    setRenamed({ source: item.label, value: draft });
    onRename?.(currentItem, draft);
  }
  function selectContent(event) {
    event.stopPropagation();
    const activate = () => { if (rowExpands) toggle(); else onSelect?.(currentItem); };
    // Defer only name clicks so a double click never also expands/selects the row.
    if (renameable && event.target.closest(".mi-label") && event.detail > 0) {
      clearTimeout(clickTimer.current);
      if (event.detail === 1) clickTimer.current = setTimeout(activate, 300);
    } else activate();
  }
  const rowExpands = level === "level-1" && dropdownIcon;
  function toggle() {
    const next = !expanded;
    if (item.expanded === undefined) setInternalExpanded(next);
    onToggle?.({ ...currentItem, expanded: next });
  }
  return <div className={`mi-row${rowExpands ? " mi-row-expandable" : ""}${editing ? " mi-row-editing" : ""}`} role="listitem" onClick={rowExpands && !editing ? toggle : undefined}>
    {level === "level-2" && <span className="mi-disclosure-space" aria-hidden="true" />}
    {dropdownIcon && <button type="button" className="mi-disclosure" aria-label={expanded ? "收起" : "展开"} aria-expanded={expanded} onClick={event => { event.stopPropagation(); toggle(); }}>
      <MenuIcon src={expanded ? EXPANDED_ICON : COLLAPSED_ICON} />
    </button>}
    {editing ? <>
      {leadingIcon && <MenuIcon src={item.iconSrc || DEFAULT_ICON} className="mi-leading-icon" />}
      <input className="mi-rename-input" aria-label="重命名" autoFocus={inputAutoFocus} value={draft}
        onChange={event => setDraft(event.target.value)} onBlur={finishRename}
        onClick={event => event.stopPropagation()} onDoubleClick={event => event.stopPropagation()}
        onKeyDown={event => {
          event.stopPropagation();
          if (event.key === "Enter" && !event.nativeEvent.isComposing && event.keyCode !== 229) {
            event.preventDefault();
            finishRename();
          }
        }} />
    </> : <>
      <button type="button" className="mi-main" aria-expanded={rowExpands ? expanded : undefined} onClick={selectContent}>
        {leadingIcon && <MenuIcon src={item.iconSrc || DEFAULT_ICON} className="mi-leading-icon" />}
        <MenuLabel name={name} onDoubleClick={beginRename} />
      </button>
      {trailingIcon && <span className="mi-trailing-region"><button type="button" className="mi-trailing-action" aria-label="更多" onClick={event => { event.stopPropagation(); onTrailingAction?.(currentItem); }}><MenuIcon src={MORE_ICON} /></button></span>}
    </>}

  </div>;
}
