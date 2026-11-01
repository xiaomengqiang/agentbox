import React from "react";
import "./index.css";

// ---- Lucide (offline fallback, table injected at build time) ----
const ICONS = typeof LUCIDE !== "undefined" ? LUCIDE : {};

function camelToKebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function lookupIcon(name) {
  if (!name) return null;
  return (
    ICONS[name] ||
    ICONS[camelToKebab(name)] ||
    ICONS[name.replace(/-([a-z])/g, (_m, c) => c.toUpperCase())] ||
    null
  );
}

export function Icon({
  name,
  src,
  mask,
  size = 16,
  color,
  className = "",
  style,
  strokeWidth = 2,
  id,
}) {
  // Debug/test hooks: component identity + props snapshot on the root element
  const dataAttrs = {
    "data-component": "Icon",
    "data-props": JSON.stringify({ name, src, mask, size, color, strokeWidth }),
  };

  // file-based monochrome icon via CSS mask — follows currentColor (svg contributes shape only)
  if (mask) {
    return React.createElement("span", {
      id,
      ...dataAttrs,
      className,
      "aria-hidden": true,
      style: {
        ...style,
        display: "inline-block",
        verticalAlign: "middle",
        width: size,
        height: size,
        backgroundColor: color || "currentColor",
        mask: `url("${mask}") center / contain no-repeat`,
        WebkitMask: `url("${mask}") center / contain no-repeat`,
      },
    });
  }

  // user-provided asset (svg/png/jpg) via relative path — overrides name when both are set
  if (src) {
    return React.createElement("img", {
      id,
      src: src,
      ...dataAttrs,
      width: size,
      height: size,
      className: className,
      alt: "",
      "aria-hidden": true,
      style,
    });
  }

  // offline Lucide table lookup (table injected at build time)
  const nodes = lookupIcon(name);
  if (!nodes) return null;
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      id,
      ...dataAttrs,
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      strokeWidth: strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: className,
      "aria-hidden": true,
      style: { ...style, stroke: color || "currentColor" },
    },
    nodes.map(([tag, attrs], i) =>
      React.createElement(tag, { key: i, ...attrs })
    )
  );
}