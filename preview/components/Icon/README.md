# Icon

## Overview

#### 作用

图标渲染组件,提供三条渲染通路:

- `name` → Lucide 离线图标表:构建时扫描代码中实际用到的图标名,按需注入节点数据,产物只包含用到的图标;描边跟随 `currentColor`,随文字色与明暗主题变化。
- `mask` → 文件形式的单色图标:SVG 作为遮罩贡献形状,背景色取 `currentColor`,同样跟随文字色;适合 Lucide 中没有的精绘图标。
- `src` → 资源图(svg / png / jpg):渲染为 `img`,构建时自动内联为 data URL;不跟随颜色,适合多彩图形。

三条通路均未命中时渲染为空(构建时对非法 Lucide 名给出 WARN)。

#### 视觉样式

- name 模式:24×24 viewBox 线性图标,描边色默认 `currentColor`,线宽默认 2,可按实例覆盖。
- mask 模式:图形等比缩放居中(`contain`),颜色默认跟随 `currentColor`。
- src 模式:图片原样渲染,宽高由 `size` 决定,不跟随颜色。

#### 尺寸

- 默认 16px,通过 `size` 自定义,作用于根元素宽高。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Lucide 图标名(kebab-case);仅接受图标集中存在的名字,camelCase 自动转换 |
| `mask` | `string` | — | 单色 SVG 路径(相对页面),CSS mask 渲染,跟随 currentColor;三 prop 同传时优先级最高 |
| `src` | `string` | — | 资源图路径(相对页面),渲染为 `img`;与 `name` 同传时优先于 `name` |
| `size` | `number` | `16` | 图标尺寸(px) |
| `color` | `string` | `currentColor` | name 模式描边色 / mask 模式背景色;src 模式无效 |
| `strokeWidth` | `number` | `2` | 描边线宽,仅 name 模式生效 |
| `id` | `string` | — | 根元素标识 |
| `className` | `string` | `""` | 追加到根元素,保留内部行为 |
| `style` | `React.CSSProperties` | — | 根元素行内样式 |

## Usage

```jsx
import { Icon } from "../../components/Icon/index.jsx";

<Icon name="chevron-down" size={16} />

const item = { icon: "home", label: "首页" };
<Icon name={item.icon} size={22} />

let open = true;
<Icon name={open ? "chevron-up" : "chevron-down"} />

<Icon mask="./assets/uploads/icon/function/add.svg" size={20} />

<Icon src="./assets/uploads/logo.svg" size={28} />
```

注意:运行时拼接的名字(如 `` `${type}-icon` ``)无法被构建器提取,图标表不含对应数据,渲染为空;Lucide 图标名以 <https://lucide.dev/icons> 为准,不使用已废弃的旧名。Lucide 中没有合适图标时,自行编写 SVG 放入 `assets/uploads/icon/`,用 `mask`(单色跟色)或 `src`(多彩)引用。
