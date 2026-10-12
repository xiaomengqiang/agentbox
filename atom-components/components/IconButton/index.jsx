import React from "react";
import "./index.css";

export const FUNCTION_ICONS = {
  "add": "./assets/uploads/icon/function/add.svg",
  "arrow_down": "./assets/uploads/icon/function/arrow_down.svg",
  "arrow_left": "./assets/uploads/icon/function/arrow_left.svg",
  "arrow_right": "./assets/uploads/icon/function/arrow_right.svg",
  "arrow_up": "./assets/uploads/icon/function/arrow_up.svg",
  "check": "./assets/uploads/icon/function/check.svg",
  "close": "./assets/uploads/icon/function/close.svg",
  "collapse_sidebar": "./assets/uploads/icon/function/collapse_sidebar.svg",
  "delete": "./assets/uploads/icon/function/delete.svg",
  "download_list": "./assets/uploads/icon/function/download_list.svg",
  "edit": "./assets/uploads/icon/function/edit.svg",
  "open_local": "./assets/uploads/icon/function/open_local.svg",
  "pin": "./assets/uploads/icon/function/pin.svg",
  "quote_to_chat": "./assets/uploads/icon/function/quote_to_chat.svg",
  "refresh": "./assets/uploads/icon/function/refresh.svg",
  "right_list": "./assets/uploads/icon/function/right_list.svg",
  "search": "./assets/uploads/icon/function/search.svg",
  "setting": "./assets/uploads/icon/function/setting.svg",
  "unpin": "./assets/uploads/icon/function/unpin.svg"
};
export const DIALOG_ICONS = {
  "add": "./assets/uploads/icon/send button/add.svg",
  "ariplane": "./assets/uploads/icon/send button/ariplane.svg",
  "pause": "./assets/uploads/icon/send button/pause.svg",
  "resume": "./assets/uploads/icon/send button/resume.svg"
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
