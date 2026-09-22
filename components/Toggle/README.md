# Toggle

## Overview

#### 作用

Toggle 用于立即切换开 / 关状态，例如通知、同步或显示设置。它适合即时生效的布尔设置，不用于需要提交确认的选择。

#### 视觉样式

- Off：表示功能关闭，使用低强调轨道。
- On：表示功能开启，使用品牌色轨道。
- Disabled：保留 On / Off 状态，并以 50% 不透明度表示不可修改。

#### 尺寸与形状

- 轨道固定为 36 × 20px，滑块为 16px，四周留 2px。
- 轨道与滑块均使用全圆角。

#### 使用原则

- 标签描述被控制的设置，如“消息通知”，不要写“开启/关闭”。
- 点击开关或标签均会切换；禁用时两者都不可交互。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | — | 受控开关状态；非 `null` 时进入受控模式。 |
| `defaultChecked` | `boolean` | `false` | 非受控模式的初始状态。 |
| `disabled` | `boolean` | `false` | 禁止切换并将整体透明度设为 50%。 |
| `label` | `string` | — | 右侧标签，同时参与可点击区域。 |
| `onChange` | `(next: boolean, event) => void` | — | 状态切换回调。 |
| `className` | `string` | `""` | 追加到根 `label` 的类名。 |

## Color Spec

| Element / State | Track | Knob / Outline | Label |
|-----------------|-------|----------------|-------|
| Off | `--color-comp-background-secondary` | `--color-comp-background-primary`；外描边 `--color-comp-background-tertiary` | `--on-surface` |
| On | `--color-comp-background-emphasize` | `--color-comp-background-primary` | `--on-surface` |
| Hover | 当前轨道上叠加 `--color-interactive-hover` | 同当前状态 | 同当前状态 |
| Pressed | 当前轨道上叠加 `--color-interactive-pressed` | 同当前状态 | 同当前状态 |
| Focus visible | 同当前状态 | `--focus-ring` | 同当前状态 |
| Disabled | 同当前状态，整体 opacity 50% | 同当前状态 | 同当前状态 |

Dark 模式下滑块固定使用 `--white`。

## Usage

```jsx
import { useState } from "react";
import Toggle from "./components/Toggle/index.jsx";

<Toggle defaultChecked label="消息通知" />

const [enabled, setEnabled] = useState(true);
<Toggle checked={enabled} onChange={setEnabled} label="自动同步" />;

<Toggle checked disabled label="组织策略已开启" />
```

