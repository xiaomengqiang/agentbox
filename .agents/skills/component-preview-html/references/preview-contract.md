# Component preview contract

Use this contract when the user asks for the established Agentbox component-preview format. Adapt it to the component; omit sections that do not apply.

## Application to independent pages and galleries

In the dual-library project, author the target component's `preview.jsx` and `preview.css`; generated HTML is not source. Both output modes use the same preview module. A standalone page contains the shared title/theme control and one component panel; it does not need a component tab row. Gallery-only navigation and panel-state checks apply when aggregating or editing the shared gallery shell. Keep this contract focused on presentation; build commands live in `agentbox-component/references/component-workflow.md`.

## Page structure

1. Shared page header, component tabs in gallery mode, then the selected component’s bilingual name and key-prop summary (see below).
2. Configurator: live controls beside a rendered preview.
3. Interactive gallery: supported sizes and variants, with interactive enabled examples. Disabled examples belong in State matrix.
4. Shape: include only when shape is a public axis or a documented exception.
5. State matrix: supported states from the actual component; include Disabled. Add Input states separately when input stages convey useful behavior.
6. Color spec: semantic color behavior by variant and state.
7. Token contract: sizing, spacing, radius, typography, and relevant exceptions.
8. Asset contract: include only when the component exposes replaceable icons or other assets.

Keep prose short and operational. The page should help a designer inspect behavior and help an AI or engineer call the component correctly.

## Shared page shell

- At the very top, show “组件预览” once, with the theme toggle immediately beside the title. Use a sliding toggle with both sun and moon icons visible: left is Light, right is Dark. Use a native button with role="switch", a stable accessible name, aria-checked, visible keyboard focus, and reduced-motion support; persist the theme choice. Share its markup and styles across both libraries and standalone pages (Agentbox: tooling/preview/Gallery.jsx and shell.css); do not override it with a circular single-icon button.
- In gallery mode, put component tabs on a separate row below the title. Selected tab text and underline use the theme blue token (`--brand`) in light and dark modes.
- Build tabs and panels from one component registry. Keep tabs on one horizontally scrollable row as the component list grows; do not squeeze labels or allow whole-page overflow. Support arrow keys, Home/End, selected-tab visibility, and tab/panel accessibility relationships.
- Keep panel configuration when switching tabs. Use one shared theme control; remove duplicate global “组件预览” titles and theme buttons, but retain each panel’s bilingual heading.
- Scope preview styles to their component panel so a local correction does not change Button, Dropdown Button, or another established reference.

## Component panel title

Every tab panel starts with one visible `English name 中文名称` heading above its key-prop summary and Configurator. Use a dedicated class such as `.preview-panel-title` so legacy `.demo-title` hiding rules do not remove it. Keep the font-size hierarchy strict: shared page title > panel title > section title. Agentbox uses `--font-title-lg` (30px), `--font-title-md` (24px), and `--font-title-sm` (20px), respectively. Preserve this order in responsive layouts. Panel titles must use the same `--font-weight-bold` as Configurator section headings, while retaining their larger font size. Declare font-weight after the font shorthand and ensure later shell styles cannot reset it; prefer a shared selector with sufficient specificity over per-component overrides. Check the target panel on a standalone edit; when changing the shared shell or aggregating, check affected registry tabs for missing or duplicate panel headings.

## Component summary wording

Use `English name 中文名称 · key prop choices · relevant capabilities · state summary`. Show the actual choices, not only “4 variants × 2 sizes”. Keep technical integration modes such as Controlled / Uncontrolled in the API documentation rather than the design summary. Do not introduce a separate `+ Disabled` suffix: include Disabled in a verified state total.

Approved Agentbox summary examples (verify against the implementation before reusing after API changes):

- Button 按钮 · Filled / Tonal / Outlined / Text · Large / Small · Round / Square · 5 states
- Dropdown Button 下拉按钮 · Filled / Tonal / Outlined / Text · Large / Small / XS · Round / Square · 可配置前后图标及下拉图标 · 5 states
- Segmented Button 分段按钮 · Text / Icon · 2–5 segments · 24px / 8px radius · 5 states
- Input Box 输入框 · Outlined / Filled · Text / Password · 可配置宽度 · 6 states
- SearchBar 搜索框 · Large / Small · Filled / Unfilled · 可配置清空按钮及位置 · 输入状态预览

State counts must reflect real behavior, not the number of columns in a generic matrix. SearchBar has size-dependent interaction appearances and separate input stages; use “输入状态预览” rather than an ambiguous total. Do not imply that derived appearances (such as SearchBar fill tied to size) are independent props. Unsupported combinations belong in the Configurator constraints and detailed documentation.

## Configurator

Order controls by the public API: Size, Shape, Variant, State, then optional content or assets. Preserve a different explicit order from the user.

- Enum prop: labeled select.
- Boolean prop: title above a toggle and its current value. Do not wrap a standalone toggle in a tinted card or bordered panel.
- Boolean-gated enum: place the toggle and dependent selector in one configuration item. Hide the selector while the toggle is off.
- Conditionally supported prop: hide the entire control until the selected combination supports it.
- Text prop: input only when editable copy is part of the component contract.

Do not add button type, click counters, debug values, or controls that do not change a supported prop.

The live preview updates immediately and uses representative placeholder copy that communicates the variant's purpose. Visual type controls use the public `variant` API; a separate emphasis axis may use `emphasis`. Keep bilingual field labels exactly aligned with README prop spelling and casing.

Leading and trailing icon controls follow the same flat layout as Button: label above the toggle/current value, with the selector below only when enabled. No nested tinted card or bordered panel around these optional controls.

### Configurator controls and CSS scope (Agentbox)

Use the existing Button / Dropdown Button controls as the visual reference. In Agentbox, enum selectors have a label above a full-width, 40px-high select: `--font-body-md`, `--radius-container`, `1px solid --color-comp-border`, `--surface-container-lowest` background, and `--on-surface` text. Padding is `0 40px 0 12px` to reserve the trailing arrow. Keep the native select for keyboard and option behavior, but remove its platform-dependent arrow with `appearance: none` and `-webkit-appearance: none`.

Reuse the wrapper and CSS together; do not copy only the class names:

```jsx
<label className="button-control">
  <span>Variant</span>
  <span className="button-select-wrap">
    <select value={variant} onChange={event => setVariant(event.target.value)}>
      {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </span>
</label>
```

The wrapper draws one 8 × 8px chevron with 1.5px strokes in `--color-icon-primary`, 15px from the right, vertically centered; `pointer-events: none` lets clicks reach the select. Reuse the reference hover (`--surface-container-low` and `--color-comp-border-hover`), focus (`--focus-ring` and shared outline tokens), and disabled (`opacity: 0.5`, not-allowed cursor) rules. Keep arrows and text legible in both themes; long options must not expand the control grid.

For a boolean, use the reference flat toggle and current-value label, not a two-option select. Dependent enum controls belong below that toggle and disappear when it is off. Every displayed control must update a supported prop; omit inert placeholders such as a Disabled selector that only says “see state matrix”.

Before reusing styles, inspect `@scope`, selector ancestry, stylesheet loading and cascade order. Rules inside `@scope (.preview-button)` do **not** apply to another panel even if it uses `button-control`. In the dual-library project, import shared documentation CSS from `tooling/preview/` into the target preview stylesheet so the builder scopes it with that panel. In other projects, use an appropriate shared scope. Avoid copying the full reference stylesheet into each component. Keep actual component styles separate and preserve unrelated tabs. Do not assume the external `demo.css` is loaded by a standalone generated HTML.

Update preview source and generated HTML together. In verification, distinguish JSX compilation from styling: inspect the generated stylesheet scope and, when browser access is available, compare actual controls against Button at the same viewport and theme (height, font, padding, border, radius, arrow, hover/focus/disabled). Exercise each control and conditional selector. If browser access is blocked, report that visual verification is incomplete; a successful component-tree render does not establish visual consistency.

### Preview centering and safe padding

Center the actual specimen group, not only a larger wrapper. Keep its label, field, and helper/error text aligned together. For a width-configurable Input Box, size the wrapper to the selected width and cap both wrapper and component at `max-width: 100%`.

Use `min-width: 0` and `box-sizing: border-box` on the live-preview container. Reserve 32px padding on all sides (24px on narrow screens). Allow required markers, focus rings, and shadows room to render; do not use `overflow: hidden` to mask a sizing problem. The specimen should shrink to the available width when appropriate; if a true fixed-size specimen cannot shrink, use an intentional inner scroller with safe padding. Check the widest option, fluid width, required markers, and helper/error text.

## Gallery and state matrix

Group examples by size, then variant. Use semantic variant labels such as Primary, Secondary, Tertiary, and Text in user-facing documentation even when implementation classes are `filled`, `tonal`, `outlined`, and `text`.

The interactive gallery demonstrates real hover, focus, pressed, and disabled behavior. The state matrix may use forced states for visual comparison, but its cells must not respond to pointer input and override the forced state.

## Color spec

The hierarchy is **Variant → State → visual property**.

Use these columns:

| Variant | State | Background | Outline | Text |
| --- | --- | --- | --- | --- |

- Group supported state rows under one Variant cell. The common set is Default, Hover, Focus, Pressed, Disabled; derive exceptions from the actual component rather than inventing states.
- Name variants Primary, Secondary, Tertiary, and Text unless the component defines other semantic variants.
- Default lists each property's token, visible color swatch, and useful resolved light/dark value.
- Prefer the actual semantic token from `light.css` / `dark.css` as the main label and swatch source. Show referenced `base.css` tokens beside it in smaller, muted text; distinguish Light and Dark mappings where they differ. Verify mappings from source files. If no equivalent semantic token exists, retain the actual base token and label its source.
- For neutral surface hover/pressed backgrounds, use `--color-interactive-hover` / `--color-interactive-pressed` rather than a fixed base container token; preserve explicitly specified variant exceptions such as filled-button overlays or transparent text buttons.
- Later states list a token and swatch only for a property that changes from Default.
- Write `同 Default` when a property does not change. Do not repeat its token, value, or swatch.
- Put the focus ring in Outline when it changes.
- If Disabled keeps Default colors and changes only opacity, put the opacity note beside the Disabled state and write `同 Default` in the three property cells.
- Use a checkerboard swatch for transparent and a crossed swatch for no outline.
- Use a shaded row-spanning Variant cell and stronger group boundaries, matching the established Button / Dropdown Button Color spec.

Do not organize states as unrelated property columns such as `hover`, `pressed`, and `disabled`; this obscures the component hierarchy.

## Table typography and backgrounds

Check every table: State matrix, Input states, Color spec, Token contract, and API contract. Reuse the existing Button / Dropdown Button styling as the reference without editing those components to make a new table match.

- Column headers: `--font-caption-lg`, bold, secondary text, `--surface-container-low` background.
- Body cells: `--font-body-md`, with consistent 12px / 16px cell padding and divider lines.
- Ordinary body row labels (Size, prop names, etc.): `--font-body-md`, medium weight, primary text, and no gray fill. A semantic `<th>` in `<tbody>` must not accidentally inherit the column-header font or background.
- **Color spec Variant group cells are the exception:** `--font-body-lg`, bold, primary text, `--surface-container-low` background, top-aligned. This is the approved shaded grouping column shown in Button, not a regular body label.
- Scope selectors explicitly to `thead` / `tbody`, or provide equally precise overrides. Match both font size and weight; do not rely on browser `<th>` defaults.
- Retain grouped borders, row spans, and horizontal scroll wrappers. Verify light and dark themes using tokens rather than hardcoded gray.

### Table visual specifications

Use these shared values for new preview tables, scoped to the relevant panel:

| Element | Typography | Color / background | Layout |
| --- | --- | --- | --- |
| Column header | `--font-caption-lg`, `--font-weight-bold` | `--text-secondary` / `--surface-container-low` | Left aligned; 12px vertical, 16px horizontal padding |
| Body cell | `--font-body-md`, regular | `--text-secondary` / table surface | Same cell padding; 1px `--divider` row border |
| Ordinary body row heading | `--font-body-md`, `--font-weight-medium` | `--on-surface` / transparent | Same padding; do not inherit header background |
| Color spec Variant | `--font-body-lg`, `--font-weight-bold` | `--on-surface` / `--surface-container-low` | Row-spanning; top aligned |
| Color spec State | `--font-body-md`, `--font-weight-medium` | `--on-surface` / table surface | Top aligned |
| Secondary token description / state note | `--font-caption-md`, regular | `--text-placeholder` | 4px above; descriptions use 1.5 line height |
| Unchanged property (`同 Default`) | `--font-body-md`, regular | `--text-placeholder` | No duplicate swatch or token |

The table surface is `--surface-container-lowest`. Put `--radius-xl` and `--shadow-card` on the horizontal-scroll wrapper; do not double the shadow or rounded corners on the inner table. The inner table is 100% wide with collapsed borders and no extra top margin inside the wrapper. When a section title directly precedes a table wrapper or gallery, leave 24px between them. Use a uniform 1px `--divider` horizontal border across body row headings and data cells, including Color spec group boundaries. A row-spanning Variant cell only has a divider at its group boundary.

Reference minimum widths: general spec table 900px, roomy token table 920px, Color spec 1180px. Adjust to actual content rather than forcing these widths on small two-column tables. Specimen matrices need enough room for each rendered component. Keep overflow within the wrapper and preserve readable cells. For Color spec, allow at least 112px for Variant and 130px for other columns; token strings wrap with `overflow-wrap: anywhere`.

Color swatches are fixed 18 × 18px with 4px corners and a 1px `--color-comp-border` border; leave 8px between swatch and token. Use a checkerboard for transparent and a diagonal slash for no outline. Swatch values follow the actual CSS token in both themes.

Apply body-header rules explicitly (for example `.btn-table tbody th`), then override the Color spec grouping cell (for example `.btn-table tbody .btn-color-variant`). A broad `.btn-table th` rule alone makes Size/API body headings look like column headers. Keep these rules scoped; do not change reference components while matching their tables.

## Token contract

Use separate tables when the component has independent axes. Typical columns are:

- Size: height, font size, icon size, padding, gap, radius behavior.
- Shape: public value, class, radius token, resolved value, aliases, supported combinations.
- Replaceable asset: prop value, source file, default or supported use.

Document exceptions next to the affected table instead of hiding them in prose elsewhere.

## Responsive layout

- Let the page use available width while keeping a comfortable maximum width.
- Use equal flexible columns for parallel specimen cards; they should expand when the viewport widens.
- Allow the Configurator to collapse from split view to one column.
- Preserve minimum control widths and reduce the control grid from three columns to two and then one as needed.
- Wrap every wide table in an `overflow-x: auto` container. Give the table a content-appropriate `min-width` so narrow pages show a horizontal scrollbar instead of crushing cells.
- Keep swatches fixed-size and prevent tokens from forcing the entire page wider than the viewport.

## Completion checks

- Visual/interactive props are configurable; integration props are documented, with unsupported combinations prevented or hidden.
- Toggles and dependent selectors update the preview correctly.
- Gallery and matrix match the actual component CSS.
- Color Spec describes real state behavior and uses `同 Default` correctly.
- Shared assets resolve from their canonical location.
- Light and dark themes remain readable.
- Wide layouts fill available space; narrow layouts do not overflow except inside intentional table scrollers.
- Bilingual summaries list key visual choices and use verified state totals or a descriptive state summary.
- Header title and adjacent theme toggle remain consistent; gallery mode additionally checks separate blue-selected tabs and panel state persistence.
- Live previews are centered with safe padding, including wide widths and outlying markers/rings.
- Ordinary body labels and shaded Color spec Variant groups match the reference typography.
- Standalone HTML has been rebuilt; report whether actual browser rendering was successfully verified.

### Interactive gallery naming and dimensions

In Agentbox specimen cards, use a left-aligned `h3` title with `--font-subtitle-sm` (14px / 1.5), `--font-weight-bold`, and `--on-surface`, with 24px bottom spacing. Prefer readable bilingual labels such as “Skill · 技能” or “Square · 方形” when a Chinese name is available. Card titles identify the specimen group; do not style them as muted body text. Keep 24px card padding so titles and specimens do not touch the card edges; place centered specimens in a separate content container rather than centering the title.

Use “Interactive gallery” consistently across component panels, keeping each panel’s bilingual component heading intact. Specimen cards use `--surface-container-lowest` (white in the light theme), no border, `--shadow-card`, and `--radius-xl`. Group examples by content type, then shape and optional icons. Segmented Button uses Text (Round / Square × with / without prefix icon) and Icon. Do not mix disabled specimens into this gallery. Use real component interaction and reserve forced states for State matrix.

Configurable width is a consumer-controlled layout prop, documented under API and exposed in Configurator where supported. Omit fixed width columns from Token contract; preserve actual intrinsic dimensions such as icon size and fixed child-button width.
