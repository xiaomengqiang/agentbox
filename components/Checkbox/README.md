# Checkbox

勾选组件，容器 24×24、方框实际边长 20px，支持方形（4px 圆角）与圆形两种形状，覆盖选中 / 未选中、可用 / 禁用组合形态。

## Features

- 容器 24×24（命中区域），实际方框 20×20（1px 描边含在内）
- 方形 4px 圆角、圆形整圆
- 选中底色 `Light/comp_background_emphasize`（#0A59F7 100%），勾为白色 `comp_background_primary_contrary`
- 勾自带**内部** 1px 描边（#000000 5%）与投影阴影效果
- 未选中：描边 `icon-tertiary`，填充 `fg_color_unchecked`
- 禁用态直接复用可用态并整体降到 40% 不透明度
- 支持受控（`checked` + `onChange`）与非受控（`defaultChecked`）两种用法
- 键盘可达：`Space` / `Enter` 切换，`:focus-visible` 显示品牌色聚焦环

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | — | 受控选中态；传入即进入受控模式 |
| `defaultChecked` | `boolean` | `false` | 非受控模式的初始选中态 |
| `onChange` | `(checked: boolean) => void` | — | 切换回调，参数为下一次的选中态 |
| `shape` | `"square" \| "circle"` | `"square"` | 形状 |
| `disabled` | `boolean` | `false` | 禁用态，整体 40% 不透明度 |
| `label` | `string` | — | 右侧文字标签，缺省为纯控件 |

## Usage

```jsx
import Checkbox from "./components/Checkbox/index.jsx";

// 非受控
<Checkbox defaultChecked label="自动同步" />
<Checkbox shape="circle" label="圆形 · 未选中" />

// 禁用
<Checkbox checked disabled label="不可修改" />

// 受控
const [agree, setAgree] = useState(false);
<Checkbox checked={agree} onChange={setAgree} label="我已阅读并同意服务协议" />
```

## Notes

- 结构：`.cbx-control`（24×24 容器，居中）→ `.cbx-box`（20×20 方框，1px 描边含在内）→ 勾。
- 勾的内部描边由两层同形勾叠放实现：底层勾全宽（屏上 4px），白色勾居中覆盖（屏上 2px），外露的 1px 即为描边——描边位于勾的内侧，宽度恒为 1px。勾图标 15px，白色勾线宽 2×UNIT、底层 4×UNIT（UNIT = 24/15）。
- 勾阴影 `drop-shadow(0 1.4px 1.3px var(--container-10))`，只作用于勾，不影响方框。
- 勾整体 `translateY(0.5px)`：Lucide `check` 的墨迹在 24 viewBox 内中心为 y=11.5（15px 下偏上 0.31px），设计稿勾中心却在方框中心下 0.21px，合计补偿 0.5px（2x 屏上即 1 设备像素）。方形与圆形共用该偏移。
- 颜色全部走主题 token（`--color-comp-background-emphasize` / `--color-icon-tertiary` / `--color-fg-unchecked`），深浅色模式自动翻转。
