import React, { useState } from "react";
import { Icon } from "../../../assets/shared/icons.js";
import "./index.css";

/** Segmented — options determines the items; shape and layout are independent; Text is 36/44px, Icon is 32px. */
export default function Segmented({
  options = [],
  variant = "text",
  shape = "round",
  size = "large",
  block = false,
  value,
  defaultValue,
  disabled = false,
  onChange,
  onSegmentClick,
  id,
  style,
  className = "",
}) {
  const resolvedSegments = options.map(option =>
    typeof option === "string" || typeof option === "number"
      ? { value: option, label: option }
      : option
  );
  const [internalActive, setInternalActive] = useState(defaultValue);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [pressedKey, setPressedKey] = useState(null);
  const active = value !== undefined ? value : internalActive ?? resolvedSegments[0]?.value;
  const handleClick = (seg, idx) => {
    if (disabled || seg.disabled) return;
    if (value === undefined) setInternalActive(seg.value);
    if (seg.value !== active) onChange?.(seg.value);
    onSegmentClick?.(seg.value, idx);
  };
  const resolvedHeight = variant === "icon" ? 32 : size === "medium" ? 36 : 44;
  const rootClass = ["sb-root", `sb-height-${resolvedHeight}`, `sb-shape-${shape}`,
    variant === "icon" ? "sb-icon-only" : "", disabled ? "sb-disabled" : "", className
  ].filter(Boolean).join(" ");

  return (
    <div id={id} className={rootClass} role="group" aria-label="Segmented" style={{ ...(block ? { width: "100%" } : {}), ...style }}>
      {resolvedSegments.map((seg, idx) => {
        const key = seg.value;
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
            aria-label={variant === "icon" ? (seg.ariaLabel ?? (typeof seg.label === "string" || typeof seg.label === "number" ? String(seg.label) : undefined) ?? `选项 ${idx + 1}`) : undefined}
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
                  size={variant === "icon" ? 14 : 16}
                  className="sb-icon"
                  color="currentColor"
                />
              ) : (
                <span className="sb-icon" aria-hidden="true">
                  {seg.icon}
                </span>
              )
            ) : null}
            {(variant !== "icon" || !seg.icon) && seg.label != null ? <span className="sb-label">{seg.label}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
