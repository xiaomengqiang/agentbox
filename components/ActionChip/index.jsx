import { Icon } from "../../assets/shared/icons.js";
import "./index.css";

/**
 * ActionChip — 操作块（Chips）
 * 图标 + 文字形式，仅一个默认状态：
 * 图标 14×14，文字 12px / 行高 20px，图文间距 4px，
 * 固定高度 24px，左右边距 8px，底色 Light/Brand10（#0A59F7 10%），
 * 图标与文字取 Light/icon_emphasize（#0A59F7）。
 *
 * 宽度为变量：默认 auto（内容撑开），可通过 width 属性指定固定宽度；
 * 宽度不足时文字自动省略号截断。
 */
export default function ActionChip(props) {
  const label = props.label;
  const icon = props.icon;
  const onClick = props.onClick;
  const width = props.width;
  const className = props.className || "";

  // width: number → px；string → 原样（如 "100%"、"12rem"）
  const style =
    width == null
      ? undefined
      : { "--ac-chip-width": typeof width === "number" ? width + "px" : width };

  return (
    <button
      type="button"
      className={"ac-chip" + (className ? " " + className : "")}
      style={style}
      onClick={onClick}
    >
      {icon ? <Icon name={icon} size={14} className="ac-chip-icon" /> : null}
      <span className="ac-chip-label">{label}</span>
    </button>
  );
}
