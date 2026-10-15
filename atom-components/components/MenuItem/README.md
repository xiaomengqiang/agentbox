# MenuItem

## Overview

#### 作用

MenuItem 用于显示可操作菜单条目。通过 `items` 提供条目内容，尺寸、样式、层级、展开图标、前置图标与右侧图标区域为独立属性轴。

#### 视觉样式

- `default`：普通文字与图标，默认背景透明。
- `error`：红色文字与前置图标，默认背景透明，Hover 为浅红色背景。
- 两种样式仅包含 Default 和 Hover 视觉状态；按下时保持当前悬浮效果。无 Focus、Selected、Disabled 状态；可选重命名交互保持 Hover 背景。

#### 尺寸与形状

| size | 条目高度 | 全部图标尺寸 | 字号 / 行高 | 圆角 |
| --- | --- | --- | --- | --- |
| `large` | 40px | 16px | 14px / 22px | 8px |
| `medium` | 36px | 16px | 14px / 22px | 6px |
| `small` | 32px | 14px | 12px / 18px | 6px |

所有尺寸文字字重均为 Regular（400）；左右内边距 12px，内容 gap 8px。宽度跟随父容器；条目默认紧贴，可通过根容器 `style` 设置宽度或行间距。

#### 图标

- `leadingIcon` 控制文字前的内容图标，资源由 `items[].iconSrc` 提供，默认使用 `sidebar/new-chat.svg`。
- `level` 只控制缩进：`level-1` 不额外缩进；`level-2` 保留一个图标位与 8px gap 的缩进。
- `dropdownIcon` 独立控制展开箭头，两个层级都可以开启或关闭。一级带箭头与二级不带箭头时，前置图标对齐；一级关闭箭头后内容直接靠左。
- `trailingIcon` 控制右侧独立区域，目前固定显示 `sidebar/more.svg`，开启后常驻显示。热区为 24×24px，默认 secondary 图标色，仅悬浮该热区时变为 primary；点击 More 不触发行展开或选择。Error 在配置器中默认关闭此开关，仍可手动开启。
- 所有图标使用原始 SVG 作为 mask，尺寸统一由 `size` 决定。`error` 只改变样式，不会自动替换前置图标；删除图标需通过 `items[].iconSrc` 提供。
- 一级带展开箭头时，整行（包括文字、图标和空白区域）触发展开；More 为独立操作区。

#### 使用原则

按设计规范，名称应为非空文本；调用方需保证传入的 `items[].label` 有效，组件不会拦截初始空名称。

#### 长文本

超出可用宽度时，名称右侧以 24px 渐变消失；悬浮条目后连续循环滚动全文，离开后回到开头。图标不参与滚动。短文本保持静止；系统减少动态效果开启时不自动滚动。

#### 重命名

开启 `renameable` 后，双击名称进入编辑：清空文字、自动聚焦并显示原生闪烁光标。输入框替换文字与右侧 More 区域，左侧箭头和图标保持不变；上下右距外框 2px，圆角为外框减 2px（6 / 4 / 4px）。输入框无填充，描边为 1px，描边和光标均为品牌主色。光标粗细由运行环境的原生输入框决定，组件未指定固定宽度。

按 Enter 或点击外部失焦后保存，空输入或纯空白保留原名称。中文输入法确认候选时不提交。组件立即显示新名称，并通过 `onRename(item, newName)` 通知调用方保存；外部更新 `items[].label` 优先。双击名称不会同时触发行展开或选择，启用后名称单击有 300ms 判定延迟。

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | 列表根容器元素标识 |
| `className` | `string` | `""` | 追加到列表根容器，保留内部类名 |
| `style` | `React.CSSProperties` | — | 列表根容器行内样式，调用方值优先 |
| `items` | `Array<{ id: string \| number, label: string, iconSrc?: string, expanded?: boolean }>` | `[]` | 条目内容；`id` 唯一，`label` 按设计规范为非空文本，`iconSrc` 为 SVG 资源路径；`expanded` 控制该条目的展开状态 |
| `size` | `"large" \| "medium" \| "small"` | `"large"` | 行高、字号、图标尺寸与圆角 |
| `variant` | `"default" \| "error"` | `"default"` | 普通 / 红色样式 |
| `level` | `"level-1" \| "level-2"` | `"level-1"` | 一级无额外缩进 / 二级保留图标位缩进 |
| `dropdownIcon` | `boolean` | `true` | 是否显示展开箭头，与层级独立 |
| `leadingIcon` | `boolean` | `true` | 是否显示前置内容图标 |
| `trailingIcon` | `boolean` | `false` | 是否显示右侧 More 图标区域 |
| `renameable` | `boolean` | `false` | 是否允许双击名称重命名，所有尺寸、样式与图标组合均支持 |
| `onRename` | `(item, newName) => void` | — | 非空且名称变化时提交一次；item.label 为修改前名称 |
| `defaultExpanded` | `boolean` | `false` | 条目非受控初始展开值；`items[].expanded` 优先 |
| `onSelect` | `(item) => void` | — | 点击普通条目内容时触发；一级带展开箭头时改为触发 onToggle |
| `onToggle` | `(item) => void` | — | 一级带箭头时点击整行、二级点击箭头时回传含新 `expanded` 的条目；受控模式由调用方更新 items |
| `onTrailingAction` | `(item) => void` | — | 点击右侧 More 时触发，不触发 `onSelect` 或 `onToggle` |

## Usage

```jsx
import MenuItem from "./MenuItem/index.jsx";

<MenuItem
  size="large"
  level="level-1"
  leadingIcon
  trailingIcon
  renameable
  onRename={(item, newName) => console.log("rename", item.id, newName)}
  style={{ width: 300 }}
  items={[{ id: "folder", label: "文件夹", iconSrc: "./assets/uploads/icon/sidebar/folder-close.svg" }]}
  onSelect={item => console.log("select", item.id)}
  onToggle={item => console.log("expanded", item.expanded)}
  onTrailingAction={item => console.log("more", item.id)}
/>

// 二级保留展开箭头占位，图标与一级对齐。
<MenuItem
  size="medium"
  level="level-2"
  dropdownIcon={false}
  trailingIcon
  items={[{ id: "chat", label: "对话条目" }]}
/>

// Error 可与所有尺寸、层级及图标开关组合。
<MenuItem
  size="small"
  variant="error"
  level="level-2"
  dropdownIcon={false}
  leadingIcon={false}
  items={[{ id: "error", label: "删除" }]}
/>
```

一级无需展开箭头时，设置 `level="level-1" dropdownIcon={false}`。
