# Toggle

开关组件，用于在「开 / 关」两种互斥状态之间切换，固定尺寸 36 × 20，支持受控与非受控用法。

## Features

- 四态齐全：开 / 关 × 可用 / 禁用（禁用＝整体 opacity 50%）
- 开态轨道 `Light/Brand #0A59F7`，关态轨道 `comp_background_secondary`（黑 10%）
- 圆形滑块 `comp_background_primary_contrary`（白色）；关态滑块带 `comp_background_tertiary` 1px 外描边
- 可选右侧文案，点击文字同样可切换
- hover / 按下叠加层、键盘 `Space` 切换、`:focus-visible` 焦点环
- 深色模式自动适配（滑块恒为白色）

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | — | 受控选中态；传入即受控 |
| `defaultChecked` | `boolean` | `false` | 非受控初始选中态 |
| `disabled` | `boolean` | `false` | 禁用，整体透明度 50%，不响应交互 |
| `label` | `string` | — | 开关右侧文案，同时作为可访问名称 |
| `onChange` | `(next: boolean, e) => void` | — | 状态切换回调 |
| `className` | `string` | — | 追加到根节点 |

## Usage

```jsx
import Toggle from "./components/Toggle/index.jsx";

// 非受控
<Toggle defaultChecked label="消息通知" onChange={(next) => console.log(next)} />

// 受控
const [on, setOn] = useState(true);
<Toggle checked={on} onChange={setOn} label="深色模式" />

// 禁用
<Toggle checked label="已锁定（开·禁用）" disabled />
<Toggle label="已锁定（关·禁用）" disabled />
```
