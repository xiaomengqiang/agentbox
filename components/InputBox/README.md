# InputBox

通用输入框组件：单行文本输入，覆盖表单输入的核心状态与两种视觉样式。

## Features

- 六种状态：默认 / 激活 / 输入中 / 输入完成 / 报错 / 隐藏（密码）
- 两种样式：描边（outlined）与无描边（filled）
- 状态可受控（`state`）或自动派生（由焦点 + 内容 + 错误推导）
- 红色星标开关（`required`）：`true` 显示、`false` / 缺省隐藏
- 支持一键清空、密码可见性切换
- 非默认状态统一在右侧显示关闭按钮，报错在输入框下方显示「Error」小字提示
- 仅 Active / Typing 状态显示蓝色竖线（`--brand`），始终位于输入文字之后；Default / Complete 状态隐藏
- 蓝色光标开关（`caret`）：`true` 显示、`false` 隐藏（默认显示）
- 密码隐藏状态用自定义圆点掩码：每个点 8×8px、间距 2px
- 支持无图标版本（`icon={false}`），不显示任何尾部图标 / 按钮

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"outlined" \| "filled"` | `"outlined"` | 样式：描边 / 无描边 |
| `width` | `string` | `"432px"` | 输入框宽度 |
| `state` | `"default" \| "active" \| "typing" \| "complete" \| "error"` | 自动派生 | 受控状态，缺省时由焦点 + 内容 + 错误推导 |
| `label` | `string` | — | 顶部标签 |
| `required` | `boolean` | `false` | 红色星标开关：是否在标签前显示必填星号 `*`（14px、与文字间距 4px、颜色 `--error`） |
| `placeholder` | `string` | `"请输入内容"` | 占位文案 |
| `type` | `string` | `"text"` | 输入类型，`"password"` 时启用密码隐藏/显示 |
| `value` | `string` | — | 受控值 |
| `defaultValue` | `string` | `""` | 非受控初始值 |
| `error` | `boolean` | `false` | 是否报错 |
| `errorText` | `string` | `"Error"` | 错误提示文案（12px / medium / `#e84026`，左间距 12px） |
| `helperText` | `string` | — | 辅助说明文案 |
| `clearable` | `boolean` | `false` | 是否显示一键清空按钮 |
| `icon` | `boolean` | `true` | 是否显示尾部图标 / 按钮（键盘提示、关闭、密码切换）；设为 `false` 为无图标版本 |
| `iconName` | `"auto" \| "keyboard" \| "close" \| "eye" \| "eye-off"` | `"auto"` | 尾部图标选择；自动模式随状态切换，指定图标时固定其外观 |
| `caret` | `boolean` | `true` | 蓝色竖线开关：Active / Typing 可显示；Default / Complete 始终隐藏 |
| `disabled` | `boolean` | `false` | 是否禁用 |

## 尺寸规格（定稿）

### 标题（label）

- 字号 / 字重：14px / regular（`--font-body-md` + `--font-weight-regular`）
- 行高：19px
- 颜色：`--color-font-primary`
- 必填星号（`required` 开关控制）：14px、颜色 `--error`，与标题文字间距 4px
- 标题与输入框固定间距：8px

### 输入框（input field）

- 尺寸：宽 432px、高 40px、圆角 24px
- 内边距：上下 8px、左右 16px
- 内部元素间距（gap）：8px
- 输入文字：`--font-body-lg`、颜色 `--color-font-primary`
- 占位文字：颜色 `--color-font-tertiary`

### 尾部图标 / 按钮

- 图标尺寸：32px，距输入框右边框 4px
- 按钮（关闭 / 密码切换）尺寸：32×32px
- 颜色：`--color-icon-primary`

### 提示 / 错误信息

- 与输入框间距：8px
- Helper text 与 Error 文本左侧位置相同：均左移 12px
- 报错小字：12px / medium / `#e84026`

### 光标 / 密码点

- 蓝色竖线（`caret` 开关控制）：2×24px、颜色 `--brand`（`#0A59F7`），仅 Active / Typing 显示，始终位于文字末尾（密码隐藏时位于圆点末尾）
- 密码点：8×8px 圆点、间距 2px、颜色 `--color-font-primary`

## Usage

```jsx
import Input from "./InputBox/index.jsx";

<Input
  variant="outlined"
  required
  label="对话名称"
  placeholder="请输入名称"
  clearable
/>

<Input variant="outlined" label="账号名" placeholder="请输入账号名" />

<Input variant="outlined" label="对话名称" caret={false} />

<Input variant="outlined" label="对话名称" iconName="keyboard" />

<Input
  variant="filled"
  label="手机号"
  placeholder="请输入手机号"
  helperText="11 位手机号"
/>

<Input
  variant="filled"
  label="密码"
  type="password"
  defaultValue="123456"
/>

<Input
  variant="outlined"
  label="验证码"
  value="123"
  error
  errorText="验证码不正确"
/>
```
