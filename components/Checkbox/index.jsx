import { useState } from "react";
import { Icon } from "../../assets/shared/icons.js";
import "./index.css";

// 勾的几何参数（方框容器/边长见 index.css；Lucide 图标 viewBox 为 24）
const ICON_SIZE = 15; // 勾图标边长（px）
const UNIT = 24 / ICON_SIZE; // 1 个屏幕像素 = UNIT 个 viewBox 单位
const CHECK_STROKE = 2 * UNIT; // 白色勾线宽 → 屏上 2px
// 底层勾全宽 → 屏上 4px，白色勾之外两侧各露出 1px 即为勾的内部描边
const CHECK_STROKE_OUTLINE = 4 * UNIT;

/**
 * Checkbox 勾选组件
 * - 容器 24×24，实际方框边长 20px
 * - shape: "square" 方形（4px 圆角） | "circle" 圆形
 * - 选中底色 Light/comp_background_emphasize，勾为白色并带内部 1px 描边 + 阴影
 * - 未选中：描边 icon-tertiary、填充 fg_color_unchecked
 * - disabled：在可用态基础上整体 40% 不透明度
 */
export default function Checkbox(props) {
  const shape = props.shape || "square";
  const disabled = props.disabled === true;
  const label = props.label;

  // 受控 / 非受控：传了 checked 即为受控
  const isControlled = props.checked != null;
  const [innerChecked, setInnerChecked] = useState(props.defaultChecked === true);
  const checked = isControlled ? props.checked === true : innerChecked;

  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInnerChecked(!checked);
    if (props.onChange) props.onChange(!checked);
  };

  const handleKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  };

  const rootClass = [
    "cbx",
    "cbx-" + shape,
    checked ? "is-checked" : "is-unchecked",
    disabled ? "is-disabled" : "is-enabled",
  ].join(" ");

  return (
    <span
      className={rootClass}
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={toggle}
      onKeyDown={handleKeyDown}
    >
      {/* 容器 24×24，方框居中为 20×20 */}
      <span className="cbx-control">
        <span className="cbx-box">
          <span className="cbx-check" aria-hidden="true">
            {/* 底层：全宽勾，颜色即描边色（#000000 5%），只在白色勾外侧露出 1px */}
            <Icon
              name="check"
              size={ICON_SIZE}
              strokeWidth={CHECK_STROKE_OUTLINE}
              className="cbx-check-outline"
            />
            {/* 上层：白色勾 comp_background_primary_contrary */}
            <Icon
              name="check"
              size={ICON_SIZE}
              strokeWidth={CHECK_STROKE}
              className="cbx-check-mark"
            />
          </span>
        </span>
      </span>
      {label ? <span className="cbx-label">{label}</span> : null}
    </span>
  );
}
