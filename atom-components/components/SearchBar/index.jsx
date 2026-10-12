import React from "react";
import { useRef, useState } from "react";
import "./index.css";

export default function SearchBar(props) {
  const size = props.size || "medium";
  const variant = props.variant || "filled";
  const placeholder = props.placeholder ?? "请输入搜索内容";
  const disabled = !!props.disabled;
  const clearable = props.clearable ?? true;
  const iconSize = 16;
  const inputRef = useRef(null);
  const composingRef = useRef(false);

  // 受控（传入 value）/ 非受控（defaultValue）两用
  const isControlled = props.value != null;
  const [innerValue, setInnerValue] = useState(props.defaultValue || "");
  const value = isControlled ? props.value : innerValue;
  const isEmpty = value.length === 0;

  // 聚焦状态与浏览器原生光标同步。
  const [focused, setFocused] = useState(false);

  const handleChange = (event) => {
    const next = event.target.value;
    if (!isControlled) setInnerValue(next);
    if (props.onChange) props.onChange(next);
  };

  // 回车触发搜索回调
  const handleKeyDown = (event) => {
    if (composingRef.current || event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.key === "Enter" && props.onSearch) {
      event.preventDefault();
      props.onSearch(event.currentTarget.value);
    }
  };

  // 清空按钮：有文字时出现，点击清空（受控场景同步回调 onChange("")）
  const handleClear = () => {
    if (!isControlled) setInnerValue("");
    if (props.onChange) props.onChange("");
    if (props.onClear) props.onClear();
    inputRef.current?.focus();
  };

  const className = [
    "sb-root",
    `sb-${size}`,
    `sb-${variant}`,
    focused ? "sb-editing" : "",
    disabled ? "sb-disabled" : "",
    props.className || "",
  ]
    .join(" ")
    .trim();

  const clearButton =
    clearable && !disabled && !isEmpty ? (
      <button className="sb-clear" type="button" onClick={handleClear} aria-label="清空">
        <span className="sb-asset-icon sb-close-icon" style={{ width: iconSize, height: iconSize }} aria-hidden="true" />
      </button>
    ) : null;

  return (
    <div id={props.id} className={className} style={props.style}
      onClick={event => {
        if (!disabled && !event.target.closest("button")) inputRef.current?.focus();
      }}>
      <span className="sb-asset-icon sb-icon" style={{ width: iconSize, height: iconSize }} aria-hidden="true" />

      <span className="sb-field">
        <input
          className="sb-input"
          ref={inputRef}
          type="search"
          enterKeyHint="search"
          aria-label="搜索"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => { composingRef.current = true; }}
          onCompositionEnd={() => { composingRef.current = false; }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </span>

      {clearButton}
    </div>
  );
}
