import React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import "./index.css";

export default function SearchBar(props) {
  const size = props.size || "large";
  const isLarge = size === "large";
  const placeholder = props.placeholder || "请输入搜索内容";
  const disabled = !!props.disabled;
  // 关闭图标只有大号有；小号不显示（需要时可显式传 clearable）
  const clearable = props.clearable != null ? props.clearable : isLarge;
  const fontSize = /^--font-size-(xs|sm|base|md|lg|xl|2xl|3xl|4xl|5xl|6xl)$/.test(props.fontSize)
    ? props.fontSize : (isLarge ? "--font-size-base" : "--font-size-sm");
  const iconSize = 16;
  const caretHeight = isLarge ? 24 : 18;

  // 受控（传入 value）/ 非受控（defaultValue）两用
  const isControlled = props.value != null;
  const [innerValue, setInnerValue] = useState(props.defaultValue || "");
  const value = isControlled ? props.value : innerValue;
  const isEmpty = value.length === 0;

  // 聚焦仅控制输入光标，不增加 focus 外观。
  const [focused, setFocused] = useState(false);

  // 自绘光标：始终由组件绘制（原生光标不可控宽高），位置跟随插入点
  const fieldRef = useRef(null);
  const inputRef = useRef(null);
  const measureRef = useRef(null);
  const [caretLeft, setCaretLeft] = useState(-1.5);

  // 用等宽度的隐藏节点量出「插入点之前的文字宽度」，得到光标 left
  const syncCaret = () => {
    const field = fieldRef.current;
    const input = inputRef.current;
    const measure = measureRef.current;
    if (!field || !input || !measure) return;
    const at = input.selectionStart == null ? input.value.length : input.selectionStart;
    measure.textContent = input.value.slice(0, at);
    // 右缘对齐到设备像素网格：1.5px 若不落在整像素上，会被抗锯齿摊成「1px 实心 + 半透明虚边」，视觉上比 1.5px 细
    const dpr = window.devicePixelRatio || 1;
    const right = Math.round(measure.getBoundingClientRect().width * dpr) / dpr;
    // 无前导文字（空内容或插入点在开头）→ 紧贴文字起点；否则与前文留 0.5px 间距，且不超出输入区
    const max = Math.max(0, field.clientWidth - 1.5);
    setCaretLeft(right <= 0 ? -1.5 : Math.min(right + 0.5, max));
  };

  useLayoutEffect(() => {
    if (focused) syncCaret();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused, value, size, placeholder, fontSize]);

  const handleChange = (event) => {
    const next = event.target.value;
    if (!isControlled) setInnerValue(next);
    if (props.onChange) props.onChange(next);
  };

  // 回车触发搜索回调
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && props.onSearch) props.onSearch(value);
  };

  // 关闭（Small cancel）：有文字时出现，点击清空（受控场景同步回调 onChange("")）
  const handleClear = () => {
    if (!isControlled) setInnerValue("");
    if (props.onChange) props.onChange("");
    if (props.onClear) props.onClear();
  };

  const className = [
    "sb-root",
    isLarge ? "sb-large" : "sb-small",
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
    <label className={className} style={{ ...props.style, fontSize: `var(${fontSize})` }}>
      <span className="sb-asset-icon sb-icon" style={{ width: iconSize, height: iconSize }} aria-hidden="true" />

      <span className="sb-field" ref={fieldRef}>
        {/* 整数 SVG 视口保留 1.5px 光标圆角。 */}
        <svg
          className="sb-caret"
          style={{ left: caretLeft }}
          width="24"
          height={caretHeight}
          viewBox={`0 0 24 ${caretHeight}`}
          aria-hidden="true"
        >
          <rect width="1.5" height={caretHeight} rx="0.75" fill="currentColor" />
        </svg>
        {/* 隐藏量尺：与输入框同字体，用于测量插入点之前的文字宽度 */}
        <span className="sb-measure" ref={measureRef} aria-hidden="true" />
        <input
          className="sb-input"
          ref={inputRef}
          type="text"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onSelect={syncCaret}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </span>

      {clearButton}
    </label>
  );
}
