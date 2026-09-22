import { useState, useRef, useLayoutEffect } from "react";
import { Icon } from "../shared/icons.js";
import "./index.css";

/**
 * Input 输入框组件
 * - 两种样式（variant）：outlined 描边 / filled 无描边
 * - 六种状态：默认 default / 激活 active / 输入中 typing / 输入完成 complete / 报错 error / 隐藏 hidden（密码）
 * - 状态可受控（state prop）或自动派生（由 focus + value + error 推导）
 */
export default function Input(props) {
  const {
    variant = "outlined", // "outlined" | "filled"
    width = "432px", // 输入框宽度（默认 432px）
    state: controlledState, // 受控状态，缺省时自动派生
    label,
    required = false, // 是否显示必填星号
    placeholder = "请输入内容",
    type = "text", // "text" | "password" ...
    value: valueProp,
    defaultValue = "",
    error = false, // boolean 或错误文案
    errorText = "Error",
    helperText,
    clearable = false,
    icon = true, // 是否显示尾部图标 / 按钮（键盘提示、关闭、密码切换）
    iconName = "auto", // 自动选择，或指定 keyboard / close / eye / eye-off
    caret = true, // 蓝色光标（输入线条）开关
    disabled = false,
    onChange,
    onFocus,
    onBlur,
  } = props;

  const isControlled = valueProp !== undefined;
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [caretOffset, setCaretOffset] = useState(0);

  const measureRef = useRef(null);

  const currentValue = isControlled ? valueProp : value;
  const hasError = Boolean(error);

  // 未受控时，由焦点 / 内容 / 错误推导状态
  const derivedState = hasError
    ? "error"
    : focused
    ? currentValue
      ? "typing"
      : "active"
    : currentValue
    ? "complete"
    : "default";
  const state = controlledState || derivedState;

  const isPassword = type === "password";
  const inputType = isPassword ? (passwordVisible ? "text" : "password") : type;

  const isDotted = isPassword && !passwordVisible;
  const displayedIcon = iconName === "auto"
    ? isPassword ? (passwordVisible ? "eye-off" : "eye") : state === "default" ? "keyboard" : "close"
    : iconName;
  const showCaret = caret && !disabled && (state === "active" || state === "typing");
  // 光标左偏移：密码隐藏时按圆点宽度（每点 8px + 间距 2px）计算，其余按文字宽度
  const caretLeft = isDotted
    ? Math.max(currentValue.length * 10 - 2, 0)
    : caretOffset;

  // 测量完整文字宽度，使蓝色竖线始终位于输入文字之后
  useLayoutEffect(() => {
    if (measureRef.current) {
      const w = measureRef.current.offsetWidth;
      if (w !== caretOffset) setCaretOffset(w);
    }
  }, [currentValue, caretOffset]);

  const handleChange = (e) => {
    if (!isControlled) setValue(e.target.value);
    if (onChange) onChange(e);
  };
  const handleFocus = (e) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };
  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };
  const handleClear = () => {
    if (!isControlled) setValue("");
    if (onChange) onChange({ target: { value: "" } });
  };

  return (
    <>
      {label && (
        <label className="input-label">
          {required && (
            <span className="input-required" aria-hidden="true">
              *
            </span>
          )}
          {label}
        </label>
      )}

      <div
        className={`input-root input-${variant} input-state-${state}${
          disabled ? " input-disabled" : ""
        }`}
        style={{ width }}
      >
      <div className="input-field">
        <div className="input-caret-wrap">
          <input
            className={`input-control${
              isPassword && !passwordVisible ? " input-control-dotted" : ""
            }`}
            type={inputType}
            value={currentValue}
            placeholder={placeholder}
            disabled={disabled}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {/* 隐藏测量层：宽度 = 完整输入文字宽度 */}
          <span
            ref={measureRef}
            className="input-caret-measure"
            aria-hidden="true"
          >
            {currentValue}
          </span>
          {/* 蓝色竖线：仅 Active / Typing 显示，始终位于文字末尾 */}
          {showCaret && (
            <span
              className="input-caret"
              style={{ left: caretLeft }}
              aria-hidden="true"
            >
              <Icon name="cursor" size={24} />
            </span>
          )}

          {/* 密码点：隐藏时自定义渲染，每个点 8×8px、间距 2px */}
          {isPassword && !passwordVisible && currentValue.length > 0 && (
            <span className="input-dots" aria-hidden="true">
              {Array.from({ length: currentValue.length }).map((_, i) => (
                <span key={i} className="input-dot" />
              ))}
            </span>
          )}
        </div>

        {/* 尾部图标：自动模式随状态变化，也可用 iconName 指定 */}
        {icon && !disabled && displayedIcon === "keyboard" && (
          <Icon name="keyboard" size={32} className="input-hint-icon" />
        )}
        {icon && !disabled && displayedIcon === "close" && (
          <button
            type="button"
            className="input-close"
            onClick={handleClear}
            aria-label="关闭"
            tabIndex={-1}
          >
            <Icon name="close" size={32} />
          </button>
        )}

        {icon && !disabled && (displayedIcon === "eye" || displayedIcon === "eye-off") && (
          isPassword ? (
            <button
              type="button"
              className="input-eye"
              onClick={() => setPasswordVisible((v) => !v)}
              aria-label={passwordVisible ? "隐藏密码" : "显示密码"}
              tabIndex={-1}
            >
              <Icon name={displayedIcon} size={32} />
            </button>
          ) : <Icon name={displayedIcon} size={32} className="input-hint-icon" />
        )}
      </div>

      {hasError ? (
        <div className="input-message input-error-text">{errorText}</div>
      ) : helperText ? (
        <div className="input-message input-helper-text">{helperText}</div>
      ) : null}
      </div>
    </>
  );
}
