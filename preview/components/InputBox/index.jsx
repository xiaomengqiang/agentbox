import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "../../assets/shared/icons.js";
import "./index.css";

/**
 * InputBox 统一承载单行与多行文本输入。
 * mode="single" 保留原有表单输入能力；mode="multiline" 用于提示词和正文编辑。
 */
export default function InputBox({ mode = "single", ...props }) {
  return mode === "multiline" ? <MultilineInput {...props} /> : <SingleLineInput {...props} />;
}

function SingleLineInput({
  bordered = true,
  width = "432px",
  state: controlledState,
  title,
  label,
  required = false,
  showRequired,
  placeholder = "请输入内容",
  type = "text",
  value: valueProp,
  defaultValue = "",
  error = false,
  errorText = "Error",
  helperText,
  icon = true,
  iconName = "auto",
  caret = true,
  disabled = false,
  onChange,
  onFocus,
  onBlur,
}) {
  const isControlled = valueProp !== undefined;
  const fieldTitle = title ?? label;
  const hasRequiredMark = showRequired ?? required;
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [caretOffset, setCaretOffset] = useState(0);
  const measureRef = useRef(null);
  const currentValue = isControlled ? valueProp : value;
  const hasError = Boolean(error);
  const derivedState = hasError ? "error" : focused ? (currentValue ? "typing" : "active") : currentValue ? "complete" : "default";
  const state = controlledState || derivedState;
  const isPassword = type === "password" || state === "hidden";
  const inputType = isPassword ? (passwordVisible ? "text" : "password") : type;
  const isDotted = isPassword && !passwordVisible;
  const displayedIcon = iconName === "auto"
    ? isPassword ? (passwordVisible ? "eye-off" : "eye") : state === "default" ? "keyboard" : "close"
    : iconName;
  const showCaret = caret && !disabled && (state === "active" || state === "typing");
  const caretLeft = isDotted ? Math.max(currentValue.length * 10 - 2, 0) : caretOffset;

  useLayoutEffect(() => {
    const nextOffset = measureRef.current?.offsetWidth || 0;
    if (nextOffset !== caretOffset) setCaretOffset(nextOffset);
  }, [currentValue, caretOffset]);

  function handleChange(event) {
    if (!isControlled) setValue(event.target.value);
    onChange?.(event);
  }

  function handleClear() {
    if (!isControlled) setValue("");
    onChange?.({ target: { value: "" } });
  }

  return (
    <div className="ib-single-shell" style={{ width }}>
      {fieldTitle ? <label className="ib-label">{hasRequiredMark ? <span className="ib-required" aria-hidden="true">*</span> : null}{fieldTitle}</label> : null}
      <div className={`ib-single ib-single--${state}${bordered ? " ib-single--bordered" : " ib-single--unbordered"}${disabled ? " ib-single--disabled" : ""}`}>
        <div className="ib-single__field">
          <div className="ib-single__caret-wrap">
            <input
              className={`ib-single__control${isPassword && !passwordVisible ? " ib-single__control--dotted" : ""}`}
              type={inputType}
              value={currentValue}
              placeholder={placeholder}
              disabled={disabled}
              onChange={handleChange}
              onFocus={(event) => { setFocused(true); onFocus?.(event); }}
              onBlur={(event) => { setFocused(false); onBlur?.(event); }}
            />
            <span ref={measureRef} className="ib-single__measure" aria-hidden="true">{currentValue}</span>
            {showCaret ? <span className="ib-single__caret" style={{ left: caretLeft }} aria-hidden="true"><img className="ib-single__caret-image" src="./assets/uploads/icon/inputbox/inputbox-caret.svg" alt="" /></span> : null}
            {isDotted && currentValue.length > 0 ? <span className="ib-single__dots" aria-hidden="true">{Array.from({ length: currentValue.length }).map((_, index) => <span key={index} className="ib-single__dot" />)}</span> : null}
          </div>
          {icon && !disabled && displayedIcon === "keyboard" ? <Icon name="keyboard" size={32} className="ib-single__hint-icon" /> : null}
          {icon && !disabled && displayedIcon === "close" ? <button type="button" className="ib-single__icon-button" onClick={handleClear} aria-label="清空输入"><Icon src="./assets/uploads/icon/inputbox/inputbox-close.svg" size={16} /></button> : null}
          {icon && !disabled && (displayedIcon === "eye" || displayedIcon === "eye-off") ? isPassword ? <button type="button" className="ib-single__icon-button" onClick={() => setPasswordVisible((visible) => !visible)} aria-label={passwordVisible ? "隐藏密码" : "显示密码"}><Icon name={displayedIcon} size={32} /></button> : <Icon name={displayedIcon} size={32} className="ib-single__hint-icon" /> : null}
        </div>
      </div>
      {hasError ? <div className="ib-message ib-message--error">{typeof error === "string" ? error : errorText}</div> : helperText ? <div className="ib-message">{helperText}</div> : null}
    </div>
  );
}

function MultilineInput({
  width = 514,
  radius = 8,
  showActionBar = true,
  heightMode = "fixed",
  fixedHeight = 140,
  maxAutoHeight = 240,
  shadow = false,
  bordered = true,
  actionBarLayout = "home",
  value,
  defaultValue = "",
  placeholder = "请输入提示词",
  onChange,
  onSubmit,
  maxLength,
  actionBar,
  leftActions,
  rightActions,
  submitIcon,
  label,
  required = false,
  helperText,
  error = false,
  errorText = "Error",
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [scrollbar, setScrollbar] = useState({ visible: false, offset: 0 });
  const textareaRef = useRef(null);
  const isDraggingScrollbarRef = useRef(false);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const resolvedWidth = typeof width === "number" ? `${width}px` : width;
  const resolvedRadius = typeof radius === "number" ? `${radius}px` : radius;
  const hasError = Boolean(error);
  const resolvedActionBarLayout = actionBarLayout === "both" ? "home" : actionBarLayout;
  const defaultLeftActions = resolvedActionBarLayout === "home" || resolvedActionBarLayout === "left"
    ? [<button className="ib-multiline__action" type="button" aria-label="添加内容"><Icon src="./assets/uploads/icon/inputbox/inputbox-action-add.svg" size={16} /></button>]
    : [];
  const defaultRightActions = resolvedActionBarLayout === "home"
    ? [<button className="ib-multiline__action ib-multiline__action--send" type="button" aria-label="提交内容" onClick={() => currentValue.trim() && onSubmit?.(currentValue)}>{submitIcon ?? <Icon src="./assets/uploads/icon/iconstate/icon-dialog-dark.svg" size={32} />}</button>]
    : [];
  const resolvedLeftActions = Array.isArray(leftActions) ? leftActions.slice(0, 3) : defaultLeftActions;
  const resolvedRightActions = Array.isArray(rightActions) ? rightActions.slice(0, 2) : defaultRightActions;

  function renderAction(action, index) {
    if (typeof action === "string") {
      return <button className="ib-multiline__custom-text" type="button" key={index}>{action}</button>;
    }
    return <span className="ib-multiline__action-slot" key={index}>{action}</span>;
  }

  useEffect(() => {
    const field = textareaRef.current;
    if (!field) return;
    field.style.height = "auto";
    if (heightMode === "fixed") {
      const lineHeight = 21;
      const safeSpace = 8;
      const actionHeight = showActionBar ? 40 : 0;
      const availableHeight = Math.max(lineHeight + safeSpace, fixedHeight - 20 - actionHeight);
      const rowsHeight = Math.max(lineHeight, Math.floor((availableHeight - safeSpace) / lineHeight) * lineHeight);
      field.style.paddingBottom = `${Math.max(safeSpace, availableHeight - rowsHeight)}px`;
      field.style.height = `${availableHeight}px`;
      field.style.overflowY = "auto";
    } else {
      field.style.paddingBottom = "8px";
      field.style.height = `${Math.min(field.scrollHeight, maxAutoHeight)}px`;
      field.style.overflowY = field.scrollHeight > maxAutoHeight ? "auto" : "hidden";
    }
    const isOverflowing = field.scrollHeight > field.clientHeight + 1;
    setScrollbar({ visible: isOverflowing, offset: 0 });
  }, [currentValue, fixedHeight, heightMode, maxAutoHeight, showActionBar]);

  function handleChange(event) {
    if (!isControlled) setInternalValue(event.target.value);
    onChange?.(event.target.value, event);
  }

  function handleScroll(event) {
    const field = event.currentTarget;
    if (field.scrollHeight <= field.clientHeight + 1) {
      setScrollbar({ visible: false, offset: 0 });
      return;
    }
    const maxScroll = Math.max(1, field.scrollHeight - field.clientHeight);
    const travel = Math.max(0, field.clientHeight - 80);
    setScrollbar({ visible: field.scrollHeight > field.clientHeight + 1, offset: (field.scrollTop / maxScroll) * travel });
  }

  function moveScrollbar(clientY) {
    const field = textareaRef.current;
    const track = field?.parentElement;
    if (!field || !track) return;
    const trackRect = track.getBoundingClientRect();
    const thumbHeight = 60;
    const travel = Math.max(1, field.clientHeight - thumbHeight);
    const offset = Math.max(0, Math.min(travel, clientY - trackRect.top - thumbHeight / 2));
    const maxScroll = Math.max(1, field.scrollHeight - field.clientHeight);
    field.scrollTop = (offset / travel) * maxScroll;
    setScrollbar({ visible: true, offset });
  }

  function handleScrollbarPointerDown(event) {
    isDraggingScrollbarRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    moveScrollbar(event.clientY);
  }

  function handleScrollbarPointerMove(event) {
    if (isDraggingScrollbarRef.current) moveScrollbar(event.clientY);
  }

  function handleScrollbarPointerUp() {
    isDraggingScrollbarRef.current = false;
  }

  function handleKeyDown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && currentValue.trim()) {
      event.preventDefault();
      onSubmit?.(currentValue);
    }
  }

  return (
    <div className="ib-multiline-shell" style={{ width: resolvedWidth }}>
      {label ? <label className="ib-label">{required ? <span className="ib-required" aria-hidden="true">*</span> : null}{label}</label> : null}
      <div className={`ib-multiline${shadow ? " ib-multiline--shadow" : ""}${bordered ? " ib-multiline--bordered" : ""}${hasError ? " ib-multiline--error" : ""}`} style={{ height: heightMode === "fixed" ? `${fixedHeight}px` : undefined, borderRadius: resolvedRadius }}>
        <div className="ib-multiline__field-wrap">
          <textarea ref={textareaRef} className="ib-multiline__field" value={currentValue} placeholder={placeholder} maxLength={maxLength} aria-label={placeholder} onChange={handleChange} onKeyDown={handleKeyDown} onScroll={handleScroll} />
          {scrollbar.visible ? <img className="ib-multiline__scrollbar" src="./assets/uploads/icon/inputbox/inputbox-scrollbar.svg" style={{ transform: `translateY(${scrollbar.offset}px)` }} alt="" onPointerDown={handleScrollbarPointerDown} onPointerMove={handleScrollbarPointerMove} onPointerUp={handleScrollbarPointerUp} onPointerCancel={handleScrollbarPointerUp} /> : null}
        </div>
        {showActionBar ? <div className={`ib-multiline__action-bar ib-multiline__action-bar--${resolvedActionBarLayout}`}>{actionBar || <><div className="ib-multiline__actions ib-multiline__actions--left">{resolvedLeftActions.map(renderAction)}</div><div className="ib-multiline__actions ib-multiline__actions--right">{resolvedRightActions.map(renderAction)}</div></>}</div> : null}
      </div>
      {hasError ? <div className="ib-message ib-message--error">{typeof error === "string" ? error : errorText}</div> : helperText ? <div className="ib-message">{helperText}</div> : null}
    </div>
  );
}
