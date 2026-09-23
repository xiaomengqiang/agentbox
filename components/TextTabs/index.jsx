import { useRef, useState } from "react";
import "./index.css";

/**
 * TextTabs — 纯文字标签导航。
 * 选中态：黑色 100% + Bold；未选中态：黑色 40%；标签间距默认 24px。
 */
export default function TextTabs(props) {
  const items = props.items || [];
  const gap = props.gap != null ? props.gap : 24;
  const onChange = props.onChange;
  const isControlled = props.activeId != null;

  // 非受控时组件自己维护选中项，默认选中第一项
  const [internalId, setInternalId] = useState(
    props.defaultActiveId != null
      ? props.defaultActiveId
      : items.length > 0
        ? items[0].id
        : null
  );
  const activeId = isControlled ? props.activeId : internalId;
  const listRef = useRef(null);

  // 找到某个 tab 对应的 DOM 节点（用于滚动可见 / 焦点管理）
  const getTabNode = (id) => {
    const node = listRef.current;
    if (!node || !node.querySelector) return null;
    return node.querySelector('[data-tab-id="' + id + '"]');
  };

  const selectTab = (item) => {
    if (!isControlled) setInternalId(item.id);
    if (onChange) onChange(item);
    // 列表横向滚动时，保证选中项可见
    const el = getTabNode(item.id);
    if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  // 键盘导航：左右方向键循环切换，Home / End 跳首尾，焦点跟随选中项
  const handleKeyDown = (event) => {
    const key = event.key;
    if (key !== "ArrowLeft" && key !== "ArrowRight" && key !== "Home" && key !== "End") return;
    event.preventDefault();
    if (items.length === 0) return;

    const currentIndex = items.findIndex((it) => it.id === activeId);
    let nextIndex = currentIndex < 0 ? 0 : currentIndex;
    if (key === "ArrowLeft") nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
    if (key === "ArrowRight") nextIndex = currentIndex >= items.length - 1 ? 0 : currentIndex + 1;
    if (key === "Home") nextIndex = 0;
    if (key === "End") nextIndex = items.length - 1;

    const nextItem = items[nextIndex];
    if (!nextItem) return;
    selectTab(nextItem);
    const el = getTabNode(nextItem.id);
    if (el && el.focus) el.focus();
  };

  if (items.length === 0) return null;

  return (
    <div className="tt-root">
      <div
        className="tt-list"
        role="tablist"
        ref={listRef}
        onKeyDown={handleKeyDown}
        style={{ gap: gap + "px" }}
      >
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              data-tab-id={item.id}
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              className={active ? "tt-tab tt-tab-active" : "tt-tab"}
              onClick={() => selectTab(item)}
            >
              {/* data-label 让未选中态预留 Bold 宽度，切换时不抖动 */}
              <span className="tt-label" data-label={item.label}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
