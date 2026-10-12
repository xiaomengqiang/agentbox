# DropdownButton

## Overview

#### 作用

用于展开操作菜单或选项列表，例如新建类型、导出格式或模式切换。组件仅渲染触发按钮，菜单内容和展开状态由调用方管理。

#### 视觉样式

- `primary`：实心背景。
- `secondary`：浅色填充背景。
- `tertiary`：描边样式。
- `text`：文字样式。

视觉样式不表示菜单是否展开；展开状态由调用方管理。

#### 尺寸与形状

- 三种尺寸：`large`（16px 字号、500 字重）、`medium`（32px 高、14px 字号、500 字重）、`small`（12px 字号、400 字重）；每种尺寸均支持全部四种 `variant`，共 12 种组合。
- 两种形状：`round`、`square`，可与所有尺寸和类型组合。

#### 图标

- 支持可选的前置图标和文字后的内容图标，各尺寸与类型均可配置。
- `primary` 的图标显示为单色。
- 两种下拉指示图标：`caret-down-filled`、`chevron-down`，用于提示存在可展开的内容。

#### 使用原则

标签保持简短，说明菜单用途或当前选项；英文使用 sentence case（句首字母大写，专有名词保留原有大小写）。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "tertiary" \| "text"` | `"primary"` | 视觉样式；仅支持所列规范值，不支持别名。所有尺寸均支持全部四种取值 |
| `size` | `"large" \| "medium" \| "small"` | `"large"` | 按钮尺寸（size），与视觉样式 variant 独立 |
| `shape` | `"round" \| "square"` | `"round"` | 仅支持所列规范值，不支持别名。所有尺寸与类型均可选择 |
| `dropdownIcon` | `"caret-down-filled" \| "chevron-down"` | 见说明 | Small Text 默认 `chevron-down`，其他组合默认 `caret-down-filled` |
| `leadingIconSrc` | `string` | — | 文字前图标的资源路径 |
| `contentIconSrc` | `string` | — | 文字后图标的资源路径 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | 原生 button type |
| `onClick` | `function` | — | 点击回调 |
| `id` | `string` | — | 根按钮的元素标识 |
| `style` | `React.CSSProperties` | — | 根按钮的行内样式 |
| `className` | `string` | `""` | 追加到根按钮的 class |
| `data-state` | `"hover" \| "focus" \| "pressed"` | — | 静态展示指定状态，仅用于文档和走查 |
| `children` | `ReactNode` | — | 按钮内容 |

## Usage

```jsx
import DropdownButton from "./components/DropdownButton/index.jsx";

<DropdownButton
  variant="tertiary"
  size="medium"
  dropdownIcon="caret-down-filled"
>
  描边操作
</DropdownButton>

<DropdownButton
  variant="tertiary"
  size="small"
  contentIconSrc="./assets/uploads/icon/file_type/pdf.svg"
>
  描边操作
</DropdownButton>

<DropdownButton
  variant="text"
  size="small"
  leadingIconSrc="./assets/uploads/icon/prompt input/agent.svg"
>
  文字操作
</DropdownButton>
```
