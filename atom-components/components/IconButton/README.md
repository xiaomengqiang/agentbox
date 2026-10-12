# IconButton

## Overview

#### 作用

纯图标操作按钮，支持独立的样式、尺寸和形状轴，共 2 × 2 × 2 种组合。

#### 视觉样式

- `filled`：浅色主题黑底白图标，深色主题随主题 token 反转。
- `unfilled`：默认透明底；悬浮和按下显示交互背景。
- 颜色只由 `variant` 决定，尺寸和形状不改变颜色。

#### 尺寸与形状

- `large` 外框为 32 × 32px，`small` 外框为 28 × 28px；图标均为 16px。
- `round` 为正圆；`square` 为 token 定义的圆角，默认 6px。
- 三个属性自由组合，切换任一属性不会重置其他属性。

#### 图标

所有组合共享 `ICONS` 图标集，默认 `search`。功能图标来自 `assets/uploads/icon/function/`；额外的 `ariplane`、`pause`、`resume` 来自 `assets/uploads/icon/send button/`。名称与资源文件名一致，未知名称回退到 `search`。`src` 优先于 `icon`；CSS mask 使图标跟随状态色。

#### 状态

支持 Default、Hover、Pressed、Disabled 四种视觉状态。悬浮和按下由原生交互触发；`disabled` 用于禁用按钮并阻止点击。

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"filled" \| "unfilled"` | `"unfilled"` | 填充样式，独立于尺寸和形状。 |
| `size` | `"large" \| "small"` | `"large"` | 外框尺寸为 32 × 32px / 28 × 28px；图标均为 16px。 |
| `shape` | `"round" \| "square"` | `"square"` | 正圆或 token 圆角。 |
| `icon` | `string` | `"search"` | `ICONS` 中的资源名称，所有组合均可使用。 |
| `src` | `string` | 未设置 | 自定义 SVG URL / data URL，优先于 icon。 |
| `disabled` | `boolean` | `false` | 禁用按钮并阻止点击。 |
| `onClick` | `(event) => void` | 未设置 | 原生点击回调，禁用时不触发。 |
| `id` | `string` | 未设置 | 根 button 的标识。 |
| `className` | `string` | `""` | 与根 button 内部类名合并。 |
| `style` | `React.CSSProperties` | 未设置 | 根 button 的行内样式，调用方值优先。 |

其余原生按钮属性透传至根 button，组件固定 `type="button"`。

## Usage

```jsx
import IconButton from './atom-components/components/IconButton/index.jsx';

export default function Actions({ onSearch, onSend }) {
  return <div>
    <IconButton variant="unfilled" size="large" shape="square" icon="search" onClick={onSearch} />
    <IconButton variant="filled" size="small" shape="round" icon="ariplane" onClick={onSend} />
    <IconButton variant="filled" size="large" shape="square" icon="add" disabled />
  </div>;
}
```

使用页面需加载项目共享主题样式。颜色与圆角 token 的具体契约见[交互预览](../../previews/IconButton/preview.html)。
