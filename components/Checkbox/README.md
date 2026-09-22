# Checkbox

## Overview

#### 作用

Checkbox 用于切换独立的布尔选项，或在一组选项中进行多选。它支持受控与非受控状态。

#### 视觉样式

- `square`：用于常规设置、协议确认和多选列表。
- `circle`：用于产品规范要求圆形选择标记的场景；行为仍是 checkbox，不表示单选。

#### 尺寸与形状

- 命中容器为 24 × 24px，实际选择框为 20 × 20px。
- 方形使用 4px 圆角；圆形使用全圆角。

#### 使用原则

- 标签应描述选中后成立的状态，例如“接收消息通知”。
- 多个互斥选项不应使用 Checkbox。
- 禁用状态保留当前选中外观，并将整个组件降至 40% 不透明度。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | — | 受控选中状态；非 `null` 时进入受控模式。 |
| `defaultChecked` | `boolean` | `false` | 非受控模式的初始选中状态。 |
| `onChange` | `(checked: boolean) => void` | — | 状态切换回调，参数为下一状态。 |
| `shape` | `"square" \| "circle"` | `"square"` | 选择框形状。 |
| `disabled` | `boolean` | `false` | 禁止鼠标和键盘切换，并移出 Tab 顺序。 |
| `label` | `string` | — | 右侧标签；缺省时只显示选择框。 |

## Color Spec

| Element / State | Background | Border / Outline | Text / Mark |
|-----------------|------------|------------------|-------------|
| Unchecked | `--color-fg-unchecked` | `--color-icon-tertiary` | `--on-surface` |
| Unchecked hover | `--color-comp-background-secondary` | `--color-icon-secondary` | 同 Default |
| Checked | `--color-comp-background-emphasize` | 同背景 | 白色勾；内部描边 `--container-05` |
| Checked hover | `--primary-hover` | `--primary-hover` | 同 Checked |
| Focus visible | 同当前状态 | `--focus-ring` | 同当前状态 |
| Disabled | 同当前状态，整体 opacity 40% | 同当前状态 | 同当前状态 |

## Usage

```jsx
import { useState } from "react";
import Checkbox from "./components/Checkbox/index.jsx";

<Checkbox defaultChecked label="自动同步" />
<Checkbox shape="circle" label="加入体验计划" />

const [agreed, setAgreed] = useState(false);
<Checkbox checked={agreed} onChange={setAgreed} label="我已阅读并同意服务协议" />
```

