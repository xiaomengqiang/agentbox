# IconState

图标状态组件：一个可点击的图标按钮，内置 默认 / 悬浮 / 激活 / 禁用 四种状态。外围 32px、图标 20px，默认图标为 90% 黑色的搜索图标，并内置 `search` / `menu` 两种图标变量可切换。

## Features

- 四种状态：默认（无背景）、悬浮（5% 黑色背景）、激活（深灰背景）、禁用（整体 50% 透明度）
- 6px 圆角正方形按钮，外围 32px、图标 20px（小号 24px / 16px）
- 外围尺寸 `size` 与图标尺寸 `iconSize` 独立配置
- 内置 `icon` 变量：`search`（搜索）/ `menu`（菜单），也可用 `src` 传入自定义图标
- 图标为 90% 黑色，可通过替换 SVG 资源修改颜色
- 悬浮背景色可在 CSS 中一行替换

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `32` | 外围点击区域尺寸（px） |
| `iconSize` | `number` | `20` | 图标渲染尺寸（px） |
| `icon` | `"search" \| "menu"` | `"search"` | 图标变量，切换内置图标 |
| `src` | `string` | — | 自定义图标 SVG 资源路径（优先于 `icon`） |
| `disabled` | `boolean` | `false` | 禁用状态 |
| `active` | `boolean` | `false` | 激活（选中/按下）状态 |
| `state` | `"default" \| "hover" \| "active" \| "disabled"` | — | 强制视觉状态（用于文档/演示），缺省时由交互自动决定 |
| `onClick` | `function` | — | 点击回调 |
| `ariaLabel` | `string` | `"icon"` | 无障碍标签 |

## Usage

```jsx
import IconState from "./IconState/index.jsx";

<IconState />
<IconState icon="menu" />
<IconState state="hover" />
<IconState state="active" />
<IconState state="disabled" />
```

## 自定义

### 图标变量的切换

通过 `icon` prop 在内置图标之间切换：

```jsx
<IconState icon="search" /> {/* 搜索图标（默认） */}
<IconState icon="menu" />   {/* 菜单图标 */}
```

内置图标定义在 `index.jsx` 顶部的 `ICON_SRC` 映射中：

```js
const ICON_SRC = {
  search: "./assets/uploads/icon-search.svg",
  menu: "./assets/uploads/icon-menu.svg",
};
```

**新增图标变量**：把新 SVG 放入 `assets/uploads/`，再在 `ICON_SRC` 中追加一行 `别名: "./assets/uploads/新图标.svg"`，即可用 `<IconState icon="别名" />` 使用。

### 图标 SVG 的替换

两种替换方式：

- **替换资源文件**：用你自己的 SVG 覆盖 `assets/uploads/icon-search.svg`（或对应图标的文件，保持 20×20 的 viewBox 最省心）。
- **传入 `src` prop**：`<IconState src="./assets/uploads/your-icon.svg" />`，直接指定自定义图标路径（优先级最高，可覆盖 `icon`）。

### 颜色的替换

图标颜色由 SVG 内部的 `fill` 属性决定，默认值为 `fill="black" fill-opacity="0.898039"`（即 90% 黑色）。打开 SVG 文件修改该 `<path>`：

```svg
<path d="..." fill="#0A59F7" fill-opacity="1" />
```

- `fill` 换成目标色值（如 `#0A59F7`）
- `fill-opacity` 换成目标不透明度（`1` 为完全不透明）

### 悬浮状态的背景色替换

悬浮背景色在 `index.css` 中定义，默认使用 `--container-05`（5% 透明度的黑色，即 `rgba(0,0,0,0.05)`）。修改 `.is-btn:hover` 即可：

```css
.is-btn:hover {
  background-color: var(--surface-container-high); /* 深灰 */
  /* 或品牌淡色：var(--primary-container) */
}
```

常用背景 token：`--container-05`（5% 黑色，默认）、`--surface-container-high`（深灰）、`--primary-container`（品牌淡色）。
