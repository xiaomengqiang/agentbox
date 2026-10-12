# Icon Component

Agentbox 功能图标优先且统一使用 `assets/uploads/icon/function/` 对应 SVG，名称与文件名一致，不设别名。Button 以 CSS mask 呈现并跟随 currentColor。缺少语义对应资源时说明缺口，不用 Lucide 或手绘图标冒充。下文为共享 Icon 的技术说明，不改变这条项目资源约定。

## Usage

The import below assumes `<library>/components/<Name>/`. Adapt it to the actual source location; preserve a project-specific icon module when already used.

```jsx
import { Icon } from "../../../assets/shared/icons.js";

<Icon name="chevron-down" size={16} color="#0A59F7" className="chev"/>

const item = { icon: "home", label: "首页" };
<Icon name={item.icon} size={22} />

let open = true;
<Icon name={open ? "chevron-up" : "chevron-down"} />

<Icon src="./assets/uploads/logo.svg" size={32} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | — | Lucide icon name (kebab-case) |
| `src` | string | — | User-provided image path (svg/png/jpg); overrides `name` when both are set |
| `size` | number | `16` | Icon size in px |
| `color` | string | `currentColor` | Icon stroke color (name mode only) |
| `className` | string | `""` | CSS class (margin/hover effects belong here) |
| `style` | object | — | Inline styles |
| `strokeWidth` | number | `2` | Stroke width (name mode only) |

## Lucide name mode (`name`)

Shared Icon 的既有能力；Agentbox 功能图标不使用此模式。

1. **Use real Lucide icon names only** — exactly as they exist in the Lucide icon set (kebab-case: `chevron-down`, `shopping-cart`, `circle-check`). Never invent, guess-spell, or pluralize names.
2. **Never hand-write SVG path data** — the Icon component renders Lucide nodes; hand-written paths will not render.
3. **camelCase is auto-converted** — `chevronDown` → `chevron-down`, but prefer kebab-case.
4. **Passing variables is fine** — `name="close"`, `name={item.icon}`, `name={cond ? "a" : "b"}` all work; Runtime-assembled names (`` `${type}-icon` ``) cannot be extracted and will render nothing.
5. Unsure about a name? Rely on your Lucide knowledge or check https://lucide.dev/icons.
6. **Do NOT use legacy (renamed) icon names** — some old Lucide names no longer exist: `bar-chart-3` → `chart-column`, `more-horizontal` → `ellipsis`, `check-circle-2` → `circle-check-big`. Use the current names.

## src mode (`src`)

Agentbox 功能图标使用项目提供的对应 SVG。 Place them in the existing project’s shared `assets/uploads/`. In the dual-library project, the builder resolves the source URL below and rewrites it for both standalone and gallery output; do not copy assets into each component. Legacy scaffolds keep their own existing asset root:

1. `<Icon src="./assets/uploads/logo.svg" size={28} />`
2. `<img src="./assets/uploads/banner.png" />`
