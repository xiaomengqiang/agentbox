# Tag

## Overview

#### 作用

Tag 用于展示紧凑的元信息、代码变更数量或可选择的筛选项。默认导出 `Tag`，并提供 `DiffTags` 与 `TagGroup` 处理成对差异和标签组。

#### 视觉样式

- `diff-add`：表示新增数量，如代码审查中的新增行数。
- `diff-remove`：表示删除数量，如代码审查中的删除行数。
- `icon`：用于带图标的静态分类或元信息，如“代码编辑”。
- `tab`：用于轻量筛选或视图选择；支持选中、禁用、单选和多选。

#### 尺寸与形状

- Diff 标签高 18px，左右内边距各 4px，使用全圆角，宽度随内容自适应。
- Icon 标签总高 24px，使用 12px / 16px 文字、14px 图标、上下 4px 内边距和 4px 圆角。
- Tab 标签高 36px，使用 16px 文字、16px 图标和 20px 圆角。

#### 图标

- `icon` 与 `tab` 变体支持前置 Lucide 图标。
- 默认图标尺寸分别为 14px 与 16px，可通过 `iconSize` 覆盖。

#### 行为模式

- `TagGroup` 默认在 `tab` 变体下可选中；支持受控、非受控、单选和多选。
- `interactive={false}` 或 `selectable={false}` 用于纯展示，不响应 hover 或键盘焦点。

#### 使用原则

- Diff 值优先通过 `DiffTags` 成对展示，组件会补符号和千分位。
- Tab 标签使用短名词；禁用项应保留可理解的文案，不依赖颜色解释原因。

## Props

### Tag

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"diff-add" \| "diff-remove" \| "icon" \| "tab"` | `"diff-add"` | 标签视觉变体。 |
| `icon` | `string` | — | Lucide 图标名。 |
| `iconSize` | `number` | Icon 14 / Tab 16 | 图标尺寸。 |
| `selected` | `boolean` | `false` | 仅 Tab 变体生效。 |
| `interactive` | `boolean` | Tab 为 `true` | Tab 是否渲染为可交互按钮。 |
| `disabled` | `boolean` | `false` | 禁用 Tab 交互。 |
| `onClick` | `function` | — | Tab 点击回调。 |
| `className` | `string` | `""` | 追加类名。 |
| `children` | `ReactNode` | — | 标签内容。 |

### DiffTags

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `added` | `number \| string` | — | 新增值，自动补 `+` 和千分位。 |
| `removed` | `number \| string` | — | 删除值，自动补 `-` 和千分位。 |
| `gap` | `number` | `4` | 两个标签的间距，单位 px。 |
| `className` | `string` | `""` | 容器附加类名。 |

### TagGroup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<{ id, label, icon?, disabled?, title? }>` | `[]` | 标签数据。 |
| `variant` | `Tag.variant` | `"tab"` | 子标签变体。 |
| `gap` | `number` | Tab 8 / 其他 4 | 标签间距，单位 px。 |
| `selectable` | `boolean` | Tab 为 `true` | 是否管理选中状态。 |
| `multiple` | `boolean` | `false` | 是否允许多选。 |
| `value` | `string \| string[]` | — | 受控选中值。 |
| `defaultValue` | `string \| string[]` | 单选首项 / 多选空数组 | 非受控初始值。 |
| `onChange` | `(nextValue, item) => void` | — | 选中值变化回调。 |

## Color Spec

| Variant / State | Background | Outline | Text / Icon |
|-----------------|------------|---------|-------------|
| Diff add | `#D5F2DC` | 无 | `#01802B` |
| Diff remove | `#FCE3E0` | 无 | `#BF0A1C` |
| Icon | `--container-05` | 无 | `--color-font-primary` / `--color-icon-primary` |
| Tab · Default | `--color-comp-background-tertiary` | 无 | `--color-font-secondary` / `--container-60` |
| Tab · Hover | Light `--container-10`；Dark `--container-15` | 同 Default | 同 Default |
| Tab · Selected | Light `--container-90`；Dark `--gray-02` | 无 | `--color-font-on-primary` / `--color-icon-on-primary` |
| Tab · Selected hover | Light `--container-80`；Dark `--gray-03` | 同 Selected | 同 Selected |
| Tab · Focus visible | 同当前状态 | `--focus-ring` | 同当前状态 |
| Tab · Disabled | 同当前背景 | 无 | `--text-disabled` |

Diff 颜色是固定设计色，不随主题翻转。

## Usage

```jsx
import Tag, { DiffTags, TagGroup } from "./components/Tag/index.jsx";

<DiffTags added={1280} removed={64} />

<Tag variant="icon" icon="code">
  代码编辑
</Tag>

<TagGroup
  items={[
    { id: "all", label: "全部", icon: "layout-grid" },
    { id: "chart", label: "图表", icon: "chart-column" },
  ]}
  defaultValue="all"
  onChange={(value, item) => console.log(value, item)}
/>
```
