import React from "react";
import { useEffect, useRef, useState } from "react";
import IconButton from "../IconButton/index.jsx";
import "./index.css";

/**
 * Tab — 可带前置图标的标签导航。
 * 选中态：黑色 100% + Bold；未选中态：黑色 40%；large 为 18px / 24px，medium 为 16px / 20px。
 */
export default function Tab(props) {
  const items = props.items || [];
  const size = props.size === "medium" ? "medium" : "large";
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
  const activeId = isControlled ? props.activeId : (items.some(item => item.id === internalId) ? internalId : items[0]?.id);
  const listRef = useRef(null);
  const navRef = useRef(null);
  const trackRef = useRef(null);
  const [overflow, setOverflow] = useState(false);
  const [edges, setEdges] = useState({ left: false, right: false });

  const updateEdges = () => {
    const list = listRef.current;
    if (!list) return;
    const left = list.scrollLeft > 1;
    const right = list.scrollWidth - list.clientWidth - list.scrollLeft > 1;
    setEdges(previous => previous.left === left && previous.right === right ? previous : { left, right });
  };

  useEffect(() => {
    const nav = navRef.current;
    const track = trackRef.current;
    if (!nav || !track) return;
    const measure = () => {
      setOverflow(track.scrollWidth > nav.clientWidth + 1);
      updateEdges();
    };
    measure();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    observer?.observe(nav);
    observer?.observe(track);
    window.addEventListener("resize", measure);
    return () => { observer?.disconnect(); window.removeEventListener("resize", measure); };
  }, [items, size]);

  useEffect(() => { updateEdges(); }, [overflow]);

  const revealTab = id => {
    const list = listRef.current;
    const el = getTabNode(id);
    if (!list || !el) return;
    const bounds = list.getBoundingClientRect();
    const target = el.getBoundingClientRect();
    const inset = overflow ? 56 : 0;
    const left = bounds.left + inset;
    const right = bounds.right - inset;
    const offset = target.left < left ? target.left - left
      : target.right > right ? target.right - right : 0;
    if (offset) list.scrollBy({ left: offset, behavior: "instant" });
  };

  useEffect(() => { revealTab(activeId); }, [activeId, overflow, size, items]);

  const scrollTabs = direction => {
    const list = listRef.current;
    if (!list) return;
    list.scrollBy({ left: direction * Math.max(80, list.clientWidth * 0.75),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  // 找到某个 tab 对应的 DOM 节点（用于滚动可见 / 焦点管理）
  const getTabNode = (id) => {
    const node = listRef.current;
    if (!node || !node.querySelector) return null;
    return Array.from(node.querySelectorAll("[data-tab-id]")).find(tab => tab.dataset.tabId === String(id));
  };

  const selectTab = (item) => {
    if (!isControlled) setInternalId(item.id);
    if (onChange) onChange(item);
    // 列表横向滚动时，保证选中项可见
    revealTab(item.id);
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
    if (el && el.focus) el.focus({ preventScroll: true });
  };

  if (items.length === 0) return null;

  const activeItem = items.find(item => item.id === activeId);

  return (
    <div id={props.id} style={props.style} className={["tt-root", `tt-size-${size}`, props.className].filter(Boolean).join(" ")}>
      <div className={`tt-nav${overflow ? " tt-nav-overflow" : ""}`} ref={navRef}>
      {overflow && <IconButton icon="arrow_left" size="small" shape="round" variant="unfilled" ariaLabel="向左滚动标签" className={`tt-scroll-button tt-scroll-left${edges.left ? "" : " tt-scroll-hidden"}`} tabIndex={edges.left ? 0 : -1} onClick={() => scrollTabs(-1)} />}
      <div
        className={`tt-list${overflow && edges.left ? " tt-fade-left" : ""}${overflow && edges.right ? " tt-fade-right" : ""}`}
        onScroll={updateEdges}
        role="tablist"
        ref={listRef}
        onKeyDown={handleKeyDown}
      >
        <div className="tt-track" ref={trackRef}>
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
              {item.icon != null && <span className="tt-icon" aria-hidden="true">{item.icon}</span>}
              <span className="tt-label">
                {item.label}
              </span>
            </button>
          );
        })}
        </div>
      </div>
      {overflow && <IconButton icon="arrow_right" size="small" shape="round" variant="unfilled" ariaLabel="向右滚动标签" className={`tt-scroll-button tt-scroll-right${edges.right ? "" : " tt-scroll-hidden"}`} tabIndex={edges.right ? 0 : -1} onClick={() => scrollTabs(1)} />}
      </div>
      {activeItem?.children != null && (
        <div key={activeItem.id} className="tt-panel" role="tabpanel">
          {activeItem.children}
        </div>
      )}
    </div>
  );
}
