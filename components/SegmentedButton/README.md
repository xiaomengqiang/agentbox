# Segmented Button

- 分段按钮：胶囊轨道上并排多段可点击区域，选中段悬浮白底、未选中段透明。
- 两种类型：**文本类**（`variant="text"`，默认）与**纯图标类**（`variant="icon"`）。
- 圆角可选：**24px**（默认，胶囊）或 **8px**（方角感），由 `radius` 控制。

## 核心配置

| 需求 | 对应参数 | 说明 |
|------|----------|------|
| 文本类按钮还是纯图标类按钮 | `variant` | `"text"`（默认）\| `"icon"` |
| 文本类按钮是否显示图标 | `showIcon` | 布尔开关，`true` 时图标显示在文本左侧（间距 8px） |
| 有几个子按钮 button | `count` | 子按钮数量（2 / 3 / 4 / 5 …），也可用 `labels` 指定文本 |
| 总长度与自适应 | （固定） | 文本类按钮总宽固定 **514px**，内部子按钮按数量等分自适应（`flex: 1`） |
| 圆角大小 | `radius` | `24`（默认，胶囊）\| `8`（方角感） |

## Features

- 文本类按钮总宽固定 514px、高 44px，内部子按钮按数量等分自适应
- 纯图标类按钮 76×32、圆角 8，图标在子按钮内居中
- 支持受控（`activeKey`）/ 非受控（`defaultActiveKey`）两种选中管理
- 完整交互态：默认 / 悬停 / 按压 / 键盘聚焦 / 禁用（整组或单段）
- 文本类：文字 14px；带图标时文字 regular、纯文本时 medium；图标 16px、与文本间距 8px、组合居中
- 图标颜色跟随文字颜色（选中 `--on-surface` / 未选中 `--text-secondary`，currentColor）

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"text" \| "icon"` | `"text"` | 按钮类型：文本类 / 纯图标类 |
| `count` | `number` | `2` | 子按钮数量（传入 `segments` 时忽略） |
| `labels` | `string[]` | 每段 `"文本"` | 各子按钮文本（长度即子按钮数，覆盖 `count`） |
| `showIcon` | `boolean` | `false` | 文本类按钮是否显示图标 |
| `radius` | `24 \| 8` | `24` | 圆角大小：24px（胶囊）\| 8px（方角感） |
| `icon` | `ReactNode \| string \| ReactNode[]` | — | 图标：Lucide 图标名 / 内联 SVG / 数组按段循环取用 |
| `segments` | `Array<{ key, label?, icon?, disabled? }>` | — | 完全自定义分段数据（优先于以上参数） |
| `activeKey` | `string` | — | 受控选中段 key |
| `defaultActiveKey` | `string` | 第一段 key | 非受控默认选中段 |
| `disabled` | `boolean` | `false` | 整组禁用 |
| `onChange` | `(key, index) => void` | — | 选中段变化回调 |
| `onSegmentClick` | `(key, index) => void` | — | 单段点击回调 |
| `className` | `string` | `""` | 附加类名 |

## Usage

```jsx
import SegmentedButton from "./SegmentedButton/index.jsx";

// 1. 文本类按钮：2 个子按钮，总宽固定 514px，内部等分自适应
<SegmentedButton variant="text" count={2} defaultActiveKey="s0" />

// 2. 文本类按钮 + 图标开关：3 个子按钮，每个子按钮左侧显示图标
<SegmentedButton
  variant="text"
  count={3}
  showIcon
  icon={<SettingsIcon />}
  defaultActiveKey="s0"
/>

// 3. 纯图标类按钮：76×32，2 个子按钮各一个图标
<SegmentedButton
  variant="icon"
  count={2}
  icon={[<EyeIcon />, <CodeIcon />]}
  defaultActiveKey="s0"
/>

// 4. 完全自定义（segments 优先）
<SegmentedButton
  segments={[
    { key: "a", label: "文本", icon: <SettingsIcon /> },
    { key: "b", label: "文本" },
  ]}
  defaultActiveKey="a"
/>
```
