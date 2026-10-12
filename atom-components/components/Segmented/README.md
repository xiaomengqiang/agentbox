# Segmented 分段按钮

## Overview

#### 作用

在一组互斥选项间切换；分段内容与数量由 `options` 数组决定。

#### 视觉样式

- `text`：文字，可通过每项 `icon` 添加前缀图标。
- `icon`：纯图标；没有图标的项保留文字标签。
- Default、Hover、Pressed、Disabled 四种交互外观，保留选中与未选中关系。

#### 尺寸与形状

- `size`：Text 支持 `large`（44px，默认）和 `medium`（36px），轨道内边距分别为 4 / 2px；Icon 固定 32px，内边距 2px。
- `shape`：`round` 外/内圆角 24px；`square` 外圆角 8px、内圆角 6px。
- 形状与高度独立：两种形状均支持 Text 的 36 / 44px 和 Icon 的 32px。
- 默认宽度随内容；`block` 填满容器；`style.width` 手动设置，优先于 block。Text 分段等分，容器不足时允许收缩。Icon 每个按钮固定 36px，不拉伸、不压缩，可用空间充足时总宽为 `36 × options.length + 4px`；设置轨道宽度不改变按钮宽度。

#### 图标

Text 图标 16px，Icon 图标 14px。图标支持共享图标名称或 ReactNode；通过每项 `icon` 设置。

#### 使用原则

- 每项 `value` 应唯一且稳定；字符串或数字选项同时作为 value 和 label。
- `value` 用于受控模式，`defaultValue` 用于非受控初始值；选项更新后，调用方应同步维护有效的选中值。

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| options | `(string / number / Option)[]` | `[]` | 循环渲染选项，数量由数组长度决定；Option 为 `{ value, label?, icon?, disabled? }`，value 为唯一 string 或 number，label 为 ReactNode，icon 为共享图标名称或 ReactNode，disabled 为 boolean |
| variant | `text / icon` | `text` | 内容类型 |
| shape | `round / square` | `round` | 仅决定圆角 |
| size | `large / medium` | `large` | Text：large 高 44px，medium 高 36px；Icon 忽略此值，固定 32px |
| block | `boolean` | `false` | 轨道填满父容器；省略时随内容。Icon 按钮仍固定 36px |
| value | `string / number` | — | 受控选中值 |
| defaultValue | `string / number` | — | 非受控初始值；未指定 value 和 defaultValue 时显示选中首项 |
| disabled | `boolean` | `false` | 整组禁用；options 单项可独立禁用 |
| onChange | `(value) => void` | — | 点击使选中值变化时触发 |
| onSegmentClick | `(value, index) => void` | — | 每次点击可用项时触发 |
| id | `string` | — | 根 div 的元素标识 |
| className | `string` | `""` | 追加到根 div，保留内部类名 |
| style | `React.CSSProperties` | — | 根 div 行内样式，调用方优先；width 支持数字（px）或 CSS 字符串 |

## Usage

```jsx
import Segmented from "./components/Segmented/index.jsx";

const data = [
  { id: "recent", name: "最近", icon: "clock" },
  { id: "saved", name: "收藏", icon: "star" },
  { id: "shared", name: "共享", icon: "share-2" },
];
const options = data.map(item => ({
  value: item.id,
  label: item.name,
  icon: item.icon,
}));

// 数组循环生成；形状与尺寸分别设置。
<Segmented options={options} shape="square" size="large" />
<Segmented options={["最近", "收藏", "共享"]} shape="round" size="medium" />

// 默认随内容、填满容器、手动宽度；没有独立 width prop。
<Segmented options={options} />
<Segmented options={options} block />
<Segmented options={options} style={{ width: 320 }} />
<Segmented options={options} style={{ width: "80%" }} />

<Segmented variant="icon" shape="square" options={[
  { value: "grid", label: "卡片", icon: "layout-grid" },
  { value: "list", label: "列表", icon: "list", disabled: true },
]} />
```

受控用法：

```jsx
import { useState } from "react";
import Segmented from "./components/Segmented/index.jsx";

const options = [
  { value: "recent", label: "最近" },
  { value: "saved", label: "收藏" },
];

export default function Example() {
  const [value, setValue] = useState("recent");
  return <Segmented options={options} value={value} onChange={setValue} />;
}
```

options 数据模型参考 [Ant Design Segmented](https://ant.design/components/segmented/)；配置器不提供宽度控件。Count 和 Text 前缀图标开关仅用于生成演示 options，组件 API 仍直接接收数组；切换类型保留 Text 的尺寸与图标开关设置。
