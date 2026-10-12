# Tab

## Overview

#### 作用

Tab 用于同一页面区域内的并列视图切换。标签支持可选的前置图标，没有背景和下划线。

#### 视觉样式

- 未选中：较弱文字色和 Regular 字重。
- 选中：高对比文字色和 Bold 字重。

#### 尺寸

- `large`（默认）：字号 18px，标签间距 24px。
- `medium`：字号 16px，标签间距 20px。字号与间距由 `size` 统一控制。
- 每项宽度贴合图标与当前文字，不预留 Bold 宽度；标签数量由 `items.length` 决定。
- 标签行与下方内容区间距为 24px，两种尺寸一致。
- 标签始终单行显示；超出容器宽度时自动显示渐变遮罩及左右 IconButton，滚动条隐藏。
- 左右滚动按钮复用 `IconButton`，固定为 `unfilled`、`small`、`round`，悬浮在标签行边缘，不占据标签布局宽度。
- 点击箭头滚动约 3/4 可视宽度（至少 80px），不改变选中标签；到达边缘时隐藏对应方向的箭头及遮罩。窗口、标签尺寸或数量变化后自动重新判断溢出。

#### 图标

- 每项通过 `items[].icon` 传入可选的 React 节点，图标位于文字前。
- 图标随文字状态变色（传入图形应使用 currentColor），large 为 18px，medium 为 16px，图文间距为 8px。

#### 行为模式

- 支持 `activeId` 受控模式和 `defaultActiveId` 非受控模式。非受控模式下，当前项被移除时回到第一项；受控模式由调用方维护有效的 `activeId`。
- 支持左右方向键循环切换，`Home` / `End` 跳到首尾。
- 初始选中、点击切换或外部更新 `activeId` 时，选中项会自动滚动到可见区域。
- `items[].children` 提供标签下方的联动内容；切换时卸载旧内容，未提供内容时只显示标签。

#### 使用原则

- 标签使用短名词，描述视图内容，如“图片”“视频”。
- 各标签应处于同一信息层级，不用于触发一次性动作。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<{ id: string \| number, label: React.ReactNode, icon?: React.ReactNode, children?: React.ReactNode }>` | `[]` | 标签数据；每项 id 应唯一且类型保持一致；空数组不渲染组件。 |
| `items[].icon` | `React.ReactNode` | — | 标签前置图标，可逐项设置。 |
| `items[].children` | `React.ReactNode` | — | 当前标签的内容；未提供时不渲染内容区，切换后旧内容会卸载。 |
| `activeId` | `string \| number` | — | 受控选中项 id。 |
| `defaultActiveId` | `string \| number` | 第一项 id | 非受控初始选中项。 |
| `onChange` | `(item) => void` | — | 选择标签时返回完整 item；再次点击当前项也会触发。 |
| `size` | `"large" \| "medium"` | `"large"` | 同时决定字号与标签间距；未传或无效值回退 large。 |
| `id` | `string` | — | 根 div 元素标识；不传时不设置 id。 |
| `style` | `React.CSSProperties` | — | 根 div 元素行内样式，可覆盖根元素样式。 |
| `className` | `string` | — | 追加到根 div 元素的 CSS 类，保留内部类名。 |

## Usage

标签通过数据循环生成，数量由 `items.length` 决定；`count` 仅是预览控件，不是组件属性。

```jsx
import { useState } from "react";
import Tab from "./components/Tab/index.jsx";

const items = ["全部", "图片", "视频"].map((label, index) => ({
  id: `tab-${index + 1}`,
  label,
  children: <div>{label}的内容</div>,
}));

export default function Example() {
  const [activeId, setActiveId] = useState(items[0].id);
  return <Tab
    items={items}
    size="large"
    activeId={activeId}
    onChange={item => setActiveId(item.id)}
  />;
}

// 非受控模式
export function UncontrolledExample() {
  return <Tab items={items} size="medium" defaultActiveId="tab-2" />;
}
```

前置图标通过每项的 `icon` 传入已有图标节点，可与任意尺寸组合：

```jsx
export function WithIconExample({ searchIcon }) {
  const iconItems = items.map(item => ({ ...item, icon: searchIcon }));
  return <Tab items={iconItems} size="large" />;
}
```

`searchIcon` 应为使用项目功能图标资源的 React 节点。内容区由 `children` 决定，预览中的蓝底虚线框只是示例样式。

Tab 直接依赖同层 `IconButton` 组件及其箭头资源，交付时需一起提供。
