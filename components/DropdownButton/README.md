# DropdownButton

下拉操作触发按钮。组件只渲染按钮，不渲染 menu，也不管理展开状态。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"filled" \| "tonal" \| "outlined" \| "text"` | `"filled"` | 支持别名：`primary`、`secondary`、`tertiary`、`plain`。XS 只支持 `outlined` 和 `text`，其他值转为 `outlined` |
| `size` | `"large" \| "small" \| "xs"` | `"large"` | 按钮尺寸 |
| `shape` | `"round" \| "square"` | `"round"` | 支持别名：`rounded`、`pill`、`rect`、`sharp`。XS Outlined 强制使用 `square` |
| `dropdownIcon` | `"caret-down-filled" \| "chevron-down"` | 见说明 | XS Plain 默认 `chevron-down`，其他组合默认 `caret-down-filled` |
| `leadingIconSrc` | `string` | — | 文字前图标的资源路径 |
| `leadingIconAlt` | `string` | `""` | 文字前图标的 alt；为空时图标对辅助技术隐藏 |
| `contentIconSrc` | `string` | — | 文字后图标的资源路径，仅 XS Outlined 生效 |
| `contentIconAlt` | `string` | `""` | 文字后图标的 alt；为空时图标对辅助技术隐藏 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | 原生 button type |
| `onClick` | `function` | — | 点击回调 |
| `className` | `string` | `""` | 追加到根按钮的 class |
| `data-state` | `"hover" \| "focus" \| "pressed"` | — | 静态展示指定状态，仅用于文档和走查 |
| `aria-label` | `string` | — | 按钮的无障碍名称 |
| `aria-expanded` | `boolean` | — | menu 是否展开，由调用方控制 |
| `aria-controls` | `string` | — | 被控制的 menu 元素 ID |
| `children` | `ReactNode` | — | 按钮内容 |

## Color Spec

| Variant | Background | Border | Text / icon | Hover | Pressed |
|---------|------------|--------|-------------|-------|---------|
| `filled` | `--color-icon-primary` | — | `--color-font-on-primary` | 叠加 `--on-primary-10` | 叠加 `--on-primary-15` |
| `tonal` | `--color-comp-background-tertiary` | — | `--color-icon-primary` | 叠加 `--color-interactive-hover` | 叠加 `--color-interactive-pressed` |
| `outlined` | `transparent` | `--color-comp-border` | `--color-icon-primary` | 叠加 `--color-interactive-hover` | 叠加 `--color-interactive-pressed` |
| `text` | `transparent` | — | `--color-icon-primary` | 叠加 `--color-interactive-hover` | 叠加 `--color-interactive-pressed` |

- Disabled：保留默认颜色，整体 `opacity: 0.5`
- Focus：`--black` 聚焦环；`text` 无聚焦环
- Dark mode：语义 token 自动切换；`filled` 文字切换为 `--black`
- Dropdown 图标使用 `currentColor`，跟随文字颜色

## Usage

```jsx
import DropdownButton from "./components/DropdownButton/index.jsx";

<DropdownButton
  variant="outlined"
  size="small"
  dropdownIcon="caret-down-filled"
  aria-expanded={isOpen}
  aria-controls="actions-menu"
  onClick={() => setIsOpen((value) => !value)}
>
  文字操作
</DropdownButton>

<DropdownButton
  variant="outlined"
  size="xs"
  contentIconSrc="./assets/uploads/icon/file_type/pdf.svg"
>
  打开方式
</DropdownButton>

<DropdownButton
  variant="text"
  size="xs"
  leadingIconSrc="./assets/uploads/icon/prompt input/agent.svg"
>
  单agent模式
</DropdownButton>
```
