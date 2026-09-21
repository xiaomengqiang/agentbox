# InputBox

通用输入框组件：单行文本输入，覆盖表单输入的核心状态与两种视觉样式。

## Features

- 六种状态：默认 / 激活 / 输入中 / 输入完成 / 报错 / 隐藏（密码）
- 两种样式：描边（outlined）与无描边（filled）
- 状态可受控（`state`）或自动派生（由焦点 + 内容 + 错误推导）
- 支持必填星号、一键清空、密码可见性切换
- 非默认状态统一在右侧显示关闭按钮，报错在输入框下方显示「Error」小字提示
- 所有状态均显示蓝色光标（`--brand`），随文字（或密码点）移动
- 密码隐藏状态用自定义圆点掩码：每个点 8×8px、间距 2px
- 支持无图标版本（`icon={false}`），不显示任何尾部图标 / 按钮

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"outlined" \| "filled"` | `"outlined"` | 样式：描边 / 无描边 |
| `width` | `string` | `"432px"` | 输入框宽度 |
| `state` | `"default" \| "active" \| "typing" \| "complete" \| "error"` | 自动派生 | 受控状态，缺省时由焦点 + 内容 + 错误推导 |
| `label` | `string` | — | 顶部标签 |
| `required` | `boolean` | `false` | 标签前是否显示必填星号 `*`（14px、与文字间距 4px、颜色 `--error`） |
| `placeholder` | `string` | `"请输入内容"` | 占位文案 |
| `type` | `string` | `"text"` | 输入类型，`"password"` 时启用密码隐藏/显示 |
| `value` | `string` | — | 受控值 |
| `defaultValue` | `string` | `""` | 非受控初始值 |
| `error` | `boolean` | `false` | 是否报错 |
| `errorText` | `string` | `"Error"` | 错误提示文案（12px / medium / `#e84026`，左间距 12px） |
| `helperText` | `string` | — | 辅助说明文案 |
| `clearable` | `boolean` | `false` | 是否显示一键清空按钮 |
| `icon` | `boolean` | `true` | 是否显示尾部图标 / 按钮（键盘提示、关闭、密码切换）；设为 `false` 为无图标版本 |
| `disabled` | `boolean` | `false` | 是否禁用 |

## 尺寸规格

- 标题：14px / regular（`--font-body-md` + `--font-weight-regular`）
- 标题与输入框间距：0
- 输入框：宽 432px、高 40px、圆角 24px
- 输入框内边距：上下 8px、左右 16px
- 尾部图标：32px，距右边框 4px
- 报错小字：12px / medium / `#e84026`，左间距 12px
- 蓝色光标：2×24px、颜色 `--brand`（`#0A59F7`），所有状态均显示，定位到文字末尾（密码隐藏时定位到圆点末尾）
- 密码点：8×8px 圆点、间距 2px、颜色 `--color-font-primary`

## Usage

```jsx
import InputBox from "./InputBox/index.jsx";

<InputBox
  variant="outlined"
  required
  label="对话名称"
  placeholder="请输入名称"
  clearable
/>

<InputBox
  variant="filled"
  label="手机号"
  placeholder="请输入手机号"
  helperText="11 位手机号"
/>

<InputBox
  variant="filled"
  label="密码"
  type="password"
  defaultValue="123456"
/>

<InputBox
  variant="outlined"
  label="验证码"
  value="123"
  error
  errorText="验证码不正确"
/>
```
