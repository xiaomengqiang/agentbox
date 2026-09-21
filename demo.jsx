import { Fragment, useEffect, useRef, useState } from "react";
import SearchBar from "./components/SearchBar/index.jsx";
import "./demo.css";

/** 状态用到的 token（色块用 token 变量实时取色，深色主题自动跟随） */
const T = {
  bg: { token: "comp_background_tertiary", cssVar: "--color-comp-background-tertiary", value: "#000000 5%" },
  hover: { token: "interactive_hover", cssVar: "--color-interactive-hover", value: "#000000 5%" },
  pressed: { token: "interactive_pressed", cssVar: "--color-interactive-pressed", value: "#000000 10%" },
  focus: { token: "interactive_focus", cssVar: "--color-comp-border-focus", value: "#0A59F7" },
  emphasize: { token: "font_emphasize", cssVar: "--color-font-emphasize", value: "#0A59F7" },
  container90: { token: "container90", cssVar: "--container-90", value: "#000000 90%" },
  primary: { token: "font_primary", cssVar: "--color-font-primary", value: "#000000 90%" },
  secondary: { token: "font_secondary", cssVar: "--color-font-secondary", value: "#000000 60%" },
  tertiary: { token: "font_tertiary", cssVar: "--color-font-tertiary", value: "#000000 40%" },
  none: { token: "无填充（transparent）", none: true, value: "transparent" },
};

/** 每个状态的背景色 / 文字色；null = 该尺寸没有这个状态 */
const COLOR_ROWS = [
  {
    state: "默认",
    large: { bg: [T.bg], text: [{ ...T.secondary, use: "图标 / 占位文字" }] },
    small: { bg: [T.none], text: [{ ...T.secondary, use: "图标" }, { ...T.tertiary, use: "占位文字" }] },
  },
  {
    state: "hover",
    large: { bg: [{ ...T.bg }, { ...T.hover, use: "叠加" }], text: [{ ...T.secondary, use: "同默认" }] },
    small: null,
  },
  {
    state: "press",
    large: { bg: [{ ...T.bg }, { ...T.pressed, use: "叠加" }], text: [{ ...T.secondary, use: "同默认" }] },
    small: null,
  },
  {
    state: "focus",
    large: { bg: [T.bg], ring: [{ ...T.focus, use: "内部描边 2px" }], text: [{ ...T.secondary, use: "同默认" }] },
    small: null,
  },
  {
    state: "激活",
    large: { bg: [T.bg], text: [{ ...T.secondary, use: "占位文字" }, { ...T.emphasize, use: "光标" }] },
    small: { bg: [T.none], text: [{ ...T.secondary, use: "图标" }, { ...T.tertiary, use: "占位文字" }, { ...T.container90, use: "光标" }] },
  },
  {
    state: "输入中",
    large: {
      bg: [T.bg],
      text: [{ ...T.primary, use: "文字" }, { ...T.emphasize, use: "光标" }, { ...T.secondary, use: "关闭图标" }],
    },
    small: { bg: [T.none], text: [{ ...T.primary, use: "文字" }, { ...T.container90, use: "光标" }] },
  },
  {
    state: "输入完成",
    large: { bg: [T.bg], text: [{ ...T.primary, use: "文字" }, { ...T.secondary, use: "关闭图标" }] },
    small: { bg: [T.none], text: [{ ...T.primary, use: "文字" }] },
  },
];

function ColorLine({ label, items }) {
  return (
    <div className="demo-color-line">
      <span className="demo-color-key">{label}</span>
      <span className="demo-color-items">
        {items.map((it, i) => (
          <span className="demo-color-chip" key={i}>
            <i
              className={it.none ? "demo-swatch demo-swatch-none" : "demo-swatch"}
              style={it.none ? undefined : { background: `var(${it.cssVar})` }}
            />
            <span className="demo-color-token">{it.token}</span>
            <span className="demo-color-value">{it.value}</span>
            {it.use ? <span className="demo-color-use">{it.use}</span> : null}
          </span>
        ))}
      </span>
    </div>
  );
}

function ColorCell({ data }) {
  if (!data) return <span className="demo-color-empty">—（无此状态）</span>;
  return (
    <div className="demo-color-cell">
      <ColorLine label="背景" items={data.bg} />
      {data.ring ? <ColorLine label="描边" items={data.ring} /> : null}
      <ColorLine label="文字" items={data.text} />
    </div>
  );
}

/**
 * 只展示规格中提到的状态，大号 / 小号按行对齐
 * 默认 · hover · press · focus · 激活 · 输入中 · 输入完成
 */
export default function Demo() {
  const [liveLarge, setLiveLarge] = useState("");
  const [liveSmall, setLiveSmall] = useState("");
  const [typing, setTyping] = useState("HarmonyOS 设计组件");
  const [done, setDone] = useState("搜索框状态演示");
  const liveRef = useRef(null);
  const [metrics, setMetrics] = useState("");

  // 实测大号 / 小号盒子尺寸与文字行高，便于核对内边距
  useEffect(() => {
    const root = liveRef.current;
    if (!root) return;

    const measure = (el, label) => {
      if (!el) return "";
      const cs = getComputedStyle(el);
      const box = Math.round(el.getBoundingClientRect().height);
      const input = el.querySelector(".sb-input");
      // 行高设在 .sb-input 上，需读输入框自身的计算值
      const lineHeight = input ? getComputedStyle(input).lineHeight : cs.lineHeight;
      return `${label}：高 ${box}px，上下内边距 ${cs.paddingTop}/${cs.paddingBottom}，文字行高 ${lineHeight}，左右内边距 ${cs.paddingLeft}/${cs.paddingRight}`;
    };

    setMetrics(
      [
        measure(root.querySelector(".sb-large"), "实测大号"),
        measure(root.querySelector(".sb-small"), "实测小号"),
      ]
        .filter(Boolean)
        .join(" ｜ ")
    );
  }, []);

  return (
    <div className="demo-page">
      <header className="demo-header">
        <div className="demo-title">
          <img src="./assets/uploads/logo.svg" alt="logo" style={{ width: 28, height: 28 }} />
          <span>SearchBar</span>
        </div>
        <p className="demo-subtitle">
          大号：16px、填充 comp_background_tertiary（Light #000000 5%）、上下 9px / 左右 12px、圆角 24px；
          小号：12px、无填充、圆角 6px。逐状态左右对照。
        </p>
      </header>

      {/* 顶部：可交互搜索框 */}
      <section className="demo-section">
        <div className="demo-section-header">
          <h2 className="demo-section-name">可交互</h2>
        </div>
        <p className="demo-section-desc">
          可直接输入，实时查看 hover / press / focus / 激活 / 输入中 / 输入完成。
        </p>
        <div className="demo-live" ref={liveRef}>
          <SearchBar value={liveLarge} onChange={setLiveLarge} />
          <SearchBar size="small" value={liveSmall} onChange={setLiveSmall} />
        </div>
        <p className="demo-note">{metrics}</p>
      </section>

      <section className="demo-section">
        <div className="demo-state-table">
          <span className="demo-col-title" />
          <span className="demo-col-title">大号 · 填充</span>
          <span className="demo-col-title">小号 · 无填充</span>

          {/* 默认 */}
          <span className="demo-state-name">默认</span>
          <SearchBar />
          <SearchBar size="small" />

          {/* hover（小号无此状态） */}
          <span className="demo-state-name">hover</span>
          <div className="demo-force-hover">
            <SearchBar />
          </div>
          <span />

          {/* press（小号无此状态） */}
          <span className="demo-state-name">press</span>
          <div className="demo-force-press">
            <SearchBar />
          </div>
          <span />

          {/* focus（小号无此状态） */}
          <span className="demo-state-name">focus</span>
          <div className="demo-force-focus">
            <SearchBar />
          </div>
          <span />

          {/* 激活 */}
          <span className="demo-state-name">激活</span>
          <div className="demo-force-active">
            <SearchBar />
          </div>
          <div className="demo-force-caret">
            <SearchBar size="small" />
          </div>

          {/* 输入中（有文字 + 原生光标；无描边） */}
          <span className="demo-state-name">输入中</span>
          <SearchBar value={typing} onChange={setTyping} />
          <SearchBar size="small" value={typing} onChange={setTyping} />

          {/* 输入完成 */}
          <span className="demo-state-name">输入完成</span>
          <SearchBar value={done} onChange={setDone} />
          <SearchBar size="small" value={done} onChange={setDone} />
        </div>

        <p className="demo-note">
          hover / press / focus 与关闭图标只有大号有，小号对应单元格留空。静态展示为常驻样式；
          蓝色描边只在<strong>键盘聚焦（Tab）</strong>时出现，鼠标点击进入的「激活」「输入中」无描边；
          光标由组件自绘（1.5×24），激活时贴文字起点、输入时跟在插入点之后，点击输入框即可看到。
        </p>
      </section>

      {/* 状态色板：逐状态列出背景色 / 文字色 */}
      <section className="demo-section">
        <div className="demo-section-header">
          <h2 className="demo-section-name">状态色板</h2>
        </div>
        <p className="demo-section-desc">
          逐状态列出背景色与文字色（token + Light 值）。色块直接取 token 变量，切到深色主题会一起变化。
        </p>

        <div className="demo-color-table">
          <span className="demo-col-title" />
          <span className="demo-col-title">大号 · 填充</span>
          <span className="demo-col-title">小号 · 无填充</span>

          {COLOR_ROWS.map((row) => (
            <Fragment key={row.state}>
              <span className="demo-state-name">{row.state}</span>
              <ColorCell data={row.large} />
              <ColorCell data={row.small} />
            </Fragment>
          ))}
        </div>

        <p className="demo-note">
          叠加说明：hover / press 是「底色不变 + 叠加交互浮层」（黑 5% / 黑 10%），不是替换底色；
          focus 描边为内部 2px，只在键盘聚焦时出现；关闭图标颜色与搜索图标一致（font_secondary）。
        </p>
      </section>
    </div>
  );
}
