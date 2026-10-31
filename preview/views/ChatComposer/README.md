# ChatComposer

类 AI 对话工具的消息输入框。灰色外框 800×188、左右 4px 包裹；内层白色输入卡 792×140，卡内底部排布工具条，卡外下方左侧为项目空间选择。

## Features

- 底部工具条：左下加号附件入口 → 图标+「单Agent模式」下拉 → 图标+「请求权限」下拉；右侧模型下拉（auto + 外部传入模型，图标+名称）+ 圆形发送按钮
- 全部下拉项可交互：选中后选项标签实时更新，面板自动对齐（上/下、左/右），菜单项图标垂直居中
- 发送按钮：空内容禁用，Enter 或点击发送后清空输入并闪现成功反馈
- 灰色外框下方左侧提供图标+「选择项目空间」下拉，选中后展示当前空间名
- 模型数据由 `models` 外部注入，`auto` 恒为第一项
- 深色模式免费适配（全部使用主题 token）

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialMessage` | `string` | `""` | 输入框初始文本 |
| `modeId` | `string` | `"single"` | Agent 模式初始值：`single` / `swarm` |
| `permissionId` | `string` | `"request"` | 权限策略初始值：`request`（请求权限）/ `full`（完全访问） |
| `modelId` | `string` | `"auto"` | 当前模型：`auto` 或任一 `models[].id` |
| `models` | `Array<{ id, label, icon?, src? }>` | 内置 4 款模拟模型 | 模型列表；`src`（`assets/uploads/` 下的 logo）优先展示，`icon` 为 Lucide 名兜底；`Auto` 恒置顶 |
| `spaceId` | `string` | `""` | 项目空间初始值：`onboard` / `personal` 等，空为未选择 |

## Usage

```jsx
import ChatComposer from "./components/ChatComposer/index.jsx";

const models = [
  { id: "deepseek", label: "Deepseek-V4-Flash", src: "./assets/uploads/deepseek.png" },
  { id: "glm-52", label: "GLM-5.2", src: "./assets/uploads/glm.png" },
];

<ChatComposer
  initialMessage="帮我分析一下 Q3 用户流失原因"
  modeId="swarm"
  spaceId="personal"
  modelId="deepseek"
  models={models}
/>
```
