# Switch

## Overview

#### 作用

Switch 用于切换开 / 关两种布尔状态，支持受控和非受控用法。

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
| `checked` | `boolean` | — | 受控开关状态；非 `undefined` 且非 `null` 时进入受控模式；优先于 `defaultChecked`。 |
| `defaultChecked` | `boolean` | `false` | 非受控模式的初始状态。 |
| `disabled` | `boolean` | `false` | 禁止切换并将整体透明度设为 50%。 |
| `label` | `string` | — | 右侧标签，同时参与可点击区域。 |
| `onChange` | `(next: boolean, event) => void` | — | 状态切换回调。 |
| `id` | `string` | — | 根 `label` 的元素标识。 |
| `style` | `React.CSSProperties` | — | 应用于根 `label` 的行内样式。 |
| `className` | `string` | — | 追加到根 `label` 的类名，保留内部类名。 |

## Usage

```jsx
import { useState } from "react";
import Switch from "./components/Switch/index.jsx";

export default function SwitchExample() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div>
      <Switch defaultChecked label="消息通知" />
      <Switch checked={enabled} onChange={setEnabled} label="自动同步" />
      <Switch checked disabled label="组织策略已开启" />
    </div>
  );
}
```
