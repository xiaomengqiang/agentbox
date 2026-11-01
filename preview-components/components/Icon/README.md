# Icon

## Overview

#### 作用

图标渲染组件,提供两条渲染通路:

- `name` → Lucide 离线图标表:构建时扫描代码中实际用到的图标名,按需注入节点数据,产物只包含用到的图标;描边跟随 `currentColor`,随文字色与明暗主题变化。
- `src` → 资源图(svg / png / jpg):渲染为 `img`,构建时自动内联为 data URL;与 `name` 同传时优先。

两条通路都未命中时渲染为空(构建时对非法 Lucide 名给出 WARN)。

#### 视觉样式

- name 模式:24×24 viewBox 线性图标,描边色默认 `currentColor`,线宽默认 2,可按实例覆盖。
- src 模式:图片原样渲染,宽高由 `size` 决定,不跟随颜色。

#### 尺寸

- 默认 16px,通过 `size` 自定义,作用于根元素宽高。

#### 自定义精绘图标

不写入本组件。SVG 放入 `assets/uploads/icon/`(经 sync-assets 分发),使用处以 CSS mask(跟随 currentColor)或 `src` 引用。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Lucide 图标名(kebab-case);仅接受图标集中存在的名字,camelCase 自动转换 |
| `src` | `string` | — | 资源图路径(相对页面);与 `name` 同传时优先 |
| `size` | `number` | `16` | 图标尺寸(px) |
| `color` | `string` | `currentColor` | 描边色,仅 name 模式生效 |
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

<Icon src="./assets/uploads/logo.svg" size={28} />
```

注意:运行时拼接的名字(如 `` `${type}-icon` ``)无法被构建器提取,图标表不含对应数据,渲染为空;图标名以 <https://lucide.dev/icons> 为准,不使用已废弃的旧名。
