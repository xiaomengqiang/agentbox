# Button

Material 3 命名的按钮组件：**4 变体 × 2 尺寸**，外加一个 `shape` 几何轴；颜色全部取自语义色彩规范，可直接并入组件库复用。

## Features
- **三个正交轴**：`variant`（含义 / 强调层级）× `size`（密度）× `shape`（几何）
- 变体（M3 规范命名）：`filled` / `tonal` / `outlined` / `text`，同时兼容别名 `primary` / `secondary` / `tertiary` / `plain`
- 尺寸：`large`（40px 高 / 16px 字号 / 20px 图标 / 8px 图标间距）、`small`（28px 高 / 14px 字号 / 16px 图标 / 4px 图标间距）
- 形状：`round`（跑道圆 `--radius-full`，默认，全变体全尺寸）、`square`（方圆角 **8px** `--radius-lg`，按 design system **只用于 `outlined` × `small`**）；口头语 `rounded` / `pill` / `rect` / `sharp` 会自动收敛到规范值
- 颜色：main color 抽成组件级契约 `--btn-main-color`，默认 `--color-icon-primary`（明=主色 90% 近黑实心，暗=主色 90% 近白实心，令牌自带翻转）；其余色彩取自语义层 token，无任何色值字面量
- 状态：default、hover、focus（键盘 `:focus-visible`）、pressed、disabled；组件无内部 state
- **filled 的 hover / pressed 有真实色差**：叠 `--on-primary-10` / `-15`（M3 Filled button 的 state layer）；明色下近黑实心由约 10% 灰升到约 19% 灰（变浅），暗色下近白实心变深，同一令牌双模式方向都正确
- 禁用态统一模型：四变体都保留静止态的底 / 字 / 描边，仅整体 `opacity: 0.5`
- 聚焦环：纯黑 `--black` 1px + 2px 间隙；`text` 变体无容器，focus 不画环
- 支持前置 / 后置图标（Lucide 名称或自有 `src` 资源），图标色自动跟随文字色
- 全量令牌化：所有 `--btn-*` 变量可在单个实例上覆盖
- `data-state` 可静态强制 state，用于文档走查、设计走查与截图对比

## 为什么形状不并入变体名

`variant` 描述「强调层级」，`shape` 描述「几何」，两者是独立维度。若把形状写进变体名（`filled-round` / `filled-square` / `tonal-round`…），会带来两个问题：

1. **组合爆炸**：变体数 × 形状数，今天 4×2=8 个名字，出现第三种形状就是 12 个，且每加一个形状都要重命名一整轮；
2. **别名失效**：`primary` 到底等于 `filled-rounded` 还是 `filled`？口头语与规范名的映射会崩掉。

所以保留 M3 自己的词汇：变体用 `filled/tonal/outlined/text`，形状用 M3 的 **Round / Square**（没有 `rounded` 这个词）。默认 `round` 与历史外观 100% 一致，不传 `shape` 就没有任何变化。

需要强调的是：**`shape` 是正交轴，不代表每个组合都存在**。design system 里 `square` 只落在 `outlined` × `small` 上，所以这个轴的价值不是「开放 8 种组合」，而是「让那一个组合有名字、有令牌、可被查询」——真值表由 `BUTTON_SHAPE_SCOPE` 承载。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"filled" \| "tonal" \| "outlined" \| "text"`（或别名 `primary` / `secondary` / `tertiary` / `plain`） | `"filled"` | 视觉变体，非法值回退 `filled` |
| `size` | `"large" \| "small"` | `"large"` | 尺寸，非法值回退 `large` |
| `shape` | `"round"` \| `"square"`（或别名 `rounded` / `pill` / `rect` / `sharp`） | `"round"` | 形状，与 variant / size 正交；非法值回退 `round`。规范上 `square` 只配 `outlined` + `small` |
| `icon` | `string` | — | Lucide 图标名（kebab-case），如 `"plus"`、`"chevron-right"` |
| `iconSrc` | `string` | — | 自有图标资源路径（相对 scaffold 根，如 `./assets/uploads/logo.svg`），优先级高于 `icon` |
| `iconPosition` | `"start" \| "end"` | `"start"` | 图标在文案前 / 后 |
| `disabled` | `boolean` | `false` | 禁用态 |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | 原生 button type |
| `onClick` | `function` | — | 点击回调（禁用态不触发） |
| `className` | `string` | `""` | 追加类名，用于单实例令牌覆盖 |
| `data-state` | `"hover" \| "focus" \| "pressed"` | — | **仅文档/走查用**，静态强制某个状态，不参与业务逻辑 |
| `children` | `node` | — | 按钮文案 |

## Variants × Sizes × Shapes

| 变体 class | M3 名称 | 别名 | 适用场景 |
|---|---|---|---|
| `.btn--filled` | Filled button | `primary` | 页面主操作（每屏最多 1 个） |
| `.btn--tonal` | Filled tonal button | `secondary` | 次操作，需要品牌感但有主按钮共存 |
| `.btn--outlined` | Outlined button | `tertiary` | 中强调操作、并列选项 |
| `.btn--text` | Text button | `plain` | 低强调操作，如取消、更多 |

| 尺寸 class | 高度 | 字号 | 图标 | 左右 padding | 图标间距 |
|---|---|---|---|---|---|
| `.btn--large` | 40px | 16px | 20px | 16px | 8px |
| `.btn--small` | 28px | 14px | 16px | 12px | 4px |

形状（几何轴，与上面两个轴正交；组合是否成立由下表「规范适用范围」决定）：

| 形状 class | 名称 | 圆角 token | 解析值 | 别名（自动收敛） | 规范适用范围 |
|---|---|---|---|---|---|
| `.btn--round` | Round | `--radius-full` | 9999px | `rounded` · `pill` | 全变体 × 全尺寸，**默认**，与历史外观一致 |
| `.btn--square` | Square | `--radius-lg` | **8px** | `rect` · `sharp` | **仅 `outlined` × `small`** |

叠加层与聚焦环都各自 `border-radius: inherit` / 跟随轮廓，所以**形状不需要任何额外适配**。
`<Button variant="outlined" size="small" shape="square" />` = 小号方圆角描边按钮，这是 `square` 在 design system 里的唯一规范用法。

真值表以数据形式导出，供走查与代码评审使用：

```js
import { BUTTON_SHAPE_SCOPE, isShapeSupported } from "./presets.js";

BUTTON_SHAPE_SCOPE;
// { round: null /* 不限 */, square: [{ variant: "outlined", size: "small" }] }

isShapeSupported("square", "outlined", "small"); // true
isShapeSupported("square", "filled", "large");   // false
```

组件**不做静默降级**：传了 `square` 就渲染 `square`，即使在范围外的组合上也是——这样违规组合会直接暴露在界面上，而不是被悄悄改回 `round` 藏起来。

## Color Spec Mapping

本套按钮的 **main color = `--btn-main-color` → `--color-icon-primary`**（主色，不是品牌 `--brand`）。
`assets/style/*` 零改动，只消费其中已有令牌：

| variant | 背景 background | 描边 outlined | 文字 text | hover | pressed | disabled |
|---|---|---|---|---|---|---|
| `filled` | `--color-icon-primary` | — | `--color-font-on-primary`（暗色 `--black`） | 叠 `--on-primary-10` | 叠 `--on-primary-15` | 沿用静止态 + 50% 透明度 |
| `tonal` | `--color-comp-background-tertiary` | — | `--color-icon-primary` | 叠 `--color-interactive-hover` ≈ `--color-comp-background-secondary` | 叠 `--color-interactive-pressed` ≈ container-15 | 沿用静止态 + 50% 透明度 |
| `outlined` | 透明 | `--color-comp-border`（1px） | `--color-icon-primary` | 叠 `--color-interactive-hover` = `--color-comp-background-tertiary` | 叠 `--color-interactive-pressed` = `--color-comp-background-secondary` | 沿用静止态（含描边）+ 50% 透明度 |
| `text` | 透明（任何状态都无背景） | — | `--color-font-emphasize` | 字 `--primary-hover` | 字 `--primary-active` | 沿用静止态 + 50% 透明度 |

解析值（明 / 暗）：

- `--color-icon-primary` = `--primary-90` → rgba(0,0,0,.9) / rgba(255,255,255,.9)
- `--color-font-on-primary` = `--on-primary` → 纯白（`--on-primary` 暗色下不翻转，故 filled 的文字色由组件在 `html.dark` 下覆盖为 `--black`）
- `--color-font-emphasize` = `--brand-font` → #0A59F7 / #5291FF
- `--primary-hover` = `--brand-80` → rgba(10,89,247,.8) / rgba(49,122,247,.8)
- `--primary-active` = `--brand` → #0A59F7 / #317AF7
- `--color-comp-background-secondary` = `--container-10` → rgba(0,0,0,.1) / rgba(255,255,255,.1)
- `--color-comp-background-tertiary` = `--container-05` → rgba(0,0,0,.05) / rgba(255,255,255,.05)
- `--color-comp-border` = `--container-15` → rgba(0,0,0,.15) / rgba(255,255,255,.15)
- `--color-interactive-hover` / `-pressed` → `--container-05` / `--container-10`（暗色各加深一档）
- `--on-primary-10` / `-15` → 明 rgba(255,255,255,.1) / rgba(255,255,255,.15) ／ 暗 rgba(0,0,0,.1) / rgba(0,0,0,.15)（**明暗自动反向**）

叠加层分两种模型（取决于静止底是浅色还是实心主色）：

- **① tonal / outlined —— 叠中性层**：静止底是浅色 / 透明，叠同一对 `--color-interactive-hover` / `-pressed`（`--container-05` / `--container-10`，暗色各加深一档），不改静止底。合成结果：tonal hover ≈ `--color-comp-background-secondary`、pressed ≈ container-15；outlined hover = `--color-comp-background-tertiary`、pressed = `--color-comp-background-secondary`，与 `design_system.md` 的「Hover/pressed on surfaces」一致。
- **② filled —— 叠「主色上的颜色」**：静止底是实心主色 `--color-icon-primary`（近黑 / 近白），中性层叠在其上对比度极低（视觉上接近无变化），所以改用 `--on-primary-10` / `-15`。这正是 **M3 Filled button 的 state layer 规范**，不是特例。该令牌明色为白基、暗色为黑基，自带翻转，一个值同时满足两个模式的正确方向：

| filled 状态 | 明色（叠在 `--surface-container-low` 上算得） | 暗色 |
|---|---|---|
| default | 约 10% 灰 | 约 91% 灰 |
| **hover**（叠 `--on-primary-10`） | **变浅约 9 个百分点** | **变深约 9 个百分点** |
| pressed（叠 `--on-primary-15`） | 再浅一档 | 再深一档 |

- **`text` 不叠层，直接换字色**：静止 `--color-font-emphasize`（`--brand-font`）→ hover `--primary-hover`（brand 80%）→ pressed `--primary-active`（brand 实色），三档互不相同。注意静止态 `--brand-font` 与 `--primary-active`（= `--brand`）在浅色下同为 #0A59F7，所以 pressed 只靠 hover 那一档拉开区别。

其它：

- 禁用态：**四个变体统一模型**——保留静止态的底 / 字 / 描边，仅整体 `opacity: 0.5`（`--btn-container-disabled` / `--btn-label-disabled` / `--btn-border-color-disabled` 默认即指向静止态变量，变体无需各自声明）。
- 键盘聚焦环：`--btn-focus-ring: var(--black)`（纯黑 1px）+ `--outline-offset-gap`（2px 间隙）。**`text` 变体无容器，focus 不画描边环**（`--btn-focus-ring: transparent`）。
- 暗色模式（`html.dark`）：`filled` 的底 = `--color-icon-primary` 在暗色下翻为近白，文字随之翻黑（`.dark .btn--filled { --btn-label: var(--black); }`）。原因是 style 层的 `--on-primary` 被 `theme.css` 的 `:root` 固定为 `--white`，与 `base.css` 的 `.dark` 同权重且更晚加载，导致 `--color-font-on-primary` 在暗色下不翻转。**叠加层不受此影响**：`--on-primary-10` / `-15` 由 `base.css` 的 `.dark` 定义为黑基，所以暗色下近白实心的 hover 会正确变深。`--btn-radius` 与颜色无关，明暗一致。
- 其余变体无需暗色特判：底 / 字都引用了自带翻转的语义 token（`--primary-90`、`--container-05`、`--brand-font` 等）。
- 若需要在暗色下换成别的主色（例如暗色下用品牌色实心），覆盖 `--btn-main-color` 并同步覆盖 `.dark` 下的 `--btn-label`。

## Token Contract

所有变量均定义在 `.btn` 上，由变体类覆写；单实例覆盖只需给一个自定义 class：

| 变量 | 作用 | 默认 |
|---|---|---|
| `--btn-height` | 固定高度 | 40px / 28px |
| `--btn-padding-inline` | 左右内边距 | 16px / 12px |
| `--btn-font-size` | 字号 | 16px / 14px |
| `--btn-icon-size` | 图标尺寸 | 20px / 16px |
| `--btn-icon-gap` | 图标与文案间距 | 8px / 4px |
| `--btn-radius` | 圆角（由 shape 轴覆写） | `round` → `var(--radius-full)` ／ `square` → `var(--radius-lg)`（8px） |
| `--btn-main-color` | 本套按钮主色（换主色只改这一处） | `var(--color-icon-primary)` |
| `--btn-container` | 静止态填充 | 变体决定 |
| `--btn-label` | 文字/图标颜色 | 变体决定 |
| `--btn-label-hover` / `-pressed` | hover / pressed 文字色（默认不变） | 变体决定 |
| `--btn-state-layer-hover` | hover 叠加层 | 变体决定 |
| `--btn-state-layer-pressed` | pressed 叠加层 | 变体决定 |
| `--btn-container-disabled` | 禁用态填充 | `var(--btn-container)` |
| `--btn-label-disabled` | 禁用态文字 | `var(--btn-label)` |
| `--btn-disabled-opacity` | 禁用态整体透明度 | 0.5 |
| `--btn-border-width` / `-color` / `-color-disabled` | 描边 | 仅 outlined 启用 |
| `--btn-focus-ring` | 聚焦环颜色（text 变体为 transparent） | `var(--black)` |

数值型契约同时导出为 `BUTTON_SIZE_TOKENS` / `BUTTON_SHAPE_TOKENS`（见 `presets.js`），并把口头语收敛函数一并导出：`resolveVariant` / `resolveSize` / `resolveShape`，业务侧可编程读取而无需硬编码。

## Usage

```jsx
import Button from "./components/Button/index.jsx";

// 默认：Filled + Large
<Button onClick={handleSave}>保存</Button>

// 带前置图标
<Button variant="filled" size="large" icon="plus">新建</Button>

// 四种变体
<Button variant="filled">主要操作</Button>
<Button variant="tonal">次要操作</Button>
<Button variant="outlined">描边操作</Button>
<Button variant="text">取消</Button>

// 别名等价写法
<Button variant="primary">等价 filled</Button>
<Button variant="secondary">等价 tonal</Button>
<Button variant="tertiary">等价 outlined</Button>
<Button variant="plain">等价 text</Button>

// 小尺寸 + 后置图标
<Button size="small" variant="outlined" icon="chevron-right" iconPosition="end">更多</Button>

// 形状是独立轴：square 在 design system 中只配 outlined × small
<Button variant="outlined" size="small" shape="square">方圆角描边</Button>
<Button shape="round">等价默认写法（全变体全尺寸都适用）</Button>

// 口头语别名会被自动收敛（rounded → round、rect → square）
<Button shape="rounded">等价 shape="round"</Button>

// 禁用
<Button disabled>不可用</Button>

// 单实例定制（加宽内边距；覆盖圆角）
<Button className="btn-wide">宽内边距</Button>
// .btn-wide { --btn-padding-inline: 32px; --btn-radius: var(--radius-md); }
```
