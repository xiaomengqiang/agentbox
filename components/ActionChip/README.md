# ActionChip 操作块

图标 + 文字形式的操作块（Chips），用于行内快捷操作。组件只有**一个默认状态**。

## Features

- 图标 14×14 + 文字 12px / 行高 20px，图文间距 4px
- 固定高度 24px（垂直居中），左右边距 8px，胶囊圆角
- 宽度为变量：默认随内容自适应，可用 `width` 属性固定或通过外部 `--ac-chip-width` 统一控制
- 底色 Light/Brand10（#0A59F7 10%），图标与文字取 Light/icon_emphasize（#0A59F7）
- 文字超长自动省略号截断（单行不换行）
- 悬停 / 按下仅叠加一层交互色，静止底色不变；键盘聚焦有 focus ring

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — (required) | 文字内容 |
| `icon` | `string` | — | Lucide 图标名（14×14），缺省时仅显示文字 |
| `width` | `number \| string` | — | 宽度变量：数字按 px，字符串原样（`"100%"`、`"12rem"`）；缺省为内容自适应 |
| `onClick` | `function` | — | 点击回调 |
| `className` | `string` | `""` | 附加类名 |

## Usage

```jsx
import ActionChip from "./components/ActionChip/index.jsx";

<ActionChip icon="square-pen" label="编辑" onClick={handleEdit} />
<ActionChip icon="share-2" label="分享" />          {/* 宽度自适应内容 */}
<ActionChip icon="download" label="导出" width={96} />   {/* 固定宽度，超长文字截断 */}
<ActionChip icon="copy" label="复制" width="100%" />     {/* 撑满容器 */}
```
