import { useState, useRef, useLayoutEffect } from "react";
import { Icon } from "../../assets/shared/icons.js";
import "./index.css";

/**
 * Input 输入框组件
 * - 两种样式（variant）：outlined 描边 / filled 无描边
 * - 六种状态：默认 default / 激活 active / 输入中 typing / 输入完成 complete / 报错 error / 隐藏 hidden（密码）
 * - 状态可受控（state prop）或自动派生（由 focus + value + error 推导）
 */
export default function InputBox(props) {
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
    disabled = false,
    onChange,
    onFocus,
    onBlur,
  } = props;

  const isControlled = valueProp !== undefined;
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [caretPos, setCaretPos] = useState(() =>
    isControlled ? (valueProp || "").length : (defaultValue || "").length
  );
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
  const showCaret = !disabled;
  // 光标左偏移：密码隐藏时按圆点宽度（每点 8px + 间距 2px）计算，其余按文字宽度
  const caretLeft = isDotted
    ? Math.max(currentValue.length * 10 - 2, 0)
    : caretOffset;

  // 测量光标位置：用与输入框同字体的隐藏 span 量出“光标前的文字”宽度
  useLayoutEffect(() => {
    if (measureRef.current) {
      const w = measureRef.current.offsetWidth;
      if (w !== caretOffset) setCaretOffset(w);
    }
  }, [currentValue, caretPos, caretOffset]);

  const syncCaret = (e) => {
    const pos = e?.target?.selectionStart;
    if (typeof pos === "number") setCaretPos(pos);
  };

  const handleChange = (e) => {
    if (!isControlled) setValue(e.target.value);
    syncCaret(e);
    if (onChange) onChange(e);
  };
  const handleFocus = (e) => {
    setFocused(true);
    syncCaret(e);
    if (onFocus) onFocus(e);
  };
  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };
  const handleClear = () => {
    if (!isControlled) setValue("");
    setCaretPos(0);
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
            onSelect={syncCaret}
            onKeyUp={syncCaret}
            onClick={syncCaret}
          />
          {/* 隐藏测量层：宽度 = 光标前文字宽度 */}
          <span
            ref={measureRef}
            className="input-caret-measure"
            aria-hidden="true"
          >
            {currentValue.slice(0, caretPos)}
          </span>
          {/* 蓝色光标：所有状态均显示，随文字（或密码点）移动 */}
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

        {/* 默认状态：输入提示图标 */}
        {icon && state === "default" && !isPassword && !disabled && (
          <Icon name="keyboard" size={32} className="input-hint-icon" />
        )}

        {/* 非默认状态：统一关闭按钮 */}
        {icon && state !== "default" && !isPassword && !disabled && (
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

        {/* 密码可见性切换（隐藏 / 显示） */}
        {icon && isPassword && (
          <button
            type="button"
            className="input-eye"
            onClick={() => setPasswordVisible((v) => !v)}
            aria-label={passwordVisible ? "隐藏密码" : "显示密码"}
            tabIndex={-1}
          >
            <Icon name={passwordVisible ? "eye-off" : "eye"} size={32} />
          </button>
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
