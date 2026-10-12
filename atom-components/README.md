# Atom Components · 组件选择目录

把自然语言需求映射到现有组件。当前收录 13 个组件；名称与 [registry.json](registry.json) 一致。外观和交互见 [总览 HTML](index.html)，参数与代码示例见各组件文档。

## 如何选择

先判断用户要**执行操作、输入、选择、切换内容，还是展示信息**，再结合下面的描述线索选择组件。关键词只是线索，以实际行为为准；“标签”“切换”“下拉”等模糊描述需结合上下文判断，仍无法区分时再询问。

选定后读取对应 README 的 Props / Usage 和同目录 `index.jsx`，使用真实 API；不要从自然语言词语推导不存在的属性。每个组件默认从 `components/<Name>/index.jsx` 导入；命名导出见下表。完整面板或卡片先查看 [组合组件库](../large-components/README.md)。

## 组件目录

| 组件 / 文档 | 用途 | 自然语言线索 / 示例 | 选择边界 |
| --- | --- | --- | --- |
| [Button](components/Button/README.md) | 带文字的操作按钮，可加前置图标。 | 按钮、保存、提交、确认、新建；button、save、submit | 点击执行动作；纯图标用 IconButton，展开菜单用 DropdownButton。 |
| [IconButton](components/IconButton/README.md) | 只显示图标的操作按钮。 | 关闭叉号、更多图标、复制图标、发送箭头；icon button | 有可见文字用 Button；只展示图标而无操作时无需按钮。 |
| [DropdownButton](components/DropdownButton/README.md) | 带下拉指示的菜单触发按钮。 | 点开导出格式、展开选项、下拉按钮；dropdown trigger | 仅负责触发按钮；菜单容器、定位和展开状态由调用方提供，条目可用 MenuItem。 |
| [MenuItem](components/MenuItem/README.md) | 可操作的菜单或侧栏条目列表，支持缩进、展开箭头、更多操作与重命名。 | 菜单项、侧栏行、删除条目、双击改名；menu item、sidebar item | 负责条目及回调；不是完整弹出菜单或路由系统，也没有选中态。 |
| [TextFields](components/TextFields/README.md) | 单行、多行或密码输入，带可选标题、说明和错误展示。 | 名称输入框、描述文本域、密码框、字数限制；input、textarea、password | 填写内容用它；输入关键词查找用 SearchBar。校验规则由调用方提供。 |
| [SearchBar](components/SearchBar/README.md) | 输入搜索词，支持回车搜索和清空。 | 搜索框、搜文件、按名称查找；search、query | 负责输入与回调；搜索结果和过滤逻辑由调用方提供。 |
| [Checkbox](components/Checkbox/README.md) | 勾选独立选项、确认同意或从列表中多选。 | 复选框、批量选择、勾选多项、同意协议；checkbox、multi-select | 开关设置优先用 Switch；圆形外观仍是复选，不表示互斥单选；无半选态。 |
| [Switch](components/Switch/README.md) | 切换一项设置的开 / 关状态。 | 开启通知、关闭同步、开关；switch、toggle on/off | 适合表达设置启停；勾选条目或同意条款用 Checkbox。业务生效由调用方处理。 |
| [Segmented](components/Segmented/README.md) | 同一轨道内的一组互斥选项，可用文字或图标。 | 分段控件、列表/网格、日/周/月、模式切换；segmented control | 适合紧凑的模式或选项切换；只管理选中值，内容联动由调用方实现。 |
| [Tab](components/Tab/README.md) | 同一区域的并列内容视图切换，可联动内容面板。 | 页签、详情/记录、概览/文件、切换内容页；tabs | 内容分区用它；紧凑模式选择用 Segmented。标签为文字样式，溢出可横向滚动。 |
| [Chip](components/Chip/README.md) | 可选中的独立胶囊标签；命名导出 `ChipGroup` 提供单选组。 | 筛选胶囊、选类别、全部/图片/视频；filter chip、selectable chip | 静态标签用 Tag；ChipGroup 仅内置单选，多选需调用方管理多个 Chip。 |
| [Tag](components/Tag/README.md) | 静态分类、状态或元信息标签；命名导出 `DiffTags` 展示成对增删数字。 | 状态标记、文件类型、分类标签、+12/−3；tag、label、diff counts | 不承担点击、选择或移除；可选中标签用 Chip，移除技能条目用 ActionChip。 |
| [ActionChip](components/ActionChip/README.md) | 展示已添加的技能、连接器或专家，悬浮时显示移除提示。 | 已选技能、移除连接器、输入区专家标签；skill chip、connector chip | 整个条目点击触发回调，由调用方移除；不是通用筛选标签或添加动作按钮。 |

## 容易混淆的描述

- **“加一个标签”**：只展示 → Tag；可选中筛选 → Chip；已添加技能可移除 → ActionChip；切换内容分区 → Tab。
- **“切换一下”**：开 / 关 → Switch；多个互斥模式 → Segmented；内容面板 → Tab；独立胶囊分类 → ChipGroup。
- **“做个下拉选择”**：DropdownButton + 调用方管理的菜单，可使用 MenuItem 条目；当前没有独立 Select / Combobox，不假定已有完整选择器行为。

Button / DropdownButton 的操作层级建议：主操作用 `primary`，强调的辅助入口用 `secondary`，有边界的次要入口用 `tertiary`，轻量入口用 `text`；同一区域通常只保留一个主操作。这是选择建议，不是组件限制。

## 维护与预览

新增、移除或变更组件职责时，同步本目录与注册表；尺寸、颜色和完整参数仅维护在组件文档及预览中。

从工程根目录运行：

```sh
node scripts/build.mjs atom Button
node scripts/verify.mjs atom Button
node scripts/build.mjs atom --gallery
node scripts/verify.mjs atom --gallery
```

独立预览位于 `previews/<Name>/preview.html`，总览位于 `index.html`。目录与交付方式见 [工程说明](../README.md)。

结构参考：[Atlassian Components](https://atlassian.design/components) 的简短职责目录。本目录在此基础上补充中英文描述线索、相邻组件边界和 API 入口，供 AI 按需逐层读取；组件能力以本仓库实现为准。
