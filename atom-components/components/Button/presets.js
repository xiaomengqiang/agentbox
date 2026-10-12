/** Button 的规范取值和尺寸契约；不提供属性别名。尺寸数值须与 index.css 同步。 */
export const BUTTON_VARIANTS = ["primary", "secondary", "tertiary", "text"];


export const BUTTON_SIZES = ["large", "medium"];

export const BUTTON_SIZE_TOKENS = {
  large: {
    height: 40,
    paddingInline: 16,
    fontSize: "var(--font-size-md)",
    iconSize: 20,
    iconGap: 8,
  },
  medium: {
    height: 32,
    paddingInline: 12,
    fontSize: "var(--font-size-base)",
    iconSize: 16,
    iconGap: 4,
  },
};

export const BUTTON_SHAPES = ["round", "square"];


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
    scope: "全变体 × 全尺寸",
  },
};

export const BUTTON_SHAPE_SCOPE = {
  round: null, // null = 不限
  square: null,
};

export function isShapeSupported(shape, variant, size) {
  return BUTTON_SHAPES.includes(shape) && BUTTON_VARIANTS.includes(variant) && BUTTON_SIZES.includes(size);
}

export function resolveShape(shape) {
  if (BUTTON_SHAPES.indexOf(shape) > -1) return shape;
  return "round";
}

export function resolveVariant(variant) {
  if (BUTTON_VARIANTS.indexOf(variant) > -1) return variant;
  return "primary";
}

export function resolveSize(size) {
  return BUTTON_SIZES.indexOf(size) > -1 ? size : "large";
}
