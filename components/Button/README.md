# Button

## Overview

#### 作用

用于触发操作，例如保存、新建或确认。

#### 视觉样式

支持四种视觉样式，根据操作在当前区域中的重要程度选择：

- `filled`：用于主操作，如保存。
- `tonal`：用于需要强调的辅助操作，如预览。
- `outlined`：用于需要明确边界的次要操作，如取消。
- `text`：用于上下文中的轻量操作，如编辑。

同一操作区域通常只保留一个高强调的主操作；相同操作可根据场景选择不同视觉样式。

#### 尺寸与形状

- 两种尺寸：`large`、`small`。
- 两种形状：`round`、`square`；按设计规范，`square` 仅适用于 `outlined + small`。

#### 图标

支持前置或后置图标，也可仅显示图标。

#### 使用原则

标签保持简短，使用明确的动作词；英文使用 sentence case（句首字母大写，专有名词保留原有大小写）。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"filled" \| "tonal" \| "outlined" \| "text"` | `"filled"` | 支持别名：`primary`、`secondary`、`tertiary`、`plain`；非法值回退为 `filled` |
| `size` | `"large" \| "small"` | `"large"` | 按钮尺寸；非法值回退为 `large` |
| `shape` | `"round" \| "square"` | `"round"` | 支持别名：`rounded`、`pill`、`rect`、`sharp`；非法值回退为 `round`。`square` 只用于 `outlined + small` |
| `icon` | `string` | — | Lucide 图标名，使用 kebab-case，如 `plus`、`chevron-right` |
| `iconSrc` | `string` | — | 自定义图标资源路径；同时传入时优先于 `icon` |
| `iconPosition` | `"start" \| "end"` | `"start"` | 图标位于内容前或后；非法值按 `start` 处理 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | 原生 button type |
| `onClick` | `function` | — | 点击回调 |
| `className` | `string` | `""` | 追加到根按钮的 class |
| `data-state` | `"hover" \| "focus" \| "pressed"` | — | 静态展示指定状态，仅用于文档和走查 |
| `children` | `ReactNode` | — | 按钮内容；空值时不渲染文字标签 |

## Color Spec

| Variant | Background | Border | Text / icon | Hover | Pressed |
|---------|------------|--------|-------------|-------|---------|
| `filled` | `--color-icon-primary` | — | `--color-font-on-primary` | 叠加 `--on-primary-10` | 叠加 `--on-primary-15` |
| `tonal` | `--color-comp-background-tertiary` | — | `--color-icon-primary` | 叠加 `--color-interactive-hover` | 叠加 `--color-interactive-pressed` |
| `outlined` | `transparent` | `--color-comp-border` | `--color-icon-primary` | 叠加 `--color-interactive-hover` | 叠加 `--color-interactive-pressed` |
| `text` | `transparent` | — | `--color-font-emphasize` | 文字变为 `--primary-hover` | 文字变为 `--primary-active` |

- Disabled：保留默认颜色，整体 `opacity: 0.5`
- Focus：`--black` 聚焦环；`text` 无聚焦环
- Dark mode：语义 token 自动切换；`filled` 文字切换为 `--black`

## Usage

```jsx
import Button from "./components/Button/index.jsx";

<Button variant="filled" onClick={handleSave}>
  保存
</Button>

<Button variant="tonal" size="small" icon="plus">
  新建
</Button>

<Button
  variant="outlined"
  size="small"
  shape="square"
  icon="chevron-right"
  iconPosition="end"
>
  更多
</Button>

<Button
  variant="text"
  iconSrc="../assets/icons/custom/prompt input/agent.svg"
  disabled
>
  Agent
</Button>
```
