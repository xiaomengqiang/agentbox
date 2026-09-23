# SearchBar

## Overview

#### 作用

搜索输入框，支持受控和非受控输入、回车搜索与清空。

#### 视觉样式

- `large`：填充式，用于主要搜索入口；高 40px，字号 14px / 行高 22px，圆角 24px。
- `small`：透明背景，用于紧凑区域搜索；高 36px，字号 12px / 行高 16px，圆角 6px。
- Large 有 Hover 外观；两种尺寸均无 Focus / Pressed 专属外观，聚焦仍可正常输入。

#### 图标

搜索图标使用 `assets/uploads/icon/function/search.svg`。清空按钮固定在右侧，仅使用 `assets/uploads/icon/function/close.svg`。两个图标均使用 `--color-icon-secondary` 着色。Large 两个图标均为 16px，Small 为 16px，图标与输入区间距 8px。

#### 输入光标

两种尺寸均使用 `--text-primary`（浅色黑 90%）。自绘 SVG 光标宽 1.5px、圆角 0.75px，Large 高 24px，Small 高 18px；输入时与前面的文字间隔 0.5px。聚焦时以 1.1 秒周期闪烁，空值保留占位文字，失焦后隐藏。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"large" \| "small"` | `"large"` | 尺寸与填充样式 |
| `fontSize` | `string` | Large `--font-size-base` / Small `--font-size-sm` | 使用项目 `--font-size-*` token 名称；调整占位与输入字号，优先于 style.fontSize；不改变行高、光标高度。无效值回退默认字号 |
| `placeholder` | `string` | `"请输入搜索内容"` | 占位文字；空字符串回退默认文案 |
| `value` | `string` | — | 受控值，配合 onChange 使用 |
| `defaultValue` | `string` | `""` | 非受控初始值，仅初始化生效 |
| `onChange` | `(value: string) => void` | — | 输入与清空时返回字符串 |
| `onSearch` | `(value: string) => void` | — | 回车搜索 |
| `clearable` | `boolean` | Large true / Small false | 有文字且未禁用时显示右侧清空按钮 |
| `onClear` | `() => void` | — | 清空回调 |
| `disabled` | `boolean` | `false` | 禁用输入，隐藏清空按钮 |
| `className` | `string` | — | 追加类名 |
| `style` | `object` | — | 内联样式，宽度默认由父容器决定 |

不提供 `state` 或 `clearPosition` 属性。受控判断为 `value != null`；清空通过 `onChange("")` 通知外部更新。`value` 和 `defaultValue` 不应同时使用。

## Color Spec

| 内容 | Token / 外观 |
|------|-------------|
| Large 背景 | `--surface-container` |
| Large Hover | 叠加 `--color-interactive-hover` |
| Small 背景 | transparent |
| 占位文字（Large / Small） | `--text-tertiary` |
| 输入文字 / 光标 | `--text-primary` |
| 搜索 / 清空图标 | `--color-icon-secondary` |
| 禁用搜索图标 | `--color-icon-fourth` |
| 禁用文字 | `--text-disabled` |

## Usage

```jsx
import SearchBar from "./SearchBar/index.jsx";

<SearchBar />
<SearchBar size="small" placeholder="搜索" />
<SearchBar size="large" fontSize="--font-size-md" />
<SearchBar defaultValue="手机" onChange={console.log} />

const [keyword, setKeyword] = useState("");
<SearchBar value={keyword} onChange={setKeyword} onSearch={console.log} />
<SearchBar placeholder="搜索联系人" style={{ width: 320 }} />
```
