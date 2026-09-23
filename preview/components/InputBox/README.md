# InputBox

## Overview

#### 作用

`InputBox` 统一承载表单单行输入和提示词/正文多行输入。通过 `mode` 切换能力，避免在同一页面混用两个输入组件。

#### 视觉样式

- `mode="single"`（单行文本）：用于名称、账号、验证码等短字段；支持默认、激活、输入中、输入完成、报错、隐藏密码六种状态。
- `mode="multiline"`（多行文本）：用于提示词、消息和正文编辑。按内容长度和操作需要选择固定高度、自动高度或无操作栏展示。

#### 尺寸与形状

- 单行默认宽度为 `432px`、高度为 `40px`，使用全圆角；可通过 `width` 调整。
- 多行默认宽度为 `514px`、圆角 `8px`；`heightMode="fixed"` 默认高度 `140px`，`heightMode="auto"` 随内容增长至默认 `240px` 上限。
- 多行固定高度会保留完整 21px 文本行，并在溢出时显示 4px 宽的滚动提示。

#### 图标

- 单行默认按状态显示键盘、清空或密码可见性图标；`icon` 与 `bordered` 分别作为独立开关控制有无图标、有无描边。输入中使用蓝色 2 × 24px 光标。
- 多行默认采用 `home`（首页对话输入）：左侧为添加，右侧为 IconState 的发送默认态。输入区与操作栏等宽并左对齐；可用插槽分别扩展左侧最多 3 个、右侧最多 2 个组件。

#### 多行展示状态

- Default（有操作栏，文本未超出容器）：使用 `heightMode="fixed"`、`showActionBar={true}`。适合对话、提示词等需要稳定区域高度和快捷提交的场景；文本未超出可见区域时不显示滚动提示。
- Container auto（容器自适应文本高度）：使用 `heightMode="auto"`。适合正文编辑、补充说明等内容长度不可预估的场景；容器随完整文本行增长，到达 `maxAutoHeight` 后显示可拖动滚动条，操作栏可按需保留。
- No action bar（无操作栏）：使用 `showActionBar={false}`。适合仅收集或展示多行内容、提交动作位于组件外部的场景；可与固定高度或自动高度组合。

#### 操作栏

- `actionBarLayout="home"`：用于首页对话输入，保留左侧添加与右侧提交，适合需要快速补充素材并立即发送的场景。
- `actionBarLayout="left"`：只保留添加入口，适合提交动作已在外部工具栏中提供的编辑场景。
- `actionBar`：用于完全自定义操作栏内容。推荐传入左右两个区域，以保持两端对齐；每个区域内的小组件间距为 `4px`。
- `leftActions` / `rightActions`：适合只替换其中一侧的轻量场景。左侧最多 3 个、右侧最多 2 个；可传文本按钮或 `ReactNode` 图标组件。

#### 使用原则

- 表单短值使用单行文本；需要换行、长内容或提交辅助操作时使用多行文本。
- 固定高度仅在内容超出可见文本区时显示滚动提示；不要将滚动提示作为常驻装饰。
- 自动高度适用于需要跟随正文扩展的编辑场景；无操作栏时，应在附近提供明确的外部提交或保存入口。
- `onChange` 在单行模式回传原生事件，在多行模式回传 `(value, event)`；接入时按所选模式处理。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"single" \| "multiline"` | `"single"` | 输入特性：单行文本或多行文本 |
| `width` | `number \| string` | 单行 `"432px"`；多行 `514` | 组件宽度；数字按 px 处理 |
| `title` | `string` | — | 单行顶部标题；优先于 `label` |
| `label` | `string` | — | 顶部标签，两种模式都支持；单行模式为 `title` 的兼容别名 |
| `required` | `boolean` | `false` | 标签前显示必填星号 |
| `showRequired` | `boolean` | 跟随 `required` | 是否显示标题前红色必填标记；优先于 `required` |
| `value` | `string` | — | 受控输入值 |
| `defaultValue` | `string` | `""` | 非受控初始值 |
| `placeholder` | `string` | 单行 `"请输入内容"`；多行 `"请输入提示词"` | 占位文案 |
| `disabled` | `boolean` | `false` | 仅单行文本：禁用输入与尾部图标操作 |
| `error` | `boolean \| string` | `false` | 报错状态或错误文案 |
| `errorText` | `string` | `"Error"` | `error` 为布尔值时显示的错误文案 |
| `helperText` | `string` | — | 输入框下方辅助说明 |
| `onChange` | 单行 `(event) => void`；多行 `(value, event) => void` | — | 输入变化回调 |
| `state` | `"default" \| "active" \| "typing" \| "complete" \| "error" \| "hidden"` | 自动派生 | 单行受控视觉状态；`hidden` 强制以密码圆点显示 |
| `type` | `string` | `"text"` | 单行输入类型；`"password"` 启用密码显示切换 |
| `icon` | `boolean` | `true` | 是否显示单行尾部图标 |
| `bordered` | `boolean` | `true` | 是否显示 1px 描边；两种模式均可用 |
| `iconName` | `"auto" \| "keyboard" \| "close" \| "eye" \| "eye-off"` | `"auto"` | 单行尾部图标 |
| `caret` | `boolean` | `true` | 单行 Active / Typing 时是否显示自绘光标 |
| `onFocus` / `onBlur` | `(event) => void` | — | 单行焦点回调 |
| `radius` | `number \| string` | `8` | 多行圆角；数字按 px 处理 |
| `heightMode` | `"auto" \| "fixed"` | `"fixed"` | 多行自动高度或固定高度 |
| `fixedHeight` | `number` | `140` | 多行固定高度，单位 px |
| `maxAutoHeight` | `number` | `240` | 多行自动高度的最大值，超过后显示可拖动滚动条，单位 px |
| `shadow` | `boolean` | `false` | 多行是否显示卡片投影 |
| `showActionBar` | `boolean` | `true` | 多行是否显示 32px 底部操作栏 |
| `actionBarLayout` | `"home" \| "left"` | `"home"` | 多行内置操作栏布局；`home` 为首页对话输入，`left` 仅保留添加操作 |
| `actionBar` | `ReactNode` | — | 自定义多行操作栏内容；传入两个左右区域时由容器两端对齐，区域内组件间距应为 4px |
| `leftActions` | `(string \| ReactNode)[]` | — | 自定义左侧操作，最多 3 个；字符串会渲染为文本按钮，相邻间距为 4px |
| `rightActions` | `(string \| ReactNode)[]` | — | 自定义右侧操作，最多 2 个；操作栏与左侧保持两端对齐 |
| `submitIcon` | `ReactNode` | IconState 发送默认态 | 自定义首页对话输入右侧的提交图标；点击仍触发 `onSubmit` |
| `onSubmit` | `(value) => void` | — | 多行点击提交或按 Cmd/Ctrl + Enter 时触发 |
| `maxLength` | `number` | — | 多行最大字符数 |

## Color Spec

| 特性 | State | Background | Outline | Text / icon |
|------|-------|------------|---------|-------------|
| 单行 | Default | `--surface-bright` | `bordered=true` 时 `--color-comp-border` | `--on-surface` |
| 单行 | Focus | 同 Default | `--focus-ring` | 同 Default |
| 单行 / 多行 | Error | 同 Default | `--error` | 单行输入文字 `rgb(0 0 0 / 90%)`；提示文字 `--error` |
| 多行 | Default | `--surface-container-lowest` | `--color-comp-border`（可选） | `--on-surface` |
| 多行 | Focus | 同 Default | `--focus-ring`（可选） | `--primary` 光标 |
| 多行发送操作 | Default | IconState `icon-dialog-dark.svg` | 无 | 白色发送图形 |
| 单行 | Disabled | `--surface-container-low` | 同 Default | `--text-disabled` / `--color-icon-fourth` |

## Usage

```jsx
import InputBox from "./components/InputBox/index.jsx";

// 单行文本
<InputBox
  mode="single"
  bordered
  icon
  title="对话名称"
  showRequired
  value={name}
  placeholder="请输入名称"
  helperText="最多 32 个字符" // 底部小字
  onChange={(event) => setName(event.target.value)}
/>

// Default：固定高度、有操作栏、文本未溢出时不显示滚动提示
<InputBox
  mode="multiline"
  width={514}
  heightMode="fixed"
  fixedHeight={140}
  actionBarLayout="home"
  onChange={(value) => console.log(value)}
  onSubmit={(value) => console.log("submit", value)}
/>

// Container auto：容器随文本高度增长，操作栏仍可保留
<InputBox
  mode="multiline"
  heightMode="auto"
  defaultValue="正文会随完整文本行自然增长。"
/>

// No action bar：提交动作由组件外部承载
<InputBox
  mode="multiline"
  showActionBar={false}
  defaultValue="这里不展示底部操作栏。"
/>

// 自定义多行操作栏插槽
<InputBox
  mode="multiline"
  leftActions={["附件", "引用", "模板"]}
  rightActions={["保存草稿", "发送"]}
/>

// actionBar：完全自定义操作栏内容
<InputBox
  mode="multiline"
  actionBar={<><div className="ib-multiline__actions ib-multiline__actions--left">附件 · 引用</div><div className="ib-multiline__actions ib-multiline__actions--right">保存 · 发送</div></>}
/>

// 自定义提交图标
<InputBox
  mode="multiline"
  submitIcon={<MySendIcon />}
  onSubmit={(value) => send(value)}
/>

```
