# ActionChip

## Overview

#### 作用

ActionChip 用于在内容附近提供轻量、即时的快捷操作，例如复制、分享或导出。它只表达操作，不用于选择状态或提交表单。

#### 视觉样式

- 默认样式：用于低干扰的行内操作，如卡片工具栏中的“复制”。
- 固定宽度：用于需要整齐对齐的一组操作；空间不足时文字自动省略。

#### 尺寸与形状

- 固定高度 24px，胶囊圆角，默认宽度随内容自适应。
- `width` 可传数字或 CSS 长度；组件最大宽度不超过父容器。

#### 图标

- 支持一个 14px 前置 Lucide 图标；不传 `icon` 时显示纯文字。
- 图标用于帮助识别动作，不应代替必要的文字标签。

#### 使用原则

- 使用简短动词，如“复制”“分享”“下载”。
- 同一区域避免堆叠过多 ActionChip；主要提交操作应使用 Button。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | 操作文案。 |
| `icon` | `string` | — | Lucide 图标名；缺省时仅显示文字。 |
| `width` | `number \| string` | `auto` | 数字按 px 处理，字符串作为 CSS 宽度。 |
| `onClick` | `function` | — | 点击回调。 |
| `className` | `string` | `""` | 追加到根按钮的类名。 |

## Color Spec

| Element / State | Background | Outline | Text / Icon |
|-----------------|------------|---------|-------------|
| Default | `--brand-10` | 无 | `--color-font-emphasize` / `--color-icon-emphasize` |
| Hover | Default 上叠加 `--color-interactive-hover` | 同 Default | 同 Default |
| Pressed | Default 上叠加 `--color-interactive-pressed` | 同 Default | 同 Default |
| Focus visible | 同 Default | `--focus-ring` | 同 Default |

组件当前没有 `disabled` prop。

## Usage

```jsx
import ActionChip from "./components/ActionChip/index.jsx";

<ActionChip icon="copy" label="复制" onClick={handleCopy} />
<ActionChip icon="download" label="导出报告" width={96} />
<ActionChip label="查看详情" width="100%" />
```

