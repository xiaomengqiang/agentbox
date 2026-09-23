# MenuItem

菜单条目组件：通过 `variant` 区分三种形态——导航内容列表（nav）、历史对话列表（history）、下拉列表（dropdown）。

## Features

### 导航内容列表（nav）
- 316px 宽容器，背景 #f1f3f5 70% 不透明度（可用 `plain` 关闭）
- 每行 300×40px，上下间距 12px、左右间距 8px
- 图标 16px，文本 14px / regular / 主文字色，图标与文本间距 8px
- 悬浮态：背景 5% 透明黑色；选中态：与悬浮态同款背景

### 历史对话列表（history）
- 每行 300×40px，文本左对齐、距左 12px，右侧状态图标右对齐、距右 12px、上下各 8px
- 状态：默认 / 悬浮 / 生成中 / 完成 / 故障 / 待授权
- 除默认态外，其余状态均显示 5% 透明黑色背景

### 下拉列表（dropdown）
- 小尺寸（`size="sm"`，默认）：单行菜单项 152×32px、6px 圆角，图标 + 文本左对齐
  - 图标 16px 距左 12px，文本 12px / 行高 19.2px / 字重 400
  - 默认态无背景；悬浮态普通项 5% 透明黑、危险项浅红；禁用态 50% 透明度
- 中尺寸（`size="md"`）：单行菜单项 232×36px、6px 圆角
  - 图标 17px 距容器左 12px、上下 8px，文本与图标间距 8px，文本 12px / 行高 19.2px / 字重 400
  - 默认态白色底；悬浮态 5% 透明黑底；选中态白色底 + 右侧绿色「正确」图标；禁用态 50% 透明度
  - 图标支持自定义上传（`iconSrc`），文本为自定义输入（`label`）

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"nav" \| "history" \| "dropdown"` | `"nav"` | 菜单条目形态 |
| `items` | `Array` | `[]` | 菜单条目，字段随 `variant` 不同（见下） |
| `selectedId` | `string` | — | 受控选中条目 id（仅 nav） |
| `defaultSelectedId` | `string` | — | 非受控默认选中条目 id（仅 nav） |
| `onSelect` | `(item) => void` | — | 点击条目的回调，回传被点击的 item |
| `plain` | `boolean` | `false` | 是否无背景形态（仅 nav） |
| `size` | `"sm" \| "md"` | `"sm"` | 下拉列表尺寸（仅 dropdown）：`sm` 小尺寸 152×32px，`md` 中尺寸 232×36px |

### items 字段
- `nav`：`{ id, label, icon?, iconSrc?, state? }`；`label` 为自定义文本；`icon` 为 Lucide 图标名，`iconSrc` 为自定义上传图片路径（优先于 `icon`）；`state` 可选，可为 `hover` / `selected`
- `history`：`{ id, label, state? }`；`label` 为自定义文本；`state` 可选，可为 `hover` / `generating` / `completed` / `fault` / `pending-auth`，缺省或 `default` 为默认态
- `dropdown`：`{ id, label, icon?, iconSrc?, danger?, disabled?, state? }`；`icon` 为 Lucide 图标名（`message-square-plus` 新建对话 / `trash-2` 卸载），`iconSrc` 为自定义上传图片路径；`danger` 标记危险项（红字），`disabled` 标记禁用（50% 透明度），`state` 可选 `hover` / `selected`
  - 中尺寸 `size="md"` 时，`state` 支持 `selected`（白色底 + 右侧绿色正确图标）；`iconSrc` 支持自定义上传 17px 图标

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
```
