# SearchBar

## Overview

#### 作用

搜索输入框，支持受控和非受控输入、回车搜索与清空。

#### 视觉样式

- `filled`：填充背景，圆角 24px。
- `unfilled`：透明背景，圆角 6px。
- 搜索框容器在两种样式下均无独立 Hover / Focus / Pressed 外观；Typing 沿用 Default 外观，仅增加原生光标，不显示外框。

#### 尺寸

尺寸与填充样式独立，支持全部 2 × 2 组合；字号与尺寸一一绑定，占位文字和输入文字在所有状态下均使用 regular（400）。

| size | 高度 | 字号 / 行高 |
|------|------|-------------|
| `medium` | 40px | 14px / 22px |
| `small` | 36px | 12px / 18px |

#### 图标

搜索和清空分别使用 `assets/uploads/icon/function/search.svg`、`assets/uploads/icon/function/close.svg`。所有尺寸图标均为 16px，图标与输入区间距 8px。清空按钮位于右侧，点击区域为 24 × 24px，悬浮时不增加底色。

#### 输入光标

与 TextFields 一致，使用浏览器原生光标。光标的尺寸、闪烁、选区、输入法及滚动行为由浏览器管理；聚焦空值时保留占位文字。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"medium" \| "small"` | `"medium"` | 尺寸及对应字号，无独立字号属性 |
| `variant` | `"filled" \| "unfilled"` | `"filled"` | 填充样式，与 size 独立 |
| `placeholder` | `string` | `"请输入搜索内容"` | 占位文字，支持空字符串 |
| `value` | `string` | — | 受控值，配合 onChange 使用 |
| `defaultValue` | `string` | `""` | 非受控初始值，仅初始化生效 |
| `onChange` | `(value: string) => void` | — | 输入与清空时返回字符串 |
| `onSearch` | `(value: string) => void` | — | 回车搜索，输入法组合期间不触发 |
| `clearable` | `boolean` | `true` | 所有尺寸均支持；有文字且未禁用时显示清空按钮 |
| `onClear` | `() => void` | — | 清空回调；清空后聚焦输入框 |
| `disabled` | `boolean` | `false` | 禁用输入，隐藏清空按钮 |
| `id` | `string` | — | 根 div 的元素标识 |
| `className` | `string` | — | 追加到根 div，保留内部类名 |
| `style` | `React.CSSProperties` | — | 根 div 的行内样式，调用方值优先；宽度默认由父容器决定 |

输入框使用原生 `type="search"` 与 `enterKeyHint="search"`；仅显示组件清空按钮，避免与浏览器自带按钮重复。传入 onSearch 时 Enter 阻止表单默认提交，由回调处理搜索；未传入时保留原生表单行为。

受控判断为 `value != null`；清空通过 `onChange("")` 通知外部更新。`value` 和 `defaultValue` 不应同时使用。

## Usage

```jsx
import { useState } from "react";
import SearchBar from "./SearchBar/index.jsx";

export default function SearchExample() {
  const [keyword, setKeyword] = useState("");

  return (
    <>
      <SearchBar />
      <SearchBar size="medium" variant="unfilled" placeholder="搜索" />
      <SearchBar size="small" variant="filled" clearable={false} />
      <SearchBar defaultValue="手机" onChange={console.log} />
      <SearchBar
        id="contact-search"
        placeholder="搜索联系人"
        value={keyword}
        onChange={setKeyword}
        onSearch={console.log}
        style={{ width: 320 }}
      />
    </>
  );
}
```
