import React from "react";
import "./index.css";

export const FUNCTION_ICONS = {
  "add": "./assets/uploads/icon/function/add.svg",
  "arrow-down": "./assets/uploads/icon/function/arrow-down.svg",
  "arrow-left": "./assets/uploads/icon/function/arrow-left.svg",
  "arrow-right": "./assets/uploads/icon/function/arrow-right.svg",
  "arrow-up": "./assets/uploads/icon/function/arrow-up.svg",
  "check": "./assets/uploads/icon/function/check.svg",
  "close": "./assets/uploads/icon/function/close.svg",
  "collapse-sidebar": "./assets/uploads/icon/function/collapse-sidebar.svg",
  "delete": "./assets/uploads/icon/function/delete.svg",
  "download": "./assets/uploads/icon/function/download.svg",
  "edit": "./assets/uploads/icon/function/edit.svg",
  "open-local": "./assets/uploads/icon/function/open-local.svg",
  "pin": "./assets/uploads/icon/function/pin.svg",
  "quote-to-chat": "./assets/uploads/icon/function/quote-to-chat.svg",
  "refresh": "./assets/uploads/icon/function/refresh.svg",
  "search": "./assets/uploads/icon/function/search.svg",
  "setting": "./assets/uploads/icon/function/setting.svg",
  "unpin": "./assets/uploads/icon/function/unpin.svg"
};
export const DIALOG_ICONS = {
  "add": "./assets/uploads/icon/send-button/add.svg",
  "ariplane": "./assets/uploads/icon/send-button/ariplane.svg",
  "pause": "./assets/uploads/icon/send-button/pause.svg",
  "resume": "./assets/uploads/icon/send-button/resume.svg"
};

export const ICONS = { ...DIALOG_ICONS, ...FUNCTION_ICONS };

/** Icon-only action button with independent visual axes. */
export default function IconButton({ variant = "unfilled", size = "large", shape = "square",
  icon = "search", src, disabled = false, ariaLabel = "图标操作", onClick, id, className = "", style, ...rest }) {
  const source = src || ICONS[icon] || ICONS.search;
  return <button {...rest} id={id} type="button" className={`icon-button icon-button--${variant} icon-button--${size} icon-button--${shape} ${className}`}
    style={style}
    disabled={disabled} aria-label={ariaLabel} onClick={onClick}>
    <span className="icon-button__glyph" aria-hidden="true" style={{ WebkitMaskImage: `url("${source}")`, maskImage: `url("${source}")` }} />
  </button>;
}
