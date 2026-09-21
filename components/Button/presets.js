/**
 * Button · 单一事实来源（vocabulary + token contract）
 * ---------------------------------------------------------------------------
 * 本文件是 AI / 开发者调用 Button 时的「查表入口」：
 *   - BUTTON_VARIANTS         M3 规范命名（唯一推荐的取值）
 *   - BUTTON_VARIANT_ALIASES  旧称/设计口头语 → M3 命名（primary → filled ...）
 *   - BUTTON_SIZES            尺寸取值
 *   - BUTTON_SIZE_TOKENS      尺寸数值契约，与 index.css 中同名 CSS 变量一一对应
 *   - BUTTON_SHAPES           形状取值（几何轴）
 *   - BUTTON_SHAPE_ALIASES    形状别名 → 规范命名（rounded → round ...）
 *   - BUTTON_SHAPE_SCOPE      形状的规范适用范围（square 只用于 outlined × small）
 *
 * 三个轴互相正交，组合出全部按钮：variant（含义）× size（密度）× shape（几何）。
 *   <Button variant="outlined" size="small" shape="square" />
 * 形状不并入变体名：否则会长出 filled-round / filled-square / tonal-round… 的组合命名，
 * 变体数随形状数相乘膨胀，别名映射也会失效。
 *
 * ⚠️ 若修改尺寸数值，请同步修改 index.css 里 .btn--large / .btn--small 的
 *    --btn-height / --btn-padding-inline / --btn-font-size / --btn-icon-size / --btn-icon-gap。
 *    形状同理：BUTTON_SHAPE_TOKENS 对应 index.css 的 .btn--round / .btn--square。
 */

/** M3 Filled / Filled tonal / Outlined / Text —— 仅这四个是规范命名 */
export const BUTTON_VARIANTS = ["filled", "tonal", "outlined", "text"];

/**
 * 别名映射：习惯叫法 → M3 规范命名。
 * primary   = 品牌实心，高强调
 * secondary = 品牌淡底，中强调
 * tertiary  = 描边，中强调
 * plain     = 纯文字，低强调
 */
export const BUTTON_VARIANT_ALIASES = {
  primary: "filled",
  secondary: "tonal",
  tertiary: "outlined",
  plain: "text",
};

/** 尺寸：large ≈ M3 L（40px 高），small ≈ M3 S（28px 高） */
export const BUTTON_SIZES = ["large", "small"];

/** 尺寸数值契约（px），与 index.css 的 CSS 变量同源 */
export const BUTTON_SIZE_TOKENS = {
  large: {
    height: 40,
    paddingInline: 16,
    fontSize: 16,
    iconSize: 20,
    iconGap: 8,
  },
  small: {
    height: 28,
    paddingInline: 12,
    fontSize: 14,
    iconSize: 16,
    iconGap: 4,
  },
};

/** 形状（几何轴，与 variant / size 正交）：round = 跑道圆，square = 方圆角 */
export const BUTTON_SHAPES = ["round", "square"];

/**
 * 形状别名映射。`rounded` 是设计口头语，收敛到规范名 round；
 * `rect` / `sharp` 收敛到 square。
 */
export const BUTTON_SHAPE_ALIASES = {
  rounded: "round",
  pill: "round",
  rect: "square",
  sharp: "square",
};

/**
 * 形状半径契约，与 index.css 的 .btn--round / .btn--square 同源。
 * scope 是该形状在 design system 中允许出现的组合，供走查 / 代码评审对照。
 */
export const BUTTON_SHAPE_TOKENS = {
  round: {
    radius: "var(--radius-full)",
    radiusPx: 9999,
    label: "跑道圆",
    scope: "全变体 × 全尺寸",
  },
  square: {
    radius: "var(--radius-lg)",
    radiusPx: 8,
    label: "方圆角",
    scope: "仅 outlined × small",
  },
};

/**
 * 形状的规范适用范围（design system 事实，不是可选项）：
 *   round  —— 不限，所有 variant × size
 *   square —— 只有 outlined + small 这一个组合
 * 组件本身不做静默降级：传了 square 就渲染 square，是否落在范围内由调用方 /
 * 走查用 isShapeSupported() 自行校验，避免把违规组合藏起来。
 */
export const BUTTON_SHAPE_SCOPE = {
  round: null, // null = 不限
  square: [{ variant: "outlined", size: "small" }],
};

/** 该 shape 是否被允许用于这个 variant × size 组合 */
export function isShapeSupported(shape, variant, size) {
  const scope = BUTTON_SHAPE_SCOPE[resolveShape(shape)];
  if (!scope) return true;
  for (let i = 0; i < scope.length; i++) {
    if (scope[i].variant === variant && scope[i].size === size) return true;
  }
  return false;
}

/** 把任意写法收敛成形状名；非法值回退到 round（= 历史默认外观） */
export function resolveShape(shape) {
  if (BUTTON_SHAPES.indexOf(shape) > -1) return shape;
  if (BUTTON_SHAPE_ALIASES[shape]) return BUTTON_SHAPE_ALIASES[shape];
  return "round";
}

/** 把任意写法收敛成 M3 变体名；非法值回退到 filled */
export function resolveVariant(variant) {
  if (BUTTON_VARIANTS.indexOf(variant) > -1) return variant;
  if (BUTTON_VARIANT_ALIASES[variant]) return BUTTON_VARIANT_ALIASES[variant];
  return "filled";
}

/** 把任意写法收敛成尺寸名；非法值回退到 large */
export function resolveSize(size) {
  return BUTTON_SIZES.indexOf(size) > -1 ? size : "large";
}
