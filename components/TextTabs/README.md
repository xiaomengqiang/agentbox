# TextTabs

纯文字标签导航组件，用于页面内的视图切换。只有选中与未选中两种状态，无背景、无下划线。

## Features

- 纯文字标签：未选中 `rgba(0,0,0,.4)` / Regular，选中 `#000000` / Bold，字号均为 18px
- 标签间距默认 24px，通过 `gap` 可调
- 支持受控（`activeId`）与非受控（`defaultActiveId`）两种用法
- 横向溢出时自动滚动，并保证选中项始终可见（隐藏滚动条）
- 键盘导航：`←` `→` 循环切换，`Home` / `End` 跳首尾
- 未选中态预留 Bold 宽度，切换时文字不抖动
- 深色模式下选中态自动反相为纯白

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<{ id: string \| number, label: string }>` | — (required) | 标签数据 |
| `activeId` | `string \| number` | — | 受控选中项 id |
| `defaultActiveId` | `string \| number` | 第一项 | 非受控初始选中项 id |
| `onChange` | `(item) => void` | — | 选中项变化回调，返回被选中项 |
| `gap` | `number` | `24` | 标签之间的间距（px） |

## Usage

```jsx
import TextTabs from "./components/TextTabs/index.jsx";

const tabs = [
  { id: "all", label: "全部" },
  { id: "photo", label: "图片" },
  { id: "video", label: "视频" },
];

// 非受控
<TextTabs items={tabs} defaultActiveId="photo" onChange={(item) => console.log(item.id)} />

// 受控
const [active, setActive] = useState("all");
<TextTabs items={tabs} activeId={active} onChange={(item) => setActive(item.id)} />
```
