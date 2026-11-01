import React, { useRef, useEffect } from "react";
import "./index.css";

// ECharts 6.1 封装:SVG 渲染,自适应容器宽度;echarts 为构建注入的全局库。
export default function Chart({ option, height = 320, id, style, className = "" }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof echarts === "undefined") return undefined;
    const chart = echarts.init(el, null, { renderer: "svg" });
    chartRef.current = chart;
    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (chartRef.current && option) {
      chartRef.current.setOption(option, true);
    }
  }, [option]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`chart-root${className ? ` ${className}` : ""}`}
      style={{ width: "100%", height, ...style }}
    />
  );
}
