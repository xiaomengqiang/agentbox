import ColorSpecTable from "../../../tooling/preview/color-spec.jsx";
import React from "react";
import Button from "../../components/Button/index.jsx";


// 规范 API 取值与状态定义
// container/border/label = 背景色 / 描边色 / 文字色；hover/pressed 为叠加层或文字色；disabled 为禁用态
const VARIANTS = [
  {
    value: "primary",
    title: "Primary button",
    displayName: "Primary",
    sample: "主要操作",
    desc: "高强调 · 主色实心",
    container: "--color-icon-primary",
    containerValue: "明 rgba(0,0,0,.9) ／ 暗 rgba(255,255,255,.9)",
    border: "—",
    label: "--color-background-primary",
    labelValue: "明 纯白 #FFFFFF ／ 暗 黑色 #000000",
    hover: "叠 --on-primary-10",
    hoverValue: "叠加于 Default 背景；色块展示叠层本色",
    pressed: "叠 --on-primary-15",
    pressedValue: "叠加于 Default 背景；色块展示叠层本色",
    disabled: "沿用静止态 + 50% 透明度",
    disabledValue: "实心底与白字都不变，opacity: 0.5",
  },
  {
    value: "secondary",
    title: "Secondary button",
    displayName: "Secondary",
    sample: "次要操作",
    desc: "中强调 · 主色淡底",
    container: "--color-comp-background-tertiary",
    containerValue: "明黑 5% ／ 暗白 10%",
    border: "—",
    label: "--color-icon-primary",
    labelValue: "明 rgba(0,0,0,.9) ／ 暗 rgba(255,255,255,.9)",
    hover: "叠 --color-interactive-hover",
    hoverValue: "叠加于 Default 背景；色块展示叠层本色",
    pressed: "叠 --color-interactive-pressed",
    pressedValue: "叠加于 Default 背景；色块展示叠层本色",
    disabled: "沿用静止态 + 50% 透明度",
    disabledValue: "opacity: 0.5",
  },
  {
    value: "tertiary",
    title: "Tertiary button",
    displayName: "Tertiary",
    sample: "描边操作",
    desc: "中强调 · 中性描边",
    container: "透明",
    containerValue: "transparent",
    border: "--color-comp-border",
    borderValue: "container-15：明 rgba(0,0,0,.15) ／ 暗 rgba(255,255,255,.15)",
    label: "--color-icon-primary",
    labelValue: "明 rgba(0,0,0,.9) ／ 暗 rgba(255,255,255,.9)",
    hover: "叠 --color-interactive-hover",
    hoverValue: "叠加于 Default 背景；色块展示叠层本色",
    pressed: "叠 --color-interactive-pressed",
    pressedValue: "叠加于 Default 背景；色块展示叠层本色",
    disabled: "沿用静止态 + 50% 透明度",
    disabledValue: "描边不变，opacity: 0.5",
  },
  {
    value: "text",
    title: "Text button",
    displayName: "Text",
    sample: "取消",
    desc: "低强调 · 无背景",
    container: "透明",
    containerValue: "任何状态都不出现背景色",
    border: "—",
    label: "--color-font-emphasize",
    labelValue: "brand 主题蓝：明 #0A59F7 ／ 暗 #5291FF",
    hover: "字变 --primary-hover",
    hoverValue: "brand 80%：明 rgba(10,89,247,.8) ／ 暗 rgba(49,122,247,.8)",
    pressed: "字变 --primary-active",
    pressedValue: "brand 实色：明 #0A59F7 ／ 暗 #317AF7；focus 不画描边环",
    disabled: "沿用静止态 + 50% 透明度",
    disabledValue: "opacity: 0.5",
  },
];

// 形状是独立于 variant / size 的第三个轴：形状不并入变体名，否则命名组合爆炸
// scope = 该形状在 design system 中被规范使用的组合（所有形状覆盖全部尺寸和变体）
const SHAPES = [
  {
    value: "round",
    label: "Round",
    radiusToken: "--radius-full",
    radiusValue: "9999px",
    scope: "全变体 × 全尺寸",
    note: "跑道圆 · 默认，历史外观",
  },
  {
    value: "square",
    label: "Square",
    radiusToken: "--radius-lg",
    radiusValue: "8px",
    scope: "全变体 × 全尺寸",
    note: "方圆角 · 可自由组合",
  },
];

const SIZES = [
  {
    value: "large",
    label: "Large",
    spec: "40px 高 · 16px 字号 · Medium · 20px 图标",
  },
  {
    value: "medium",
    label: "Medium",
    spec: "32px 高 · 14px 字号 · Medium · 16px 图标",
  },
];

// 五个状态：前四个由 CSS 伪类驱动，disabled 用属性；均可静态强制呈现
const STATES = [
  { value: "default", label: "Default", hint: "静止" },
  { value: "hover", label: "Hover", hint: ":hover" },
  { value: "focus", label: "Focus", hint: ":focus-visible" },
  { value: "pressed", label: "Pressed", hint: ":active" },
  { value: "disabled", label: "Disabled", hint: ":disabled" },
];

const PREVIEW_ICONS = {
  add: "./assets/uploads/icon/function/add.svg",
  delete: "./assets/uploads/icon/function/delete.svg",
  download: "./assets/uploads/icon/function/download.svg",
  edit: "./assets/uploads/icon/function/edit.svg",
};
const ICON_OPTIONS = Object.keys(PREVIEW_ICONS).map(value => ({ value, label: value }));

const COLOR_VARIANT_NAMES = {
  primary: "Primary",
  secondary: "Secondary",
  tertiary: "Tertiary",
  text: "Text",
};

function colorStateRows(variant) {
  const isText = variant.value === "text";
  const backgroundState = (label, detail) => ({ label, detail });
  const textState = (label, detail) => ({ label, detail });

  return [
    {
      value: "default",
      label: "Default",
      background: backgroundState(variant.container, variant.containerValue),
      outline: { label: variant.border, detail: variant.border === "—" ? "无描边" : variant.borderValue },
      text: textState(variant.label, variant.labelValue),
    },
    {
      value: "hover",
      label: "Hover",
      background: isText ? null : backgroundState(variant.hover, variant.hoverValue),
      outline: null,
      text: isText ? textState(variant.hover, variant.hoverValue) : null,
    },
    {
      value: "focus",
      label: "Focus",
      background: isText ? null : backgroundState(variant.hover, variant.hoverValue),
      outline: isText ? null : { label: "--black", detail: "1px focus ring，offset 2px" },
      text: null,
    },
    {
      value: "pressed",
      label: "Pressed",
      background: isText ? null : backgroundState(variant.pressed, variant.pressedValue),
      outline: null,
      text: isText ? textState(variant.pressed, variant.pressedValue) : null,
    },
    {
      value: "disabled",
      label: "Disabled",
      note: "整体 opacity 50%",
      background: null,
      outline: null,
      text: null,
    },
  ];
}

export default function Demo() {
  const [playgroundVariant, setPlaygroundVariant] = React.useState("primary");
  const [playgroundSize, setPlaygroundSize] = React.useState("large");
  const [playgroundShape, setPlaygroundShape] = React.useState("round");
  const [showIcon, setShowIcon] = React.useState(true);
  const [playgroundIcon, setPlaygroundIcon] = React.useState("add");
  const [playgroundDisabled, setPlaygroundDisabled] = React.useState(false);

  const playgroundLabel = VARIANTS.find((variant) => variant.value === playgroundVariant)?.sample || "按钮操作";


  return (
    <div className="demo-page">
      <header className="demo-header"><h2 className="preview-panel-title">Button 按钮</h2><p className="demo-subtitle">Button 按钮 · Primary / Secondary / Tertiary / Text · Large / Medium · Round / Square · 5 states</p></header>

      <section className="demo-section">
        <div className="demo-section-header">
          <h2 className="demo-section-name">Configurator</h2>
          <span className="demo-section-tag">实时配置</span>
        </div>
        <p className="demo-section-desc">
          各属性独立配置：2 sizes × 2 shapes × 4 variants，图标和禁用状态适用于全部组合。
        </p>

        <div className="button-configurator">
          <div className="button-controls">
            <label className="button-control">
              <span>尺寸 · size</span>
              <span className="button-select-wrap">
                <select value={playgroundSize} onChange={(event) => setPlaygroundSize(event.target.value)}>
                  {SIZES.map((size) => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </select>
              </span>
            </label>

            <label className="button-control">
              <span>形状 · shape</span>
              <span className="button-select-wrap">
                <select value={playgroundShape} onChange={(event) => setPlaygroundShape(event.target.value)}>
                  <option value="round">Round</option>
                  <option value="square">Square</option>
                </select>
              </span>
            </label>

            <label className="button-control">
              <span>样式 · variant</span>
              <span className="button-select-wrap">
                <select value={playgroundVariant} onChange={(event) => setPlaygroundVariant(event.target.value)}>
                  {VARIANTS.map((variant) => (
                    <option key={variant.value} value={variant.value}>{variant.displayName}</option>
                  ))}
                </select>
              </span>
            </label>

            <div className="button-control button-control--toggle">
              <span>禁用 · disabled</span>
              <div className="button-toggle-line">
                <span>{playgroundDisabled ? "Disabled" : "Enabled"}</span>
                <label className="button-switch">
                  <input
                    type="checkbox"
                    checked={playgroundDisabled}
                    onChange={(event) => setPlaygroundDisabled(event.target.checked)}
                    aria-label="Disabled state"
                  />
                  <span className="button-switch-track" />
                </label>
              </div>
            </div>

            <div className="button-control button-control--toggle">
              <span>图标 · icon</span>
              <div className="button-toggle-line">
                <span>{showIcon ? "开启" : "关闭"}</span>
                <label className="button-switch">
                  <input
                    type="checkbox"
                    checked={showIcon}
                    onChange={(event) => setShowIcon(event.target.checked)}
                    aria-label="显示图标"
                  />
                  <span className="button-switch-track" />
                </label>
              </div>

              {showIcon ? (
                <span className="button-select-wrap button-icon-select">
                  <select
                    value={playgroundIcon}
                    onChange={(event) => setPlaygroundIcon(event.target.value)}
                    aria-label="选择图标"
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon.value} value={icon.value}>{icon.label}</option>
                    ))}
                  </select>
                </span>
              ) : null}
            </div>
          </div>

          <div className="button-configurator-preview">
            <span className="btn-lab-slotlabel">LIVE PREVIEW</span>
            <Button
              variant={playgroundVariant}
              size={playgroundSize}
              shape={playgroundShape}
              icon={showIcon ? PREVIEW_ICONS[playgroundIcon] : undefined}
              disabled={playgroundDisabled}
            >
              {playgroundLabel}
            </Button>
          </div>
        </div>
      </section>

      <section className="demo-section">
        <div className="demo-section-header">
          <h2 className="demo-section-name">Interactive gallery</h2>
        </div>
        <p className="demo-section-desc">
          按 size 分组展示全部 variant；每种组合只保留一个标本。其他属性同步使用上方 Configurator 的配置。
        </p>
        <div className="btn-lab">
          {SIZES.map((size) => (
            <div className="btn-lab-block" key={size.value}>
              <div className="btn-lab-head">
                <h3 className="btn-lab-size">{size.label}</h3>
                <span className="btn-lab-spec">{size.spec}</span>
              </div>
              <div className="btn-lab-grid">
                {VARIANTS.map((variant) => (
                  <div className="btn-lab-col" key={variant.value}>
                    <div className="btn-lab-colhead">
                      <h3 className="btn-lab-colname">{variant.displayName}</h3>
                    </div>
                    <div className="btn-lab-slot">
                      <Button
                        size={size.value}
                        variant={variant.value}
                        shape={playgroundShape}
                        icon={showIcon ? PREVIEW_ICONS[playgroundIcon] : undefined}
                        disabled={playgroundDisabled}
                      >
                        {variant.sample}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="demo-section">
        <div className="demo-section-header">
          <h2 className="demo-section-name">Shape</h2>
        </div>
        <p className="demo-section-desc">
          Round 为跑道圆角，Square 为 8px 圆角。两组使用 Configurator 中相同的 size、variant 和图标配置，仅 shape 不同。
        </p>
        <div className="btn-lab-grid btn-lab-grid--two">
          {SHAPES.map((shape) => (
            <div className="btn-lab-col" key={shape.value}>
              <div className="btn-lab-colhead">
                <h3 className="btn-lab-colname">{shape.label}</h3>
              </div>
              <div className="btn-lab-slot">
                <Button
                  size={playgroundSize}
                  variant={playgroundVariant}
                  shape={shape.value}
                  icon={showIcon ? PREVIEW_ICONS[playgroundIcon] : undefined}
                >
                  {VARIANTS.find((variant) => variant.value === playgroundVariant)?.sample}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="demo-section">
        <div className="demo-section-header"><h2 className="demo-section-name">State matrix</h2></div>
        <p className="demo-section-desc">按 size × variant 展示五种状态，形状与图标跟随 Configurator。静态标本不接收交互。</p>
        <div className="btn-matrix">
          {SIZES.map(size => (
            <section className="btn-matrix-group" key={size.value}>
              <div className="btn-matrix-grouphead">
                <h3 className="btn-matrix-groupname">{size.label}</h3>
                <span className="btn-matrix-groupspec">{size.spec}</span>
              </div>
              <div className="btn-matrix-row btn-matrix-row-head"><div />{STATES.map(state => <div className="btn-matrix-cell" key={state.value}><span className="btn-matrix-state">{state.label}</span><span className="btn-matrix-hint">{state.hint}</span></div>)}</div>
              {VARIANTS.map(variant => <div className="btn-matrix-row" key={variant.value}>
                <div className="btn-matrix-label">{variant.displayName}</div>
                {STATES.map(state => <div className="btn-matrix-cell" key={state.value} inert="">
                  <Button size={size.value} shape={playgroundShape} variant={variant.value} icon={showIcon ? PREVIEW_ICONS[playgroundIcon] : undefined} disabled={state.value === "disabled"} className={`button-preview-state-${state.value}`}>{variant.sample}</Button>
                </div>)}
              </div>)}
            </section>
          ))}
        </div>
      </section>

      {/* ── 4. 色彩映射：变体 → 语义色彩规范 token ── */}
      <ColorSpecTable groups={VARIANTS.map(variant => ({ name: COLOR_VARIANT_NAMES[variant.value], rows: colorStateRows(variant) }))} />

      {/* ── 5. 尺寸与令牌契约速查 ── */}
      <section className="demo-section">
        <div className="demo-section-header">
          <h2 className="demo-section-name">Token contract</h2>
          <span className="demo-section-tag">
            复用资产
          </span>
        </div>
        <p className="demo-section-desc">
          三个轴各对应一组 class：<code>.btn--&#123;variant&#125;</code>（颜色）、
          <code>.btn--&#123;size&#125;</code>（尺寸）、<code>.btn--&#123;shape&#125;</code>（圆角）。下面是可复用的数值。
        </p>

        <div className="btn-table-wrap">
        <table className="btn-table btn-table--roomy">
          <thead>
            <tr>
              <th>size</th>
              <th>height</th>
              <th>font-size / line-height</th>
              <th>icon-size</th>
              <th>padding-inline</th>
              <th>icon-gap</th>
              <th>radius</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="btn-table-strong">large</td>
              <td>40px</td>
              <td>16px / 24px</td>
              <td>20px</td>
              <td>16px</td>
              <td>8px</td>
              <td>
                <span className="btn-table-src">由 shape 决定 ↓</span>
              </td>
            </tr>
            <tr>
              <td className="btn-table-strong">medium</td>
              <td>32px</td>
              <td>14px / 22px</td>
              <td>16px</td>
              <td>12px</td>
              <td>4px</td>
              <td>
                <span className="btn-table-src">由 shape 决定 ↓</span>
              </td>
            </tr>
          </tbody>
        </table>
        </div>

        <div className="btn-table-wrap btn-table-wrap--spaced">
        <table className="btn-table btn-table--roomy">
          <thead>
            <tr>
              <th>shape</th>
              <th>class</th>
              <th>radius token</th>
              <th>解析值</th>
              <th>规范适用范围</th>
            </tr>
          </thead>
          <tbody>
            {SHAPES.map((sh) => (
              <tr key={sh.value}>
                <td className="btn-table-strong">{sh.label}</td>
                <td>
                  <code>{`.btn--${sh.value}`}</code>
                </td>
                <td>
                  <code>{sh.radiusToken}</code>
                </td>
                <td>{sh.radiusValue}</td>
                <td>
                  {sh.scope}
                  <br />
                  <span className="btn-table-src">{sh.note}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>
      <section className="demo-section">
        <div className="demo-section-header"><h2 className="demo-section-name">Asset contract</h2></div>
        <p className="demo-section-desc">icon 接收调用方提供的图标资源路径，不限制文件名。以下四个资源仅用于预览检查；组件通过 mask 让图标跟随文字颜色，支持全部尺寸和形状。</p>
        <div className="btn-table-wrap"><table className="btn-table"><thead><tr><th>icon</th><th>资源</th></tr></thead><tbody>
          {ICON_OPTIONS.map(icon => <tr key={icon.value}><td><code>{icon.value}</code></td><td>assets/uploads/icon/function/{icon.value}.svg</td></tr>)}
        </tbody></table></div>
      </section>
      <section className="demo-section">
        <div className="demo-section-header"><h2 className="demo-section-name">API contract</h2></div>
        <p className="demo-section-desc">children 为必填按钮文案，缺少文案时不渲染按钮；纯图标操作使用 IconButton。onClick 接收原生点击事件，disabled 时不会触发。type 默认 button；id、className 和 style 应用于根按钮。无单独尺寸或形状功能限制。</p>
      </section>
    </div>
  );
}
