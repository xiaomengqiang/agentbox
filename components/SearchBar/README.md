# SearchBar

搜索框，两种规格：

- `large`（默认）：填充式，上下 9px / 左右 12px、文字行高 22px → 高 40px，圆角 24px，字号 16px。底色 `comp_background_tertiary`（Light #000000 5%）。
- `small`：无填充（背景透明），固定高 36px，上下 9px / 左右 12px，字号 12px（行高 16px），圆角 6px；占位文字 `font_tertiary`（Light #000000 40%），输入的文字仍为 `font_primary`；**无 hover / press / focus 状态，也没有关闭图标**。

内容为 magnifying glass 图标 + 占位文字「请输入搜索内容」，图标与文字颜色为 `font_secondary`（Light #000000 60%）。

- 搜索图标：内联 SVG（`icons.jsx` 的 `SearchIcon`，设计稿给的 16×16 实心路径），两种尺寸都用 16px，颜色用 `currentColor` 继承 `font_secondary`。
- 关闭图标（Small cancel）：内联 SVG（`icons.jsx` 的 `CloseIcon`，设计稿给的 16×16 实心路径），16×16，颜色同搜索图标。

## Features

- 尺寸：`large` 16px / `small` 12px（小号无填充、圆角 6px）
- 大号状态：默认 → hover（+`interactive_hover` 5%）→ press（+`interactive_pressed` 10%）→ focus（内部 2px `interactive_focus` #0A59F7）；小号无这三种状态
- 激活：空内容聚焦时显示自绘光标 1.5×24px，紧贴文字（右缘与文字左缘相接），占位文字保留。大号光标 `font_emphasize`（Light #0A59F7），小号光标 `container90`（Light #000000 90%）
- 输入中：文字颜色 `font_primary`（Light #000000 90%），自绘光标（1.5×24）跟随插入点，即位于文字之后；大号出现关闭图标（Small cancel，16×16，颜色同搜索图标），点击清空（受控场景会同时触发 `onChange("")`，非受控场景内部清空）
- 输入完成：保留文字（大号同时保留关闭图标），无光标
- 受控（`value`）与非受控（`defaultValue`）两用；回车触发 `onSearch`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"large" \| "small"` | `"large"` | 尺寸规格；large 填充 16px 圆角 24px，small 无填充 12px（行高 16px）圆角 6px |
| `placeholder` | `string` | `"请输入搜索内容"` | 占位文字（可随场景替换） |
| `value` | `string` | — | 受控值 |
| `defaultValue` | `string` | `""` | 非受控初始值 |
| `onChange` | `(value: string) => void` | — | 输入变化回调，直接返回字符串 |
| `onSearch` | `(value: string) => void` | — | 回车确认回调 |
| `clearable` | `boolean` | 大号 `true` / 小号 `false` | 有文字时是否显示关闭图标（小号默认不显示） |
| `clearPosition` | `"right" \| "left"` | `"right"` | 关闭图标位置；`left` 为最左侧 |
| `onClear` | `() => void` | — | 点击关闭图标回调 |
| `disabled` | `boolean` | `false` | 禁用 |
| `className` | `string` | — | 追加类名 |
| `style` | `object` | — | 内联样式；**宽度由父容器决定**（组件自身 `width: 100%`），也可在这里写 `width` |

> 宽度不是独立 prop：`.sb-root` 为 `width: 100%`，实际宽度取父容器列宽，或通过 `style={{ width: 320 }}` 指定。

## 受控 / 非受控

| 写法 | Prop | 含义 |
|------|------|------|
| 受控 | `value` + `onChange` | 值由外部 state 持有，组件只负责显示与回调；输入、清空都会通过 `onChange`（直接给字符串）通知外部更新 |
| 非受控 | `defaultValue`（可选）+ `onChange` | 不给 `value`，组件内部持有状态，`defaultValue` 只作为**首次渲染的初始值**，之后由组件自己维护 |

- 判定规则：`props.value != null` 即视为受控；两者不要同时传。
- 受控场景点关闭图标会先回调 `onChange("")`，外部把 `value` 置空即可（内部不自行改值）。
- 只用来看静态展示，两个都不传也行。

```jsx
// 非受控：初始值「手机」，之后组件自己管
<SearchBar defaultValue="手机" onChange={(v) => console.log(v)} />

// 受控：完全由外部 state 驱动
const [kw, setKw] = useState("手机");
<SearchBar value={kw} onChange={setKw} />
```

## Usage

```jsx
import SearchBar from "./SearchBar/index.jsx";

// 大号（默认，填充）
<SearchBar />

// 小号（无填充）
<SearchBar size="small" placeholder="搜索" />

// 占位文案 / 宽度都是变量：宽度由父容器决定，或用 style 指定
<SearchBar placeholder="搜索联系人" style={{ width: 320 }} />
<SearchBar size="small" placeholder="搜索" style={{ width: 160 }} />

// 受控 + 回车搜索 + 关闭图标在左
const [kw, setKw] = useState("");
<SearchBar value={kw} onChange={setKw} onSearch={(v) => console.log(v)} clearPosition="left" />
```

## Notes

- 原生 `caret` 宽度不可控、且高度随字号变化（大号 16px / 小号 12px 会不一致），故**两种尺寸、所有状态统一用自绘光标** 1.5×24px（原生光标置为 transparent）。
- 光标按设计 SVG 还原：`1.5×24px` **圆角矩形**，圆角 `rx=0.75`（两端半圆，即半径受半宽限制后的 0.75px），纯 `fill`、无描边；两种尺寸同一形状，只换颜色（大号 `font_emphasize`、小号 `container90`）。
- **不要用 CSS 背景 + `border-radius` 画光标**：`width:1.5px` 会被像素对齐撑成 2px 的直角块，圆角同时被吃掉。
- **SVG 根元素必须取整数尺寸（`width="24" height="24" viewBox="0 0 24 24"`），把 1.5px 的几何放在内部**：根元素尺寸为小数（如 `width="1.5"`）时，Chromium 会把 SVG 视口吸附到整像素，细条的圆角同样会被吃掉、渲染成直角条（已在 DPR1 逐像素验证：根元素整数尺寸时首行覆盖为中间行的约 78%，圆头保留）。
- 光标位置由隐藏量尺（`.sb-measure`，同字体）测量插入点之前的文字宽度得到，跟随 `selectionStart`；右缘对齐到设备像素网格（否则 1.5px 会被抗锯齿摊成「1px 实心 + 半透明虚边」，看起来比 1.5px 细）；超出输入区时贴右边界。
- 聚焦时占位文字保持可见，光标显示在占位文字之前。
