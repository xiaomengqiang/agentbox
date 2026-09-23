# TextFields

## Overview

#### 作用

统一单行、多行与密码输入，适用于表单字段。原 InputBox 重命名为 TextFields。

#### 视觉样式

- `single`：单行文本，如名称、标题。
- `multiline`：多行文本，如说明、备注，随内容增高，超过整体最大高度后滚动文字区。
- `password`：密码输入，默认圆点遮蔽，末尾按钮切换明文。

Default、Hover、Active、Error、Disabled；Active 表示正在编辑，加深中性描边，悬浮时颜色保持不变，没有独立 Press 或 Focus 外观。

#### 尺寸与形状

- 所有类型默认 14px 字号；单行与密码使用 22px 行高、上下 9px、左右 16px 内边距、24px 圆角。
- 单行及密码高 40px；密码图标右侧内边距为 12px。数字 `width` 默认 432px，最大不超过父容器。
- 多行容器上 12px、左右 8px、下 8px；文字块另加左右各 8px，即距外框 16px。圆角可选 8px / 14px，边框可关闭。
- 多行整体最小 140px；`maxHeight` 默认 140px，设置更大值后随内容增长，包含容器内边距、可选操作区及间隔，不含标题；多行不显示 helper。超出后只滚动文字区。4px 滚动条悬浮在右侧 8+8px 留白的中间，不占文字宽度；支持滚轮、键盘滚动与拖动滑块。
- 操作区固定高 32px，与文字间隔 8px。Helper 左右 margin / padding 为 0，与组件左边缘对齐。
- 1.5 × 24px 圆角光标跟随插入点、换行和滚动；选区存在时隐藏。

#### 图标

仅 password 有末尾图标，20px，使用共享资源 `assets/uploads/icon/password/show.svg` 与 `hide.svg`。图标表示当前状态：明文使用 show.svg，圆点遮蔽使用 hide.svg；点击切换显隐。单行、多行均无末尾图标；多行可通过 `showActionBar` 和 `actionBar` 添加底部操作区。Brand 20% 填充、12px 圆角矩形仅在预览中作为占位，不属于组件默认内容。

#### 使用原则

`showLabel` 是标题显示开关，`label` 是字段标题，`required` 表示字段必填并显示星号。`helperText` 仅支持单行与密码，留空隐藏；多行始终不显示底部 helper。错误说明同样放入 `helperText`，由 `error` 控制样式。无标题时提供 `ariaLabel`。密码切换保留内容与选区；隐藏时显示 8 × 8px 圆点，间距 2px。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"single" \| "multiline" \| "password"` | `"single"` | 顶层输入类型 |
| `radius` | `8 \| 14` | `8` | 仅多行：圆角 px，其他值回退到 8 |
| `bordered` | `boolean` | `true` | 仅多行：边框开关；关闭后各状态均无描边，使用 --shadow-card 阴影 |
| `maxHeight` | `number` | `140` | 仅多行：整体最大高度 px；最小 140，不含标题，超出时只滚动文字区 |
| `showActionBar` | `boolean` | `false` | 仅多行：显示底部 32px 操作区 |
| `actionBar` | `ReactNode` | — | 仅多行：自定义操作内容，需 showActionBar=true；disabled 时不可交互 |
| `width` | `number` | `432` | 宽度，单位 px；最大为父容器宽度 |
| `disabled` | `boolean` | `false` | 禁用输入与密码显隐按钮 |
| `required` | `boolean` | `false` | 原生必填约束；有 label 时显示星号 |
| `helperText` | `string` | `""` | 仅单行与密码：辅助或错误文案，留空隐藏；多行忽略 |
| `error` | `boolean` | `false` | 错误描边及辅助文案颜色；优先于 Active |
| `placeholder` | `string` | `"请输入内容"` | 占位文案 |
| `showLabel` | `boolean` | `true` | 标题显示开关，关闭后 label 仍可作为无障碍名称 |
| `label` | `string` | `""` | 输入框上方标题，留空隐藏 |
| `value` | `string` | — | 受控值 |
| `defaultValue` | `string` | `""` | 非受控初始值 |
| `onChange` | `(value, event) => void` | — | 所有类型统一的输入回调 |
| `onFocus` / `onBlur` | `(event) => void` | — | 输入焦点事件 |
| `id` / `name` / `autoComplete` | `string` | — | 原生属性；未指定 id 时自动生成 |
| `maxLength` | `number` | — | 最大输入长度 |
| `ariaLabel` | `string` | placeholder 或“输入内容” | 无可见标题时的无障碍名称 |

旧 `mode`、`type`、`state`、`title`、`showRequired`、`errorText`、`icon`、`iconName`、`caret` 及旧多行操作按钮配置移除。`bordered` 仅支持多行；操作内容通过 `actionBar` 插槽传入。请改用上表中的统一 API；旧单行 onChange(event) 改为 onChange(value, event)。

## Color Spec

| State / Element | Token | Behavior |
|------|------|---------|
| 背景，所有状态 | `--color-background-primary` | Light 白色 / Dark 黑色 |
| Default outline | `--color-comp-border` | 1px 内描边 |
| Hover outline | `--color-comp-border-hover` | 轻微加深 |
| 无边框多行阴影 | `--shadow-card` → `--shadow-sm` | `0 2px 12px 0`；Light 黑色 6%，Dark 黑色 30% |
| Active outline | `--container-40` | 中性 40% 描边 |
| Error outline / helper | `--error` / `--text-error` | 编辑时保持错误颜色 |
| 输入文字 / caret | `--text-primary` | 与 SearchBar 一致 |
| Placeholder / helper | `--text-tertiary` | 三级文字色 |
| Password icon | `--color-icon-primary` | 20px，所有状态保持一致 |
| Disabled text / icon | `--text-disabled` / `--color-icon-primary` | 背景不变，无光标；error=true 时保留错误描边 |

文字使用 `--text-*` token；图标使用 `--color-icon-*`。无边框多行在 Hover / Active / Error 时仍无描边并保留阴影，单行与密码错误可通过 helper 颜色表达；无边框多行通过 aria-invalid 暴露错误语义。

## Usage

```jsx
import React, { useState } from "react";
import TextFields from "./components/TextFields/index.jsx";

export default function FormFields() {
  const [name, setName] = useState("");
  return <>
    <TextFields variant="single" width={432} label="名称" required
      value={name} onChange={setName} placeholder="请输入名称" />
    <TextFields variant="multiline" label="说明" radius={14} bordered={false}
      maxHeight={140} showLabel={false} />
    <TextFields variant="multiline" label="备注" maxHeight={180} showActionBar
      actionBar={<button type="button">添加附件</button>} />
    <TextFields variant="password" label="密码" autoComplete="new-password"
      error helperText="密码至少需要 8 个字符" />
    <TextFields label="不可编辑" defaultValue="已锁定" disabled />
  </>;
}
```
