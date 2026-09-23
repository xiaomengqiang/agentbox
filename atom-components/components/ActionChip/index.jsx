import React from "react";
import "./index.css";

export const actionChipIcons = {
  skill: "./assets/uploads/icon/prompt input/skill.svg",
  connector: "./assets/uploads/icon/prompt input/connector.svg",
  expert: "./assets/uploads/icon/prompt input/expert.svg",
};

export default function ActionChip({ label, icon = "skill", onClick, className = "" }) {
  const source = actionChipIcons[icon] || actionChipIcons.skill;
  return (
    <button type="button" className={`ac-chip ${className}`} onClick={onClick}>
      <span className="ac-chip-icon" aria-hidden="true">
        <span className="ac-chip-glyph ac-chip-glyph-default" style={{ maskImage: `url("${source}")`, WebkitMaskImage: `url("${source}")` }} />
        <span className="ac-chip-glyph ac-chip-glyph-close" />
      </span>
      <span className="ac-chip-label">{label}</span>
    </button>
  );
}
