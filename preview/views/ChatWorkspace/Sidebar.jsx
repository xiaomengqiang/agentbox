import React, { useState } from "react";
import Button from "../../components/Button/index.jsx";
import SearchBar from "../../components/SearchBar/index.jsx";
import { Icon } from "../../assets/shared/icons.js";

const FEATURES = [
  { id: "chat", icon: "message-square", label: "智能对话" },
  { id: "code", icon: "code", label: "代码助手" },
  { id: "writing", icon: "pen-line", label: "文案创作" },
  { id: "library", icon: "library", label: "知识库" },
];

const HISTORY = [
  {
    group: "今天",
    items: [
      { id: "h1", label: "Agentbox 组件库重构方案" },
      { id: "h2", label: "ChatComposer 输入框联调" },
    ],
  },
  {
    group: "昨天",
    items: [
      { id: "h3", label: "周报生成与润色" },
      { id: "h4", label: "SQL 查询优化建议" },
    ],
  },
  {
    group: "更早",
    items: [
      { id: "h5", label: "产品命名头脑风暴" },
      { id: "h6", label: "旅行计划:成都三日" },
      { id: "h7", label: "会议纪要整理" },
    ],
  },
];

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      className={`cw-nav-item${active ? " cw-nav-item--active" : ""}`}
      onClick={onClick}
    >
      <Icon name={icon} size={16} />
      <span className="cw-nav-label">{label}</span>
    </button>
  );
}

export default function Sidebar() {
  const [keyword, setKeyword] = useState("");
  const [activeId, setActiveId] = useState("chat");
  const query = keyword.trim().toLowerCase();
  const groups = HISTORY.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.label.toLowerCase().includes(query)),
  })).filter((group) => group.items.length > 0);

  return (
    <aside className="cw-sidebar">
      <div className="cw-brand">
        <span className="cw-brand-logo">
          <Icon name="sparkles" size={16} />
        </span>
        <span className="cw-brand-name">AgentBox</span>
        <button type="button" className="cw-collapse" aria-label="折叠侧栏">
          <Icon name="panel-left" size={16} />
        </button>
      </div>

      <div className="cw-new-chat">
        <Button icon="./assets/uploads/icon/function/add.svg" className="cw-new-chat-btn">
          新对话
        </Button>
      </div>

      <div className="cw-search">
        <SearchBar
          size="small"
          variant="unfilled"
          placeholder="搜索历史会话"
          value={keyword}
          onChange={setKeyword}
        />
      </div>

      <nav className="cw-section">
        <p className="cw-section-title">功能</p>
        {FEATURES.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeId === item.id}
            onClick={() => setActiveId(item.id)}
          />
        ))}
      </nav>

      <div className="cw-history">
        <p className="cw-section-title">历史记录</p>
        {groups.length === 0 && <p className="cw-history-empty">没有匹配的会话</p>}
        {groups.map((group) => (
          <section key={group.group} className="cw-history-group">
            <p className="cw-group-label">{group.group}</p>
            {group.items.map((item) => (
              <NavItem
                key={item.id}
                icon="message-square"
                label={item.label}
                active={activeId === item.id}
                onClick={() => setActiveId(item.id)}
              />
            ))}
          </section>
        ))}
      </div>

      <div className="cw-sidebar-footer">
        <div className="cw-user">
          <span className="cw-avatar">Q</span>
          <span className="cw-user-name">汪同学</span>
        </div>
        <button type="button" className="cw-settings" aria-label="设置">
          <Icon name="settings" size={16} />
        </button>
      </div>
    </aside>
  );
}
