# Chart

## Overview

#### 作用

ECharts 6.1 图表封装组件。接收 ECharts option 渲染图表,内部负责实例创建、配置更新、容器尺寸自适应与实例销毁;渲染器固定为 SVG(矢量清晰,适配无 canvas 环境)。

#### 视觉样式

- 图表随容器宽度自适应(窗口 resize 自动重绘),高度由 `height` 指定。
- 配色、坐标轴等视觉细节全部通过 ECharts option 控制;主题色建议取自 `assets/style` 的 token 值。

#### 运行依赖

- `echarts` 为全局库:构建器检测到代码中使用 `echarts` / 本组件时,自动在产物注入本地 `assets/library/echarts.min.js`(ECharts 6.1,UMD)。
- 禁止从 CDN 引入或以 npm 包形式 import ECharts。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `option` | `object` | — (required) | ECharts option 对象;变化时以 notMerge 方式整体更新 |
| `height` | `number` | `320` | 图表高度(px) |
| `id` | `string` | — | 根元素标识 |
| `className` | `string` | `""` | 追加到根元素,保留内部类名 |
| `style` | `React.CSSProperties` | — | 根元素行内样式,与内部样式合并且调用方优先 |

## Usage

```jsx
import Chart from "../../components/Chart/index.jsx";

const option = {
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
  yAxis: { type: "value" },
  series: [{ type: "line", data: [150, 230, 224, 218, 135], smooth: true }],
};

<Chart option={option} height={320} />
```
