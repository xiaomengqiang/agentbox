import React, { useId, useLayoutEffect, useRef, useState } from "react";
import "./index.css";

export default function TextFields({
  variant = "single", width = 432, disabled = false, label = "", required = false,
  helperText = "", error = false, placeholder = "请输入内容", value, defaultValue = "",
  radius = "--radius-container", minHeight = 140, maxHeight = 140,
  onChange, onFocus, onBlur, maxLength, className = "", style,
}) {
  const generatedId = useId();
  const fieldId = generatedId;
  const multiline = variant === "multiline";
  const password = variant === "password";
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [editing, setEditing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [scrollbar, setScrollbar] = useState({ visible: false, height: 0, top: 0 });
  const scrollDragRef = useRef(null);
  const inputRef = useRef(null);
  const boxRef = useRef(null);
  const dotsRef = useRef(null);
  const fieldRef = useRef(null);
  const measureRef = useRef(null);
  const manualHeightRef = useRef(null);
  const fittedHeightRef = useRef(null);
  const currentValue = value !== undefined ? value : internalValue;
  const masked = password && !visible && currentValue.length > 0;
  const hasLabel = Boolean(label);
  const hasHelper = Boolean(helperText);
  const inputLimit = Number.isInteger(maxLength) && maxLength >= 0 ? maxLength : undefined;
  const hasCounter = multiline && inputLimit !== undefined;
  const radiusToken = typeof radius === "string" && /^--[a-zA-Z][a-zA-Z0-9_-]*$/.test(radius) ? radius : "--radius-container";
  const heightMinimum = Math.max(38, Number.isFinite(minHeight) ? minHeight : 140);
  const heightLimit = Math.max(heightMinimum, Number.isFinite(maxHeight) ? maxHeight : 140);

  function syncOverflow() {
    const input = inputRef.current;
    const field = fieldRef.current;
    if (!input || !field) return;
    const vertical = input.tagName === "TEXTAREA";
    let extent = vertical ? input.scrollHeight : Math.max(input.scrollWidth, dotsRef.current?.scrollWidth || 0);
    if (!vertical && !input.value && input.placeholder) {
      const context = measureRef.current || (measureRef.current = document.createElement("canvas").getContext("2d"));
      if (context) {
        context.font = getComputedStyle(input).font;
        extent = Math.max(extent, context.measureText(input.placeholder).width);
      }
    }
    const viewport = vertical ? input.clientHeight : input.clientWidth;
    const range = Math.max(0, extent - viewport);
    const offset = Math.max(0, Math.min(range, vertical ? input.scrollTop : input.scrollLeft));
    field.style.setProperty("--tf-fade-start", offset > 1 ? "var(--spacing-3)" : "0px");
    field.style.setProperty("--tf-fade-end", range - offset > 1 ? "var(--spacing-3)" : "0px");
  }
  function syncPasswordScroll() {
    if (dotsRef.current && inputRef.current) dotsRef.current.style.transform = `translateX(${-inputRef.current.scrollLeft}px)`;
  }
  useLayoutEffect(() => { syncPasswordScroll(); syncOverflow(); }, [currentValue, visible, width, placeholder, variant]);

  function syncScrollbar() {
    syncOverflow();
    const input = inputRef.current;
    if (!input || !multiline) return;
    const viewport = input.clientHeight;
    const range = Math.max(0, input.scrollHeight - viewport);
    const track = Math.max(0, viewport - 24); // 8px top + 16px bottom clearance.
    const height = Math.min(track, Math.max(24, track * viewport / input.scrollHeight));
    const top = range ? (Math.max(0, Math.min(range, input.scrollTop)) / range) * (track - height) : 0;
    setScrollbar(previous => previous.visible === (range > 1) && previous.height === height && previous.top === top
      ? previous : { visible: range > 1, height, top });
  }
  function moveScrollbar(event) {
    const drag = scrollDragRef.current;
    const input = inputRef.current;
    if (!drag || !input) return;
    const travel = Math.max(0, input.clientHeight - 24) - scrollbar.height;
    if (travel > 0) input.scrollTop = drag.scrollTop + (event.clientY - drag.y) * (input.scrollHeight - input.clientHeight) / travel;
    syncScrollbar();
  }
  function fitHeight() {
    const input = inputRef.current;
    if (!multiline) {
      if (boxRef.current) boxRef.current.style.height = "";
      manualHeightRef.current = null;
      fittedHeightRef.current = null;
      return;
    }
    if (!input) return;
    const scrollTop = input.scrollTop;
    input.style.height = "0px";
    const naturalHeight = input.scrollHeight;
    const nextHeight = Math.min(heightLimit, Math.max(heightMinimum, manualHeightRef.current ?? naturalHeight));
    fittedHeightRef.current = nextHeight;
    boxRef.current.style.height = `${nextHeight}px`;
    input.style.height = "100%";
    input.style.overflowY = "auto";
    input.scrollTop = scrollTop;
    syncScrollbar();
  }

  useLayoutEffect(() => { fitHeight(); }, [currentValue, variant, width, heightLimit, heightMinimum, placeholder]);
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    let lastWidth = input.clientWidth;
    const observer = new ResizeObserver(() => {
      if (input.clientWidth !== lastWidth) { lastWidth = input.clientWidth; fitHeight(); }
      syncScrollbar();
    });
    observer.observe(input);
    const box = boxRef.current;
    const boxObserver = new ResizeObserver(() => {
      if (!multiline || !box || box.clientHeight === fittedHeightRef.current) return;
      manualHeightRef.current = box.clientHeight;
      fittedHeightRef.current = box.clientHeight;
      syncScrollbar();
    });
    if (multiline && box) boxObserver.observe(box);
    document.fonts?.ready.then(() => { if (inputRef.current === input) { fitHeight(); syncOverflow(); } });
    return () => { observer.disconnect(); boxObserver.disconnect(); };
  }, [variant, visible, heightLimit, heightMinimum]);
  useLayoutEffect(() => { setVisible(false); }, [variant, disabled]);
  const Control = multiline ? "textarea" : "input";
  return <div className={`tf-root${multiline ? " tf-multiline" : ""}${password ? " tf-password-root" : ""}${masked ? " tf-masked" : ""}${editing && !disabled ? " tf-editing" : ""}${error ? " tf-error" : ""}${disabled ? " tf-disabled" : ""} ${className}`} style={{ width, ...(multiline ? { "--tf-radius": `var(${radiusToken}, var(--radius-container))` } : {}), ...style }}>
    {hasLabel && <label className="tf-label" htmlFor={fieldId}>{label}{required && <span className="tf-required" aria-hidden="true">*</span>}</label>}
    <div ref={boxRef} className="tf-box" style={multiline ? { minHeight: heightMinimum, maxHeight: heightLimit } : undefined}>
      <div ref={fieldRef} className="tf-field">
        <Control ref={inputRef} id={fieldId} className="tf-input"
          type={multiline ? undefined : password && !visible ? "password" : "text"}
          rows={multiline ? 1 : undefined} value={currentValue} disabled={disabled} required={required}
          placeholder={placeholder} maxLength={inputLimit}
          aria-label={hasLabel ? undefined : label || placeholder || "输入内容"}
          aria-invalid={error || undefined} aria-describedby={[hasHelper && `${fieldId}-helper`, hasCounter && `${fieldId}-counter`].filter(Boolean).join(" ") || undefined}
          onChange={event => { if (value === undefined) setInternalValue(event.target.value); onChange?.(event.target.value, event); }}
          onFocus={event => { setEditing(true); onFocus?.(event); }}
          onBlur={event => { setEditing(false); onBlur?.(event); }}
          onScroll={() => { syncScrollbar(); syncPasswordScroll(); }} />
        {masked && <div className="tf-dots-viewport" aria-hidden="true"><span ref={dotsRef} className="tf-dots">{Array.from({ length: currentValue.length }, (_, index) => <span className="tf-dot" key={index} />)}</span></div>}
      </div>
      {password && <button className="tf-password" type="button" disabled={disabled} aria-label={visible ? "隐藏密码" : "显示密码"} aria-controls={fieldId}
        onMouseDown={event => event.preventDefault()}
        onClick={() => { const input = inputRef.current; const start = input.selectionStart; const end = input.selectionEnd; setVisible(!visible); requestAnimationFrame(() => { input.focus(); input.setSelectionRange(start, end); }); }}>
        <span className={`tf-password-icon ${visible ? "tf-show" : "tf-hide"}`} aria-hidden="true" />
      </button>}
      {multiline && scrollbar.visible && <div className="tf-scrollbar" aria-hidden="true">
        <div className="tf-scrollbar-thumb" style={{ height: scrollbar.height, transform: `translateY(${scrollbar.top}px)` }}
          onPointerDown={event => { if (event.button !== 0) return; event.preventDefault(); scrollDragRef.current = { y: event.clientY, scrollTop: inputRef.current.scrollTop }; event.currentTarget.setPointerCapture(event.pointerId); }}
          onPointerMove={moveScrollbar}
          onPointerUp={event => { scrollDragRef.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
          onPointerCancel={() => { scrollDragRef.current = null; }}
          onLostPointerCapture={() => { scrollDragRef.current = null; }} />
      </div>}
    </div>
    {(hasHelper || hasCounter) && <div className="tf-support">
      {hasHelper && <div id={`${fieldId}-helper`} className="tf-helper">{helperText}</div>}
      {hasCounter && <div id={`${fieldId}-counter`} className={`tf-counter${currentValue.length > inputLimit ? " tf-counter-over" : ""}`}>{currentValue.length}/{inputLimit}</div>}
    </div>}
  </div>;
}
