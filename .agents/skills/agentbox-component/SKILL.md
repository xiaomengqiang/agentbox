---
name: agentbox-component
description: 创建、精修和组合 Agentbox React 组件，维护 atom-components 与 large-components 两层组件库，按组件独立构建预览，并在需要时汇总总览。协调 component-preview-html 的交互预览规范与 component-readme 的组件文档规范。
---

# Agentbox Component

组件实现与预览源码是唯一事实来源。默认工作单元是一个组件：局部读取、局部修改、独立预览；用户要求汇总时再生成该层总览。基础组件与组合组件使用相同流程，组合组件直接引用基础组件源码。

## 先判断任务与工程

- 读取工作区的 `AGENTS.md`，确认目标组件、所在层和现有构建入口。用户指定的目录与已有工程约定优先。
- 存在 `atom-components/registry.json`、`large-components/registry.json` 和 `scripts/build.mjs` 时，使用[双层组件工作流](references/component-workflow.md)。首次在该工程操作时读取；纯 README 编辑无需加载构建细节。
- 不因触发技能而运行初始化器、复制 assets 或新建第二套预览脚手架。只有明确的新工程初始化需求才选择脚手架；没有现成双层工具的项目不能直接套用这些命令。

## 三个技能的分工

| 当前任务 | 采用的规范 | 修改范围 |
|---|---|---|
| 新建或精修组件、组合 atom | 本技能统筹；按下面条件加载专项技能 | 目标组件实现及必要的预览、文档 |
| 新建或调整交互预览、配置器、状态矩阵、HTML 布局 | [component-preview-html](../component-preview-html/SKILL.md) | `preview.jsx`、`preview.css`，构建目标页面 |
| 编写或整理 README、Props、用法 | [component-readme](../component-readme/SKILL.md) | 对应 `README.md` |
| 汇总总览或检查构建 | 本技能的工作流参考 | 注册表与生成输出；无需重读全部组件源码 |

按实际变更加载专项技能，不默认把三份技能及其参考资料全读一遍。专项技能定义文档与视觉规范，本技能不重复规定另一套 README 结构或预览章节。

- 新组件通常需要实现、预览和 README，加载两个专项技能。
- API、支持的状态、默认值或视觉契约变化时，同步受影响的预览与 README，按需要加载相应规范。
- 纯预览布局精修不重写组件 API 或 README；纯 README 编辑不改实现、不构建 HTML。
- 专项技能可独立使用；不要通过相互调用将窄任务扩展成完整组件开发。

## 组件开发约束

- 本项目默认不将无障碍作为独立设计、配置或交付内容：不新增专用无障碍 props（如 `ariaLabel`）、配置器字段、README / API 说明或审查清单。常规组件检查不主动扩展无障碍专项改造；用户明确要求时再处理。原生元素语义、基础内部 ARIA 标记及正常键盘交互可保留，无需暴露为配置项。

- 仅针对原子组件：所有公开能力按独立属性轴的笛卡尔积（n × m × …）设计，覆盖 size × shape × variant × 图标位置 × 状态等组合。不得因某个尺寸、形状或样式而禁用另一项能力，也不得修改一个属性时自动重置另一个属性。用户提出此类组合限制时，先明确受影响组合并向用户二次确认，再实现例外；组合组件不适用这条强制要求。

- 属性按语义统一命名：离散尺寸档位使用 `size`；视觉样式、内容类型或布局形态使用 `variant`，不得用 `variant` 表示纯尺寸。判断依据是实际行为：例如仅改变尺寸用 `size`，改变内容排布的 short / long 可保留为 `variant`。数值型 `width`、`height`、`minHeight`、`maxHeight`、`fontSize` 保留具体含义，不机械改为 `size`；固定尺寸组件不为统一而新增尺寸 API。
- 尺寸枚举使用完整名称 `large`、`medium`、`small`，不保留 `lg`、`md`、`sm`、`xs` 等简写别名；仅迁移名称时保留原有几何、字号与交互，不顺带重设计组件。
- API 命名检查必须对照实现、README Props / Usage、Configurator、状态矩阵及 API / Token contract，确保名称、枚举与默认值一致；改名同步更新实际调用方及相关验证用例，不只改展示标签。

- 每个公开 prop 及其枚举值只保留一个规范名称，不提供旧称、缩写或别名映射；实现、README、配置器、示例与调用方同步迁移。Button / DropdownButton 的 variant 统一为 `primary`、`secondary`、`tertiary`、`text`，shape 为 `round`、`square`。
- 按文字字号命名 size：16px 为 `large`，14px 为 `medium`，12px 为 `small`；仅暴露组件实际支持的尺寸，不为凑齐枚举新增尺寸。纯图标组件不按图标像素套用文字字号规则。实现、README、配置器、状态矩阵与契约表同步使用规范名，不保留 `xs` 作为 12px 尺寸别名。
- Button / DropdownButton 的文字字重按尺寸统一：`large`（16px）与 `medium`（14px）使用 `--font-weight-medium`（500），`small`（12px）使用 `--font-weight-regular`（400）；仅对组件实际支持的尺寸应用。

- 两层组件库的每个组件都必须支持可选的 `id`、`style`、`className`，调用方无需每次传值。新建或修改目标组件实现时检查并补齐这三个属性。
- 三个属性默认作用于组件根 DOM 元素；无单一根节点或有特殊语义时，明确选择承载元素，并在 README 中说明。`id` 不得重复传给多个节点或使用固定默认值；`className` 与组件内部类名合并；`style` 使用 React 样式对象，与内部行内样式合并时调用方值优先，不得被属性展开顺序意外覆盖。
- README 的 Props 必须记录这三个属性的类型、实际默认值、用途和承载元素。验证时确认它们实际落到约定 DOM 元素上，且自定义类名保留内部类名、自定义样式生效。
- 使用标准 ES Module：组件实现与 README 位于 `<library>/components/<Name>/`；预览的 `preview.jsx`、`preview.css`、生成的 `preview.html` 单独位于同层 `previews/<Name>/`，不得混入交付代码目录。预览通过 `../../components/<Name>/index.jsx` 导入真实组件并提供默认导出，不依赖总 HTML 闭包中的隐式变量。
- `index.css` 只定义组件表现；配置器、文档表格与强制状态演示放入 `preview.css`。共享预览布局复用 `tooling/preview/`，共享资源复用 `assets/`。
- 写组件 CSS 前按需读取[设计 token 参考](references/design_system.md)，并以项目当前 token 定义为准。组件不重新定义全局 `:root` 或主题；深色差异使用语义 token 或组件级主题选择器。
- 功能图标统一使用 `assets/uploads/icon/function/` 中语义对应的原始资源，以文件名作为唯一名称；不另用 Lucide 近似图标或添加别名。缺少对应资源时说明缺口，不自行画近似图标。单色功能图标应跟随 currentColor，保证明暗主题及状态可读。
- 涉及图标能力时读取[图标参考](references/icons.md)，使用项目已有图标模块和资源，不复制原子组件或运行库。
- 大组件直接 import atom 源码；只读取和编辑本次确实涉及的依赖。修改 atom 不自动全量重建下游大组件，按本次请求选择验证范围。

组件 README 使用 Overview、Props、Usage 三部分；颜色与 token 契约保留在交互预览，不写 README 的 Color Spec。前端交付包含组件源码及必要的共享 assets、atom 依赖；预览目录与工具仅用于内部检查。

## 验证与交付

遵循工作流参考中的单组件、汇总或全量命令。生成 HTML 可删除重建，不手工修补，也不将它作为下一次构建的输入。

运行与改动范围匹配的验证；视觉或交互修改还应检查对应页面。运行检查不等于浏览器视觉验证，未完成时说明限制。交付目标独立预览链接；汇总任务交付对应总览链接，简要说明变更和验证。技能维护任务只修改技能，不顺带重建工程页面。
