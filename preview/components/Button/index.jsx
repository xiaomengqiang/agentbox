import React from "react";
import {
  resolveShape,
  resolveSize,
  resolveVariant,
} from "./presets.js";
import "./index.css";

/** Button：variant、size、shape 为独立属性；只接受 presets.js 中的规范值。 */
export default function Button(props) {
  const variant = resolveVariant(props.variant);
  const size = resolveSize(props.size);
  const shape = resolveShape(props.shape);
  const iconSrc = props.icon;
  const hasIcon = Boolean(iconSrc);
  const hasLabel = React.Children.toArray(props.children).some(
    child => typeof child === "string" ? child.trim().length > 0 : true
  );
  // 纯图标操作使用 IconButton；缺少文案时不渲染 Button。
  if (!hasLabel) return null;
  const extraClass = props.className ? ` ${props.className}` : "";

  // 图标尺寸由尺寸契约决定（20px / 16px），颜色跟随文字 currentColor
  const iconNode = hasIcon ? (
    <span
      aria-hidden="true"
      className="btn__icon"
      style={{ maskImage: `url("${iconSrc}")`, WebkitMaskImage: `url("${iconSrc}")` }}
    />
  ) : null;

  return (
    <button
      id={props.id}
      style={props.style}
      type={props.type || "button"}
      className={`btn btn--${variant} btn--${size} btn--${shape}${extraClass}`}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {iconNode}
      <span className="btn__label">{props.children}</span>
    </button>
  );
}
