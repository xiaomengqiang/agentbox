import React, { useState, useRef, useEffect } from "react";
import "./index.css";

const DEFAULT_ICON = "./assets/uploads/icon/sidebar/new-chat.svg";
const MORE_ICON = "./assets/uploads/icon/sidebar/more.svg";
const NEW_CHAT_ICON = "./assets/uploads/icon/sidebar/new-chat.svg";
const COLLAPSED_ICON = "./assets/uploads/icon/function/arrow-right.svg";
const EXPANDED_ICON = "./assets/uploads/icon/function/arrow-down.svg";

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
  newChatAction = true,
  renameable = false,
  onRename,
  defaultExpanded = false,
  activeId,
  onSelect,
  onToggle,
  onTrailingAction,
  onNewChatAction,
}) {
  return <div id={id} className={["mi-menu", `mi-menu-${size}`, `mi-menu-${variant}`, className].filter(Boolean).join(" ")} style={style} role="list">
    {items.map(item => <MenuRow key={item.id} item={item} level={level} dropdownIcon={dropdownIcon} leadingIcon={leadingIcon} trailingIcon={trailingIcon} newChatAction={newChatAction}
      renameable={renameable} onRename={onRename} defaultExpanded={defaultExpanded} activeId={activeId} onSelect={onSelect} onToggle={onToggle} onTrailingAction={onTrailingAction} onNewChatAction={onNewChatAction} />)}
  </div>;
}

export function MenuRow({ initialEditing = false, inputAutoFocus = true, renameable, onRename, item, level, dropdownIcon, leadingIcon, trailingIcon, submenu = false, newChatAction = true, defaultExpanded, activeId, onSelect, onToggle, onTrailingAction, onNewChatAction }) {
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
  /* 子节点:存在 children 且展开时,在行下渲染子菜单(level-2 子菜单项);
     子菜单形态为纯文本 + 右侧更多图标 —— 无展开/收起箭头、无前置图标、无新建对话操作 */
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  /* 选中态:activeId 与行 id 一致时常驻高亮 */
  const selected = activeId !== undefined && activeId === item.id;
  function toggle() {
    const next = !expanded;
    if (item.expanded === undefined) setInternalExpanded(next);
    onToggle?.({ ...currentItem, expanded: next });
  }
  return <>
    <div className={`mi-row${rowExpands ? " mi-row-expandable" : ""}${editing ? " mi-row-editing" : ""}${selected ? " mi-row-selected" : ""}`} role="listitem" onClick={rowExpands && !editing ? toggle : undefined}>
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
      {trailingIcon && (
        <span className="mi-trailing-region mi-trailing-region--actions">
          {/* 默认尾随图标(云朵/显示器/⋯):行 hover 时隐藏,由 hover 组接管 */}
          <button type="button" className="mi-trailing-action" aria-label="更多" onClick={event => { event.stopPropagation(); onTrailingAction?.(currentItem); }}>
            {item.trailingIcon || <MenuIcon src={MORE_ICON} />}
          </button>
          {/* hover 操作组(所有行):更多在前;hover 时替换默认图标。
             新建对话仅普通行且 newChatAction 开启时渲染 —— 子菜单项与对话分组都只有更多 */}
          <span className="mi-trailing-hover">
            <button type="button" className="mi-trailing-action" aria-label="更多" onClick={event => { event.stopPropagation(); onTrailingAction?.(currentItem); }}>
              <MenuIcon src={MORE_ICON} />
            </button>
            {!submenu && newChatAction && (
              <button type="button" className="mi-trailing-action" aria-label="新建对话" onClick={event => { event.stopPropagation(); onNewChatAction?.(currentItem); }}>
                <MenuIcon src={NEW_CHAT_ICON} />
              </button>
            )}
          </span>
        </span>
      )}
      {item.statusDot && <span className="mi-status-dot" aria-hidden="true" />}
    </>}

  </div>
  {hasChildren && expanded ? (
    /* 子菜单:纯文本子菜单项 —— 无前置图标(leadingIcon=false)、无展开箭头、
       尾部仅更多图标(不渲染 hover 操作组),继承选中/选择行为 */
    <div className="mi-children" role="group">
      {item.children.map(child => (
        <MenuRow key={child.id} item={child} level="level-2" dropdownIcon={false} leadingIcon={false} trailingIcon={trailingIcon} submenu newChatAction={newChatAction}
          renameable={renameable} onRename={onRename} defaultExpanded={false} activeId={activeId} onSelect={onSelect} onToggle={onToggle}
          onTrailingAction={onTrailingAction} onNewChatAction={onNewChatAction} />
      ))}
    </div>
  ) : null}
  </>;
}
