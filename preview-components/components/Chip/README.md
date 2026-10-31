# Chip

## Overview

#### 作用

Chip 是可选中的标签按钮。ChipGroup 提供单选及受控、非受控状态管理。

#### 视觉样式

未选中使用弱化背景和次要文字；选中使用高对比背景及中等字重。支持 hover 和 disabled，颜色随主题变化。

#### 尺寸与形状

固定尺寸：高 36px、16px 文字、24px 行高（--font-body-lg）、左右 16px、文字垂直居中、20px 圆角。

#### 图标

可选前置 SVG 资源 URL；16px 图标，图文间距 6px，颜色跟随状态。

## Props

### Chip

| Prop | Type | Default | Description |
|---|---|---|---|
| `selected` | `boolean` | `false` | 受控选中状态。 |
| `disabled` | `boolean` | `false` | 禁止交互。 |
| `icon` | `string` | — | 前置 SVG 资源 URL，通过 mask 使用状态对应的图标颜色。 |
| `onClick` | `(event) => void` | — | 点击回调，由调用方更新 selected。 |
| `children` | `ReactNode` | — | 标签内容。 |
| `title` | `string` | — | 原生提示。 |
| `id` | `string` | — | 根元素标识。 |
| `style` | `React.CSSProperties` | — | 根元素行内样式，覆盖内部同名样式。 |
| `className` | `string` | `""` | 合并到根元素的附加类名。 |

根元素为 button。

### ChipGroup

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `Array<{id: string, label: ReactNode, icon?: string, disabled?: boolean, title?: string}>` | `[]` | 选项。 |
| `value` | `string / null` | — | 受控值。 |
| `defaultValue` | `string / null` | 首项 id / 无选项时 null | 非受控初始值。 |
| `onChange` | `(nextValue, item) => void` | — | 选择回调。 |
| `gap` | `number` | `8` | 间距，单位 px。 |
| `id` | `string` | — | 根元素标识。 |
| `style` | `React.CSSProperties` | — | 根元素行内样式，覆盖内部同名样式。 |
| `className` | `string` | `""` | 合并到根元素的附加类名。 |

根元素为 div。选项数量由 `items` 决定，没有 `count` 属性。点击已选项时保持选中，禁用选项不触发 `onChange`。`defaultValue` 仅在首次挂载时生效；受控使用时由调用方在 `onChange` 中更新 `value`。

## Usage

```jsx
import React, { useState } from "react";
import { ChipGroup } from "./components/Chip/index.jsx";

export default function Example() {
  const [value, setValue] = useState("all");
  return (
    <ChipGroup
      items={[
        { id: "all", label: "全部" },
        { id: "image", label: "图片" },
        { id: "video", label: "视频" },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}
```
