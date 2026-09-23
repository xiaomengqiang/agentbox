# TextTabs

## Overview

#### 作用

TextTabs 用于同一页面区域内的并列视图切换。组件只呈现文字标签，没有背景和下划线。

#### 视觉样式

- 未选中：用于可切换但当前未展示的视图，使用较弱文字色和 Regular 字重。
- 选中：表示当前视图，使用高对比文字色和 Bold 字重。

#### 尺寸

- 文字默认 `--font-subtitle-lg`（18px），可用 `fontSize` 调整；间距默认 `--spacing-6`（24px），可用 `gap` 调整。
- 每项宽度贴合当前文字，不预留 Bold 宽度；标签数量由 `items.length` 决定。
- 标签始终单行显示；内容超出容器时列表横向滚动并隐藏滚动条。

#### 行为模式

- 支持 `activeId` 受控模式和 `defaultActiveId` 非受控模式。
- 支持左右方向键循环切换，`Home` / `End` 跳到首尾。
- 选中项会自动滚动到可见区域。

#### 使用原则

- 标签使用短名词，描述视图内容，如“图片”“视频”。
- 各标签应处于同一信息层级，不用于触发一次性动作。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<{ id: string \| number, label: string }>` | `[]` | 标签数据；空数组不渲染组件。 |
| `activeId` | `string \| number` | — | 受控选中项 id。 |
| `defaultActiveId` | `string \| number` | 第一项 id | 非受控初始选中项。 |
| `onChange` | `(item) => void` | — | 选择变化回调，返回完整 item。 |
| `fontSize` | `string` | `--font-size-lg`（18px） | 使用项目 `--font-size-*` token 名称，如 `--font-size-md`；无效值回退默认字号。 |
| `gap` | `number \| string` | `--spacing-6`（24px） | 数字为 px，也支持 CSS 长度。 |

## Color Spec

| Element / State | Background | Outline | Text |
|-----------------|------------|---------|------|
| Unselected | transparent | 无 | `--text-placeholder`，Regular |
| Hover | transparent | 无 | `--text-secondary` |
| Selected · Light | transparent | 无 | `#000000`，Bold |
| Selected · Dark | transparent | 无 | `--white`，Bold |
| Focus visible | transparent | `--focus-ring` | 按当前选中状态 |

## Usage

```jsx
import { useState } from "react";
import TextTabs from "./components/TextTabs/index.jsx";

const items = [
  { id: "all", label: "全部" },
  { id: "photo", label: "图片" },
  { id: "video", label: "视频" },
];

<TextTabs items={items} defaultActiveId="photo" />;

const [activeId, setActiveId] = useState("all");
<TextTabs items={items} activeId={activeId} onChange={(item) => setActiveId(item.id)} />;
```

