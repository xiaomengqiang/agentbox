import React from "react";
import { Icon } from "../../../assets/shared/icons.js";
import {
  BUTTON_SIZE_TOKENS,
  resolveShape,
  resolveSize,
  resolveVariant,
} from "./presets.js";
import "./index.css";

/**
 * Button · Material 3 命名规范
 * ---------------------------------------------------------------------------
 * 三个正交轴，任意组合：
 *   variant "filled" | "tonal" | "outlined" | "text"   （别名 primary / secondary / tertiary / plain）
 *   size    "large" (40px) | "small" (28px)
 *   shape   "round" (跑道圆，默认) | "square" (方圆角)
 *
 * 形状是独立轴，不并入变体名：variant 表达「强调层级」，shape 表达「几何」。
 * 若把形状写进变体（filled-round…），变体数会随形状数相乘膨胀，别名映射也会失效。
 *
 * 所有视觉状态（default / hover / focus / pressed / disabled）都由 CSS 驱动，
 * 组件本身不维护 state，因此在任何业务里都是零成本可复用单元。
 *
 * data-state="hover" | "focus" | "pressed" 可强制静态呈现某个状态，
 * 仅供文档 / 走查 / 截图使用，业务代码不要传。
 */
export default function Button(props) {
  const variant = resolveVariant(props.variant);
  const size = resolveSize(props.size);
  const shape = resolveShape(props.shape);
  const sizeToken = BUTTON_SIZE_TOKENS[size];
  const iconPosition = props.iconPosition === "end" ? "end" : "start";
  const hasIcon = Boolean(props.icon || props.iconSrc);
  const hasLabel = props.children != null && props.children !== "";
  const extraClass = props.className ? ` ${props.className}` : "";

  // 图标尺寸由尺寸契约决定（20px / 16px），颜色跟随文字 currentColor
  const iconNode = hasIcon ? (
    <Icon
      name={props.icon}
      src={props.iconSrc}
      size={sizeToken.iconSize}
      className="btn__icon"
    />
  ) : null;

  return (
    <button
      type={props.type || "button"}
      className={`btn btn--${variant} btn--${size} btn--${shape}${extraClass}`}
      disabled={props.disabled}
      data-state={props["data-state"]}
      onClick={props.onClick}
    >
      {iconPosition === "start" ? iconNode : null}
      {hasLabel ? <span className="btn__label">{props.children}</span> : null}
      {iconPosition === "end" ? iconNode : null}
    </button>
  );
}
