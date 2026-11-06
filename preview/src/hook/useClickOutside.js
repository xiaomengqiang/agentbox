import { useEffect } from "react";

/* ===================== 自定义 hook:点击外部关闭 =====================
   active 为 true 时监听全局 mousedown;isInside(target) 判断目标是否在
   "安全区"内(返回 truthy 不关闭),不在则触发 onClose */
export function useClickOutside(active, isInside, onClose) {
  useEffect(() => {
    if (!active) return;
    const onDown = (e) => {
      if (!isInside(e.target)) onClose();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [active, isInside, onClose]);
}
