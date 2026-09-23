import React from "react";
import { useState, useEffect } from "react";
import { Icon } from "../../../assets/shared/icons.js";
import "./index.css";

/**
 * 状态图标配置：历史对话列表各状态对应的右侧图标。
 * 使用组件资源中的 SVG，保持状态图形与设计稿一致。
 */
const STATUS_ICON = {
  generating: { src: "./assets/uploads/icon/menuitem/menuitem-history-generating.svg", size: 21 },
  completed: { src: "./assets/uploads/icon/menuitem/menuitem-history-completed.svg", size: 20 },
  fault: { src: "./assets/uploads/icon/menuitem/menuitem-history-fault.svg", size: 16 },
  "pending-auth": { src: "./assets/uploads/icon/menuitem/menuitem-history-pending-auth.svg", size: 70 },
};

/**
 * MenuItem —— 菜单/列表条目组件
 * 通过 variant 区分多种形态：
 *  - nav：导航内容列表（图标 + 文字，316px 容器，支持默认 / 悬浮 / 选中）
 *  - history：历史对话列表（文字 + 右侧状态图标，每行 300×40px）
 *  - dropdown：下拉列表（图标 + 文字，支持小 / 中两种尺寸）
 *      · 小尺寸 152×32px：默认 / 悬浮 / 禁用（危险项红字）
 *      · 中尺寸 232×36px：默认（白底）/ 悬浮（5% 黑底）/ 选中（白底 + 右侧正确图标）/ 禁用（50% 透明度）
 *  - folder：文件夹列表（展开/收起图标 → 文件夹图标 → 文本）
 *  - file-level-1：一级文件列表（文件图标距左 12px，无展开/收起）
 *  - file-level-2：二级文件列表（文件图标距左 36px，无展开/收起）
 *  folder / file-level-1 / file-level-2 三种列表形态均支持：默认 / 悬浮 / 重命名 / 重命名输入中 / 禁用。
 */
export default function MenuItem({
  variant = "nav",
  items = [],
  selectedId,
  defaultSelectedId,
  onSelect,
  plain = false,
  size = "sm",
  // ---- 文件夹/文件列表相关 props ----
  defaultExpanded = false,
  onToggle,
  onRename,
  expandIconSrc = null,
  collapseIconSrc = null,
  folderIconSrc = null,
  hoverCommentSrc = null,
  hoverMoreSrc = null,
  caretSrc = null,
}) {
  const isList =
    variant === "folder" || variant === "file-level-1" || variant === "file-level-2";

  const [internalSelected, setInternalSelected] = useState(defaultSelectedId ?? null);
  const current = selectedId !== undefined ? selectedId : internalSelected;

  function handleClick(item) {
    if (variant === "nav" && selectedId === undefined) {
      setInternalSelected(item.id);
    }
    onSelect?.(item);
  }

  // ---- 文件夹/文件列表形态：独立渲染（复用 FolderRow 子组件） ----
  if (isList) {
    return (
      <div className="fl-list" role="list">
        {items.map((item) => (
          <FolderRow
            key={item.id}
            item={item}
            variant={variant}
            defaultExpanded={defaultExpanded}
            onToggle={onToggle}
            onRename={onRename}
            expandIconSrc={expandIconSrc}
            collapseIconSrc={collapseIconSrc}
            folderIconSrc={folderIconSrc}
            hoverCommentSrc={hoverCommentSrc}
            hoverMoreSrc={hoverMoreSrc}
            caretSrc={caretSrc}
          />
        ))}
      </div>
    );
  }

  const containerCls = `mi-menu mi-menu-${variant}${
    plain && variant === "nav" ? " mi-menu-plain" : ""
  }${variant === "dropdown" && size === "md" ? " mi-menu-dropdown-md" : ""}`;

  return (
    <div className={containerCls} role="menu" aria-label="菜单列表">
      {items.map((item) => {
        // ---- 历史对话列表形态 ----
        if (variant === "history") {
          const active = item.state && item.state !== "default";
          const cls = active
            ? "mi-item mi-item-history mi-item-active"
            : "mi-item mi-item-history";
          const status = STATUS_ICON[item.state];
          return (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className={cls}
              onClick={() => onSelect?.(item)}
            >
              <span className="mi-label">{item.label}</span>
              {status ? (
                <Icon name={status.icon} src={status.src} size={status.size} className="mi-status" />
              ) : null}
            </button>
          );
        }

        // ---- 导航内容列表 / 下拉列表形态 ----
        const isDropdownMd = variant === "dropdown" && size === "md";
        const isSelected =
          (variant === "nav" || isDropdownMd) &&
          (item.state === "selected" || item.id === current);
        let cls = `mi-item mi-item-${variant}`;
        if (isDropdownMd) cls += " mi-item-dropdown-md";
        if (item.state === "hover") cls += " mi-item-hover";
        if (isSelected) cls += " mi-item-selected";
        if (variant === "dropdown" && item.danger) cls += " mi-item-danger";

        return (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            className={cls}
            disabled={variant === "dropdown" && item.disabled}
            aria-current={isSelected ? "true" : undefined}
            onClick={() => handleClick(item)}
          >
            {item.iconSrc && item.rawIcon ? (
              <Icon src={item.iconSrc} size={isDropdownMd ? 17 : variant === "dropdown" ? 14 : 16} className="mi-icon" />
            ) : item.iconSrc ? (
              <span
                className="mi-icon mi-icon--mask"
                style={{
                  width: isDropdownMd ? 17 : variant === "dropdown" ? 14 : 16,
                  height: isDropdownMd ? 17 : variant === "dropdown" ? 14 : 16,
                  WebkitMaskImage: `url("${item.iconSrc}")`,
                  maskImage: `url("${item.iconSrc}")`,
                }}
                aria-hidden="true"
              />
            ) : item.icon ? (
              <Icon
                name={item.icon}
                size={isDropdownMd ? 17 : 16}
                className="mi-icon"
              />
            ) : null}
            <span className="mi-label">{item.label}</span>
            {isDropdownMd && isSelected ? (
              <Icon src="./assets/uploads/icon/menuitem/menuitem-dropdown-selected.svg" size={14} className="mi-check" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/**
 * FolderRow —— 文件夹/文件列表单行
 * 每行 602×40px，左对齐排列：图标 → 文本，部件间距 8px。
 * 文件夹列表显示展开/收起图标；文件列表无展开/收起。
 */
function FolderRow({
  item,
  variant,
  defaultExpanded,
  onToggle,
  onRename,
  expandIconSrc,
  collapseIconSrc,
  folderIconSrc,
  hoverCommentSrc,
  hoverMoreSrc,
  caretSrc,
}) {
  const state = item.state ?? "default";
  const isDisabled = state === "disabled";
  const isRenameMode = state === "rename" || state === "renaming";
  const isRenaming = state === "renaming";
  // 仅文件夹列表具备展开/收起图标
  const isFolder = variant === "folder";

  // 展开/收起：受控（item.expanded）优先，非受控回退内部状态
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const expanded = item.expanded !== undefined ? item.expanded : internalExpanded;

  // 重命名输入态：本地草稿，跟随外部 label 变化同步
  const [draft, setDraft] = useState(item.label);
  useEffect(() => {
    setDraft(item.label);
  }, [item.label]);

  function handleToggle() {
    if (isDisabled) return;
    const next = !expanded;
    if (item.expanded === undefined) setInternalExpanded(next);
    onToggle?.({ ...item, expanded: next });
  }

  function handleDraftChange(e) {
    setDraft(e.target.value);
    onRename?.(item, e.target.value);
  }

  let cls = "fl-row";
  if (variant === "file-level-1") cls += " fl-row-file-1";
  if (variant === "file-level-2") cls += " fl-row-file-2";
  if (state === "hover") cls += " fl-row-hover";
  if (isRenameMode) cls += " fl-row-rename";
  if (isDisabled) cls += " fl-row-disabled";

  return (
    <div className={cls} role="listitem">
      {/* 展开/收起图标：仅文件夹列表显示（含重命名/输入中） */}
      {isFolder && (
        <button
          type="button"
          className="fl-toggle"
          aria-label={expanded ? "收起" : "展开"}
          aria-expanded={expanded}
          disabled={isDisabled}
          onClick={handleToggle}
        >
          <Icon
            name={expanded ? "chevron-down" : "chevron-right"}
            src={expanded ? collapseIconSrc : expandIconSrc}
            size={16}
            className="fl-chevron"
          />
        </button>
      )}

      {/* 图标：文件夹列表用 folder 图标，文件列表用内置文件图标 */}
      {isFolder ? (
        <Icon name="folder" src={folderIconSrc} size={16} className="fl-folder" />
      ) : (
        <FileIcon className="fl-file" />
      )}

      {isRenameMode ? (
        <div className="fl-input">
          {/* 真实编辑框：透明文本/光标，负责交互与输入 */}
          <input
            className="fl-input-field"
            value={draft}
            onChange={handleDraftChange}
            autoFocus={isRenaming}
            aria-label="重命名输入"
          />
          {/* 可见文本层 + 自定义蓝色竖线光标（文本后 2px） */}
          <span className="fl-input-display" aria-hidden="true">
            {draft}
            {isRenaming &&
              (caretSrc ? (
                <img className="fl-caret" src={caretSrc} alt="" />
              ) : (
                <span className="fl-caret" />
              ))}
          </span>
        </div>
      ) : (
        <span className="fl-label">{item.label}</span>
      )}

      {/* 悬浮态：右侧显示评论 + 更多两个操作图标 */}
      {state === "hover" && (
        <div className="fl-hover-actions">
          <Icon src={hoverCommentSrc} size={16} className="fl-hover-icon" />
          <Icon src={hoverMoreSrc} size={16} className="fl-hover-icon" />
        </div>
      )}
    </div>
  );
}

/**
 * FileIcon —— 内置文件图标（用户提供的 16×16 文档图标）
 * 使用 currentColor，跟随条目文字色（含禁用态）。
 */
function FileIcon({ size = 16, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M14.274 11.1825V8.4679L14.2737 8.14402L14.274 9.03163V11.1825ZM14.274 11.1825V13.3333C14.274 14.4366 13.3807 15.3333 12.274 15.3333H3.7207C2.61737 15.3333 1.7207 14.4366 1.7207 13.3333V2.66663C1.7207 1.55996 2.61737 0.666626 3.7207 0.666626H10.234V3.39663C10.234 4.13329 10.8307 4.72996 11.5674 4.72996H14.274V5.26767M14.274 5.26767V5.80538V6.34308V5.26767Z"
        stroke="currentColor"
        strokeOpacity="0.898039"
        strokeLinejoin="round"
      />
      <path
        d="M11.5677 4.72996H14.2744V4.67996L10.281 0.666626H10.2344V3.39663C10.2344 4.13329 10.831 4.72996 11.5677 4.72996Z"
        stroke="currentColor"
        strokeOpacity="0.898039"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        d="M8.87582 7.5412L9.77616 10.4532L10.6015 7.55104C10.6324 7.44206 10.684 7.36034 10.7561 7.30584C10.8283 7.25136 10.921 7.22412 11.0343 7.22412H11.2802C11.3392 7.22412 11.3922 7.236 11.4391 7.25976C11.4861 7.28352 11.5271 7.31916 11.5621 7.36668C11.597 7.4142 11.6189 7.46392 11.6276 7.51584C11.6363 7.56776 11.6319 7.6219 11.6143 7.67822L10.2462 12.0697C10.2207 12.1517 10.1801 12.2132 10.1244 12.2541C10.0687 12.2951 9.9979 12.3156 9.91204 12.3156H9.65994C9.55068 12.3156 9.46036 12.2896 9.38898 12.2376C9.3176 12.1856 9.26514 12.1076 9.23164 12.0036L8.31882 9.17116L7.4377 11.9995C7.40486 12.1048 7.35264 12.1839 7.28104 12.2366C7.20942 12.2893 7.11844 12.3156 7.00806 12.3156H6.76442C6.67968 12.3156 6.60958 12.2955 6.5541 12.2552C6.49862 12.2149 6.45778 12.1544 6.43158 12.0739L5.0034 7.68236C4.985 7.62582 4.97996 7.5714 4.98822 7.51908C4.9965 7.46676 5.01812 7.41654 5.05306 7.36844C5.088 7.32032 5.12906 7.28426 5.17626 7.2602C5.22346 7.23614 5.27678 7.22412 5.33624 7.22412H5.6492C5.7603 7.22412 5.85174 7.25068 5.92348 7.30382C5.99522 7.35696 6.04728 7.43668 6.07966 7.54296L6.9668 10.4543L7.81788 7.54766C7.84944 7.43982 7.90122 7.35894 7.9732 7.305C8.04519 7.25108 8.13737 7.22412 8.24974 7.22412H8.4459C8.55654 7.22412 8.64768 7.25054 8.71932 7.30338C8.79098 7.35624 8.84314 7.4355 8.87582 7.5412Z"
        fill="currentColor"
        fillOpacity="0.898039"
      />
    </svg>
  );
}
