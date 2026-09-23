import { Icon } from "../../assets/shared/icons.js";
// 原子组件从共享原子库消费（单一事实来源）：开关与标签复用现有实现，不在卡片里重造。
import Tag from "../../../components/Tag/index.jsx";
import Toggle from "../../../components/Toggle/index.jsx";
import "./index.css";

/* 图标取自 Lucide，构建期按下面的字面量扫描并注入图标节点：
   标签默认图标 icon: "calendar-clock"、时间图标 name="clock" */

/**
 * TaskCard —— 定时任务卡片
 * ---------------------------------------------------------------------------
 * 一个定时任务的完整信息单元，两种形态：
 *   - 形态 short（默认）：窄卡，内容垂直堆叠 —— 标题行（标题 + 右侧开关）→ 12px → 标签
 *     → 20px → 描述 → 20px → 底部信息行；多张短卡由 TaskCardGroup 横向排列，间距 16px。
 *   - 形态 long：宽卡，首行把「标题 / 标签 / 开关」并列（标题与标签 12px，开关在最右），
 *     该行下 12px 为描述，最后一行同样是「时间周期 / 下次执行」左右分布。
 * 两形态共用同一套文字与底部信息行样式：标题 20px medium 单行省略，描述 14px medium 两行省略，
 * 底部信息行 14px regular、container30 弱化色（与 TaskTemplateCard 的同族排印一致）。
 * 卡片默认是静态容器；传入 onClick 即整卡可点击，悬浮抬起一层阴影（与 TaskTemplateCard 同规格）。
 */
export default function TaskCard(props) {
  const variant = props.variant === "long" ? "long" : "short";
  const hasFooter = Boolean(props.schedule || props.nextRun);
  // 与 TaskTemplateCard 一致：传入 onClick 才算可点击；静态卡不响应悬停与键盘
  const clickable = typeof props.onClick === "function";

  const className = [
    "task-card",
    "task-card--" + variant,
    clickable ? "task-card--clickable" : "",
    props.className || "",
  ]
    .filter(Boolean)
    .join(" ");

  // 可点击时补一层键盘可达性：Enter / Space 等价于点击（同 TaskTemplateCard）
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      props.onClick(event);
    }
  };

  // 卡内原子组件（开关）的交互不冒泡成整卡点击：点开关只切开关，不触发整卡动作
  const handleClick = (event) => {
    if (event.target.closest && event.target.closest(".task-card__switch")) return;
    props.onClick(event);
  };

  // 静态卡不挂任何交互属性
  const cardProps = clickable
    ? { className, onClick: handleClick, onKeyDown: handleKeyDown, role: "button", tabIndex: 0 }
    : { className };

  // 四段内容在两形态间复用，只有排布容器不同
  const title = (
    <h3 className="task-card__title" title={props.title}>
      {props.title}
    </h3>
  );

  const tag = props.label ? (
    <Tag
      variant="icon"
      icon={props.labelIcon || "calendar-clock"}
      className="task-card__label"
      title={props.label}
    >
      {props.label}
    </Tag>
  ) : null;

  const toggle = (
    <Toggle
      className="task-card__switch"
      checked={props.checked}
      defaultChecked={props.defaultChecked}
      disabled={props.disabled}
      label={props.switchLabel}
      onChange={props.onChange}
    />
  );

  const description = props.description ? (
    <p className="task-card__desc">{props.description}</p>
  ) : null;

  const footer = hasFooter ? (
    <div className="task-card__footer">
      {props.schedule ? (
        <span className="task-card__schedule">
          <span className="task-card__time-icon">
            <Icon name="clock" size={14} />
          </span>
          <span className="task-card__schedule-text">{props.schedule}</span>
        </span>
      ) : null}

      {props.nextRun ? (
        <span className="task-card__next">
          {props.nextRunLabel || "下次执行"} {props.nextRun}
        </span>
      ) : null}
    </div>
  ) : null;

  // 长卡：标题 / 标签 / 开关 并列成一行，再依次是描述与底部信息行
  if (variant === "long") {
    return (
      <article {...cardProps}>
        <div className="task-card__row">
          {title}
          {tag}
          {toggle}
        </div>
        {description}
        {footer}
      </article>
    );
  }

  // 短卡：标题行（标题 + 开关）与标签上下叠放，再依次是描述与底部信息行
  return (
    <article {...cardProps}>
      <div className="task-card__top">
        <div className="task-card__head">
          {title}
          {toggle}
        </div>
        {tag}
      </div>
      {description}
      {footer}
    </article>
  );
}

/**
 * TaskCardGroup —— 短卡的横向排列容器
 * 与 TaskTemplateCardGroup 同规格：水平排布、自动换行，卡片间距 16px；
 * 宽度自适应但保证「一行最少两张」。长卡是宽卡，直接纵向排列即可，不需要此容器。
 */
export function TaskCardGroup(props) {
  return (
    <div className={["task-card-group", props.className || ""].filter(Boolean).join(" ")}>
      {props.children}
    </div>
  );
}
