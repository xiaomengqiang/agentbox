import React from "react";
import { resolveShape, resolveSize, resolveVariant } from "../Button/presets.js";
import "./index.css";

/** Button-derived dropdown trigger. It never renders the menu itself. */
export default function DropdownButton({
  variant = "filled",
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
  className = "",
  "data-state": state,
  "aria-label": ariaLabel,
  "aria-expanded": expanded,
  "aria-controls": controls,
}) {
  const resolvedSize = size === "xs" ? "xs" : resolveSize(size);
  const requestedVariant = resolveVariant(variant);
  const resolvedVariant =
    resolvedSize === "xs" && !["outlined", "text"].includes(requestedVariant)
      ? "outlined"
      : requestedVariant;
  const resolvedShape =
    resolvedSize === "xs" && resolvedVariant === "outlined" ? "square" : resolveShape(shape);
  const indicator = dropdownIcon
    ? (dropdownIcon === "chevron-down" ? "chevron-down" : "caret-down-filled")
    : (resolvedSize === "xs" && resolvedVariant === "text" ? "chevron-down" : "caret-down-filled");
  const canShowContentIcon = resolvedSize === "xs" && resolvedVariant === "outlined";
  return (
    <button
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
        <img
          className="dropdown-btn__asset dropdown-btn__asset--leading"
          src={leadingIconSrc}
          alt={leadingIconAlt}
          aria-hidden={leadingIconAlt ? undefined : true}
        />
      ) : null}
      <span className="btn__label">{children}</span>
      {contentIconSrc && canShowContentIcon ? (
        <img
          className="dropdown-btn__asset dropdown-btn__asset--content"
          src={contentIconSrc}
          alt={contentIconAlt}
          aria-hidden={contentIconAlt ? undefined : true}
        />
      ) : null}
      <span className={`dropdown-btn__indicator dropdown-btn__indicator--${indicator}`} aria-hidden="true" />
    </button>
  );
}
