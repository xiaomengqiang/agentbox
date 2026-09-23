# TaskTemplateCard

## Overview

#### 作用

定时任务的模版卡片：以「图标 + 标题 + 描述」三行结构展示一个可选的定时任务模版；单卡可点击，多张卡片由 `TaskTemplateCardGroup` 排布成自动换行的卡片墙。组件只承载展示与整体点击，不承载按钮、标签等其他交互单元。

#### 视觉样式

- 默认（唯一形态）：白底、24px 圆角、无描边无外阴影的卡片；内容左对齐、垂直排列，行间距 20px，内边距上下 20px / 左右 24px。
- 底色带液态玻璃材质（来自 Pixso 导出）：顶部一道 `inset 0 1px 1px #FFF` 内高光，外加 `blur(4px)` 背景折射（Chromium 下追加 `url(#glass-xs)`，档位同设计系统 `glass-xs`）。底色仍是不透明的 `--surface-container-lowest`，所以折射作用在卡片背后、当前不可见，内高光也只在深色底上看得出来；日后把底色改成半透明玻璃底，这两行会立刻生效。
- 悬浮：可点击卡片抬起一层阴影 `0 8px 24px rgba(0,0,0,8%)`（取自设计稿 Pixso 效果：Y 8px / 模糊 24px / 黑 8%）；**填充色与描边不变**，仍是白底无描边，玻璃内高光保留（外阴影与内高光叠加）；静止态与静态卡都没有外阴影。

#### 尺寸与形状

- 宽度自适应：铺满所在网格列（`width: 100%`），高度由内容撑开。
- 形状固定为 24px 圆角，不提供尺寸或形状变体。

#### 图标

- 位于第一行（标题之上），使用 Lucide 线性图标，尺寸固定 32px。
- 可选：未传 `icon` 时不渲染该行。

#### 文字

- 标题：20px medium、颜色 `--container`（container 100%），单行，超出显示省略号。
- 描述：14px medium、行高 24px，最多两行，超出显示省略号。
- 两行文字均左对齐。

#### 交互

- 状态只有两个：默认与悬浮（悬浮仅在传入 `onClick` 时出现），没有 Pressed / Focus 专属外观。
- 传入 `onClick` 时整卡可点击：悬停仅抬起阴影 `0 8px 24px rgba(0,0,0,8%)`，卡片填充色与描边保持不变（不做交互色叠加），按 Enter / Space 等价于点击。
- 未传 `onClick` 时为静态展示，无悬停反馈与手型光标。
- 键盘聚焦时用 `--focus-ring` 描边标识焦点，属于可访问性行为，不是状态变体。

#### 使用原则

- 文案保持短句摘要：标题一行、描述两行；避免关键信息落在省略号之后。
- 多卡并排时用 `TaskTemplateCardGroup` 包裹，由它负责 16px 间距与换行，不要自行叠加外边距。

## Props

`TaskTemplateCard`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string` | — | Lucide 图标名，渲染 32px 线性图标；缺省不渲染 |
| `title` | `string` | — | 标题文案，单行省略 |
| `description` | `string` | — | 描述文案，两行省略；缺省不渲染 |
| `onClick` | `function` | — | 传入后整卡可点击；缺省为静态卡片 |
| `className` | `string` | `""` | 追加到卡片根节点的类名 |

`TaskTemplateCardGroup`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | 一组 `TaskTemplateCard` |
| `className` | `string` | `""` | 追加到容器根节点的类名 |

## Color Spec

| 部位 | Token | 说明 |
|------|-------|------|
| 卡片背景 | `--surface-container-lowest` | Light 白底 / Dark 深色面；叠加液态玻璃（内高光 + 背景折射） |
| 卡片内高光（液态玻璃） | 组件内固定值 | `inset 0 1px 1px rgba(255, 255, 255, 1)`（Pixso 导出 innerShadow：y 1 / 白 / blur 1）；底色不透明时只在深色下可见 |
| 卡片背景折射（液态玻璃） | 组件内固定值 | `blur(4px)`；Chromium 追加 `url(#glass-xs)`（档位同设计系统 `glass-xs`，滤镜由 `build.mjs` 预埋在 HTML） |
| 图标 | `--color-icon-tertiary` | 三级图标灰（Light 黑 40% / Dark 白 40%） |
| 标题文字 | `--container` | container 100% · 最实的文字层（Light `#000000` / Dark `#FFFFFF`） |
| 描述文字 | `--container-50` | 中性叠加色，Light #000 50% / Dark #fff 50% |
| 悬停阴影 | `--task-template-card-hover-shadow` | 组件内定义的固定值 `0 8px 24px rgba(0,0,0,8%)`（非主题 token） |
| 焦点描边 | `--focus-ring` | 键盘聚焦时的 outline |

描述文字按规格取 50% 中性叠加色，而非语义文本色（secondary/placeholder）。悬浮态不引入任何颜色 token —— 可点击卡片悬浮时背景仍取 `--surface-container-lowest`、描边仍为空，只有阴影变化。所有颜色 token 在 `.dark` 下自动翻转，无需为暗色单独适配；悬停阴影是固定 rgba 值、不参与翻转，若后续需要暗色专用阴影，应改用主题层的 `--shadow-*` 尺阶。

## Usage

```jsx
import TaskTemplateCard, { TaskTemplateCardGroup } from "./components/TaskTemplateCard/index.jsx";

const templates = [
  { icon: "sparkles", title: "AI 写作助手", description: "基于上下文生成与润色文案，支持多轮改写。" },
  { icon: "code", title: "代码审查", description: "自动检查变更并给出修改建议。" },
];

<TaskTemplateCardGroup>
  {templates.map((item) => (
    <TaskTemplateCard
      key={item.title}
      icon={item.icon}
      title={item.title}
      description={item.description}
      onClick={() => open(item.title)}
    />
  ))}
</TaskTemplateCardGroup>
```
