import React from "react";

// Shared Button-style documentation. These are documentation aliases, not component styles.
const references = {
  "--color-font-primary": "→ --primary-90", "--color-font-secondary": "→ --primary-60",
  "--color-font-tertiary": "→ --primary-40", "--color-font-fourth": "→ --primary-20",
  "--color-icon-primary": "→ --primary-90", "--color-icon-secondary": "→ --primary-60",
  "--color-icon-tertiary": "→ --primary-40", "--color-icon-fourth": "→ --primary-20",
  "--color-font-emphasize": "→ --brand-font", "--color-icon-emphasize": "→ --brand-font",
  "--color-background-primary": "Light → --white；Dark → --black",
  "--color-comp-background-primary": "Light → --white；Dark → --gray-02",
  "--color-comp-background-secondary": "→ --container-10",
  "--color-comp-background-tertiary": "Light → --container-05；Dark → --container-10",
  "--color-comp-background-emphasize": "→ --brand", "--color-comp-emphasize-tertiary": "→ --brand-10",
  "--color-fg-unchecked": "→ --on-primary-20",
  "--color-comp-border": "→ --container-15", "--color-comp-border-hover": "→ --container-20",
  "--color-comp-border-focus": "→ --brand", "--color-interactive-hover": "Light → --container-05；Dark → --container-10",
  "--color-interactive-pressed": "Light → --container-10；Dark → --container-15",
  "--on-surface": "→ --color-font-primary → --primary-90",
  "--text-primary": "→ --color-font-primary → --primary-90", "--text-secondary": "→ --color-font-secondary → --primary-60",
  "--text-tertiary": "→ --color-font-tertiary → --primary-40", "--text-placeholder": "→ --color-font-tertiary → --primary-40",
  "--text-disabled": "→ --color-font-fourth → --primary-20", "--text-error": "→ --color-error", "--error": "→ --color-error",
  "--focus-ring": "→ --color-comp-border-focus → --brand",
  "--surface-container": "→ --color-comp-background-tertiary；Light → --container-05；Dark → --container-10",
  "--surface-container-lowest": "→ --color-background-primary；Light → --white；Dark → --black",
  "--primary-hover": "→ --brand-80", "--primary-active": "→ --brand",
  "--primary": "Light theme.css → --brand；Dark base.css → #FFFFFF",
  "--color-success": "Light #64BB5C；Dark #5BA854", "--color-success-container": "Light #EDF7EB；Dark #20351F",
  "--color-error": "Light #E84026；Dark #E85B49", "--color-error-container": "Light #FDEBEB；Dark #3D211E",
};

export const color = (label, detail) => ({ label, detail });
export const same = detail => ({ same: true, detail });

export function ColorSpecCell({ value }) {
  if (Array.isArray(value)) return <>{value.map((entry, i) => <ColorSpecCell key={i} value={entry} />)}</>;
  if (React.isValidElement(value)) return value;
  if (value == null || value.same) return <div className="color-spec-value"><span className="btn-color-same">同 Default</span>{value?.detail && <small className="btn-table-src">{value.detail}</small>}</div>;
  const entry = typeof value === "string" ? { label: value } : value;
  const label = entry.label || entry.token;
  const token = entry.token || label?.match(/--[\w-]+/)?.[0];
  const transparent = label === "transparent" || label === "透明";
  const none = label === "none" || label === "—";
  const literal = /^(#|rgba?\(|hsla?\()/.test(label || "");
  const source = token ? (references[token] || (/^--(brand|primary-|on-primary|container-|white|black)/.test(token) ? "base.css · 基础色值" : "")) : literal ? "固定色值" : "";
  const swatch = entry.css || (token ? `var(${token})` : literal ? label : undefined);
  return <div className="color-spec-value">
    <span className="btn-color-token">
      {(swatch || transparent || none) && <i aria-hidden="true" className={`btn-color-swatch${transparent ? " btn-color-swatch--transparent" : ""}${none ? " btn-color-swatch--none" : ""}`} style={!transparent && !none ? { background: swatch } : undefined} />}
      {none ? <span>—</span> : <code>{transparent ? "transparent" : label}</code>}
    </span>
    {(source || entry.detail || none || transparent) && <span className="btn-table-src">{[entry.detail || (none ? "无描边" : transparent ? "透明" : ""), source].filter(Boolean).join(" · ")}</span>}
  </div>;
}

export default function ColorSpec({ groups, description = "按 Variant 分组，逐项对比 State、Background、Outline 与 Text。未变化的属性标记为“同 Default”。", textHeading = "Text", children }) {
  return <section className="demo-section color-spec-section">
    <div className="demo-section-header"><h2 className="demo-section-name">Color spec</h2><span className="demo-section-tag">语义令牌</span></div>
    <p className="demo-section-desc">{description}</p>
    <div className="btn-table-wrap"><table className="btn-table btn-table--color">
      <thead><tr>{["Variant", "State", "Background", "Outline", textHeading].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
      <tbody>{groups.map(group => group.rows.map((row, index) => <tr key={`${group.name}-${row.label}`} className={index === 0 ? "btn-color-group-start" : undefined}>
        {index === 0 && <th className="btn-color-variant" scope="rowgroup" rowSpan={group.rows.length}>{group.name}</th>}
        <td className="btn-color-state">{row.label}{row.note && <small>{row.note}</small>}</td>
        <td><ColorSpecCell value={row.background} /></td><td><ColorSpecCell value={row.outline} /></td><td><ColorSpecCell value={row.text} /></td>
      </tr>))}</tbody>
    </table></div>{children}
  </section>;
}
