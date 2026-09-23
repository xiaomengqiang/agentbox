# ActionChip

## Overview

#### 作用

ActionChip 用于展示技能、连接器或专家条目，并提供轻量的移除操作入口，例如输入区中已添加的“网页设计”技能。组件负责展示和触发点击回调，条目的移除由宿主管理。

#### 视觉样式

采用单一品牌浅底样式，适合在输入区或内容附近展示可操作的条目。Default 与 Hover 是同一样式的交互状态：

- Default：显示类型图标和名称，便于识别已添加的内容。
- Hover：悬浮整个操作块时叠加交互色，前置图标原位切换为 close，提示可移除；移出后恢复。

#### 尺寸与形状

- 固定高度 24px，使用 `--radius-full` 胶囊圆角，左右内边距 8px。
- 图标 14px，图文间距 4px；文字 12px / 20px，Medium 字重。
- 宽度随内容自适应，最大宽度不超过父容器；空间受限时文字单行省略。

#### 图标

前置图标始终显示，`icon` 可省略，默认使用 `skill`。

| 取值 | 含义 | 默认状态资源 |
|------|------|--------------|
| `skill` | 技能 | `assets/uploads/icon/prompt input/skill.svg` |
| `connector` | 连接器 | `assets/uploads/icon/prompt input/connector.svg` |
| `expert` | 专家 | `assets/uploads/icon/prompt input/expert.svg` |

Hover 统一使用 `assets/uploads/icon/function/close.svg`。资源通过 SVG mask 着色，替换图标时占位尺寸不变。

#### 使用原则

- 标签使用简短、可识别的条目名称，例如“网页设计”“设计专家”，避免只用图标表达含义。
- close 表达移除预期，建议将 `onClick` 绑定到对应移除行为；组件本身不会自动隐藏或修改列表。
- 整个操作块是一个按钮，图标没有独立点击区域。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | 条目名称；使用时应提供非空文案，组件不补充默认标签。 |
| `icon` | `"skill" \| "connector" \| "expert"` | `"skill"` | 前置图标类型；省略、传入空字符串或 `null` 时使用 skill。 |
| `onClick` | `(event: React.MouseEvent<HTMLButtonElement>) => void` | — | 整个按钮的点击回调；移除等业务逻辑由宿主实现。 |
| `className` | `string` | `""` | 追加到根按钮的样式类名。 |

组件使用原生 `button`，固定 `type="button"`。不提供 `width`、`disabled` 或状态配置，也不透传其余原生按钮属性。

## Color Spec

| State | Background | Outline | Text | Icon |
|-------|------------|---------|------|------|
| Default | `--color-comp-emphasize-tertiary`（引用 `--brand-10`） | 无 | `--color-font-emphasize` | `--color-icon-emphasize` |
| Hover | Default 上叠加 `--color-interactive-hover` | 同 Default | 同 Default | 同 Default，图形切换为 close |

颜色随项目主题 token 切换。仅提供 Default、Hover 两种展示状态，无独立 Pressed 样式。键盘导航时保留 `:focus-visible` 提示：使用 `--focus-ring`，宽度为 `--outline-width-focus`，外偏移为 `--outline-offset-gap`。

## Usage

以下示例从 `atom-components/` 目录下的消费文件导入组件；点击条目后由宿主更新列表。

```jsx
import React, { useState } from "react";
import ActionChip from "./components/ActionChip/index.jsx";

export default function SelectedItems() {
  const [items, setItems] = useState([
    { id: "web-design", icon: "skill", label: "网页设计" },
    { id: "connector", icon: "connector", label: "连接器" },
    { id: "design-expert", icon: "expert", label: "设计专家" },
  ]);

  function removeItem(id) {
    setItems(current => current.filter(item => item.id !== id));
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map(item => (
        <ActionChip
          key={item.id}
          icon={item.icon}
          label={item.label}
          onClick={() => removeItem(item.id)}
        />
      ))}
    </div>
  );
}
```
