import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SearchIcon, CloseIcon } from "./icons.jsx";
import "./index.css";

/**
 * 键盘聚焦模式：只有 Tab 键盘聚焦才显示蓝色描边，
 * 鼠标点击进入的「激活」「输入中」不显示（对齐 ArkUI focusOnTouch=false 的默认行为）。
 * 用模块级共享状态，避免每个实例各挂一份全局监听。
 */
let keyboardMode = false;
let keyboardListenerReady = false;
const keyboardModeSubscribers = new Set();

const setKeyboardMode = (next) => {
  if (keyboardMode === next) return;
  keyboardMode = next;
  keyboardModeSubscribers.forEach((fn) => fn(next));
};

// 惰性注册全局监听（首次挂载时），避免模块引入时产生副作用
const ensureKeyboardListener = () => {
  if (keyboardListenerReady) return;
  if (typeof document === "undefined" || !document.addEventListener) return;
  keyboardListenerReady = true;
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Tab") setKeyboardMode(true);
    },
    true
  );
  document.addEventListener("mousedown", () => setKeyboardMode(false), true);
};

/**
 * SearchBar 搜索框
 * large：填充式大号（16px，上下 9px / 左右 12px，圆角 24px），底色 comp_background_tertiary
 * small：无填充小号（12px / 行高 16px，圆角 6px）
 * 结构：可选关闭按钮 + 搜索图标 + 输入区（占位文字「请输入搜索内容」/ 自绘光标）
 */
export default function SearchBar(props) {
  const size = props.size || "large";
  const isLarge = size === "large";
  const placeholder = props.placeholder || "请输入搜索内容";
  const disabled = !!props.disabled;
  // 关闭图标只有大号有；小号不显示（需要时可显式传 clearable）
  const clearable = props.clearable != null ? props.clearable : isLarge;
  const clearPosition = props.clearPosition || "right";
  // 图标两种尺寸都用 16px（与大号一致）
  const iconSize = 16;

  // 受控（传入 value）/ 非受控（defaultValue）两用
  const isControlled = props.value != null;
  const [innerValue, setInnerValue] = useState(props.defaultValue || "");
  const value = isControlled ? props.value : innerValue;
  const isEmpty = value.length === 0;

  // 聚焦中 + 键盘聚焦 → 显示蓝色描边（focus 态）
  const [focused, setFocused] = useState(false);
  const [byKeyboard, setByKeyboard] = useState(keyboardMode);

  // 自绘光标：始终由组件绘制（原生光标不可控宽高），位置跟随插入点
  const fieldRef = useRef(null);
  const inputRef = useRef(null);
  const measureRef = useRef(null);
  const [caretLeft, setCaretLeft] = useState(-1.5);

  useEffect(() => {
    ensureKeyboardListener();
    keyboardModeSubscribers.add(setByKeyboard);
    return () => {
      keyboardModeSubscribers.delete(setByKeyboard);
    };
  }, []);

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
    // 无前导文字（空内容或插入点在开头）→ 紧贴文字起点；否则紧贴插入点，且不超出输入区
    const max = Math.max(0, field.clientWidth - 1.5);
    setCaretLeft(right <= 0 ? -1.5 : Math.min(right - 1.5, max));
  };

  useLayoutEffect(() => {
    if (focused) syncCaret();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused, value, size, placeholder]);

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
    isLarge && focused && byKeyboard ? "sb-focus-ring" : "",
    disabled ? "sb-disabled" : "",
    props.className || "",
  ]
    .join(" ")
    .trim();

  const clearButton =
    clearable && !disabled && !isEmpty ? (
      <button className="sb-clear" type="button" onClick={handleClear} aria-label="清空">
        <CloseIcon size={iconSize} />
      </button>
    ) : null;

  return (
    <label className={className} style={props.style}>
      {clearPosition === "left" ? clearButton : null}

      <SearchIcon size={iconSize} className="sb-icon" />

      <span className="sb-field" ref={fieldRef}>
        {/* 自绘光标 1.5×24，圆角 rx=0.75：用 SVG 绘制，CSS 背景 + border-radius 会被像素对齐成 2px 直角。
            SVG 根元素必须取整数尺寸（24×24），几何放内部用小数坐标。根元素尺寸为小数时 Chromium 会把视口吸附到整像素，
            1.5px 细条的圆角会被吃掉变直角。激活（空内容）贴在文字起点，输入中跟在插入点之后 */}
        <svg
          className="sb-caret"
          style={{ left: caretLeft }}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <rect width="1.5" height="24" rx="0.75" fill="currentColor" />
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

      {clearPosition === "right" ? clearButton : null}
    </label>
  );
}
