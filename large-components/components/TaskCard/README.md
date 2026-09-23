# TaskCard

## Overview

#### 作用

定时任务卡片：把一个定时任务的完整信息（名称、任务标签、说明、执行周期、下次执行时间）收在一个卡片里。提供两种形态：

- `short`（默认，窄卡）：内容垂直堆叠 —— 标题行（标题 + 右侧开关）→ 标签 → 描述 → 底部信息行。多张短卡由 `TaskCardGroup` 横向排列。
- `long`（宽卡）：首行把「标题 / 标签 / 开关」并列起来（标题紧贴标签，开关落在该行最右），下一行是描述，最后一行同样是「时间周期 / 下次执行」左右分布。

两形态共用同一套文字规格与底部信息行样式。内容里只有标签可能缺省（复用原子 `Tag` 的 `icon` 形态），`title` / `description` / `schedule` / `nextRun` 固定存在；卡片默认是静态容器，卡内唯一可交互的元素是右侧开关（复用原子 `Toggle`），传入 `onClick` 时整卡可点击、悬浮抬起一层阴影。

#### 视觉样式

- 卡片：白底、24px 圆角、无描边无外阴影，与 `TaskTemplateCard` 同族；内边距上下 20px / 左右 24px。
- 底色带液态玻璃材质（来自 Pixso 导出）：顶部一道 `inset 0 1px 1px #FFF` 内高光，外加 `blur(4px)` 背景折射（Chromium 下追加 `url(#glass-xs)`，档位同设计系统 `glass-xs`）。底色仍是不透明的 `--surface-container-lowest`，所以折射作用在卡片背后、当前不可见，内高光也只在深色底上看得出来；日后把底色改成半透明玻璃底，这两行会立刻生效。
- 状态只有两个：默认与悬浮（悬浮仅在卡片可点击时出现），与 `TaskTemplateCard` 同模型，没有 Pressed / Focus 专属外观。
- 缺省（静态）：没有任何悬浮态，交互反馈完全由内部原子组件（开关、标签）给出。
- 可点击（传入 `onClick`）：悬浮只抬起一层阴影 `0 8px 24px rgba(0, 0, 0, 8%)`（模糊 24px / Y 8px / 黑 8%，与 `TaskTemplateCard` 同规格），填充色与描边保持静止态不变、玻璃内高光保留（外阴影与内高光叠加，不会互相覆盖）；键盘 Enter / Space 等价于点击。

#### 间距节奏

| 位置 | short | long |
|------|-------|------|
| 标题 ↔ 开关 | 16px | 由弹性空间顶到最右 |
| 标题 ↔ 标签 | 12px（上下叠放） | 12px（并列） |
| 标题组 / 标题行 → 描述 | 20px | 12px |
| 描述 → 底部信息行 | 20px | 20px |
| 时间图标 ↔ 时间文案 | 4px | 4px |
| 卡片之间（`TaskCardGroup`） | 16px | —（宽卡直接纵向排列） |

长卡的两段行距不一样（标题行 → 描述 12px、描述 → 底部信息行 20px），所以它的纵向间距不是统一 `gap`，而是各段自己的 `margin-top`（`--spacing-3` / `--spacing-5`）。

#### 文字

| 部位 | 规格 |
|------|------|
| 标题 | 20px medium、颜色 `--container`（container 100%）、行高随 `--font-title-sm`（1.375），单行，超出省略（与 `TaskTemplateCard` 一致） |
| 标签 | `Tag` 的 `icon` 形态：14px 图标 + 12px 文字 |
| 描述 | 14px medium、行高 24px（单行 24px、两行 48px），最多两行，超出省略（与 `TaskTemplateCard` 一致） |
| 底部信息行（时间周期 / 下次执行） | 14px **regular**、行高 `--line-height-snug`（1.375），颜色 `--container-30`（弱化），左右两端分布 |

底部信息行整行统一 14px regular / 行高 `--line-height-snug` + `--container-30`：时间图标的颜色由该行继承，与文字同色；时间周期文案过长时单行省略，保证右侧「下次执行」始终可见。

时间图标与文案垂直居中对齐：图标装在 14px 盒子里（由本组件自己提供，不依赖 `Icon` 的根节点形态），`svg` 锁死 14px，避免内联 `svg` 按基线落进 19.25px 的 strut 行盒而偏低；图标盒中线就是整行的几何基准。

在此之上还有一层 `0.04em` 的光学校正（加在文字上，用 `transform`）：HarmonyOS Sans SC（unitsPerEm 1000 / win 度量 928-244）在 14px、行高 1.375 下，内容区中心在基线之上 0.342em，而 CJK 字身中心约在基线之上 0.38em，即**文字字面天然比行盒中线高约 0.04em**。只做 flex 居中时文字会显得在行内偏高，故把「时间周期」与「下次执行」两处文字一起下移 0.04em —— 文字字面在行内视觉居中，并且与落在行中线的图标对齐。

#### 尺寸与形状

- 宽度自适应：铺满所在容器（`width: 100%`），高度由内容撑开。
- 形状固定 24px 圆角，不提供尺寸或形状变体；形态只有 `short` / `long` 两种。
- 短卡用 `TaskCardGroup` 横向排布：自动换行、间距 16px，窄容器下降为两列以保证「一行最少两张」；长卡是宽卡，直接纵向排列。

#### 使用原则

- 标题、标签、描述都保持短句摘要，关键信息不要落在省略号之后。
- 整卡点击是可选项：传 `onClick` 才启用（与 `TaskTemplateCard` 一致），缺省为静态展示。卡内开关的点击不会冒泡成整卡点击，所以「点开关只切开关、点卡片其余区域才打开详情」是天然成立的。
- 开关是受控 / 非受控两用的原子组件：传 `checked` 走受控，只传 `defaultChecked` 走非受控。
- 键盘聚焦时用 `--focus-ring` 描边标识焦点，这是可访问性行为，不属于状态变体（状态只有默认与悬浮）。

## Props

`TaskCard`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"short" \| "long"` | `"short"` | 形态：窄卡（内容叠放）/ 宽卡（标题行并列）；非法值回退为 `short` |
| `title` | `string` | — | 标题文案，单行省略 |
| `label` | `string` | — | 任务标签文案；唯一可缺省的内容字段，缺省时整个标签不渲染 |
| `labelIcon` | `string` | `"calendar-clock"` | 标签的 Lucide 图标名 |
| `description` | `string` | — | 描述文案，两行省略；固定内容，始终提供 |
| `schedule` | `string` | — | 执行周期文案（如 `每周一 00:00`），左侧带时间图标；固定内容，始终提供 |
| `nextRun` | `string` | — | 下次执行时间文案；固定内容，始终提供 |
| `nextRunLabel` | `string` | `"下次执行"` | 「下次执行」的前缀文案 |
| `checked` | `boolean` | — | 开关受控值；传入即受控 |
| `defaultChecked` | `boolean` | `false` | 开关非受控初始值 |
| `onChange` | `(next: boolean, event) => void` | — | 开关切换回调 |
| `disabled` | `boolean` | `false` | 禁用开关 |
| `switchLabel` | `string` | — | 开关旁的文字标签（一般不用；开关自带 `aria-checked`） |
| `onClick` | `(event) => void` | — | 传入即整卡可点击：悬浮抬起阴影、键盘 Enter / Space 等价点击、根节点带 `role="button"` 与 `tabIndex=0`；缺省为静态展示 |
| `className` | `string` | `""` | 追加到卡片根节点的类名 |

`title` / `description` / `schedule` / `nextRun` 是固定内容，由宿主始终提供，因此描述与底部信息行都会渲染（实现上仍做了存在性判断，缺省即不渲染对应节点）。内容里只有 `label` 可能缺省：缺省时整个标签不渲染，标题与开关之间不留空位。

`TaskCardGroup`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | 一组 `TaskCard`（短卡） |
| `className` | `string` | `""` | 追加到容器根节点的类名 |

## Color Spec

| 部位 | Token | 说明 |
|------|-------|------|
| 卡片背景 | `--surface-container-lowest` | 卡片底色 · Light `#FFFFFF` / Dark `#000000`；叠加液态玻璃（内高光 + 背景折射） |
| 卡片内高光（液态玻璃） | 组件内固定值 | `inset 0 1px 1px rgba(255, 255, 255, 1)`（Pixso 导出 innerShadow：y 1 / 白 / blur 1）；底色不透明时只在深色下可见 |
| 卡片背景折射（液态玻璃） | 组件内固定值 | `blur(4px)`；Chromium 追加 `url(#glass-xs)`（档位同设计系统 `glass-xs`，滤镜由 `build.mjs` 预埋在 HTML） |
| 标题 | `--container` | container 100% · 最实的文字层 · Light `#000000` / Dark `#FFFFFF` |
| 描述 | `--container-50` | 中性叠加色 · Light 黑 50% / Dark 白 50% |
| 底部信息行（文字 + 时间图标） | `--container-30` | 中性叠加色 · Light 黑 30% / Dark 白 30% |
| 标签（原子 `Tag` · `icon` 形态） | 底 `--container-05`；文字 `--color-font-primary`、图标 `--color-icon-primary` | 底 Light 黑 5% / Dark 白 5%；文字与图标 Light 黑 90% / Dark 白 90% |
| 开关轨道 · 开（原子 `Toggle`） | `--color-comp-background-emphasize` → `--brand` | 品牌蓝 · Light `#0A59F7` / Dark `#317AF7` |
| 开关轨道 · 关（原子 `Toggle`） | `--color-comp-background-secondary` | 中性叠加色 · Light 黑 10% / Dark 白 10% |
| 开关滑块（原子 `Toggle`） | `--color-comp-background-primary` | Light `#FFFFFF` / Dark 恒白（保证深色轨道上可见） |

卡片本体的外观只有 Default 一种填充色：唯一的交互态是悬浮，且只抬起阴影，不改变背景与文字，因此卡片自身不引入任何新颜色，交互反馈的颜色全部由内部原子组件（`Toggle`、`Tag`）给出。所有 token 在 `.dark` 下自动翻转，组件不定义任何自定义颜色。`--container-*` 是递归混合色，Light 用黑、Dark 用白按百分比叠加；`--brand` 在两个主题下取值不同。

底部信息行取 30% 中性叠加色（比描述的 50% 更弱），时间图标随文字同色，整行作为一个退让的信息层。

## Usage

```jsx
import TaskCard, { TaskCardGroup } from "./components/TaskCard/index.jsx";

// 短卡：横向排列的卡片组，间距 16px；传 onClick 即整卡可点击（悬浮抬起阴影）
<TaskCardGroup>
  <TaskCard
    title="每周项目周报汇总"
    label="周报"
    labelIcon="calendar-clock"
    description="每周一自动汇总上周进展，生成周报并同步到项目群。"
    schedule="每周一 09:00"
    nextRun="2026/09/28 09:00"
    defaultChecked
    onChange={(next) => console.log("启用状态：", next)}
    onClick={() => openTaskDetail("weekly-report")}
  />
</TaskCardGroup>

// 长卡：标题 / 标签 / 开关 并列一行；不传 onClick 即静态卡（无悬浮态）
<TaskCard
  variant="long"
  title="客户数据每日备份"
  label="备份"
  labelIcon="database"
  description="每天凌晨将客户库增量备份到对象存储，保留最近 30 天。"
  schedule="每天 02:00"
  nextRun="2026/09/24 02:00"
  checked={enabled}
  onChange={(next) => setEnabled(next)}
/>
```
