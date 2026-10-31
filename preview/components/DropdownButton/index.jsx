import React from "react";
import { resolveShape, resolveSize, resolveVariant } from "../Button/presets.js";
import "./index.css";

/** Button-derived dropdown trigger. It never renders the menu itself. */
export default function DropdownButton({
  variant = "primary",
  size = "large",
  shape = "round",
  dropdownIcon,
  leadingIconSrc,
  contentIconSrc,
  leadingIconAlt = "",
  contentIconAlt = "",
  children,
  disabled = false,
  type = "button",
  onClick,
  id,
  style,
  className = "",
  "data-state": state,
  "aria-label": ariaLabel,
  "aria-expanded": expanded,
  "aria-controls": controls,
}) {
  const resolvedSize = size === "small" ? "small" : resolveSize(size);
  const resolvedVariant = resolveVariant(variant);
  const resolvedShape = resolveShape(shape);
  const indicator = dropdownIcon
    ? (dropdownIcon === "chevron-down" ? "chevron-down" : "caret-down-filled")
    : (resolvedSize === "small" && resolvedVariant === "text" ? "chevron-down" : "caret-down-filled");
  return (
    <button
      id={id}
      style={style}
      type={type}
      className={`btn btn--${resolvedVariant} btn--${resolvedSize} btn--${resolvedShape} dropdown-btn ${className}`}
      disabled={disabled}
      data-state={state}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={expanded}
      aria-controls={controls}
    >
      {leadingIconSrc ? (
        <span className="dropdown-btn__asset dropdown-btn__asset--leading" style={{ "--dropdown-asset": `url("${leadingIconSrc}")` }}>
          <img src={leadingIconSrc} alt={leadingIconAlt} aria-hidden={leadingIconAlt ? undefined : true} />
        </span>
      ) : null}
      <span className="btn__label">{children}</span>
      {contentIconSrc ? (
        <span className="dropdown-btn__asset dropdown-btn__asset--content" style={{ "--dropdown-asset": `url("${contentIconSrc}")` }}>
          <img src={contentIconSrc} alt={contentIconAlt} aria-hidden={contentIconAlt ? undefined : true} />
        </span>
      ) : null}
      <span className={`dropdown-btn__indicator dropdown-btn__indicator--${indicator}`} aria-hidden="true" />
    </button>
  );
}
