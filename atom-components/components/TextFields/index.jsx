import React, { useId, useLayoutEffect, useRef, useState } from "react";
import "./index.css";

export default function TextFields({
  variant = "single", width = 432, disabled = false, label = "", showLabel = true, required = false,
  helperText = "", error = false, placeholder = "请输入内容", value, defaultValue = "",
  radius = 8, bordered = true, maxHeight = 140, showActionBar = false, actionBar,
  onChange, onFocus, onBlur, id, name, autoComplete, maxLength, ariaLabel,
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const multiline = variant === "multiline";
  const password = variant === "password";
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [editing, setEditing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [caret, setCaret] = useState({ left: -1.5, top: -1, show: true });
  const [scrollbar, setScrollbar] = useState({ visible: false, height: 0, top: 0 });
  const scrollDragRef = useRef(null);
  const inputRef = useRef(null);
  const mirrorRef = useRef(null);
  const beforeRef = useRef(null);
  const markerRef = useRef(null);
  const dotsRef = useRef(null);
  const currentValue = value !== undefined ? value : internalValue;
  const hasActions = multiline && showActionBar;
  const hasLabel = showLabel && Boolean(label);
  const hasHelper = !multiline && Boolean(helperText);
  const masked = password && !visible && currentValue.length > 0;
  // Height includes the outer padding and the optional action row, excluding label/helper.
  const chromeHeight = 20 + (hasActions ? 40 : 0);
  const heightLimit = Math.max(140, Number.isFinite(maxHeight) ? maxHeight : 140);

  function syncScrollbar() {
    const input = inputRef.current;
    if (!input || !multiline) return;
    const viewport = input.clientHeight;
    const range = Math.max(0, input.scrollHeight - viewport);
    const height = Math.min(viewport, Math.max(24, viewport * viewport / input.scrollHeight));
    const top = range ? (Math.max(0, Math.min(range, input.scrollTop)) / range) * (viewport - height) : 0;
    setScrollbar(previous => previous.visible === (range > 1) && previous.height === height && previous.top === top
      ? previous : { visible: range > 1, height, top });
  }
  function moveScrollbar(event) {
    const drag = scrollDragRef.current;
    const input = inputRef.current;
    if (!drag || !input) return;
    const travel = input.clientHeight - scrollbar.height;
    if (travel > 0) input.scrollTop = drag.scrollTop + (event.clientY - drag.y) * (input.scrollHeight - input.clientHeight) / travel;
    syncScrollbar();
    syncCaret();
  }
  function fitHeight() {
    const input = inputRef.current;
    if (!input || !multiline) return;
    const scrollTop = input.scrollTop;
    input.style.height = "0px";
    const naturalHeight = input.scrollHeight;
    input.style.height = `${Math.min(Math.max(140 - chromeHeight, naturalHeight), heightLimit - chromeHeight)}px`;
    input.style.overflowY = naturalHeight > heightLimit - chromeHeight ? "auto" : "hidden";
    input.scrollTop = scrollTop;
    syncScrollbar();
  }

  function syncCaret() {
    const input = inputRef.current;
    const mirror = mirrorRef.current;
    if (!input || !mirror) return;
    const start = input.selectionStart ?? input.value.length;
    // A full-width mirror preserves textarea wrapping, including newlines and tabs.
    mirror.style.width = `${input.clientWidth}px`;
    beforeRef.current.textContent = password && !visible ? "•".repeat(start) : input.value.slice(0, start);
    markerRef.current.textContent = (password && !visible ? "•".repeat(input.value.length - start) : input.value.slice(start)) || "\u200b";
    const rect = markerRef.current.getClientRects()[0];
    const base = mirror.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const x = (masked ? start * 10 : Math.round((rect.left - base.left) * dpr) / dpr) - input.scrollLeft;
    if (dotsRef.current) dotsRef.current.style.transform = `translateX(${-input.scrollLeft}px)`;
    const y = Math.floor(markerRef.current.offsetTop / 22) * 22 - input.scrollTop - 1;
    setCaret({ left: x <= 0 ? -1.5 : x + .5, top: multiline ? y : -1,
      show: input.selectionStart === input.selectionEnd && x >= 0 && x <= input.clientWidth && (!multiline || (y >= -1 && y < input.clientHeight - 1)) });
  }
  useLayoutEffect(() => { fitHeight(); if (editing) syncCaret(); }, [currentValue, editing, visible, variant, width, heightLimit, hasActions, placeholder]);
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    let lastWidth = input.clientWidth;
    const observer = new ResizeObserver(() => {
      if (input.clientWidth !== lastWidth) { lastWidth = input.clientWidth; fitHeight(); }
      syncCaret();
      syncScrollbar();
    });
    observer.observe(input);
    document.fonts?.ready.then(() => { if (inputRef.current === input) { fitHeight(); syncCaret(); } });
    return () => observer.disconnect();
  }, [variant, visible, heightLimit, hasActions, masked]);
  useLayoutEffect(() => { setVisible(false); }, [variant, disabled]);
  const Control = multiline ? "textarea" : "input";
  return <div className={`tf-root${multiline ? " tf-multiline" : ""}${password ? " tf-password-root" : ""}${masked ? " tf-masked" : ""}${multiline && !bordered ? " tf-unbordered" : ""}${editing && !disabled ? " tf-editing" : ""}${error ? " tf-error" : ""}${disabled ? " tf-disabled" : ""}`} style={{ width, ...(multiline ? { "--tf-radius": `${radius === 14 ? 14 : 8}px` } : {}) }}>
    {hasLabel && <label className="tf-label" htmlFor={fieldId}>{required && <span className="tf-required" aria-hidden="true">*</span>}{label}</label>}
    <div className="tf-box">
      <div className="tf-field">
        <Control ref={inputRef} id={fieldId} name={name} className="tf-input"
          type={multiline ? undefined : password && !visible ? "password" : "text"}
          rows={multiline ? 1 : undefined} value={currentValue} disabled={disabled} required={required}
          placeholder={placeholder} autoComplete={autoComplete} maxLength={maxLength}
          aria-label={hasLabel ? undefined : ariaLabel || label || placeholder || "输入内容"}
          aria-invalid={error || undefined} aria-describedby={hasHelper ? `${fieldId}-helper` : undefined}
          onChange={event => { if (value === undefined) setInternalValue(event.target.value); onChange?.(event.target.value, event); }}
          onFocus={event => { setEditing(true); onFocus?.(event); }}
          onBlur={event => { setEditing(false); onBlur?.(event); }}
          onSelect={syncCaret} onScroll={() => { syncCaret(); syncScrollbar(); }} onKeyUp={syncCaret} onClick={syncCaret} />
        {masked && <div className="tf-dots-viewport" aria-hidden="true"><span className="tf-dots" ref={dotsRef}>{Array.from({ length: currentValue.length }, (_, index) => <span className="tf-dot" key={index} />)}</span></div>}
        <div ref={mirrorRef} className="tf-mirror" aria-hidden="true"><span ref={beforeRef} /><span ref={markerRef} /></div>
        {editing && !disabled && caret.show && <svg className="tf-caret" width="24" height="24" viewBox="0 0 24 24" style={{ left: caret.left, top: caret.top }} aria-hidden="true"><rect width="1.5" height="24" rx="0.75" fill="currentColor" /></svg>}
      </div>
      {password && <button className="tf-password" type="button" disabled={disabled} aria-label={visible ? "隐藏密码" : "显示密码"} aria-controls={fieldId}
        onMouseDown={event => event.preventDefault()}
        onClick={() => { const input = inputRef.current; const start = input.selectionStart; const end = input.selectionEnd; setVisible(!visible); requestAnimationFrame(() => { input.focus(); input.setSelectionRange(start, end); }); }}>
        <span className={`tf-password-icon ${visible ? "tf-show" : "tf-hide"}`} aria-hidden="true" />
      </button>}
      {multiline && scrollbar.visible && <div className="tf-scrollbar" style={{ bottom: hasActions ? 48 : 8 }} aria-hidden="true">
        <div className="tf-scrollbar-thumb" style={{ height: scrollbar.height, transform: `translateY(${scrollbar.top}px)` }}
          onPointerDown={event => { if (event.button !== 0) return; event.preventDefault(); scrollDragRef.current = { y: event.clientY, scrollTop: inputRef.current.scrollTop }; event.currentTarget.setPointerCapture(event.pointerId); }}
          onPointerMove={moveScrollbar}
          onPointerUp={event => { scrollDragRef.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
          onPointerCancel={() => { scrollDragRef.current = null; }}
          onLostPointerCapture={() => { scrollDragRef.current = null; }} />
      </div>}
      {hasActions && <div className="tf-actions" inert={disabled ? "" : undefined}>{actionBar}</div>}
    </div>
    {hasHelper && <div id={`${fieldId}-helper`} className="tf-helper">{helperText}</div>}
  </div>;
}
