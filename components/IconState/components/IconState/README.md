# IconState

## Overview

#### 作用

`IconState` 用于展示带有明确视觉状态的 32px 图标按钮。它覆盖栏目中的方形图标操作，以及对话框中的圆形图标操作；`state` 可用于在预览、静态展示或业务状态中指定默认、悬浮、激活和禁用效果。

#### 视觉样式

- `square`（栏目 icon）：用于栏目工具栏、侧栏或内容区的紧凑图标操作，例如搜索、切换分栏或展开侧栏。图标可在 32px 点击区域中使用 20px 或 16px 图形。
- `circle`（对话框 icon）：用于对话框内语义明确的图标操作，例如发送、暂停或新增内容。圆形框可使用灰色、黑色或业务指定的自定义颜色。

#### 尺寸与形状

- 外框 `size` 默认是 `32`，两种样式都可修改。
- `square` 为 6px 圆角方形；栏目图标默认 20px，预览提供 20px 和 16px。
- `circle` 为正圆形，图标默认 32px；“加号”处于 `active` 状态时使用 23px 菱形加号 SVG。

#### 图标

- 栏目 icon 可选 `search`、`menu`、`columns`、`fullscreen`、`sidebar`，也可通过 `src` 传入自定义 SVG 或 data URL。
- 对话框 icon 仅支持 `dialog-glyph`（发送）、`dialog-pause`（暂停）和 `dialog-add`（加号）；圆形样式会忽略 `src`。暂停图标没有灰色或自定义框色，启用时固定使用黑色 SVG，禁用时切换为 `#E5E5EA` 浅灰 SVG。
- 未知的栏目 `icon` 会回退到 `search`；未知的对话框 `icon` 会回退到 `dialog-glyph`。

#### 使用原则

- 为每个可点击图标提供与业务动作一致的 `ariaLabel`，例如“搜索”“发送”或“新增”。
- 在静态状态展示中传入 `state`；它的优先级高于 `disabled` 和 `active`，并且不会再跟随鼠标改变视觉状态。
- 同一操作区域中，使用图标传达单一且容易辨识的动作；没有明确语义时，补充可见文字或提示。

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"square" \| "circle"` | `"square"` | 栏目方形框或对话框圆形框。 |
| `size` | `number` | `32` | 按钮外框宽高，单位 px。 |
| `iconSize` | `number` | 方形 `20`；圆形 `32` | 图标渲染尺寸；圆形“加号”在激活态未传入该值时为 `23`。 |
| `icon` | `string` | 方形 `"search"`；圆形 `"dialog-glyph"` | 方形使用内置图标；圆形仅接受发送、暂停和加号三项。 |
| `src` | `string` | — | 仅用于方形自定义 SVG 路径或 data URL，优先于 `icon`。 |
| `frameColor` | `"gray" \| "black" \| string` | 圆形 `"gray"` | 圆形框颜色；支持预设或任意 CSS 色值。`dialog-pause` 会忽略此值并固定为黑色。 |
| `iconColor` | `string` | 灰色框为 `var(--color-icon-primary)`；其余为白色 | 圆形图标颜色，适用于需要调整自定义框对比度的场景。 |
| `state` | `"default" \| "hover" \| "active" \| "disabled"` | — | 显式指定视觉状态，优先级最高。 |
| `disabled` | `boolean` | `false` | 未传 `state` 时禁用按钮。 |
| `active` | `boolean` | `false` | 未传 `state` 时显示激活态。 |
| `onClick` | `function` | — | 按钮点击回调。 |
| `ariaLabel` | `string` | `"icon"` | 按钮的无障碍名称。 |

## Color Spec

| 样式 / 状态 | 背景 | 图标 | 说明 |
| --- | --- | --- | --- |
| `square` 默认 | 透明 | SVG 原始图形 | 用于栏目中的常规图标操作。 |
| `square` 悬浮 / 激活 | `--container-05` | SVG 原始图形 | 为悬浮和按下操作提供轻量反馈。 |
| `circle` + `gray` 默认 | 透明 | `--color-icon-primary` | 用于低强调的对话框操作。 |
| `circle` + `gray` 悬浮 / 激活 | `--container-05` | `--color-icon-primary` | 使用 5% 中性色背景提示可操作性。 |
| `circle` + `black` 默认 / 悬浮 / 激活 | `#000000` | 白色 | 三种状态保持相同的纯黑容器。 |
| `circle` + `dialog-pause` 默认 / 悬浮 / 激活 | SVG 内置黑色 | 白色停止方块 | 暂停图标没有灰色状态，三种启用状态保持相同。 |
| `circle` + `dialog-pause` 禁用 | SVG 内置 `#E5E5EA` | 透明停止方块 | 使用专属禁用 SVG，不叠加通用 50% 透明度。 |
| `circle` + 自定义颜色 默认 | `frameColor` 的值 | 白色，或 `iconColor` | 用于业务需要的强调色容器。 |
| `circle` + 自定义颜色 悬浮 / 激活 | `frameColor` 加 `--on-primary-10` 覆盖层 | 白色，或 `iconColor` | 保留深色自定义框的交互反馈。 |
| 其他禁用态 | 当前状态样式，整体 `opacity: 0.5` | 同当前状态 | `state="disabled"` 同时设置原生 `disabled`。 |
| 键盘焦点 | 保持当前背景 | 保持当前图标 | 使用 `--focus-ring` 与 `--outline-offset-gap` 显示焦点轮廓。 |

## Usage

```jsx
import IconState from "./components/IconState/index.jsx";

// 栏目 icon：20px 搜索图标
<IconState
  variant="square"
  icon="search"
  iconSize={20}
  ariaLabel="搜索"
/>

// 栏目 icon：自定义 SVG
<IconState
  variant="square"
  src="./assets/uploads/icon/iconstate/icon-search.svg"
  iconSize={16}
  state="hover"
  ariaLabel="自定义操作"
/>

// 对话框 icon：透明灰色方案的发送操作
<IconState
  variant="circle"
  icon="dialog-glyph"
  frameColor="gray"
  state="hover"
  ariaLabel="发送"
/>

// 对话框 icon：黑色暂停操作
<IconState
  variant="circle"
  icon="dialog-pause"
  frameColor="black"
  state="active"
  ariaLabel="暂停"
/>

// 对话框 icon：激活态会使用菱形加号 SVG
<IconState
  variant="circle"
  icon="dialog-add"
  frameColor="#0A59F7"
  state="active"
  ariaLabel="加号"
/>
```
