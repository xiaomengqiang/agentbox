# SegmentedButton 分段按钮

## Overview

在一组互斥选项间切换。Text 用于有明确名称的视图或范围；Icon 用于用户熟悉的紧凑视图工具栏。

- Text：Round 高 44px、Square 高 36px，总宽默认 514px，分段等宽；可带前缀图标。
- Icon：轨道高 32px、padding 2px，每段固定 36×28px；14px 图标双向居中。总宽为 `36 × count + 4px`。
- Default、Hover、Pressed、Disabled 四种交互外观，分别保留选中与未选中关系；无独立 Focus 视觉态。

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| variant | `text / icon` | `text` | 内容类型 |
| count | `number` | `2` | 分段数量，预览支持 2–5 |
| width | `number / string` | Text `514px`，Icon 按内容 | 可传 px 数字或 CSS 宽度；Icon 子按钮仍固定 36px |
| radius | `24 / 8` | `24` | 仅 Text：Round / Square；Icon 固定外圆角 8px、内圆角 6px |
| showIcon | `boolean` | `false` | 仅 Text：显示 16px 前缀图标 |
| icon | `string / ReactNode / array` | `settings` | 图标或图标数组；数组循环使用 |
| labels | `string[]` | 每段“文本” | Text 文案；Icon 的无障碍名称，数量由 count 决定 |
| segments | `array` | — | 自定义 key、label、icon、ariaLabel、disabled；优先于生成参数 |
| activeKey / defaultActiveKey | `string` | 首段 | 受控 / 非受控选中值 |
| disabled | `boolean` | `false` | 整组禁用 |
| onChange / onSegmentClick | `(key, index) => void` | — | 点击可用段后的回调 |
| className | `string` | `""` | 附加类名 |

## Color Spec

| Element | Selected | Unselected |
| --- | --- | --- |
| Text | `--color-font-primary`（text_primary） | `--color-font-secondary`（text_secondary） |
| Icon / 前缀图标 | `--color-icon-primary` | `--color-icon-secondary` |
| Segment background | `--surface-container-lowest` | transparent |
| Track | `--color-comp-background-tertiary` | 同 Selected |

未选中段 Hover / Pressed 叠加对应 `--color-interactive-*`；Disabled 使用 `--text-disabled`。配色随主题切换。

## Usage

```jsx
import SegmentedButton from "./components/SegmentedButton/index.jsx";

<SegmentedButton count={3} radius={24} labels={["最近", "收藏", "共享"]} />
<SegmentedButton count={2} radius={8} showIcon icon={["layout-grid", "list"]} labels={["卡片", "列表"]} />
<SegmentedButton variant="icon" count={2} icon={["layout-grid", "list"]} labels={["卡片视图", "列表视图"]} />
```

Configurator 提供 Variant、Count、Width；仅 Text 显示 Shape 与前缀图标开关。文案不开放编辑，直接点击预览切换选中段。
