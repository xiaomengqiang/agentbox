# Button

## Overview

#### 作用

用于触发操作，例如保存、新建或确认。

#### 视觉样式

- `primary`：实心背景。
- `secondary`：浅色填充背景。
- `tertiary`：描边样式。
- `text`：无背景文字样式。

#### 尺寸与形状

- 两种尺寸：`large`（16px 字号、500 字重）、`medium`（32px 高、14px 字号、500 字重）。
- 两种形状：`round`、`square`；与所有尺寸、样式、图标及状态自由组合。

#### 图标

支持文字按钮及带前置图标的文字按钮，不支持纯图标；纯图标操作使用 `IconButton`。通过 `icon` 传入图标资源路径，不限制文件名。

#### 使用原则

标签保持简短，使用明确的动作词；英文使用 sentence case（句首字母大写，专有名词保留原有大小写）。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "tertiary" \| "text"` | `"primary"` | 视觉样式；仅支持所列规范值，不支持别名。非法值回退为 `primary` |
| `size` | `"large" \| "medium"` | `"large"` | 按钮尺寸；非法值回退为 `large` |
| `shape` | `"round" \| "square"` | `"round"` | 仅支持所列规范值，不支持别名。非法值回退为 `round`。支持所有尺寸和样式 |
| `icon` | `string` | — | 前置图标资源路径或 URL；通过 mask 跟随文字颜色 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | 原生 button type |
| `onClick` | `function` | — | 点击回调 |
| `id` | `string` | — | 根按钮的元素标识 |
| `style` | `React.CSSProperties` | — | 根按钮的行内样式 |
| `className` | `string` | `""` | 追加到根按钮的 class |
| `children` | `ReactNode` | — | 必填，按钮文字内容；未提供或为空白时不渲染按钮 |

## Usage

```jsx
import Button from "./components/Button/index.jsx";

<Button variant="primary" onClick={handleSave}>
  保存
</Button>

<Button variant="secondary" size="medium" icon="./assets/uploads/icon/function/add.svg">
  新建
</Button>

<Button
  variant="tertiary"
  size="medium"
  shape="square"
  icon="./assets/uploads/icon/function/download.svg"
>
  更多
</Button>

<Button
  variant="text"
  icon="./assets/uploads/icon/function/edit.svg"
  disabled
>
  编辑
</Button>
```
