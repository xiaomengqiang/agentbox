import React from "react";
import Button from "./index.jsx";
import { Icon } from "../../../assets/shared/icons.js";

// M3 规范命名 + 旧称别名 + 全套状态取值
// aliasLabel = 设计口头语（Primary/Secondary…），展示区以它作为分组标题
// container/border/label = 背景色 / 描边色 / 文字色；hover/pressed 为叠加层或文字色；disabled 为禁用态
const VARIANTS = [
  {
    value: "filled",
    m3: "Filled button",
    alias: "primary",
    aliasLabel: "Primary",
    sample: "主要操作",
    desc: "高强调 · 主色实心",
    container: "--color-icon-primary",
    containerValue: "明 rgba(0,0,0,.9) ／ 暗 rgba(255,255,255,.9)",
    border: "—",
    label: "--color-font-on-primary",
    labelValue: "明 纯白 #FFFFFF ／ 暗 黑色 #000000（.dark 覆盖）",
    hover: "叠 --on-primary-10",
    hoverValue: "明 白 10% 叠近黑 → 变浅 ~#303030 ／ 暗 黑 10% 叠近白 → 变深",
    pressed: "叠 --on-primary-15",
    pressedValue: "再浅 / 再深一档（= M3 Filled button 的 state layer）",
    disabled: "沿用静止态 + 50% 透明度",
    disabledValue: "实心底与白字都不变，opacity: 0.5",
  },
  {
    value: "tonal",
    m3: "Filled tonal button",
    alias: "secondary",
    aliasLabel: "Secondary",
    sample: "次要操作",
    desc: "中强调 · 主色淡底",
    container: "--color-comp-background-tertiary",
    containerValue: "container-05：明 rgba(0,0,0,.05) ／ 暗 rgba(255,255,255,.05)",
    border: "—",
    label: "--color-icon-primary",
    labelValue: "明 rgba(0,0,0,.9) ／ 暗 rgba(255,255,255,.9)",
    hover: "叠 --color-interactive-hover",
    hoverValue: "≈ --color-comp-background-secondary（container-10）",
    pressed: "叠 --color-interactive-pressed",
    pressedValue: "≈ container-15",
    disabled: "沿用静止态 + 50% 透明度",
    disabledValue: "opacity: 0.5",
  },
  {
    value: "outlined",
    m3: "Outlined button",
    alias: "tertiary",
    aliasLabel: "Tertiary",
    sample: "描边操作",
    desc: "中强调 · 中性描边",
    container: "透明",
    containerValue: "transparent",
    border: "--color-comp-border",
    borderValue: "container-15：明 rgba(0,0,0,.15) ／ 暗 rgba(255,255,255,.15)",
    label: "--color-icon-primary",
    labelValue: "明 rgba(0,0,0,.9) ／ 暗 rgba(255,255,255,.9)",
    hover: "叠 --color-interactive-hover",
    hoverValue: "= --color-comp-background-tertiary（container-05）",
    pressed: "叠 --color-interactive-pressed",
    pressedValue: "= --color-comp-background-secondary（container-10）",
    disabled: "沿用静止态 + 50% 透明度",
    disabledValue: "描边不变，opacity: 0.5",
  },
  {
    value: "text",
    m3: "Text button",
    alias: "plain",
    aliasLabel: "Plain",
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
// scope = 该形状在 design system 中被规范使用的组合（round 不限，square 只有 outlined × small）
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
    scope: "仅 outlined × small",
    note: "方圆角 · 只在描边小按钮上出现",
  },
];

const SIZES = [
  {
    value: "large",
    label: "Large",
    spec: "40px 高 · 16px 字号",
  },
  {
    value: "small",
    label: "Small",
    spec: "28px 高 · 14px 字号",
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

const ICON_OPTIONS = [
  { value: "plus", label: "Plus" },
  { value: "pencil", label: "Pencil" },
  { value: "trash-2", label: "Trash" },
  { value: "download", label: "Download" },
  { value: "settings", label: "Settings" },
  { value: "arrow-right", label: "Arrow right" },
];

function colorToken(value = "") {
  const match = value.match(/--[a-z0-9-]+/i);
  return match ? match[0] : "";
}

function ColorSpecCell({ label, detail, fallback = "", disabled = false }) {
  const isTransparent = label === "透明" || /\btransparent\b/i.test(detail);
  const isNone = label === "—";
  const token = colorToken(label) || colorToken(detail) || colorToken(fallback);
  const swatchClass = [
    "btn-color-swatch",
    isTransparent ? "btn-color-swatch--transparent" : "",
    isNone ? "btn-color-swatch--none" : "",
    disabled ? "btn-color-swatch--disabled" : "",
  ].filter(Boolean).join(" ");
  const swatchStyle = token && !isTransparent && !isNone
    ? { backgroundColor: `var(${token})` }
    : undefined;

  return (
    <>
      <span className="btn-color-token">
        <i className={swatchClass} style={swatchStyle} aria-hidden="true" />
        {isNone ? <span>—</span> : <code>{label}</code>}
      </span>
      <span className="btn-table-src">{detail}</span>
    </>
  );
}

const COLOR_VARIANT_NAMES = {
  filled: "Primary",
  tonal: "Secondary",
  outlined: "Tertiary",
  text: "Text",
};

function SameDefaultCell() {
  return <span className="btn-color-same">同 Default</span>;
}

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
  const [playgroundVariant, setPlaygroundVariant] = React.useState("filled");
  const [playgroundSize, setPlaygroundSize] = React.useState("large");
  const [playgroundShape, setPlaygroundShape] = React.useState("round");
  const [showIcon, setShowIcon] = React.useState(true);
  const [playgroundIcon, setPlaygroundIcon] = React.useState("plus");
  const [playgroundDisabled, setPlaygroundDisabled] = React.useState(false);

  const canUseSquare = playgroundVariant === "outlined" && playgroundSize === "small";
  const playgroundLabel = VARIANTS.find((variant) => variant.value === playgroundVariant)?.sample || "按钮操作";

  const changeVariant = (nextVariant) => {
    setPlaygroundVariant(nextVariant);
    if (nextVariant !== "outlined" && playgroundShape === "square") {
      setPlaygroundShape("round");
    }
  };

  const changeSize = (nextSize) => {
    setPlaygroundSize(nextSize);
    if (nextSize !== "small" && playgroundShape === "square") {
      setPlaygroundShape("round");
    }
  };

  return (
    <div className="demo-page">
      <header className="demo-header"><h2 className="preview-panel-title">Button 按钮</h2><p className="demo-subtitle">Button 按钮 · Filled / Tonal / Outlined / Text · Large / Small · Round / Square · 5 states</p></header>

      <section className="demo-section">
        <div className="demo-section-header">
          <h2 className="demo-section-name">Configurator</h2>
          <span className="demo-section-tag">实时配置</span>
        </div>
        <p className="demo-section-desc">
          按 Size、Shape、Variant、State 和前缀图标依次配置。Square 仅在 Small Tertiary 下可选。
        </p>

        <div className="button-configurator">
          <div className="button-controls">
            <label className="button-control">
              <span>Size</span>
              <span className="button-select-wrap">
                <select value={playgroundSize} onChange={(event) => changeSize(event.target.value)}>
                  {SIZES.map((size) => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </select>
              </span>
            </label>

            <label className="button-control">
              <span>Shape</span>
              <span className="button-select-wrap">
                <select value={playgroundShape} onChange={(event) => setPlaygroundShape(event.target.value)}>
                  <option value="round">Round</option>
                  <option value="square" disabled={!canUseSquare}>Square</option>
                </select>
              </span>
            </label>

            <label className="button-control">
              <span>Variant</span>
              <span className="button-select-wrap">
                <select value={playgroundVariant} onChange={(event) => changeVariant(event.target.value)}>
                  {VARIANTS.map((variant) => (
                    <option key={variant.value} value={variant.value}>{variant.aliasLabel}</option>
                  ))}
                </select>
              </span>
            </label>

            <div className="button-control button-control--toggle">
              <span>State</span>
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
              <span>前缀图标</span>
              <div className="button-toggle-line">
                <span>{showIcon ? "开启" : "关闭"}</span>
                <label className="button-switch">
                  <input
                    type="checkbox"
                    checked={showIcon}
                    onChange={(event) => setShowIcon(event.target.checked)}
                    aria-label="开启前缀图标"
                  />
                  <span className="button-switch-track" />
                </label>
              </div>

              {showIcon ? (
                <span className="button-select-wrap button-icon-select">
                  <select
                    value={playgroundIcon}
                    onChange={(event) => setPlaygroundIcon(event.target.value)}
                    aria-label="选择前缀图标"
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
              icon={showIcon ? playgroundIcon : undefined}
              disabled={playgroundDisabled}
            >
              {playgroundLabel}
            </Button>
          </div>
        </div>
      </section>

      {/* ── 1. 交互演练：真实按钮，鼠标可直接体验 hover / focus / pressed ── */}
      <section className="demo-section">
        <div className="demo-section-header">
          <h2 className="demo-section-name">交互样式库</h2>
          <span className="demo-section-tag">
            <Icon name="mouse-pointer-click" size={12} />
            可交互
          </span>
        </div>
        <p className="demo-section-desc">
          四组按钮，每组<strong>上方为可用、下方为禁用</strong>，可直接对比。鼠标悬停看 hover，按下看
          pressed，Tab 键看 focus。
        </p>

        <div className="btn-lab">
          {SIZES.map((size) => (
            <div className="btn-lab-block" key={size.value}>
              <div className="btn-lab-head">
                <span className="btn-lab-size">{size.label}</span>
                <span className="btn-lab-spec">{size.spec}</span>
              </div>

              {/* 一列 = 一个变体：列头是分组名（Primary…），列内 Enabled / Disabled 共用同一竖向中轴 */}
              <div className="btn-lab-grid">
                {VARIANTS.map((variant) => (
                  <div className="btn-lab-col" key={variant.value}>
                    <div className="btn-lab-colhead">
                      <span className="btn-lab-colname">{variant.aliasLabel}</span>
                      <span className="btn-lab-colmeta">
                        <code>{variant.value}</code>
                      </span>
                    </div>

                    <div className="btn-lab-slot">
                      <span className="btn-lab-slotlabel">Enabled</span>
                      <Button variant={variant.value} size={size.value} icon="plus">
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

      {/* ── 2. 形状：与 variant / size 正交的几何轴，但 square 只有规范一个组合 ── */}
      <section className="demo-section">
        <div className="demo-section-header">
          <h2 className="demo-section-name">Shape</h2>
          <span className="demo-section-tag">
            <Icon name="squircle" size={12} />
            几何轴
          </span>
        </div>
        <p className="demo-section-desc">
          按钮默认为<strong>跑道圆</strong>。<strong>方圆角</strong>只用于「描边 + 小尺寸」这一种按钮，
          因此两组都锁定该条件，唯一的差别是圆角从 9999px 收到 8px。
        </p>

        <div className="btn-lab">
          <div className="btn-lab-block">
            <div className="btn-lab-head">
              <span className="btn-lab-size">Outlined · Small</span>
              <span className="btn-lab-spec">固定这一个组合，只让圆角变化</span>
            </div>

            <div className="btn-lab-grid btn-lab-grid--two">
              {SHAPES.map((sh) => (
                <div className="btn-lab-col" key={sh.value}>
                  <div className="btn-lab-colhead">
                    <span className="btn-lab-colname">{sh.label}</span>
                    <span className="btn-lab-colmeta">
                      <span>
                        <code>{`shape="${sh.value}"`}</code>
                      </span>
                      <span>
                        <code>{sh.radiusToken}</code> · {sh.radiusValue}
                      </span>
                      <span>{sh.scope}</span>
                    </span>
                  </div>

                  <div className="btn-lab-slot">
                    <span className="btn-lab-slotlabel">Enabled</span>
                    <Button variant="outlined" size="small" shape={sh.value} icon="plus">
                      描边操作
                    </Button>
                  </div>

                  <div className="btn-lab-slot btn-lab-slot-off">
                    <span className="btn-lab-slotlabel">Disabled</span>
                    <Button variant="outlined" size="small" shape={sh.value} icon="plus" disabled>
                      描边操作
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. 状态矩阵：按尺寸分区，静态强制各状态，便于逐格走查 ── */}
      <section className="demo-section">
        <div className="demo-section-header">
          <h2 className="demo-section-name">State matrix</h2>
          <span className="demo-section-tag">
            <Icon name="table" size={12} />
            走查用
          </span>
        </div>
        <p className="demo-section-desc">
          按尺寸分区，逐行列出每个变体在五个状态下的样子。这里的按钮是静态标本，不响应鼠标与键盘；
          想体验真实交互请看上面的 Button 区。
        </p>

        <div className="btn-matrix">
          {SIZES.map((size) => (
            <section className="btn-matrix-group" key={size.value}>
              <div className="btn-matrix-grouphead">
                <span className="btn-matrix-groupname">{size.label}</span>
                <span className="btn-matrix-groupspec">{size.spec}</span>
              </div>

              <div className="btn-matrix-row btn-matrix-row-head">
                <div className="btn-matrix-label" />
                {STATES.map((state) => (
                  <div className="btn-matrix-cell" key={state.value}>
                    <span className="btn-matrix-state">{state.label}</span>
                    <span className="btn-matrix-hint">{state.hint}</span>
                  </div>
                ))}
              </div>

              {VARIANTS.map((variant) => (
                <div className="btn-matrix-row" key={variant.value}>
                  <div className="btn-matrix-label">
                    <span className="btn-matrix-variant">{variant.m3}</span>
                    <span className="btn-matrix-meta">{variant.value}</span>
                  </div>
                  {STATES.map((state) => (
                    <div className="btn-matrix-cell" key={state.value} inert="">
                      <Button
                        variant={variant.value}
                        size={size.value}
                        icon="plus"
                        data-state={
                          state.value === "default" || state.value === "disabled"
                            ? undefined
                            : state.value
                        }
                        disabled={state.value === "disabled"}
                      >
                        按钮文案
                      </Button>
                    </div>
                  ))}
                </div>
              ))}
            </section>
          ))}
        </div>
      </section>

      {/* ── 4. 色彩映射：变体 → 语义色彩规范 token ── */}
      <section className="demo-section">
        <div className="demo-section-header">
          <h2 className="demo-section-name">Color spec</h2>
          <span className="demo-section-tag">
            <Icon name="palette" size={12} />
            语义令牌
          </span>
        </div>
        <p className="demo-section-desc">
          先按 Variant 分组，再按 State 对比 Background、Outline 与 Text。未变化的属性标记为“同 Default”。
        </p>
        <div className="btn-table-wrap">
          <table className="btn-table btn-table--color">
            <thead>
              <tr>
                <th>Variant</th>
                <th>State</th>
                <th>Background</th>
                <th>Outline</th>
                <th>Text</th>
              </tr>
            </thead>
            <tbody>
              {VARIANTS.map((variant) => {
                const stateRows = colorStateRows(variant);
                return stateRows.map((state, index) => (
                  <tr
                    key={`${variant.value}-${state.value}`}
                    className={index === 0 ? "btn-color-group-start" : undefined}
                  >
                    {index === 0 ? (
                      <th className="btn-color-variant" scope="rowgroup" rowSpan={stateRows.length}>
                        {COLOR_VARIANT_NAMES[variant.value]}
                      </th>
                    ) : null}
                    <td className="btn-color-state">
                      <span>{state.label}</span>
                      {state.note ? <small>{state.note}</small> : null}
                    </td>
                    <td>{state.background ? <ColorSpecCell {...state.background} /> : <SameDefaultCell />}</td>
                    <td>{state.outline ? <ColorSpecCell {...state.outline} /> : <SameDefaultCell />}</td>
                    <td>{state.text ? <ColorSpecCell {...state.text} /> : <SameDefaultCell />}</td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 5. 尺寸与令牌契约速查 ── */}
      <section className="demo-section">
        <div className="demo-section-header">
          <h2 className="demo-section-name">Token contract</h2>
          <span className="demo-section-tag">
            <Icon name="braces" size={12} />
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
              <th>font-size</th>
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
              <td>16px</td>
              <td>20px</td>
              <td>16px</td>
              <td>8px</td>
              <td>
                <span className="btn-table-src">由 shape 决定 ↓</span>
              </td>
            </tr>
            <tr>
              <td className="btn-table-strong">small</td>
              <td>28px</td>
              <td>14px</td>
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
              <th>别名（自动收敛到规范值）</th>
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
                  {sh.value === "round" ? (
                    <>
                      <code>rounded</code> <code>pill</code>
                    </>
                  ) : (
                    <>
                      <code>rect</code> <code>sharp</code>
                    </>
                  )}
                </td>
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
    </div>
  );
}
