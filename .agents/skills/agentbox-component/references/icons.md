# Icon Component

Default use **Lucide icon name** (`name` prop); only when the user explicitly provides image files, use `src` prop.

The Icon component lives at `components/Icon/index.jsx` and is copied into every scaffold by `init.mjs` (it is the build-time Lucide table injection target — do not delete it).

## Usage

```jsx
import { Icon } from "../../components/Icon/index.jsx";

<Icon name="chevron-down" size={16} color="#0A59F7" className="chev"/>

const item = { icon: "home", label: "首页" };
<Icon name={item.icon} size={22} />

let open = true;
<Icon name={open ? "chevron-up" : "chevron-down"} />

<Icon src="./assets/uploads/logo.svg" size={28} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | — | Lucide icon name (kebab-case) |
| `src` | string | — | User-provided image path (svg/png/jpg); overrides `name` when both are set |
| `size` | number | `16` | Icon size in px |
| `color` | string | `currentColor` | Icon stroke color (name mode only) |
| `strokeWidth` | number | `2` | Stroke width (name mode only) |
| `id` | string | — | Root element id |
| `className` | string | `""` | CSS class (margin/hover effects belong here) |
| `style` | object | — | Inline styles |

## Lucide name mode (`name`)

The default mode — prefer it unless the user explicitly provides asset files.

1. **Use real Lucide icon names only** — exactly as they exist in the Lucide icon set (kebab-case: `chevron-down`, `shopping-cart`, `circle-check`). Never invent, guess-spell, or pluralize names.
2. **Never hand-write SVG path data** — the Icon component renders Lucide nodes; hand-written paths will not render.
3. **camelCase is auto-converted** — `chevronDown` → `chevron-down`, but prefer kebab-case.
4. **Passing variables is fine** — `name="close"`, `name={item.icon}`, `name={cond ? "a" : "b"}` all work; Runtime-assembled names (`` `${type}-icon` ``) cannot be extracted and will render nothing.
5. Unsure about a name? Rely on your Lucide knowledge or check https://lucide.dev/icons.
6. **Do NOT use legacy (renamed) icon names** — some old Lucide names no longer exist: `bar-chart-3` → `chart-column`, `more-horizontal` → `ellipsis`, `check-circle-2` → `circle-check-big`. Use the current names.

The table itself is injected at build time: `build.mjs` scans all module sources for icon names, loads the referenced entries from `assets/library/lucide-icon-nodes.json`, and inlines only the used icons into `components/Icon`. Unknown names trigger a WARN (keep them only if the user explicitly requested the name; otherwise pick a valid Lucide name).

## src mode (`src`)

Only when the user explicitly requires their own images (svg/png/jpg). Place them into `{scaffold}/assets/uploads/` — the path resolves from the scaffold root:

1. `<Icon src="./assets/uploads/logo.svg" size={28} />`
2. `<img src="./assets/uploads/banner.png" />`

Note: `src` renders as an `<img>` — the image does NOT follow text color. Referenced local images are inlined as data URLs at build time (offline `file://` pages block cross-origin CSS/resource requests).

## Custom precision artwork

Do NOT embed custom SVG artwork inside the Icon component. Put the SVG into `assets/uploads/icon/` (distribute via the project asset source), then reference it from the call site:

- **CSS mask** (`mask: url(...) center / contain no-repeat` + `background-color: currentColor`) — follows text color, use for stateful monochrome icons.
- **`src` prop** — plain image rendering, use for multicolor artwork.
