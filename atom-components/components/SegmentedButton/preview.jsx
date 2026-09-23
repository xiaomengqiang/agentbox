import React from "react";
import { useState } from "react";
import { Icon } from "../../../assets/shared/icons.js";
import SegmentedButton from "./index.jsx";
const VARIANTS = [
  { value: "text", label: "Text" },
  { value: "icon", label: "Icon" },
];
const COUNTS = [2, 3, 4, 5].map((value) => ({ value: String(value), label: `${value} segments` }));
const RADII = [
  { value: "24", label: "Round · 44px" },
  { value: "8", label: "Square · 36px" },
];
const ICONS = ["layout-grid", "list", "code", "columns-2", "image"];
const VIEW_ICONS = [
  <span style={{ width: 14, height: 14, display: "block", backgroundColor: "currentColor", mask: 'url("./assets/uploads/icon/view/code_preview.svg") center / contain no-repeat', WebkitMask: 'url("./assets/uploads/icon/view/code_preview.svg") center / contain no-repeat' }} />,
  <span style={{ width: 14, height: 14, display: "block", backgroundColor: "currentColor", mask: 'url("./assets/uploads/icon/view/code.svg") center / contain no-repeat', WebkitMask: 'url("./assets/uploads/icon/view/code.svg") center / contain no-repeat' }} />,
];
const INTERACTION_STATES = ["Default", "Hover", "Pressed", "Disabled"];

function Section({ title, description, children }) {
  return (
    <section className="demo-section">
      <div className="demo-section-header"><h2 className="demo-section-name">{title}</h2></div>
      <p className="demo-section-desc">{description}</p>
      {children}
    </section>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="button-control">
      <span>{label}</span>
      <span className="button-select-wrap">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </span>
    </label>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="button-control">
      <span>{label}</span>
      <div className="button-toggle-line">
        <span>{value ? "开启" : "关闭"}</span>
        <label className="button-switch">
          <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
          <span className="button-switch-track" />
        </label>
      </div>
    </div>
  );
}

function ColorValue({ token, detail, kind }) {
  return (
    <>
      <span className="btn-color-token">
        <i
          className={`btn-color-swatch${kind ? ` btn-color-swatch--${kind}` : ""}`}
          style={kind ? undefined : { backgroundColor: `var(${token})` }}
          aria-hidden="true"
        />
        {kind === "none" ? <span>—</span> : <code>{token}</code>}
      </span>
      <span className="btn-table-src">{detail}</span>
    </>
  );
}

function SameDefault() {
  return <span className="btn-color-same">同 Default</span>;
}

function ColorRows({ variant, selected }) {
  const group = `${variant === "text" ? "Text" : "Icon"} · ${selected ? "Selected" : "Unselected"}`;
  return INTERACTION_STATES.map((state, index) => {
    const background = state === "Default"
      ? selected
        ? <ColorValue token="--surface-container-lowest" detail="选中段浮层；随主题切换" />
        : <ColorValue token="transparent" detail="透明，显示轨道底色" kind="transparent" />
      : !selected && state === "Hover"
      ? <ColorValue token="--color-interactive-hover" detail="未选中段交互层" />
      : !selected && state === "Pressed"
      ? <ColorValue token="--color-interactive-pressed" detail="未选中段按压层" />
      : <SameDefault />;

    const outline = state === "Default"
      ? <ColorValue token="—" detail="无描边" kind="none" />
      : <SameDefault />;

    const primary = variant === "icon" ? "--color-icon-primary" : "--color-font-primary";
    const secondary = variant === "icon" ? "--color-icon-secondary" : "--color-font-secondary";
    const text = state === "Default"
      ? selected
        ? <ColorValue token={primary} detail={variant === "icon" ? "icon_primary · 选中图标" : "text_primary · 选中文字"} />
        : <ColorValue token={secondary} detail={variant === "icon" ? "icon_secondary · 未选中图标" : "text_secondary · 未选中文字"} />
      : state === "Disabled"
      ? <ColorValue token="--text-disabled" detail="禁用文字与图标" />
      : <SameDefault />;

    return (
      <tr key={`${group}-${state}`} className={index === 0 ? "btn-color-group-start" : undefined}>
        {index === 0 ? <th className="btn-color-variant" scope="rowgroup" rowSpan={INTERACTION_STATES.length}>{group}</th> : null}
        <td className="btn-color-state">{state}</td>
        <td>{background}</td>
        <td>{outline}</td>
        <td>{text}</td>
      </tr>
    );
  });
}

function stateClass(state) {
  return state === "Default" ? "" : `seg-demo-force-${state.toLowerCase()}`;
}

export default function Demo() {
  const [width, setWidth] = useState("100%");
  const [variant, setVariant] = useState("text");
  const [count, setCount] = useState(3);
  const [radius, setRadius] = useState(24);
  const [showIcon, setShowIcon] = useState(false);
  const [activeKey, setActiveKey] = useState("s0");
  const labels = Array.from({ length: count }, (_, index) => `视图 ${index + 1}`);
  const changeCount = (next) => {
    const resolved = Number(next);
    setCount(resolved);
    if (Number(activeKey.slice(1)) >= resolved) setActiveKey("s0");
  };

  return (
    <div className="demo-page">
      <header className="demo-header"><h2 className="preview-panel-title">Segmented Button 分段按钮</h2><p className="demo-subtitle">Segmented Button 分段按钮 · Text：Round 44px / Square 36px · Icon：32px · 2–5 segments · 可选前缀图标 · 4 states</p></header>

      <Section title="Configurator" description="选择 Text 或 Icon、设置分段数量；Text 可调整形状和前缀图标，直接点击预览切换选中段。">
        <div className="button-configurator">
          <div className="button-controls">
            <Select label="Variant" value={variant} onChange={setVariant} options={VARIANTS} />
            {variant === "text" ? <Select label="Shape" value={String(radius)} onChange={(next) => setRadius(Number(next))} options={RADII} /> : null}
            <label className="button-control"><span>Width</span><input value={width} onChange={event => setWidth(event.target.value)} placeholder="如 100%、480px、auto" /></label>
            <Select label="Count" value={String(count)} onChange={changeCount} options={COUNTS} />
            {variant === "text" ? <Toggle label="前缀图标" value={showIcon} onChange={setShowIcon} /> : null}
          </div>
          <div className="button-configurator-preview seg-demo-live">
            <span className="btn-lab-slotlabel">LIVE PREVIEW</span>
            <SegmentedButton
              width={width || undefined}
              variant={variant}
              count={count}
              labels={labels}
              showIcon={showIcon}
              icon={variant === "icon" ? VIEW_ICONS : ICONS}
              radius={radius}
              activeKey={activeKey}
              onChange={setActiveKey}
            />
          </div>
        </div>
      </Section>

      <Section title="交互样式库" description="点击分段体验切换。Text 按形状及前缀图标分类，Icon 展示紧凑图标样式。">
        <h3 className="seg-gallery-heading">Text 文本</h3>
        <div className="seg-demo-gallery">
          {[24, 8].flatMap(radius => [false, true].map(showIcon => <article className="seg-demo-card" key={`${radius}-${showIcon}`}>
            <h3>{radius === 24 ? "Round" : "Square"} · {showIcon ? "有前缀图标" : "无前缀图标"}</h3>
            <SegmentedButton radius={radius} count={3} labels={["最近", "收藏", "共享"]} showIcon={showIcon} icon={["clock", "star", "share-2"]} width="100%" />
          </article>))}
        </div>
        <h3 className="seg-gallery-heading">Icon 纯图标</h3>
        <div className="seg-demo-gallery"><article className="seg-demo-card"><h3>视图切换</h3><SegmentedButton variant="icon" count={2} icon={VIEW_ICONS} labels={["预览", "代码"]} /></article></div>
      </Section>

      <Section title="State matrix" description="每格固定第二段为目标；静态标本不响应鼠标。Selected 与 Unselected 使用同一组件结构。">
        <div className="btn-table-wrap">
          <table className="btn-table seg-demo-matrix">
            <thead><tr><th>Variant</th>{INTERACTION_STATES.map((state) => <th key={state}>{state}</th>)}</tr></thead>
            <tbody>
              {VARIANTS.map((item) => (
                <tr key={item.value}>
                  <th>{item.label}</th>
                  {INTERACTION_STATES.map((state) => (
                    <td key={state}>
                      <div className={`seg-demo-static ${stateClass(state)}`} inert="">
                        <SegmentedButton
                          variant={item.value}
                          count={2}
                          labels={["选中", "未选中"]}
                          icon={item.value === "icon" ? VIEW_ICONS : ["settings", "download"]}
                          activeKey="s0"
                          disabled={state === "Disabled"}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Color spec" description="轨道统一使用 comp_background_tertiary。Text 前缀图标也使用 icon_primary / icon_secondary；文字与图标分别跟随选中状态。">
        <div className="btn-table-wrap">
          <table className="btn-table btn-table--color">
            <thead><tr><th>Variant</th><th>State</th><th>Background</th><th>Outline</th><th>Text / Icon</th></tr></thead>
            <tbody>
              {VARIANTS.flatMap((item) => [
                <ColorRows key={`${item.value}-selected`} variant={item.value} selected />,
                <ColorRows key={`${item.value}-unselected`} variant={item.value} selected={false} />,
              ])}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Token contract" description="Text：Round 44px、Square 36px；Icon：32px，每段固定 36 × 28px，14px 图标居中。">
        <div className="btn-table-wrap">
          <table className="btn-table btn-table--roomy">
            <thead><tr><th>Variant</th><th>Height</th><th>Track padding</th><th>Segment padding</th><th>Font / Icon</th><th>Gap</th><th>Radius</th></tr></thead>
            <tbody>
              <tr><th>Round</th><td>44px</td><td>4px</td><td>0 / 16px</td><td>14px / 16px</td><td>8px</td><td>24px</td></tr>
              <tr><th>Square</th><td>36px</td><td>2px</td><td>0 / 16px</td><td>14px / 16px</td><td>8px</td><td>8px（内部 6px）</td></tr><tr><th>Icon</th><td>32px</td><td>2px</td><td>36 × 28px · 居中</td><td>— / 14px</td><td>0</td><td>8px（内部 6px）</td></tr><tr><th>Track background</th><td colSpan={6}><code>--color-comp-background-tertiary</code> · comp_background_tertiary</td></tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="API contract" description="简单参数适合常规等分分段；segments 用于逐段自定义。">
        <div className="btn-table-wrap">
          <table className="btn-table btn-table--roomy">
            <thead><tr><th>Props</th><th>Contract</th></tr></thead>
            <tbody>
              <tr><th>width</th><td>number（px）或 CSS 宽度字符串，例如 480、100%、auto。省略时 Text 默认 514px、Icon 按内容；Icon 每段仍固定 36px。</td></tr>
              <tr><th>variant / count / labels</th><td>选择 Text 或 Icon；count 决定数量，labels 设置各段文案。</td></tr>
              <tr><th>showIcon / icon</th><td>Text 由 showIcon 开启前缀图标；Icon 始终使用 icon。数组按段循环。</td></tr>
              <tr><th>radius</th><td>仅 Text：24 为 Round（44px 高），8 为 Square（36px 高）；Icon 固定 32px 高、8px 圆角。</td></tr>
              <tr><th>segments</th><td>传入后优先于 count、labels、showIcon 和 icon；支持单段 disabled。</td></tr>
              <tr><th>activeKey / defaultActiveKey</th><td>分别用于受控和非受控选中管理，不同时使用。</td></tr>
              <tr><th>onChange / onSegmentClick</th><td>点击可用段后返回 key 与 index；整组或单段 disabled 时不触发。</td></tr>
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
