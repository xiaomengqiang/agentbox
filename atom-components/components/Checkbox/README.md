# Checkbox

## Overview

#### 作用

Checkbox 用于切换独立的布尔选项，或在一组选项中进行多选。支持选中、未选中及各自的禁用态，可通过组件内部状态或外部受控值管理选择。

#### 视觉样式

- `square`：默认方形，适用于设置选项、协议确认和多选列表。
- `circle`：圆形选择标记，适用于需要圆形视觉语言的多选场景；仍遵循 Checkbox 的多选行为。

#### 尺寸与形状

- 选择框容器为 24 × 24px，可视框为 20 × 20px。
- 方形圆角为 `--radius-sm`（4px），圆形使用 `--radius-full`。
- 右侧文字使用 `--font-body-md`，与选择框间距为 `--spacing-2`（8px）。

#### 图标

- 使用共享模块 `assets/shared/icons.js` 中的 Lucide `check`，不提供替换图标的 prop。
- 对勾尺寸为 15px，由底层描边和上层白色对勾叠加；白色线宽为 2px，并带阴影与 0.5px 向下位置补偿。

#### 使用原则

- 标签描述选中后成立的状态，例如“接收消息通知”；点击选择框或右侧文字均可切换。
- 获得键盘焦点后，按 Space 或 Enter 切换选中状态。
- 多个互斥选项应使用单选控件。
- 禁用时保留当前选中结果，整个组件（含文字）降至 40% 不透明度。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `shape` | `"square" \| "circle"` | `"square"` | 选择框形状，不改变选择行为。 |
| `disabled` | `boolean` | `false` | 禁止点击与键盘切换，不触发 `onChange`，并移出 Tab 顺序。 |
| `label` | `string` | — | 右侧文字；省略或传入空字符串时仅显示选择框。 |
| `checked` | `boolean` | — | 传入非 `null`、非 `undefined` 的值时进入受控模式；选中状态由此值决定。 |
| `defaultChecked` | `boolean` | `false` | 仅用于非受控模式的初始选中状态，挂载后修改不会重置状态。 |
| `onChange` | `(checked: boolean) => void` | — | 切换时接收下一选中值，而非 DOM 事件；受控模式下需由调用方更新 `checked`。 |

配置器仅暴露 `shape`、`disabled` 和 `label`；选中状态通过实际交互切换。组件没有 `state` prop，也不支持半选状态。

## Color Spec

两种形状共用以下颜色规则，语义 token 随明暗主题切换。

| Element / State | Background | Border | Text / Mark |
|-----------------|------------|--------|-------------|
| Unchecked | `--color-fg-unchecked` | `--color-icon-tertiary` | 文字 `--on-surface`；隐藏对勾 |
| Checked | `--color-comp-background-emphasize` | 同背景 | 文字 `--on-surface`；对勾 `--white` |
| Hover / Pressed | 同当前选中状态 | 同当前选中状态 | 同当前选中状态 |
| Disabled | 同当前选中状态 | 同当前选中状态 | 同当前选中状态，整体 opacity 40% |

- 对勾底层描边使用 `--container-05`，阴影使用 `--container-10`；白色对勾在明暗主题中均保持白色。
- 预览不单列 Focus 状态；当前实现仍保留 `:focus-visible` 键盘焦点环，使用 `--focus-ring`、`--outline-width-focus` 和 `--outline-offset-gap`。

## Usage

以下示例的导入路径以项目根目录中的调用文件为基准。

```jsx
import React, { useState } from "react";
import Checkbox from "./atom-components/components/Checkbox/index.jsx";

export default function CheckboxExamples() {
  const [agreed, setAgreed] = useState(false);

  return (
    <div>
      {/* 非受控：组件内部维护选中状态 */}
      <Checkbox defaultChecked label="自动同步" />
      <Checkbox shape="circle" label="加入体验计划" />

      {/* 受控：调用方更新 checked */}
      <Checkbox
        checked={agreed}
        onChange={setAgreed}
        label="我已阅读并同意服务协议"
      />

      {/* 禁用：保留初始选中结果 */}
      <Checkbox disabled defaultChecked label="组织统一启用" />
    </div>
  );
}
```
