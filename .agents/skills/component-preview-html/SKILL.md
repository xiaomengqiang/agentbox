---
name: component-preview-html
description: 创建或精修 UI 组件的交互 HTML 文档，包含配置器、变体、状态矩阵、颜色与 token 契约及响应式表格。在 Agentbox 双层组件库中维护组件级 preview.jsx / preview.css，默认只生成该组件独立预览；不用于完整应用页面或静态 README。
---

# Component Preview HTML

让设计者无需阅读实现即可配置、体验并检查组件。本技能负责交互预览的内容与视觉规范；组件开发和构建范围由 `agentbox-component` 工作流协调，静态 README 由 `component-readme` 负责。

## 选择目标与源码

- 遵循用户指定范围与工程 `AGENTS.md`。先读目标组件的 README、`index.jsx`、`index.css`、`preview.jsx`、`preview.css`，仅按需读取相关 tokens、共享控件或资产。
- 双层工程使用 `<atom-components|large-components>/components/<Name>/preview.jsx` 与 `preview.css`。它们是预览源码，`preview.html` 和该层 `index.html` 是生成输出。
- 构建步骤见[双层组件工作流](../agentbox-component/references/component-workflow.md)。单独调用本技能也可直接读取该参考，无需递归加载主技能或 README 技能。
- 默认构建并交付当前组件的 `preview.html`；只有用户要求汇总时才更新总览。不要修改生成 HTML、从总 HTML 抽取下次构建模板，或创建第二套预览实现。
- 其他工程保留其已有源码与构建约定；不要强制迁移目录。无构建工具的独立 HTML 任务按实际交付要求处理，不假设 Agentbox 命令存在。
- 技能维护请求只授权修改技能，不顺带修改组件页面。

## 预览规范

新建或实质调整预览结构前，读取[预览契约](references/preview-contract.md)。局部改动只读取相关章节。

- 预览导入真实组件，提供默认导出的 React 预览组件。显式 import 使用的控件、hooks 与辅助模块，不能依赖总览中的隐式全局变量。
- 组件实现与文档页分离：`index.css` 定义真实状态；`preview.css` 定义配置器、表格和演示用强制状态。复用 `tooling/preview/` 与共享 `assets/`。
- Configurator 暴露实际支持的视觉与交互 props。组合限制真实有效；依赖开关的选项条件显示。集成回调写在 API contract，不增加无效开关。
- Configurator 字段标题采用「中文说明 · API 名称」双语形式；英文必须与组件 README 暴露的 prop 完全一致，保留大小写与拼写，例如「类型 · variant」「圆角 · radius」「无障碍名称 · ariaLabel」。单位和提示与 API 名称分开标注。组件视觉类型轴使用 variant；若同时有强调层级，使用独立 API（如 emphasis），并同步实现、README 与配置器，避免只改标签。
- 沿用 Button / DropdownButton 的配置器和表格样式，包括 select 包装、箭头、焦点与禁用态。通过共享预览 CSS 引用复用，不复制整套样式；确认样式在目标 `@scope` 内生效。
- 独立页使用共享标题与主题开关，无需其他组件的 Tab；总览使用独立的可扩展 Tab 行，切换后保留已访问面板状态。
- 所有组件独立页及两层总览的 Light / Dark 切换统一为标题旁的滑动 toggle：同时显示太阳与月亮，滑块左侧为 Light、右侧为 Dark。使用原生 button、role="switch"、稳定的无障碍名称和 aria-checked，支持键盘操作、可见焦点与减少动态效果，并记忆主题选择。Agentbox 统一由 tooling/preview/Gallery.jsx 与 shell.css 实现，避免库级样式覆盖为圆形图标按钮；修改共享开关后按用户范围重建页面。
- 每个面板保留可见双语组件标题、关键 prop 概要及准确的状态描述；标题层级参考契约，不移除面板标题来解决重复全局标题。
- 组件标题（`.preview-panel-title`）与 Configurator 等章节标题使用相同的 `--font-weight-bold` 字重；字号仍保留标题层级。注意后加载样式中的 `font` 简写会重置字重，应在共享预览样式中保证最终层叠结果，避免逐组件重复覆盖。
- Interactive gallery 使用英文节标题；标本卡片使用 --surface-container-lowest 背景（浅色主题白底）、无边框、--shadow-card 阴影。保留真实交互，disabled 和强制状态放在 State matrix。不要为组件预览附带无关弹层或业务页面。
- 按真实实现编写 Color spec、Token contract、Asset contract、API contract；可配置宽度属于 API，不写成固定 token。宽表格允许横向滚动。
- Color spec 优先展示 light.css / dark.css 中实际使用的语义 token；若引用 base.css token，在旁边以较小字号、次要文字色标注引用关系，明暗映射不同则分别列出。无等价语义 token 时保留真实 base token 并标明来源，不伪造映射。
- 若修改涉及真实 API 或视觉契约，协调更新受影响的 README 并使用 `component-readme`；单纯预览布局修改不触发文档重写。

## 验证与交付

构建目标独立页面并运行对应验证。视觉或交互修改时打开该页，检查改动涉及的控件、条件项、主题及宽窄布局；修改共享页面壳或 Tab 行时再检查受影响的总览与状态保留。

静态或运行检查不等于视觉验证。浏览器不可用时说明实际限制，不声称页面已视觉通过。交付目标独立 HTML 和相关源码链接；用户要求汇总时交付该层总览。
