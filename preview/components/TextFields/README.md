# TextFields

## Overview

#### 作用

统一单行、多行与密码输入，支持受控与非受控值、必填标记、辅助说明和错误状态。

#### 视觉样式

- `single`：单行文本。
- `multiline`：多行文本，随内容增高，超过整体最大高度后滚动文字区。
- `password`：密码输入，默认圆点遮蔽，末尾按钮切换明文。

所有类型支持 Default、Hover、Active、Error、Disabled 描边。Active 表示正在编辑，使用 1px 蓝色内描边和 2px 淡蓝外圈，不改变尺寸或文字间距，悬浮时颜色保持不变，没有独立 Press 外观；密码按钮获得键盘焦点时也显示焦点描边。Error 保留错误描边，编辑或密码按钮获得键盘焦点时显示 2px 淡红外圈。

#### 尺寸与形状

- 所有类型固定 14px 字号 / 22px 行高，regular（400）字重；单行与密码使用上下 9px、左右 16px 内边距、24px 圆角。
- 单行及密码高 40px；密码图标右侧内边距为 12px。数字 `width` 默认 432px，最大不超过父容器。
- 多行文字内边距为 8px 16px，圆角默认 `--radius-container`（8px），自定义仅接受 CSS token 名称，仅使用有边框样式。上下内边距随内容滚动，文字在外框边缘裁切。
- 多行 `minHeight` / `maxHeight` 默认均为 140px，包含内边距，不含标题、辅助说明与计数。增大最大高度后可随内容增长，达到上限后滚动。4px 滚动条悬浮于右侧留白，轨道顶部留 8px、底部留 16px，避开右下角缩放手柄；不占文字宽度，可拖动。
- 所有类型均使用原生光标，高度与粗细随字体、浏览器和系统设置适配；密码隐藏时显示直径 8px（--spacing-2）的圆点，点间净距 4px（--spacing-1）；显隐状态保持输入高度和垂直居中。底层仍为原生 password 输入。
- 字数计数使用 12px / 18px regular、次要文字色及等宽数字；放在框外 supporting text 行右侧；辅助说明与计数之间留 16px（--spacing-4），整行左右无内边距，距框 4px，不占输入框高度。超限或 error 时为错误色，禁用时为禁用色。
- 多行右下角使用浏览器原生缩放手柄，可在 minHeight / maxHeight 范围内垂直拖动；禁用时隐藏。默认高度上下限相同，需增大 maxHeight 后才能拖动增高。手动高度在编辑过程中保留。
- 标题与输入框左边缘对齐，距框 8px；必填星号在标题后，间距 4px。Helper 使用 12px / 18px、regular 字重，与框左边缘对齐；辅助说明行距框 4px，计数与框右边缘对齐，两者之间留 16px。

- 输入内容溢出时，单行与密码的左右边缘、多行的上下边缘使用 12px 渐变遮罩；仅在对应方向仍有隐藏内容时显示，滚动到起点或终点后该边缘恢复清晰。长占位文字同样支持；辅助说明正常换行。

#### 图标

仅 password 有末尾图标，20px，使用共享资源 `assets/uploads/icon/password/show.svg` 与 `hide.svg`。图标表示当前状态：明文使用 show.svg，圆点遮蔽使用 hide.svg；点击切换显隐。单行、多行均无末尾图标。

#### 使用原则

`label` 留空隐藏标题，`required` 表示字段必填并在标题后显示星号，不改变标题起始位置。`helperText` 支持所有类型，留空隐藏；错误说明放入 `helperText`，`error` 接收调用方当前的校验结果，每次渲染实时更新，不会在组件内部锁定。校验规则与触发时机由业务决定，可按输入、失焦或提交执行；修正内容后传入 false 即恢复正常。配置器中的错误开关仅用于外观演示，不是业务校验规则。密码切换保留内容与选区。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"single" \| "multiline" \| "password"` | `"single"` | 顶层输入类型 |
| `radius` | `string` | `"--radius-container"` | 仅多行：CSS token 名称，默认映射 8px；不接受数字或 CSS 长度，格式不合法时回退默认 token；未定义 token 使用默认圆角 |
| `minHeight` | `number` | `140` | 仅多行：最小高度 px，至少 38；辅助说明与计数不计入高度，不含标题 |
| `maxHeight` | `number` | `140` | 仅多行：最大高度 px；小于 minHeight 时按 minHeight 生效，超出时滚动 |
| `width` | `number` | `432` | 宽度，单位 px；最大为父容器宽度 |
| `disabled` | `boolean` | `false` | 禁用输入、密码显隐按钮及多行缩放手柄；密码回到隐藏状态 |
| `required` | `boolean` | `false` | 原生必填约束；有 label 时在标题后显示星号 |
| `helperText` | `string` | `""` | 辅助或错误文案，支持所有类型，留空隐藏 |
| `error` | `boolean` | `false` | 当前校验是否失败，由调用方动态计算；true 显示错误，false 清除错误，组件不缓存。编辑时保留错误描边与外圈；不会自动推断密码长度等业务规则 |
| `placeholder` | `string` | `"请输入内容"` | 占位文案 |
| `label` | `string` | `""` | 输入框上方标题，留空隐藏 |
| `value` | `string` | — | 受控值，传入后优先于 defaultValue，需在 onChange 中更新 |
| `defaultValue` | `string` | `""` | 非受控初始值，仅初始化时读取 |
| `onChange` | `(value, event) => void` | — | 所有类型统一的输入回调 |
| `onFocus` / `onBlur` | `(event) => void` | — | 输入焦点事件 |
| `maxLength` | `number` | — | 最大输入长度，仅非负整数生效，默认不限；使用原生 UTF-16 计数，可为 0（emoji 可能计为多个单位）；外部 value/defaultValue 不自动截断；多行框外辅助说明行右侧实时显示 x/xx，未设置时不显示 |
| `className` | `string` | `""` | 追加到根节点的类名 |
| `style` | `React.CSSProperties` | — | 根节点样式，调用方值优先 |

## Usage

以下导入路径以调用文件位于 `atom-components/` 下为例。

```jsx
import React, { useState } from "react";
import TextFields from "./components/TextFields/index.jsx";

export default function FormFields() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  // 示例业务规则：首次失焦后显示错误，之后随输入实时校验。
  const passwordError = passwordTouched && password.length < 8;
  return <>
    <TextFields variant="single" width={432} label="名称" required
      value={name} onChange={setName} placeholder="请输入名称" />
    <TextFields variant="multiline" label="说明" radius="--radius-container"
      minHeight={100} maxHeight={220} maxLength={500}
      helperText="请填写说明，最多 500 个字符" />
    <TextFields variant="password" label="密码"
      value={password} onChange={setPassword}
      onBlur={() => setPasswordTouched(true)}
      error={passwordError}
      helperText={passwordError ? "密码至少需要 8 个字符" : ""} />
    <TextFields label="不可编辑" defaultValue="已锁定" disabled />
  </>;
}
```
