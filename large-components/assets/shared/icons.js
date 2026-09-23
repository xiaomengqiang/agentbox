import React, { useState, useEffect, useId } from "react";

// ---- Lucide (offline fallback, table injected at build time) ----
const ICONS = typeof LUCIDE !== "undefined" ? LUCIDE : {};

function camelToKebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function lookupIcon(name) {
  if (!name) return null;
  return (
    ICONS[name] ||
    ICONS[camelToKebab(name)] ||
    ICONS[name.replace(/-([a-z])/g, (_m, c) => c.toUpperCase())] ||
    null
  );
}

// ---- Custom inline SVG overrides (exact user-provided artwork) ----
// These replace the Lucide fallback for a given name and render independent of
// the icon-plus network probe. Mask IDs are made unique per instance via useId
// so multiple copies never collide; strokes use currentColor to follow the
// caller's `color` / CSS `color` token.

function KeyboardIcon({ size = 16, color, className, style, ...rest }) {
  const uid = useId().replace(/:/g, "");
  const stroke = color || "currentColor";
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 32 32",
      fill: "none",
      className,
      "aria-hidden": true,
      style: { ...style, color: stroke },
      ...rest,
    },
    React.createElement(
      "mask",
      {
        id: `${uid}-mask0`,
        style: { maskType: "luminance" },
        maskUnits: "userSpaceOnUse",
        x: 8,
        y: 8,
        width: 16,
        height: 16,
      },
      React.createElement("path", {
        d: "M24 8H8V24H24V8Z",
        fill: "white",
      })
    ),
    React.createElement(
      "g",
      { mask: `url(#${uid}-mask0)` },
      React.createElement(
        "mask",
        {
          id: `${uid}-mask1`,
          style: { maskType: "luminance" },
          maskUnits: "userSpaceOnUse",
          x: 8,
          y: 8,
          width: 16,
          height: 16,
        },
        React.createElement("path", {
          d: "M24 8H8V24H24V8Z",
          fill: "white",
        })
      ),
      React.createElement(
        "g",
        { mask: `url(#${uid}-mask1)` },
        React.createElement(
          "mask",
          {
            id: `${uid}-mask2`,
            style: { maskType: "luminance" },
            maskUnits: "userSpaceOnUse",
            x: 8,
            y: 8,
            width: 16,
            height: 16,
          },
          React.createElement("path", {
            d: "M24 8H8V24H24V8Z",
            fill: "white",
          })
        ),
        React.createElement(
          "g",
          { mask: `url(#${uid}-mask2)` },
          React.createElement("path", {
            d: "M9.06268 13.6067C8.80602 14.3567 8.66602 15.16 8.66602 15.9967C8.66602 20.0467 11.946 23.33 15.9993 23.33C16.836 23.33 17.6393 23.19 18.3893 22.9334",
            stroke,
          }),
          React.createElement("path", {
            d: "M13.6076 9.06321C11.8343 8.45655 10.2976 8.52321 9.41095 9.40988C7.65428 11.1632 9.11095 15.4732 12.661 19.0865L12.7843 19.2132C16.4243 22.8532 20.8143 24.3632 22.5876 22.5865C23.4743 21.6999 23.541 20.1599 22.9343 18.3899",
            stroke,
          }),
          React.createElement(
            "mask",
            {
              id: `${uid}-mask3`,
              style: { maskType: "alpha" },
              maskUnits: "userSpaceOnUse",
              x: 10,
              y: 8,
              width: 15,
              height: 14,
            },
            React.createElement("path", {
              fillRule: "evenodd",
              clipRule: "evenodd",
              d: "M24.0007 8H10.1207V10.28C9.85073 12.74 10.8407 15.3267 13.7607 18.2467C16.6807 21.1667 19.2707 22.1567 21.7274 21.89H24.0007V8Z",
              fill: "white",
            })
          ),
          React.createElement(
            "g",
            { mask: `url(#${uid}-mask3)` },
            React.createElement("path", {
              d: "M15.9993 23.3319C20.0494 23.3319 23.3326 20.0487 23.3326 15.9986C23.3326 11.9485 20.0494 8.66528 15.9993 8.66528C11.9492 8.66528 8.66602 11.9485 8.66602 15.9986C8.66602 20.0487 11.9492 23.3319 15.9993 23.3319Z",
              stroke,
            })
          )
        )
      )
    )
  );
}

function CloseIcon({ size = 16, color, className, style, ...rest }) {
  const uid = useId().replace(/:/g, "");
  const fill = color || "currentColor";
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 32 32",
      fill: "none",
      className,
      "aria-hidden": true,
      style: { ...style, color: fill },
      ...rest,
    },
    React.createElement(
      "g",
      { clipPath: `url(#${uid}-clip)` },
      React.createElement(
        "mask",
        {
          id: `${uid}-mask`,
          style: { maskType: "luminance" },
          maskUnits: "userSpaceOnUse",
          x: 0,
          y: 0,
          width: 32,
          height: 32,
        },
        React.createElement("path", {
          d: "M32 0H0V32H32V0Z",
          fill: "white",
        })
      ),
      React.createElement(
        "g",
        { mask: `url(#${uid}-mask)` },
        React.createElement("path", {
          d: "M21.1836 11.4414C21.2799 11.3346 21.3281 11.2148 21.3281 11.082C21.3281 10.9466 21.2799 10.8307 21.1836 10.7344C21.0873 10.6276 20.9701 10.5742 20.832 10.5742C20.694 10.5742 20.5768 10.6276 20.4805 10.7344L16 15.2148L11.5195 10.7344C11.4232 10.6276 11.306 10.5742 11.168 10.5742C11.0299 10.5742 10.9075 10.6276 10.8008 10.7344C10.7149 10.8307 10.6719 10.9466 10.6719 11.082C10.6719 11.2148 10.7149 11.3346 10.8008 11.4414L15.2969 15.9219L10.8008 20.3828C10.7149 20.4896 10.6719 20.6133 10.6719 20.7539C10.6719 20.8919 10.7149 21.0091 10.8008 21.1055C10.9075 21.1888 11.0299 21.2331 11.168 21.2383C11.306 21.2435 11.4232 21.1992 11.5195 21.1055L16 16.625L20.4805 21.1055C20.5768 21.1992 20.694 21.2461 20.832 21.2461C20.9701 21.2461 21.0873 21.1992 21.1836 21.1055C21.2799 21.0091 21.3281 20.8919 21.3281 20.7539C21.3281 20.6133 21.2799 20.4896 21.1836 20.3828L16.7031 15.9219L21.1836 11.4414Z",
          fill,
        })
      )
    ),
    React.createElement(
      "defs",
      null,
      React.createElement(
        "clipPath",
        { id: `${uid}-clip` },
        React.createElement("rect", { width: 32, height: 32, fill: "white" })
      )
    )
  );
}

const EYE_PATH =
  "M25.0576 15.958C24.4456 14.8513 23.6595 13.8926 22.6992 13.082C21.7389 12.2682 20.6826 11.6448 19.5303 11.2119C18.378 10.7757 17.2012 10.5576 16 10.5576C14.7988 10.5576 13.622 10.7757 12.4697 11.2119C11.3174 11.6448 10.2611 12.2682 9.30078 13.082C8.3405 13.8926 7.55436 14.8513 6.94238 15.958C6.87402 16.0785 6.83984 16.2087 6.83984 16.3486C6.83984 16.4886 6.87402 16.6253 6.94238 16.7588C7.55436 17.8525 8.3405 18.8128 9.30078 19.6396C10.2611 20.4665 11.3206 21.1029 12.4795 21.5488C13.6384 21.9948 14.8119 22.2178 16 22.2178C17.2012 22.2178 18.378 21.9948 19.5303 21.5488C20.6826 21.1029 21.7389 20.4697 22.6992 19.6494C23.6595 18.8291 24.4456 17.8655 25.0576 16.7588C25.126 16.6253 25.1602 16.4886 25.1602 16.3486C25.1602 16.2087 25.126 16.0785 25.0576 15.958ZM14.4619 20.8408C13.1794 20.5479 11.988 20.0156 10.8877 19.2441C9.7907 18.4694 8.90202 17.5221 8.22168 16.4023V16.2607C9.03548 14.9 10.1455 13.8209 11.5518 13.0234C12.958 12.2227 14.4407 11.8223 16 11.8223C17.5853 11.8223 19.0778 12.2259 20.4775 13.0332C21.8805 13.8373 22.9873 14.9196 23.7979 16.2803V16.4414C23.1208 17.5612 22.2353 18.5052 21.1416 19.2734C20.0479 20.0384 18.8679 20.5674 17.6016 20.8604C16.5599 21.0882 15.5134 21.0817 14.4619 20.8408ZM15.9805 21.0801C16.7682 21.0801 17.4909 20.8864 18.1484 20.499C18.8092 20.1117 19.3333 19.586 19.7207 18.9219C20.1081 18.2546 20.3018 17.527 20.3018 16.7393C20.3018 15.9515 20.1081 15.2288 19.7207 14.5713C19.3333 13.9105 18.8092 13.3864 18.1484 12.999C17.4909 12.6117 16.7682 12.418 15.9805 12.418C15.4857 12.418 15.0055 12.4994 14.54 12.6621C14.4065 12.7142 14.3398 12.7679 14.3398 12.8232C14.3398 12.8753 14.4131 12.9339 14.5596 12.999C14.8656 13.1455 15.1114 13.362 15.2969 13.6484C15.4857 13.9349 15.5801 14.2523 15.5801 14.6006C15.5801 15.0921 15.4059 15.5121 15.0576 15.8604C14.7125 16.2054 14.3008 16.3779 13.8223 16.3779C13.513 16.3779 13.2249 16.3014 12.958 16.1484C12.6911 15.9954 12.4779 15.792 12.3184 15.5381C12.2142 15.3786 12.1149 15.2988 12.0205 15.2988C11.9261 15.2988 11.8529 15.3851 11.8008 15.5576C11.6933 15.958 11.6396 16.3519 11.6396 16.7393C11.6396 17.527 11.8333 18.2546 12.2207 18.9219C12.6081 19.586 13.1338 20.1117 13.7979 20.499C14.4652 20.8864 15.1927 21.0801 15.9805 21.0801Z";

function EyeIcon({ size = 16, color, className, style, ...rest }) {
  const fill = color || "currentColor";
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 32 32",
      fill: "none",
      className,
      "aria-hidden": true,
      style: { ...style, color: fill },
      ...rest,
    },
    React.createElement("path", {
      d: EYE_PATH,
      fill: fill,
    })
  );
}

function EyeOffIcon({ size = 16, color, className, style, ...rest }) {
  const uid = useId().replace(/:/g, "");
  const fill = color || "currentColor";
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 32 32",
      fill: "none",
      className,
      "aria-hidden": true,
      style: { ...style, color: fill },
      ...rest,
    },
    React.createElement(
      "mask",
      {
        id: `${uid}-mask`,
        style: { maskType: "luminance" },
        maskUnits: "userSpaceOnUse",
        x: 6,
        y: 6,
        width: 20,
        height: 20,
      },
      React.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M6 6V26H26V6H6ZM9.2385 8.57328C9.564 8.24785 10.0916 8.24785 10.4171 8.57328L23.6753 21.8315C24.0007 22.157 24.0007 22.6846 23.6753 23.01C23.3499 23.3355 22.8222 23.3355 22.4968 23.01L9.2385 9.7518C8.9131 9.42636 8.9131 8.89872 9.2385 8.57328Z",
        fill: "white",
      })
    ),
    React.createElement(
      "g",
      { mask: `url(#${uid}-mask)` },
      React.createElement("path", {
        d: EYE_PATH,
        fill: fill,
      })
    ),
    React.createElement("path", {
      d: "M22.4219 23.0459L9.16365 9.78764",
      stroke: fill,
      strokeWidth: 1.5,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    })
  );
}

function CursorIcon({ size = 24, color, className, style, ...rest }) {
  const uid = useId().replace(/:/g, "");
  const fill = color || "currentColor";
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: 2,
      height: size,
      viewBox: "0 0 2 24",
      fill: "none",
      className,
      "aria-hidden": true,
      style: { ...style, color: fill },
      ...rest,
    },
    React.createElement(
      "g",
      { clipPath: `url(#${uid}-clip)` },
      React.createElement("path", {
        d: "M1.5 0.75C1.5 0.335786 1.16421 0 0.75 0C0.335786 0 0 0.335786 0 0.75V23.25C0 23.6642 0.335786 24 0.75 24C1.16421 24 1.5 23.6642 1.5 23.25V0.75Z",
        fill: fill,
      })
    ),
    React.createElement(
      "defs",
      null,
      React.createElement(
        "clipPath",
        { id: `${uid}-clip` },
        React.createElement("rect", { width: 1.5, height: 24, fill: "white" })
      )
    )
  );
}

// clock — Pixso export on a 14×14 artboard. The export carries four masks and a
// pile of fill-opacity="0" placeholders that paint nothing; only the ring and the
// hand carry pixels, so the artwork is transcribed as those two nodes. The 14
// artboard is drawn tight to the ink (~99% of the box) whereas Lucide's 24 grid
// pads 1 unit per side (~92%), so keeping the native viewBox at 14px reproduces
// the designer's size where Lucide's clock renders ~1px small and ~17% too bold.
const CLOCK_STROKE_WIDTH = 0.9975;

function ClockIcon({ size = 14, color, className, style, ...rest }) {
  const stroke = color || "currentColor";
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 14 14",
      fill: "none",
      className,
      "aria-hidden": true,
      style: { ...style, color: stroke },
      ...rest,
    },
    React.createElement("circle", {
      cx: 7,
      cy: 7,
      r: 6.416667,
      stroke,
      strokeWidth: CLOCK_STROKE_WIDTH,
    }),
    React.createElement("path", {
      d: "M7 2.90479L7 6.88604L8.9075 8.90729",
      stroke,
      strokeWidth: CLOCK_STROKE_WIDTH,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    })
  );
}

const CUSTOM_ICONS = {
  keyboard: KeyboardIcon,
  clock: ClockIcon,
  close: CloseIcon,
  eye: EyeIcon,
  "eye-off": EyeOffIcon,
  cursor: CursorIcon,
};

// ---- icon-plus (联通) online flow, same as packages/previewpc ----
const ICON_API_BASE = "https://octo.hdesign.huawei.com";
const GET_CONFIG = `${ICON_API_BASE}/assetRepository/iconPlus/getConfig`;
const GET_ICON_INFO = `${ICON_API_BASE}/assetRepository/iconPlus/getIconInfo`;
const GET_ICON = `${ICON_API_BASE}/assetRepository/iconPlus/getIcon`;

let plusState = null; // null = probing, true = icon-plus available, false = fall back to Lucide
let plusPromise = null; // singleton getConfig probe promise
let iconConfig = null;
let defaultColorId = "";
const iconInfoMap = {}; // name -> { name, url }
const svgCache = new Map(); // "name&variant&color" -> svg text

// variant prop -> getConfig style key (matches previewpc's shapeToStyleKey)
const STYLE_KEY = {
  lined: "border",
  filled: "filled",
  "two-tone": "two_colors1",
  circle: "round_bottom2",
  square: "square_bottom2",
};

function getStyleValue(styleKey) {
  return iconConfig?.style?.find((s) => s.key === styleKey)?.value || styleKey;
}

// resolve an API color id from the requested hex against getConfig colors
function resolveColorId(variant, colorHex) {
  const styleValue = getStyleValue(STYLE_KEY[variant] || "border");
  const colors = (iconConfig?.colors || []).filter((c) => c.style === styleValue);
  if (colorHex) {
    const m = colors.find((c) =>
      c.value.split(",").map((v) => v.trim()).includes(colorHex)
    );
    if (m) return m.id;
  }
  return defaultColorId || colors[0]?.id || "";
}

// getConfig probe == 联通可用性验证 (same as previewpc fetchIconConfig)
function ensurePlus() {
  if (plusPromise) return plusPromise;
  plusPromise = (async () => {
    try {
      const resp = await fetch(GET_CONFIG);
      if (!resp.ok) {
        plusState = false;
        return false;
      }
      iconConfig = await resp.json();
      const linear = iconConfig.colors?.find(
        (c) => c.type === "linear" || c.type === "通用色"
      );
      defaultColorId =
        linear?.id || iconConfig.colors?.[0]?.id || "";
      plusState = true;
      return true;
    } catch (e) {
      plusState = false;
      return false;
    }
  })();
  return plusPromise;
}

// pick the best icon-plus match for a keyword (prefer system-icon group, then name contains keyword, else first)
function selectBestIcon(icons, keyword) {
  return (
    icons.find(
      (i) => Array.isArray(i.group) && i.group.some((g) => g.includes("系统图标"))
    ) ||
    icons.find((i) => i.name?.toLowerCase().includes(keyword.toLowerCase())) ||
    icons[0]
  );
}

// name -> { name, url } via getIconInfo (cached in iconInfoMap)
async function resolveIconInfo(name) {
  if (iconInfoMap[name]) return iconInfoMap[name];
  try {
    const resp = await fetch(
      `${GET_ICON_INFO}?keyword=${encodeURIComponent(name)}&topK=2&source_id=6`
    );
    const data = await resp.json(); // [{ keyword, icons: [{ icon_id, name, category, group[], url }] }]
    const entry = (Array.isArray(data) ? data : [data]).find(
      (d) => d.icons?.length
    );
    const selected = selectBestIcon(entry?.icons || [], name);
    if (!selected?.url) return null;
    iconInfoMap[name] = { name: selected.name, url: selected.url };
    return iconInfoMap[name];
  } catch (e) {
    return null;
  }
}

// fetch the SVG text for a name via getIcon (url + size + variant + colorId + fileType=svg)
async function fetchSvg(name, variant, colorHex) {
  const info = await resolveIconInfo(name);
  if (!info) return "";
  const styleValue = getStyleValue(STYLE_KEY[variant] || "border");
  const colorId = resolveColorId(variant, colorHex);
  try {
    const resp = await fetch(
      `${GET_ICON}?url=${encodeURIComponent(info.url)}&size=16&style=${encodeURIComponent(
        styleValue
      )}&color=${encodeURIComponent(colorId)}&fileType=svg`
    );
    const data = await resp.json(); // { url, name, data } or array
    const item = Array.isArray(data) ? data[0] : data;
    return item?.data || ""; // raw SVG text, injected as-is
  } catch (e) {
    return "";
  }
}

export function Icon({
  name,
  src,
  size = 16,
  color,
  className = "",
  style,
  strokeWidth = 2,
  variant = "lined",
}) {
  const [plus, setPlus] = useState(plusState); // reuse already-probed result
  const [svg, setSvg] = useState(
    () => svgCache.get(`${name}&${variant}&${color}`) || ""
  );

  useEffect(() => {
    if (src || CUSTOM_ICONS[name]) return; // local artwork does not need the network
    let alive = true;
    ensurePlus().then((ok) => {
      if (!alive) return;
      setPlus(ok);
      if (!ok) return; // getConfig probe failed → Lucide branch
      const key = `${name}&${variant}&${color}`;
      if (svgCache.has(key)) {
        setSvg(svgCache.get(key));
        return;
      }
      fetchSvg(name, variant, color).then((s) => {
        if (!alive) return;
        svgCache.set(key, s);
        setSvg(s);
      });
    });
    return () => {
      alive = false;
    };
  }, [src, name, variant, color]);

  // Debug/test hooks: component identity + props snapshot on the root element
  const dataAttrs = {
    "data-component": "Icon",
    "data-props": JSON.stringify({ name, src, size, color, variant, strokeWidth }),
  };

  // Exact InputBox artwork takes priority over network and Lucide fallbacks.
  if (name && CUSTOM_ICONS[name]) {
    return React.createElement(CUSTOM_ICONS[name], {
      size, color, className, style, ...dataAttrs,
    });
  }

  // user-provided asset (svg/png/jpg) via relative path — overrides name when both are set
  if (src) {
    return React.createElement("img", {
      src: src,
      ...dataAttrs,
      width: size,
      height: size,
      className: className,
      alt: "",
      "aria-hidden": true,
      style: { ...style, display: "inline-block", verticalAlign: "middle" },
    });
  }

  // probe not finished yet → render nothing
  if (plus === null) return null;

  // icon-plus unavailable (offline) → Lucide fallback (original behavior)
  if (plus === false) {
    const nodes = lookupIcon(name);
    if (!nodes) return null;
    return React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        ...dataAttrs,
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        strokeWidth: strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className,
        "aria-hidden": true,
        style: { ...style, stroke: color || "currentColor" },
      },
      nodes.map(([tag, attrs], i) =>
        React.createElement(tag, { key: i, ...attrs })
      )
    );
  }

  // icon-plus available → render fetched SVG text as-is (only width/height on the wrapper)
  if (!svg) {
    return React.createElement("span", {
      ...dataAttrs,
      className,
      "aria-hidden": true,
      style: { ...style, width: size, height: size },
    });
  }

  return React.createElement("span", {
    ...dataAttrs,
    className,
    "aria-hidden": true,
    style: { ...style, width: size, height: size },
    dangerouslySetInnerHTML: { __html: svg },
  });
}
