import { useState } from "react";
import { Icon } from "../../assets/shared/icons.js";
import "./index.css";

/**
 * SegmentedButton — 分段按钮
 *
 * variant="text"（默认）：文本类按钮，总宽固定 514px，子按钮按数量等分自适应；
 * variant="icon"：纯图标类按钮，76×32 紧凑尺寸、圆角 8。
 * 文本类按钮通过 showIcon 开关图标、count 控制子按钮数量、labels 自定义文本。
 *
 * 状态覆盖：默认、悬停、按压、键盘聚焦、禁用（整组或单段）。
 */

// 依据高层参数构建分段数据（segments 直接传入时优先）
function buildSegments({ variant, count, labels, showIcon, icon }) {
  const n = Math.max(1, count);
  return Array.from({ length: n }, (_, i) => {
    const key = `s${i}`;
    const segIcon = Array.isArray(icon) ? icon[i % icon.length] : icon;
    if (variant === "icon") {
      return { key, icon: segIcon };
    }
    return {
      key,
      label: labels?.[i] ?? "文本",
      ...(showIcon && segIcon ? { icon: segIcon } : {}),
    };
  });
}

export default function SegmentedButton({
  variant = "text",
  count = 2,
  labels,
  showIcon = false,
  icon,
  radius = 24,
  segments,
  activeKey,
  defaultActiveKey,
  disabled = false,
  onChange,
  onSegmentClick,
  className = "",
}) {
  const resolvedSegments =
    segments ?? buildSegments({ variant, count, labels, showIcon, icon });

  const [internalActive, setInternalActive] = useState(
    defaultActiveKey ?? resolvedSegments[0]?.key
  );
  const [hoveredKey, setHoveredKey] = useState(null);
  const [pressedKey, setPressedKey] = useState(null);

  // 受控 / 非受控
  const active = activeKey !== undefined ? activeKey : internalActive;

  const handleClick = (seg, idx) => {
    if (disabled || seg.disabled) return;
    if (activeKey === undefined) setInternalActive(seg.key);
    if (onChange) onChange(seg.key, idx);
    if (onSegmentClick) onSegmentClick(seg.key, idx);
  };

  const rootClass = [
    "sb-root",
    variant === "icon" ? "sb-size-sm" : "",
    radius === 8 ? "sb-radius-8" : "",
    disabled ? "sb-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass} role="group" aria-label="Segmented Button">
      {resolvedSegments.map((seg, idx) => {
        const key = seg.key ?? idx;
        const isActive = key === active;
        const isHovered = hoveredKey === key;
        const isPressed = pressedKey === key;
        const isDisabled = disabled || seg.disabled;

        const classes = [
          "sb-segment",
          seg.icon ? "sb-has-icon" : "",
          isActive ? "sb-active" : "",
          isHovered ? "sb-hover" : "",
          isPressed ? "sb-pressed" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={key}
            type="button"
            className={classes}
            disabled={isDisabled}
            aria-pressed={isActive}
            onClick={() => handleClick(seg, idx)}
            onMouseEnter={() => setHoveredKey(key)}
            onMouseLeave={() => {
              setHoveredKey(null);
              setPressedKey(null);
            }}
            onMouseDown={() => setPressedKey(key)}
            onMouseUp={() => setPressedKey(null)}
          >
            {seg.icon ? (
              typeof seg.icon === "string" ? (
                <Icon
                  name={seg.icon}
                  size={16}
                  className="sb-icon"
                  color="currentColor"
                />
              ) : (
                <span className="sb-icon" aria-hidden="true">
                  {seg.icon}
                </span>
              )
            ) : null}
            {seg.label ? <span className="sb-label">{seg.label}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
