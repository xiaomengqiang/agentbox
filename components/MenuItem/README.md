# MenuItem

## Overview

#### 作用

`MenuItem` 用于在导航、下拉菜单和文件列表中承载单条可操作内容；通过 `variant` 选择语义形态，条目数据通过 `items` 提供。

#### 视觉样式

- `nav`：用于左侧导航中的常用入口，例如新建对话、定时任务或插件。
- `history`：用于左侧导航中的历史对话，并在右侧显示生成、完成、故障或待授权状态。
- `dropdown`：用于下拉菜单中的操作项；小尺寸适合紧凑菜单，中尺寸适合带前置图标与选中反馈的菜单。
- `folder` / `file-level-1` / `file-level-2`：用于右侧文件树，分别对应文件夹、一级文件和二级文件。

#### 尺寸与形状

- `nav` 与 `history`：300 × 40px；`folder` 与文件列表：602 × 40px。
- `dropdown`：`sm` 为 152 × 32px，`md` 为 232 × 36px。
- 左侧导航和右侧列表容器使用 `--radius-container`（8px）；下拉列表使用 `--radius-md`（6px）。

#### 图标

- 导航与中尺寸下拉列表可通过条目 `iconSrc` 配置前置图标，并可传入上传后的 SVG data URL；所有形态的 `label` 均支持自定义文本。
- 文件夹容器的第一个图标是展开/收起开关；通过条目 `expanded` 控制状态，点击后由 `onToggle` 返回新值。文件夹图标本身可通过 `folderIconSrc` 替换。

#### 使用原则

- 同一菜单层级使用清晰、可编辑的短文案；`danger` 仅用于不可逆或高风险操作，例如卸载。
- `state` 主要用于受控展示与文档走查；常规点击交互由 `onSelect`、`onToggle` 和 `onRename` 接收。

#### 形态细则

**导航内容列表（`nav`）**
- 300×40px 容器，8px 圆角
- 导航条目状态：默认 / 悬浮 / 选中
- 默认状态透明；悬浮和选中使用 5% 黑色背景
- 图标可通过条目的 `iconSrc` 传入；预览提供新建对话、定时任务、插件、更多四个 16px SVG，选择后会同步使用对应文本
- 图标 16px，文本 14px / regular / 主文字色，图标与文本间距 8px
- 悬浮态：背景 5% 透明黑色；选中态：与悬浮态同款背景

**历史对话列表（`history`）**
- 每行 300×40px，文本左对齐、距左 12px，右侧状态图标右对齐、距右 12px、上下各 8px
- 状态：默认 / 悬浮 / 生成中 / 完成 / 故障 / 待授权；生成中、完成、故障、待授权会显示对应右侧状态图标
- 除默认态外，其余状态均显示 5% 透明黑色背景

**下拉列表（`dropdown`）**
- 小尺寸（`size="sm"`，默认）：单行菜单项 152×32px、6px 圆角，文本左对齐
  - 一般样式：默认无背景；悬浮为 5% 透明黑；禁用为 50% 透明度
  - 警告样式：用于“卸载”，继承红色文字与图标、浅红悬浮底；同样支持默认 / 悬浮 / 禁用
- 中尺寸（`size="md"`）：单行菜单项 232×36px、6px 圆角
  - 图标 17px 距容器左 12px、上下 8px，文本与图标间距 8px，文本 12px / 行高 19.2px / 字重 400
  - 默认态白色底；悬浮态 5% 透明黑底；选中态白色底 + 右侧绿色「正确」图标；禁用态 50% 透明度
  - 前置图标仅提供“添加”和“分支”两项；文本可通过 `label` 自定义

**文件夹 / 文件列表（`folder` / `file-level-1` / `file-level-2`）**
- 每行 602×40px，左对齐排列「图标 → 文本」，部件间距 8px
- 三种形态：
  - `folder`：展开/收起图标 → 文件夹图标 → 文本
  - `file-level-1`：文件图标距外框左 12px，无展开/收起
  - `file-level-2`：文件图标距外框左 36px，无展开/收起
- 五种状态（三种形态通用）：
  - 默认（无背景）
  - 悬浮（5% 透明黑背景 + 右侧评论、更多两个操作图标）
  - 重命名（5% 透明黑背景 + brand 蓝描边输入框，folder / file-level-2 宽 540×36px，file-level-1 宽 564×36px）
  - 重命名输入中（brand 蓝描边输入框 + 文本后 2px 蓝色竖线光标）
  - 禁用（禁用色、不可交互）
- 展开/收起图标仅文件夹列表显示，可点击切换，`expanded` 受控 / `defaultExpanded` 非受控；可用 `expandIconSrc` 和 `collapseIconSrc` 分别替换收起与展开时的图标
- 文件夹图标默认使用 Lucide（`folder`），支持通过 `folderIconSrc` 传入自定义资源；文件图标为内置 16×16 文档图标（`currentColor`，跟随文字色含禁用态）
- 悬浮操作图标与重命名光标均支持自定义图片资源（`hoverCommentSrc` / `hoverMoreSrc` / `caretSrc`）

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"nav" \| "history" \| "dropdown" \| "folder" \| "file-level-1" \| "file-level-2"` | `"nav"` | 菜单/列表条目形态 |
| `items` | `Array` | `[]` | 条目数据，字段随 `variant` 不同（见下） |
| `selectedId` | `string` | — | 受控选中条目 id（仅 nav） |
| `defaultSelectedId` | `string` | — | 非受控默认选中条目 id（仅 nav） |
| `onSelect` | `(item) => void` | — | 点击条目的回调，回传被点击的 item（nav / history / dropdown） |
| `plain` | `boolean` | `false` | 是否无背景形态（仅 nav） |
| `size` | `"sm" \| "md"` | `"sm"` | 下拉列表尺寸（仅 dropdown）：`sm` 小尺寸 152×32px，`md` 中尺寸 232×36px |
| `defaultExpanded` | `boolean` | `false` | 非受控默认展开状态（仅 folder） |
| `onToggle` | `(item) => void` | — | 展开/收起切换回调（仅 folder），回传更新后的 `item`（含 `expanded` 新值） |
| `onRename` | `(item, newName) => void` | — | 重命名输入回调（folder / file-level-1 / file-level-2），回传 `item` 与最新文本 |
| `expandIconSrc` | `string` | — | 文件夹收起时开关图标的可选 SVG 路径；缺省使用 `chevron-right` |
| `collapseIconSrc` | `string` | — | 文件夹展开时开关图标的可选 SVG 路径；缺省使用 `chevron-down` |
| `folderIconSrc` | `string` | — | 文件夹图标自定义图片路径（仅 folder） |
| `hoverCommentSrc` | `string` | — | 悬浮态右侧评论图标自定义图片路径（列表形态） |
| `hoverMoreSrc` | `string` | — | 悬浮态右侧「更多」图标自定义图片路径（列表形态） |
| `caretSrc` | `string` | — | 重命名输入中光标自定义图片路径（列表形态）；缺省时使用内置品牌蓝竖线 |

### items 字段
- `nav`：`{ id, label, icon?, iconSrc?, state? }`；`label` 为自定义文本；`icon` 为 Lucide 图标名，`iconSrc` 为自定义上传图片路径（优先于 `icon`）；`state` 可选，可为 `hover` / `selected`
- `history`：`{ id, label, state? }`；`label` 为自定义文本；`state` 可选，可为 `hover` / `generating` / `completed` / `fault` / `pending-auth`，缺省或 `default` 为默认态
- `dropdown`：`{ id, label, icon?, iconSrc?, danger?, disabled?, state? }`；小尺寸一般项和警告项均使用指定的 14px 前置图标；`danger` 使用组件级警告 token；`disabled` 标记禁用（50% 透明度），`state` 可选 `hover` / `selected`
  - 中尺寸 `size="md"` 时，预览中 `iconSrc` 提供“添加”“分支”或上传 SVG；`state` 支持 `selected`（白色底 + 右侧 14px 蓝色勾选 SVG）
- `folder` / `file-level-1` / `file-level-2`：`{ id, label, state?, expanded? }`；`label` 为文件夹/文件名称；`state` 可选，可为 `hover` / `rename` / `renaming` / `disabled`，缺省或 `default` 为默认态；`expanded` 是否展开（受控，仅 folder）

## Color Spec

| 形态 | State | Background | Text / icon |
|------|-------|------------|-------------|
| `nav` / `history` | default | `transparent` | `--on-surface` |
| `nav` / `history` | hover / selected / 状态 | `--color-interactive-hover` | 同 Default |
| `dropdown` 一般 | hover | `--color-interactive-hover` | `--on-surface` |
| `dropdown` 警告 | default / hover | `transparent` / `--mi-danger-container`（`#FEE7E8`） | `--mi-danger-font` / `--mi-danger-icon`（`#E02128`） |
| 全部形态 | disabled | 同 Default，`opacity: 0.5` | `--text-disabled` |
| `dropdown` 中尺寸 selected | selected | `--surface-container-lowest` | 指定的 14px 蓝色勾选 SVG |

主文本和图标均通过 `--on-surface` 绑定到 `--color-font-primary`（浅色主题为 90% 黑）；辅助信息使用 `--text-secondary`，禁用信息使用 `--text-disabled`。卸载是设计指定例外：`--mi-danger-font` / `--mi-danger-icon` 为 `#E02128`，`--mi-danger-container` 为 `#FEE7E8`。

## Usage

```jsx
import MenuItem from "./MenuItem/index.jsx";

// 导航内容列表
<MenuItem variant="nav" items={[
  { id: "new", label: "新建对话", iconSrc: "./assets/uploads/menu-new-conversation.svg" },
]} />

// 历史对话列表
<MenuItem variant="history" items={[
  { id: "ppt", label: "产品方案汇报ppt生成", state: "generating" },
]} />

// 下拉列表
<MenuItem variant="dropdown" items={[
  { id: "new", label: "新建对话", icon: "message-square-plus" },
  { id: "uninstall", label: "卸载", icon: "trash-2", danger: true },
]} />

// 下拉列表（中尺寸，选中态 + 自定义图标）
<MenuItem variant="dropdown" size="md" items={[
  { id: "workflow", label: "工作流", iconSrc: "./assets/uploads/menu-workflow.svg", state: "selected" },
]} />

// 文件夹列表（默认，非受控展开）
<MenuItem variant="folder" items={[
  { id: "f1", label: "新建文件夹" },
]} defaultExpanded={false} onToggle={(item) => console.log("toggled", item)} />

// 一级文件列表（无展开/收起，文件图标距左 12px）
<MenuItem variant="file-level-1" items={[
  { id: "f1", label: "产品需求文档.docx" },
]} />

// 二级文件列表（无展开/收起，文件图标距左 36px，重命名输入中）
<MenuItem variant="file-level-2" items={[
  { id: "f1", label: "产品需求文档.docx", state: "renaming" },
]} caretSrc="./assets/uploads/folder-caret.svg" onRename={(item, name) => console.log("rename", name)} />

// 文件夹列表悬浮态 + 重命名输入中（传入自定义图标资源）
<MenuItem variant="folder" items={[
  { id: "f1", label: "新建文件夹", state: "hover" },
  { id: "f2", label: "新建文件夹", state: "renaming", expanded: true },
]} hoverCommentSrc="./assets/uploads/folder-comment.svg" hoverMoreSrc="./assets/uploads/folder-more.svg" caretSrc="./assets/uploads/folder-caret.svg" onRename={(item, name) => console.log("rename", name)} />
```
