# Icon Component

Default use **Lucide icon name** (`name` prop). Use `mask` for file-based monochrome icons that must follow text color, and `src` only when the user explicitly provides multicolor image files.

The Icon component lives at `components/Icon/index.jsx` and is copied into every scaffold by `init.mjs` (it is the build-time Lucide table injection target — do not delete it).

## Usage

```jsx
import { Icon } from "../../components/Icon/index.jsx";

<Icon name="chevron-down" size={16} color="#0A59F7" className="chev"/>

const item = { icon: "home", label: "首页" };
<Icon name={item.icon} size={22} />

let open = true;
<Icon name={open ? "chevron-up" : "chevron-down"} />

<Icon mask="./assets/uploads/icon/function/add.svg" size={20} />

<Icon src="./assets/uploads/logo.svg" size={28} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | — | Lucide icon name (kebab-case) |
| `mask` | string | — | Monochrome SVG path; CSS-mask rendering, follows `currentColor`; highest priority when several props are set |
| `src` | string | — | User-provided image path (svg/png/jpg); renders as `<img>`, overrides `name` when both are set |
| `size` | number | `16` | Icon size in px |
| `color` | string | `currentColor` | Icon color (name mode stroke / mask mode background; no effect in src mode) |
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

Only when the user explicitly requires their own multicolor images (svg/png/jpg). Place them into `{scaffold}/assets/uploads/` — the path resolves from the scaffold root:

1. `<Icon src="./assets/uploads/banner.png" size={28} />`
2. `<img src="./assets/uploads/banner.png" />`

Note: `src` renders as an `<img>` — the image does NOT follow text color (an `<img>` is an isolated document; page CSS cannot reach into it). Referenced local images are inlined as data URLs at build time (offline `file://` pages block cross-origin CSS/resource requests).

## mask mode (`mask`)

For file-based monochrome icons that must follow text color (precision artwork Lucide does not have, stateful icons). The component renders a span with `background-color: currentColor` and uses the SVG as a CSS mask — the SVG contributes shape only, so the icon follows the caller's `color` / CSS `color` token across hover/pressed/light/dark states.

1. `<Icon mask="./assets/uploads/icon/function/add.svg" size={20} />`

The SVG file should be a filled silhouette (alpha matters, color does not). Place custom artwork into `{scaffold}/assets/uploads/icon/` and reference it via `mask` (monochrome, color-following) or `src` (multicolor).
