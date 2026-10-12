# Tag

## Overview

#### 作用

Tag 是静态展示标签。可选中标签由独立的 Chip 组件提供；DiffTags 保留成对增删数字的格式化能力。

#### 视觉样式

- `default`：中性底色和文字。
- `green`：绿色底色和文字。
- `red`：红色底色和文字。

#### 尺寸与形状

- `medium`：14px 文字，高 24px，左右各 8px。
- `small`：12px 文字，高 20px，左右各 6px。
- `round` 为全圆角，`square` 为 4px 圆角。
- 颜色、尺寸、形状与图标可以自由组合。

#### 图标

可选前置 SVG 图标，传入SVG 资源 URL（预览使用 FileType/outlined），以 currentColor 着色；medium 为 14px，small 为 12px，图文间距 4px。

## Props

### Tag

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"default" / "green" / "red"` | `"default"` | 颜色样式。 |
| `size` | `"medium" / "small"` | `"medium"` | 尺寸。 |
| `shape` | `"round" / "square"` | `"round"` | 形状。 |
| `icon` | `string` | — | 前置 SVG 资源 URL，不传则不显示。 |
| `children` | `ReactNode` | — | 标签内容。 |
| `title` | `string` | — | 原生提示。 |
| `id` | `string` | — | 根元素标识。 |
| `style` | `React.CSSProperties` | — | 根元素行内样式，覆盖内部同名样式。 |
| `className` | `string` | `""` | 合并到根元素的附加类名。 |

根元素为 span。

### DiffTags

| Prop | Type | Default | Description |
|---|---|---|---|
| `added` | `number / string` | — | 新增值，补 + 和千分位；未传时隐藏。 |
| `removed` | `number / string` | — | 删除值，补 - 和千分位；未传时隐藏。 |
| `gap` | `number` | `4` | 间距，单位 px。 |
| `id` | `string` | — | 根元素标识。 |
| `style` | `React.CSSProperties` | — | 根元素行内样式，覆盖内部同名样式。 |
| `className` | `string` | `""` | 合并到根元素的附加类名。 |

根元素为 span；两个值均未传时不渲染。使用 small、round 的 green / red Tag。

## Usage

```jsx
import Tag, { DiffTags } from "./components/Tag/index.jsx";

<Tag variant="green" size="medium" shape="square" icon="./assets/uploads/icon/FileType/outlined/code.svg">已完成</Tag>
<Tag size="small">标签</Tag>
<DiffTags added={1280} removed={64} />
```
