import { useState } from "react";
import { Icon } from "../../assets/shared/icons.js";
import "./index.css";

// 变体 → class 映射（未知变体回退到 diff-add，避免生成空 class）
const VARIANT_CLASS = {
  "diff-add": "tag--diff-add",
  "diff-remove": "tag--diff-remove",
  "icon": "tag--icon",
  "tab": "tag--tab",
};

const DEFAULT_ICON_SIZE = { icon: 14, tab: 16 };

// 增删数值格式化：补正负号 + 千分位（"1280" -> "+1,280"，已带号则不重复补）
function formatDiffValue(value, sign) {
  const text = String(value);
  const signed = /^[+-]/.test(text) ? text : sign + text;
  return signed.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Tag —— 标签原子组件，覆盖三种形态：
 * 1. diff-add / diff-remove：代码增删的绿 / 红标签，12px 文字，行高 18px，左右内边距 4px、上下 0（标签高 18px）
 * 2. icon：图标 + 文字标签，14px 图标 + 12px 文字，container5 底色，8/4 内边距，4px 圆角
 * 3. tab：可选中圆角标签，16px 图标 + 16px 文字（行高 20px），元素间距 6px，16/8 内边距
 */
export default function Tag(props) {
  const variant = props.variant || "diff-add";
  const iconSize = props.iconSize != null ? props.iconSize : DEFAULT_ICON_SIZE[variant] || 14;
  const isTab = variant === "tab";
  // tab 默认可交互（button），interactive=false 时退化为静态展示（span，无 hover/focus）
  const interactive = props.interactive != null ? props.interactive : isTab;
  const isSelected = isTab && !!props.selected;
  const className = [
    "tag",
    VARIANT_CLASS[variant] || VARIANT_CLASS["diff-add"],
    isSelected ? "tag--selected" : "",
    props.disabled ? "tag--disabled" : "",
    isTab && !interactive ? "tag--static" : "",
    props.className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {/* 图标：颜色由 CSS 的 currentColor 继承，选中 / 未选中自动切换 */}
      {props.icon ? <Icon name={props.icon} size={iconSize} className="tag__icon" /> : null}
      <span className="tag__label">{props.children}</span>
    </>
  );

  // tab 形态可交互时渲染为按钮，其余情况（含静态 tab）为纯展示元素
  if (isTab && interactive) {
    return (
      <button
        type="button"
        className={className}
        disabled={props.disabled}
        aria-pressed={isSelected}
        onClick={props.onClick}
      >
        {content}
      </button>
    );
  }

  return (
    <span className={className} title={props.title}>
      {content}
    </span>
  );
}

/**
 * DiffTags —— 代码增删的一体写法。
 * 增删在实际场景中总是“两个一起”成对出现，此组件固定渲染「绿 + 红」两个标签，
 * 间距固定 4px；只传一侧时另一侧不渲染，两侧都为空时不渲染任何内容。
 */
export function DiffTags(props) {
  const hasAdded = props.added != null;
  const hasRemoved = props.removed != null;
  if (!hasAdded && !hasRemoved) return null;
  const gap = props.gap != null ? props.gap : 4;
  return (
    <span
      className={["tag-diff-pair", props.className || ""].filter(Boolean).join(" ")}
      style={{ gap: `${gap}px` }}
    >
      {hasAdded ? <Tag variant="diff-add">{formatDiffValue(props.added, "+")}</Tag> : null}
      {hasRemoved ? <Tag variant="diff-remove">{formatDiffValue(props.removed, "-")}</Tag> : null}
    </span>
  );
}

/**
 * TagGroup —— 标签行容器，负责排布与选中状态管理。
 * - 一行内多个标签，间距默认 tab 8px / 其余 4px
 * - selectable 时管理单选（multiple 支持多选），支持受控（value）与非受控（defaultValue）
 */
export function TagGroup(props) {
  const items = props.items || [];
  const variant = props.variant || "tab";
  const multiple = !!props.multiple;
  const selectable = props.selectable != null ? props.selectable : variant === "tab";
  const gap = props.gap != null ? props.gap : variant === "tab" ? 8 : 4;
  const controlled = props.value !== undefined;
  const [innerValue, setInnerValue] = useState(() => {
    if (!selectable) return multiple ? [] : null;
    if (props.defaultValue !== undefined) return props.defaultValue;
    return multiple ? [] : items.length ? items[0].id : null;
  });
  const value = controlled ? props.value : innerValue;

  const isSelected = (id) => (multiple ? (value || []).indexOf(id) > -1 : value === id);

  const handleClick = (item) => {
    if (!selectable || item.disabled) return;
    let next;
    if (multiple) {
      const list = value || [];
      next = isSelected(item.id) ? list.filter((id) => id !== item.id) : list.concat(item.id);
    } else {
      next = item.id; // 单选：保持选中态，不做取消
    }
    if (!controlled) setInnerValue(next);
    if (props.onChange) props.onChange(next, item);
  };

  return (
    <div
      className={["tag-group", props.className || ""].filter(Boolean).join(" ")}
      style={{ gap: `${gap}px` }}
      role={variant === "tab" ? "tablist" : undefined}
    >
      {items.map((item) => (
        <Tag
          key={item.id}
          variant={variant}
          icon={item.icon}
          disabled={item.disabled}
          title={item.title || item.label}
          selected={isSelected(item.id)}
          interactive={selectable}
          onClick={() => handleClick(item)}
        >
          {item.label}
        </Tag>
      ))}
    </div>
  );
}
