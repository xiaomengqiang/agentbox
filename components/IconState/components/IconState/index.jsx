import { Icon } from "../../assets/shared/icons.js";
import "./index.css";

// 内置图标变量：icon prop 可选值 → 对应 SVG 资源。
// 新增图标时，只需在此处追加一行映射即可。
const ICON_SRC = {
  // 栏目 icon（方形框）
  search: "./assets/uploads/icon-search.svg",
  menu: "./assets/uploads/icon-menu.svg",
  columns: "./assets/uploads/icon-columns.svg",
  fullscreen: "./assets/uploads/icon-fullscreen.svg",
  sidebar: "./assets/uploads/icon-sidebar.svg",
  // 对话框 icon 使用透明背景的 glyph，框颜色由 frameColor 控制。
  "dialog-glyph": "./assets/uploads/icon-dialog-glyph.svg",
  "dialog-pause": "./assets/uploads/icon-dialog-pause.svg",
  "dialog-add": "./assets/uploads/icon-dialog-add.svg",
  "dialog-add-active": "./assets/uploads/icon-dialog-add-active.svg",
};
const DIALOG_ICON_NAMES = new Set(["dialog-glyph", "dialog-pause", "dialog-add"]);

// 圆形框预设颜色
const FRAME_COLORS = {
  black: "var(--black)",
  gray: "transparent",
};

// 图标状态组件：默认 / 悬浮 / 激活 / 禁用 四种状态。
// variant 控制外形：square（方形框，默认）/ circle（圆形框）。
export default function IconState({
  size = 32,
  iconSize,
  icon,
  src,
  variant = "square",
  frameColor,
  iconColor,
  disabled = false,
  active = false,
  state,
  onClick,
  ariaLabel = "icon",
}) {
  // 对话框只支持发送、暂停和加号；栏目 icon 支持内置图标和自定义 SVG。
  const isCircle = variant === "circle";
  const isCustomSource = !isCircle && Boolean(src);
  const selectedIcon = isCircle
    ? (DIALOG_ICON_NAMES.has(icon) ? icon : "dialog-glyph")
    : icon || "search";
  const baseIconSrc = (!isCircle && src) || ICON_SRC[selectedIcon] || ICON_SRC.search;

  // 视觉状态优先级：显式 state > disabled/active 布尔 > default
  const visualState =
    state || (disabled ? "disabled" : active ? "active" : "default");
  const isDisabled = visualState === "disabled";
  const isActiveAdd = isCircle && selectedIcon === "dialog-add" && visualState === "active";
  const iconSrc = isActiveAdd ? ICON_SRC["dialog-add-active"] : baseIconSrc;
  const renderedIconSize = iconSize ?? (isCircle ? (isActiveAdd ? 23 : 32) : 20);

  // gray 默认透明；black 为纯黑；也支持任意 CSS 色值（如 "#0A59F7"）。
  const selectedFrameColor = frameColor || "gray";
  const bgColor = isCircle ? FRAME_COLORS[selectedFrameColor] || selectedFrameColor : undefined;
  const foreground = iconColor || (selectedFrameColor === "gray" ? "var(--color-icon-primary)" : "var(--on-primary)");

  return (
    <button
      type="button"
      className={`is-btn is-btn--${variant} is-btn--${visualState}${state ? " is-btn--forced" : ""}${isCircle ? ` is-btn--frame-${selectedFrameColor === "gray" || selectedFrameColor === "black" ? selectedFrameColor : "custom"}` : ""}${isCircle && selectedFrameColor !== "gray" ? " is-btn--frame-dark" : ""}`}
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
      }}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
    >
      {isCircle ? (
        <span
          className="is-icon is-icon--mask"
          style={{
            width: renderedIconSize,
            height: renderedIconSize,
            color: foreground,
            WebkitMaskImage: `url("${iconSrc}")`,
            maskImage: `url("${iconSrc}")`,
          }}
          aria-hidden="true"
        />
      ) : isCustomSource ? (
        <Icon src={iconSrc} size={renderedIconSize} className="is-icon" />
      ) : (
        <span
          className="is-icon is-icon--mask"
          style={{
            width: renderedIconSize,
            height: renderedIconSize,
            color: "var(--color-icon-primary)",
            WebkitMaskImage: `url("${iconSrc}")`,
            maskImage: `url("${iconSrc}")`,
          }}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
