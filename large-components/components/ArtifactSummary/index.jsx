import React from "react";
import { Icon } from "../../../assets/shared/large-icons.js";
// Atoms are consumed from the shared atomic component library (single source of truth).
import Button from "../../../atom-components/components/Button/index.jsx";
import DropdownButton from "../../../atom-components/components/DropdownButton/index.jsx";
import { DiffTags } from "../../../atom-components/components/Tag/index.jsx";
import "./index.css";

const FILE_TYPE_ICONS = {
  PDF: "./assets/uploads/icon/file_type/pdf.svg",
  DOCX: "./assets/uploads/icon/file_type/docx.svg",
  XLSX: "./assets/uploads/icon/file_type/excel.svg",
  PPTX: "./assets/uploads/icon/file_type/ppt.svg",
  CSV: "./assets/uploads/icon/file_type/cvs.svg",
  MD: "./assets/uploads/icon/file_type/markdown.svg",
  TXT: "./assets/uploads/icon/file_type/txt.svg",
};

const CODE_ICON_SRC = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMjAzN18yKSI+PHBhdGggZD0iTTI1Ljk1ODUgMTIuMDczNEwyNS45NTg0IDIxLjI5MTVDMjUuOTU4NCAyMy44Njg5IDIzLjg2OTEgMjUuOTU4MiAyMS4yOTE4IDI1Ljk1ODJINi43MDg0MUM0LjEzMTA5IDI1Ljk1ODIgMi4wNDE3NSAyMy44Njg4IDIuMDQxNzUgMjEuMjkxNVY2LjcwODE3QzIuMDQxNzUgNC4xMzA4NCA0LjEzMTA5IDIuMDQxNSA2LjcwODQxIDIuMDQxNUgyMS4yOTE3QzIzLjg2OTEgMi4wNDE1IDI1Ljk1ODQgNC4xMzA4NCAyNS45NTg0IDYuNzA4MTdWOC4wMjA2NyIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLW9wYWNpdHk9IjAuNiIgc3Ryb2tlLXdpZHRoPSIxLjc1Ii8+PHBhdGggZD0iTTkuNDAwMzkgOS43NUw2Ljg5NjU2IDEyLjI1MDdDNi4wMDc5NCAxMy4xMzgyIDUuOTgxMjEgMTQuNTY5OSA2LjgzNjA4IDE1LjQ4OTlMOS40MDAzOSAxOC4yNDk3IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utb3BhY2l0eT0iMC42IiBzdHJva2Utd2lkdGg9IjEuNzUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xOC42NTA2IDkuNzVMMjEuMTU0NSAxMi4yNTA3QzIyLjA0MzEgMTMuMTM4MiAyMi4wNjk4IDE0LjU2OTkgMjEuMjE0OSAxNS40ODk5TDE4LjY1MDYgMTguMjQ5NyIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLW9wYWNpdHk9IjAuNiIgc3Ryb2tlLXdpZHRoPSIxLjc1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTIuMjAxNyAyMC4yMzI0TDE2LjQxMTcgNy4xMTMyMyIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLW9wYWNpdHk9IjAuNiIgc3Ryb2tlLXdpZHRoPSIxLjc1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L2c+PGRlZnM+PGNsaXBQYXRoIGlkPSJjbGlwMF8yMDM3XzIiPjxyZWN0IHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0id2hpdGUiLz48L2NsaXBQYXRoPjwvZGVmcz48L3N2Zz4=";

function ArtifactIcon({ src, name, className }) {
  return (
    <span className="artifact-summary__icon-well" aria-hidden="true">
      {src ? <Icon src={src} size={28} className={className} /> : <Icon name={name || "file"} size={28} strokeWidth={2} className={className} />}
    </span>
  );
}

export function FileArtifactCard({ title, fileType = "PPTX", iconSrc, onOpen }) {
  const normalizedType = String(fileType).toUpperCase();
  const resolvedIcon = iconSrc || FILE_TYPE_ICONS[normalizedType];
  return (
    <article className="artifact-summary__card">
      <ArtifactIcon src={resolvedIcon} name="file" />
      <div className="artifact-summary__content artifact-summary__file-content">
        <div className="artifact-summary__title" title={title}>{title}</div>
        <div className="artifact-summary__meta">{normalizedType}</div>
      </div>
      <DropdownButton
        variant="outlined"
        size="xs"
        className="artifact-summary__open"
        aria-label={`打开 ${title}`}
        onClick={onOpen}
      >
        打开方式
      </DropdownButton>
    </article>
  );
}

export function CodeChangeCard({ fileCount, added, removed, onUndo, onReview }) {
  return (
    <article className="artifact-summary__card">
      <ArtifactIcon src={CODE_ICON_SRC} className="artifact-summary__code-icon" />
      <div className="artifact-summary__content artifact-summary__code-content">
        <div className="artifact-summary__title">编辑了 {fileCount} 个文件</div>
        <DiffTags added={added} removed={removed} />
      </div>
      <div className="artifact-summary__actions">
        <Button variant="text" size="small" className="artifact-summary__undo" onClick={onUndo}>撤销</Button>
        <Button variant="outlined" size="small" shape="square" className="artifact-summary__review" onClick={onReview}>审核</Button>
      </div>
    </article>
  );
}

export default function ArtifactSummary({ file, changes, onOpen, onUndo, onReview }) {
  const fileData = file || { title: "文件名称.PPTX", fileType: "PPTX" };
  const changeData = changes || { fileCount: 3, added: 128, removed: 64 };
  return (
    <section className="artifact-summary" aria-label="产物汇总">
      <h2 className="artifact-summary__heading">产物汇总</h2>
      <div className="artifact-summary__list">
        <FileArtifactCard {...fileData} onOpen={onOpen} />
        <CodeChangeCard {...changeData} onUndo={onUndo} onReview={onReview} />
      </div>
    </section>
  );
}
