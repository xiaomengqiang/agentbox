# ArtifactSummary

流式对话中的产物汇总大组件，垂直展示文件附件和代码修改两张卡片。

## Features

- 文件卡片支持按 `PDF`、`DOCX`、`XLSX`、`PPTX` 等类型自动选择图标。
- 代码修改卡片复用 `DiffTags` 展示新增和删除文件数。
- 操作区复用 `DropdownButton` 与 `Button`，支持打开、撤销和审核回调。
- 卡片宽度跟随父容器，标题过长时单行省略。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `file` | `{ title, fileType?, iconSrc? }` | 文件名称.PPTX / PPTX | 文件附件数据 |
| `changes` | `{ fileCount, added, removed }` | `3 / 128 / 64` | 代码修改数据 |
| `onOpen` | `function` | — | 点击打开方式时触发 |
| `onUndo` | `function` | — | 点击撤销时触发 |
| `onReview` | `function` | — | 点击审核时触发 |

## Usage

```jsx
import ArtifactSummary from "./components/ArtifactSummary/index.jsx";

<ArtifactSummary
  file={{ title: "文件名称.PPTX", fileType: "PPTX" }}
  changes={{ fileCount: 3, added: 128, removed: 64 }}
  onOpen={() => setOpenMenu(true)}
  onUndo={handleUndo}
  onReview={handleReview}
/>
```
