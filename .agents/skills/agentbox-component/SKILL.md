---
name: agentbox-component
description: 创建、精修和组合 Agentbox React 组件，维护 atom-components 与 large-components 两层组件库，按组件独立构建预览，并在需要时汇总总览。协调 component-preview-html 的交互预览规范与 component-readme 的组件文档规范。
---

# Agentbox Component

组件实现与预览源码是唯一事实来源。默认工作单元是一个组件：局部读取、局部修改、独立预览；用户要求汇总时再生成该层总览。基础组件与组合组件使用相同流程，组合组件直接引用基础组件源码。

## 先判断任务与工程

- 读取工作区的 `AGENTS.md`，确认目标组件、所在层和现有构建入口。用户指定的目录与已有工程约定优先。
- 存在 `atom-components/registry.json`、`large-components/registry.json` 和 `scripts/build.mjs` 时，使用[双层组件工作流](references/component-workflow.md)。首次在该工程操作时读取；纯 README 编辑无需加载构建细节。
- 不因触发技能而运行初始化器、复制 assets 或新建 `preview/`。只有明确的新工程初始化需求才选择脚手架；没有现成双层工具的项目不能直接套用这些命令。

## 三个技能的分工

| 当前任务 | 采用的规范 | 修改范围 |
|---|---|---|
| 新建或精修组件、组合 atom | 本技能统筹；按下面条件加载专项技能 | 目标组件实现及必要的预览、文档 |
| 新建或调整交互预览、配置器、状态矩阵、HTML 布局 | [component-preview-html](../component-preview-html/SKILL.md) | `preview.jsx`、`preview.css`，构建目标页面 |
| 编写或整理 README、Props、用法或静态 Color Spec | [component-readme](../component-readme/SKILL.md) | 对应 `README.md` |
| 汇总总览或检查构建 | 本技能的工作流参考 | 注册表与生成输出；无需重读全部组件源码 |

按实际变更加载专项技能，不默认把三份技能及其参考资料全读一遍。专项技能定义文档与视觉规范，本技能不重复规定另一套 README 结构或预览章节。

- 新组件通常需要实现、预览和 README，加载两个专项技能。
- API、支持的状态、默认值或视觉契约变化时，同步受影响的预览与 README，按需要加载相应规范。
- 纯预览布局精修不重写组件 API 或 README；纯 README 编辑不改实现、不构建 HTML。
- 专项技能可独立使用；不要通过相互调用将窄任务扩展成完整组件开发。

## 组件开发约束

- 使用标准 ES Module：组件实现为 `index.jsx` + `index.css`，预览为单独的 `preview.jsx` + `preview.css`。预览导入真实组件并提供默认导出，不依赖总 HTML 闭包中的隐式变量。
- `index.css` 只定义组件表现；配置器、文档表格与强制状态演示放入 `preview.css`。共享预览布局复用 `tooling/preview/`，共享资源复用 `assets/`。
- 写组件 CSS 前按需读取[设计 token 参考](references/design_system.md)，并以项目当前 token 定义为准。组件不重新定义全局 `:root` 或主题；深色差异使用语义 token 或组件级主题选择器。
- 涉及图标能力时读取[图标参考](references/icons.md)，使用项目已有图标模块和资源，不复制原子组件或运行库。
- 大组件直接 import atom 源码；只读取和编辑本次确实涉及的依赖。修改 atom 不自动全量重建下游大组件，按本次请求选择验证范围。

## 验证与交付

遵循工作流参考中的单组件、汇总或全量命令。生成 HTML 可删除重建，不手工修补，也不将它作为下一次构建的输入。

运行与改动范围匹配的验证；视觉或交互修改还应检查对应页面。运行检查不等于浏览器视觉验证，未完成时说明限制。交付目标独立预览链接；汇总任务交付对应总览链接，简要说明变更和验证。技能维护任务只修改技能，不顺带重建工程页面。
