import React from "react";
import { useState } from "react";
import "./index.css";

/**
 * Toggle 开关（36 × 20）
 * 支持 选中 / 未选中 × 可用 / 禁用 四态，受控与非受控两种用法。
 * 颜色：开态轨道 = Light/Brand(#0A59F7)，关态轨道 = comp_background_secondary(黑 10%)，
 * 圆形滑块 = comp_background_primary_contrary(白色)，关态滑块带 comp_background_tertiary 1px 外描边。
 */
export default function Toggle(props) {
  const disabled = !!props.disabled;
  const label = props.label;
  // checked 传入即为受控；否则由内部 state 维护
  const controlled = props.checked !== undefined && props.checked !== null;
  const [innerChecked, setInnerChecked] = useState(!!props.defaultChecked);
  const checked = controlled ? !!props.checked : innerChecked;

  const handleToggle = (event) => {
    if (disabled) return;
    const next = !checked;
    if (!controlled) setInnerChecked(next);
    if (props.onChange) props.onChange(next, event);
  };

  const rootClass = "tg-root" + (disabled ? " tg-root-disabled" : "") + (props.className ? " " + props.className : "");

  return (
    // label 包裹 button：点击文字同样可切换，且文字自动成为开关的可访问名称
    <label className={rootClass}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={"tg-switch " + (checked ? "tg-switch-on" : "tg-switch-off")}
        onClick={handleToggle}
      >
        <span className="tg-knob" />
      </button>
      {label ? <span className="tg-label">{label}</span> : null}
    </label>
  );
}
