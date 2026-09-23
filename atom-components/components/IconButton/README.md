# IconButton

## Overview

#### 作用

`IconButton` 是纯图标按钮，用于在 32px 点击区域内执行单一操作，支持普通工具操作和对话框操作。

#### 视觉样式

- `variant="normal"`：用于工具栏、侧栏和内容区的轻量操作，如搜索、编辑或关闭。通过 `size` 区分图标尺寸和默认颜色。
- `variant="dialog" emphasis="primary"`：用于对话框中的主操作，如发送消息；实心背景突出操作优先级。
- `variant="dialog" emphasis="secondary"`：用于对话框中的辅助操作，如添加附件；默认透明，悬浮和按下时显示交互背景。

同一操作区域通常保留一个 Primary 主操作，其余操作使用低强调样式。`emphasis` 仅用于对话框款，不改变图标本身的动作语义。

#### 尺寸与形状

- 所有规格默认外框均为 32 × 32px，图标水平、垂直居中。
- 普通 Large：20px 图标，默认使用 `--color-icon-primary`。
- 普通 Small：16px 图标，默认使用 `--color-icon-secondary`。
- 普通款圆角默认 6px，可通过 `radius` 自定义；改变 `size` 不改变外框尺寸。
- 对话框款固定为正圆，内部图标 16px；`size` 和 `radius` 不影响其标准外观。

#### 图标

- 普通款使用 `assets/uploads/icon/function/`，默认 `search`；支持 `add`、`edit`、`close` 等资源名，完整映射由模块的 `FUNCTION_ICONS` 导出。
- 对话框款使用 `assets/uploads/icon/send button/`，支持 `airplane`、`add`、`pause`、`resume`，映射由 `DIALOG_ICONS` 导出。Primary 默认 `airplane`，Secondary 默认 `add`；`airplane` 对应实际文件 `ariplane.svg`。
- `src` 可覆盖内置资源。图标通过 CSS mask 渲染，使用资源的透明轮廓，颜色由组件控制，不保留 SVG 原始配色。
- 图标名称仅在当前 `variant` 的资源映射内查找；未提供或未知的名称回退到该样式的默认图标。

#### 使用原则

- 为每个按钮设置描述实际动作的 `ariaLabel`，例如“发送消息”或“添加附件”。
- 业务交互不传 `state`，让按钮响应真实悬浮和按下操作；不可操作时使用 `disabled`。
- `state` 用于静态状态展示，不表示业务选中态。显式传入后，外观不再随鼠标悬浮或按下变化；除 `disabled` 外，强制状态本身不会阻止点击。
- 组件提供 Default、Hover、Pressed、Disabled 四种视觉状态，没有独立 Focus 外观或焦点环；启用的按钮仍保留原生键盘交互。

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"normal" \| "dialog"` | `"normal"` | 普通工具操作或对话框操作。 |
| `size` | `"large" \| "small"` | `"large"` | 普通款图标为 20px / 16px；外框均为 32px。对话框款始终使用 16px 图标。 |
| `emphasis` | `"primary" \| "secondary"` | `"primary"` | 对话框操作的强调层级；普通款忽略此项。 |
| `radius` | `number \| string` | `6` | 普通款圆角，数值单位为 px，也接受 CSS 长度；对话框款固定为 `50%`。 |
| `icon` | `string` | 按样式确定 | 普通款为 `search`；对话框 Primary 为 `airplane`、Secondary 为 `add`。支持名称见上方图标说明。 |
| `src` | `string` | — | 自定义 SVG URL 或 data URL；非空时优先于 `icon`。 |
| `disabled` | `boolean` | `false` | 禁用按钮并显示禁用外观，优先于其他 `state` 值。 |
| `state` | `"default" \| "hover" \| "pressed" \| "disabled"` | — | 强制视觉状态；不传时使用真实交互。`"disabled"` 同时禁用按钮。 |
| `ariaLabel` | `string` | `"图标操作"` | 设置按钮的 `aria-label`，业务使用时应提供具体动作名称。 |
| `onClick` | `(event) => void` | — | 原生按钮点击回调；禁用时不触发。 |
| `className` | `string` | `""` | 追加到按钮根元素的类名。 |
| `style` | `React.CSSProperties` | — | 按钮根元素的行内样式；`borderRadius` 最终由 `variant` / `radius` 决定。 |

其余原生按钮属性透传到根元素，例如 `title`、`id`、`aria-describedby` 和 `data-*`。组件固定 `type="button"`，并自行设置 `className`、`style`、`data-state`、`disabled`、`aria-label` 和 `onClick`；这些受控字段应使用上表对应 prop。

## Color Spec

| 样式 | Default 背景 | 图标 | Hover 背景 | Pressed 背景 |
| --- | --- | --- | --- | --- |
| 普通 Large | 透明 | `--color-icon-primary` | `--color-interactive-hover` | `--color-interactive-pressed` |
| 普通 Small | 透明 | `--color-icon-secondary` | `--color-interactive-hover` | `--color-interactive-pressed` |
| 对话框 Primary | `--color-icon-primary` | `--color-font-on-primary`；深色主题覆盖为 `--black` | 默认背景叠加 `--on-primary-10` | 默认背景叠加 `--on-primary-15` |
| 对话框 Secondary | 透明 | `--color-icon-primary` | `--color-interactive-hover` | `--color-interactive-pressed` |

所有样式均无描边，Hover / Pressed 不改变图标颜色。Disabled 保留 Default 配色，整体 `opacity: 0.5`。

语义 token 优先引用 `light.css` / `dark.css`；其关联的 `base.css` token 如下：

| 语义 token | 浅色引用 | 深色引用 |
| --- | --- | --- |
| `--color-interactive-hover` | `--container-05` | `--container-10` |
| `--color-interactive-pressed` | `--container-10` | `--container-15` |
| `--color-icon-primary` | `--primary-90` | `--primary-90`（随主题翻转） |
| `--color-icon-secondary` | `--primary-60` | `--primary-60`（随主题翻转） |
| `--color-font-on-primary` | `--on-primary` | 本组件直接覆盖为 `--black` |

Primary 的 `--on-primary-10` / `--on-primary-15` 为 base 层叠加色：浅色主题使用白色叠层，深色主题使用黑色叠层。

## Usage

以下示例放在项目根目录，回调由业务调用方传入：

```jsx
import React from 'react';
import IconButton from './atom-components/components/IconButton/index.jsx';

export default function Actions({ onSearch, onEdit, onSend, onAdd, canSend = true }) {
  return (
    <div>
      <IconButton icon="search" ariaLabel="搜索" onClick={onSearch} />
      <IconButton size="small" icon="edit" radius={8} ariaLabel="编辑" onClick={onEdit} />
      <IconButton
        variant="dialog"
        emphasis="primary"
        ariaLabel="发送消息"
        disabled={!canSend}
        onClick={onSend}
      />
      <IconButton
        variant="dialog"
        emphasis="secondary"
        ariaLabel="添加附件"
        onClick={onAdd}
      />
    </div>
  );
}
```

自定义图标仍使用当前样式的尺寸和颜色：

```jsx
<IconButton src="./assets/uploads/custom-action.svg" ariaLabel="自定义操作" onClick={onAction} />
```

将示例 `src` 替换为实际资源 URL，并由调用方提供 `onAction`。组件样式依赖项目共享主题 token，使用页面需加载现有主题样式。
