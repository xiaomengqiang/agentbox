// 公共预览样式(scaffold 内 style/,side-effect 引入,由构建器内联;token 来自 assets/style)
import "./style/documentation.css";
import "./style/button-gallery.css";
import "./style/button-tables.css";
import "./style/compact.css";
import "./style/section-layout.css";
import "./style/color-spec.css";
import "./demo.css";

import React, { useState } from "react";

// 组件预览视图(每个原子组件一个 view)
import ButtonPreview from "./views/Button/index.jsx";
import DropdownButtonPreview from "./views/DropdownButton/index.jsx";
import SegmentedPreview from "./views/Segmented/index.jsx";
import TextFieldsPreview from "./views/TextFields/index.jsx";
import SearchBarPreview from "./views/SearchBar/index.jsx";
import ActionChipPreview from "./views/ActionChip/index.jsx";
import TagPreview from "./views/Tag/index.jsx";
import ChipPreview from "./views/Chip/index.jsx";
import TabPreview from "./views/Tab/index.jsx";
import SwitchPreview from "./views/Switch/index.jsx";
import CheckboxPreview from "./views/Checkbox/index.jsx";
import IconButtonPreview from "./views/IconButton/index.jsx";
import MenuItemPreview from "./views/MenuItem/index.jsx";

// view 样式在组件样式之后引入,保证预览覆盖(强制状态等)优先生效
import "./views/Button/index.css";
import "./views/DropdownButton/index.css";
import "./views/Segmented/index.css";
import "./views/TextFields/index.css";
import "./views/SearchBar/index.css";
import "./views/ActionChip/index.css";
import "./views/Tag/index.css";
import "./views/Chip/index.css";
import "./views/Tab/index.css";
import "./views/Switch/index.css";
import "./views/Checkbox/index.css";
import "./views/IconButton/index.css";
import "./views/MenuItem/index.css";

const viewItems = [
  { id: "button", label: "Button", node: <ButtonPreview /> },
  { id: "dropdown-button", label: "DropdownButton", node: <DropdownButtonPreview /> },
  { id: "segmented", label: "Segmented", node: <SegmentedPreview /> },
  { id: "text-fields", label: "TextFields", node: <TextFieldsPreview /> },
  { id: "searchbar", label: "SearchBar", node: <SearchBarPreview /> },
  { id: "action-chip", label: "ActionChip", node: <ActionChipPreview /> },
  { id: "tag", label: "Tag", node: <TagPreview /> },
  { id: "chip", label: "Chip", node: <ChipPreview /> },
  { id: "tab", label: "Tab", node: <TabPreview /> },
  { id: "switch", label: "Switch", node: <SwitchPreview /> },
  { id: "checkbox", label: "Checkbox", node: <CheckboxPreview /> },
  { id: "icon-button", label: "IconButton", node: <IconButtonPreview /> },
  { id: "menu-item", label: "MenuItem", node: <MenuItemPreview /> },
];

function DemoMenu({ items, activeId, onChange }) {
  return (
    <nav className="demo-menu">
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            className={`demo-menu__item${active ? " demo-menu__item--active" : ""}`}
            aria-current={active ? "page" : undefined}
            onClick={() => onChange(item)}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export default function Demo() {
  const [activeId, setActiveId] = useState(viewItems[0].id);
  const active = viewItems.find((item) => item.id === activeId) || viewItems[0];
  return (
    <div className="demo-shell">
      <header className="demo-topbar">
        <h2 className="demo-topbar__title">Atom Components 组件总览</h2>
      </header>
      <div className="demo-body">
        <DemoMenu
          items={viewItems.map(({ id, label }) => ({ id, label }))}
          activeId={activeId}
          onChange={(item) => setActiveId(item.id)}
        />
        <main className="demo-main">
          <div className="components-content">{active.node}</div>
        </main>
      </div>
    </div>
  );
}
