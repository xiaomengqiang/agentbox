import React from "react";
import { Icon } from "../../../assets/shared/large-icons.js";
import "./index.css";

/**
 * TaskTemplateCard —— 定时任务模版卡片（单个卡片）
 * ---------------------------------------------------------------------------
 * 用于「定时任务」的模版选择：垂直排布 32px 线性图标 → 标题（20px medium，单行省略）
 * → 描述（14px medium，双行省略），行间距 20px，左对齐；白底、无描边无阴影、24px 圆角、
 * 上下 20px / 左右 24px 内边距。
 * 结构仅「图标 + 文字」，不承载其他原子组件。传入 onClick 时整卡可点击。
 */
export default function TaskTemplateCard(props) {
  const clickable = typeof props.onClick === "function";
  const className = [
    "task-template-card",
    clickable ? "task-template-card--clickable" : "",
    props.className || "",
  ]
    .filter(Boolean)
    .join(" ");

  // 可点击时补一层键盘可达性：Enter / Space 等价于点击
  const handleKeyDown = (event) => {
    if (!clickable) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      props.onClick(event);
    }
  };

  return (
    <article
      className={className}
      onClick={props.onClick}
      onKeyDown={handleKeyDown}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {props.icon ? (
        <Icon name={props.icon} size={32} className="task-template-card__icon" />
      ) : null}

      <h3 className="task-template-card__title" title={props.title}>
        {props.title}
      </h3>

      {props.description ? (
        <p className="task-template-card__desc">{props.description}</p>
      ) : null}
    </article>
  );
}

/**
 * TaskTemplateCardGroup —— 模版卡片组容器
 * 水平排布、自动换行，卡片间距 16px；宽度自适应但保证「一行最少两张」。
 */
export function TaskTemplateCardGroup(props) {
  return (
    <div className={["task-template-card-group", props.className || ""].filter(Boolean).join(" ")}>
      {props.children}
    </div>
  );
}
