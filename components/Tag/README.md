# Tag

- 标签组件，覆盖三种形态：代码增删标签、图标 + 文字标签、多个可选中圆角标签。
- `Tag` 是标签原子（默认导出），`TagGroup` 负责一行多标签的排布与选中状态管理，`DiffTags` 是增删成对出现的一体写法。

## Features

- 三种形态由 `variant` 切换：`diff-add` / `diff-remove`（代码增删）、`icon`（图标 + 文字）、`tab`（可选中圆角标签）
- 增删标签使用设计指定的绿 `#D5F2DC` / 红 `#FCE3E0` 底色与对应文字色，12px 字号、行高 18px，左右内边距 4px、上下内边距 0（标签高度即 18px），全圆角（999px）
- `DiffTags`：增删「两个一起」成对渲染（间距固定 4px），数值自动补正负号与千分位，只传一侧时另一侧不渲染，两侧均空时整体不渲染
- `icon` 形态：14px 图标 + 12px 文字，间距 4px，`container5` 底色，内边距 8 / 4，圆角 4px
- `tab` 形态：16px 图标 + 16px 文字（行高固定 20px，标签高度 36px），间距 6px，内边距 16 / 8，圆角 20px；选中态 `container90` 底 + `font_on_primary` 文字（Medium 字重），未选中态 `container60` 图标 + `font_secondary` 文字 + `comp_background_tertiary` 底色
- `TagGroup` 自动间距：`tab` 一行 8px，其余形态 4px（可用 `gap` 覆盖）
- 静态展示：`Tag` 传 `interactive={false}`（`TagGroup` 传 `selectable={false}`）时退化为只读 `span`，保留全部配色/尺寸但无 hover、无交互
- 选中状态支持受控（`value`）与非受控（`defaultValue`），`multiple` 可多选
- 深浅色模式自动适配，键盘 `focus-visible` 焦点环，支持 `disabled`

## Props

### Tag

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"diff-add" \| "diff-remove" \| "icon" \| "tab"` | `"diff-add"` | 标签形态 |
| `icon` | `string` | — | Lucide 图标名（`icon` / `tab` 形态使用） |
| `iconSize` | `number` | `14`（`tab` 为 `16`） | 图标尺寸 |
| `selected` | `boolean` | `false` | 仅 `tab` 形态生效，切换选中样式 |
| `interactive` | `boolean` | `tab` 形态为 `true`，其余为 `false` | `false` 时渲染为静态 `span`（无 hover / 不进入焦点序列） |
| `disabled` | `boolean` | `false` | 仅 `tab` 形态生效，禁用交互（静态形态同样生效） |
| `onClick` | `function` | — | 仅 `tab` 形态生效 |
| `className` | `string` | `""` | 追加类名 |
| `children` | `ReactNode` | — | 标签文字 |

### DiffTags

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `added` | `number \| string` | — | 新增数值，渲染绿色标签（自动补 `+` 与千分位） |
| `removed` | `number \| string` | — | 删除数值，渲染红色标签（自动补 `-` 与千分位） |
| `gap` | `number` | `4` | 两个标签之间的间距（px） |
| `className` | `string` | `""` | 追加类名 |

### TagGroup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<{ id, label, icon?, disabled?, title? }>` | — (required) | 标签数据 |
| `variant` | 同 `Tag.variant` | `"tab"` | 传给每个子标签的形态 |
| `gap` | `number` | `tab` 8 / 其余 4 | 标签间距（px） |
| `selectable` | `boolean` | `variant === "tab"` | 是否可选中 |
| `multiple` | `boolean` | `false` | 多选模式 |
| `value` | `string \| string[]` | — | 受控选中值 |
| `defaultValue` | `string \| string[]` | 首项（单选） | 非受控初始值 |
| `onChange` | `function` | — | `(nextValue, item) => void` |

## 配色校验（逐元素）

> 本节仅用于设计走查 / 验收比对，不属于组件交付内容（组件本身不含任何色卡或表格）。

| 元素 | 属性 | Token | Light | Dark |
|------|------|-------|-------|------|
| `Tag · diff-add` | 标签底色 | 设计指定（不随主题） | `#D5F2DC` | `#D5F2DC` |
| `Tag · diff-add` | 文字 | 设计指定（不随主题） | `#01802B` | `#01802B` |
| `Tag · diff-remove` | 标签底色 | 设计指定（不随主题） | `#FCE3E0` | `#FCE3E0` |
| `Tag · diff-remove` | 文字 | 设计指定（不随主题） | `#BF0A1C` | `#BF0A1C` |
| `Tag · icon` | 容器底色 | `--container-05` | `rgba(0,0,0,.05)` | `rgba(255,255,255,.05)` |
| `Tag · icon` | 图标 | `--color-icon-primary` | `rgba(0,0,0,.9)` | `rgba(255,255,255,.9)` |
| `Tag · icon` | 文字 | `--color-font-primary` | `rgba(0,0,0,.9)` | `rgba(255,255,255,.9)` |
| `Tag · tab／未选中` | 容器底色 | `--color-comp-background-tertiary` | `rgba(0,0,0,.05)` | `rgba(255,255,255,.10)` |
| `Tag · tab／未选中` | 文字 | `--color-font-secondary` | `rgba(0,0,0,.6)` | `rgba(255,255,255,.6)` |
| `Tag · tab／未选中` | 图标 | `--container-60` | `rgba(0,0,0,.6)` | `rgba(255,255,255,.6)` |
| `Tag · tab／未选中 :hover` | 容器底色 | `--container-10` / `--container-15` | `rgba(0,0,0,.10)` | `rgba(255,255,255,.15)` |
| `Tag · tab／选中` | 容器底色 | `--container-90`（dark 覆写 `--gray-02`） | `rgba(0,0,0,.9)` | `#202224` |
| `Tag · tab／选中` | 文字 | `--color-font-on-primary` | `#FFFFFF` | `#FFFFFF` |
| `Tag · tab／选中` | 图标 | `--color-icon-on-primary` | `#FFFFFF` | `#FFFFFF` |
| `Tag · tab／选中 :hover` | 容器底色 | `--container-80` / `--gray-03` | `rgba(0,0,0,.8)` | `#2E3033` |
| `Tag · tab／禁用` | 图标 / 文字 | `--text-disabled` | `rgba(0,0,0,.2)` | `rgba(255,255,255,.2)` |
| `Tag · tab／焦点环` | 1px 描边 | `--focus-ring` | `#0A59F7` | `#317AF7` |

## Usage

```jsx
import Tag, { TagGroup, DiffTags } from "./components/Tag/index.jsx";

// 1. 代码增删标签：成对出现（两个一起，间距 4px）
<DiffTags added={1280} removed={64} />   {/* +1,280  -64 */}

// 单个标签也可单独使用
<Tag variant="diff-add">+128</Tag>
<Tag variant="diff-remove">-64</Tag>

// 2. 图标 + 文字标签
<Tag variant="icon" icon="code">
  代码编辑
</Tag>

// 3. 多个可选中圆角标签
<TagGroup
  items={[
    { id: "all", label: "全部", icon: "layout-grid" },
    { id: "chart", label: "图表", icon: "chart-column" },
  ]}
  defaultValue="all"
  onChange={(id) => console.log(id)}
/>
```
