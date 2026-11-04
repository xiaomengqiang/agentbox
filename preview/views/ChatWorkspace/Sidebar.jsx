import React, { useState } from "react";
import "./index.css";
import Segmented from "../../components/Segmented/index.jsx";
import MenuItem from "../../components/MenuItem/index.jsx";
import { Icon } from "../../components/Icon/index.jsx";

// 顶部模式切换：日常办公 / 代码开发
const MODES = [
  { value: "office", label: "日常办公", icon: <Icon mask="./assets/uploads/icon/mode/daily-work.svg" size={16} /> },
  { value: "code", label: "代码开发", icon: <Icon mask="./assets/uploads/icon/mode/developer.svg" size={16} /> },
];

// 主菜单：新建对话 + 定时任务 / 插件 / 更多
const MENU_ITEMS = [
  { id: "new-chat", label: "新建对话", iconSrc: "./assets/uploads/icon/sidebar/new-chat.svg" },
  { id: "scheduled-task", label: "定时任务", iconSrc: "./assets/uploads/icon/sidebar/scheduled-task.svg" },
  { id: "plugin", label: "插件", iconSrc: "./assets/uploads/icon/sidebar/plugin.svg" },
  { id: "more", label: "更多", iconSrc: "./assets/uploads/sidebar-more-circle.svg" },
];

// 项目文件（可交互）
const PROJECTS = [
  { id: "project-agentbox", label: "Agentbox 组件库重构", iconSrc: "./assets/uploads/icon/sidebar/folder-close.svg" },
  { id: "project-landing", label: "营销活动落地页", iconSrc: "./assets/uploads/icon/sidebar/folder-close.svg" },
];

// 对话 trailing 图标
const CLOUD_ICON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.70773 6.24715C3.91116 4.23531 5.56226 2.66675 7.56896 2.66675C9.26166 2.66675 10.7014 3.78288 11.2326 5.33978L11.3368 5.33511L11.4513 5.33341C13.5955 5.33341 15.3337 7.12428 15.3337 9.33341C15.3337 11.5425 13.5955 13.3334 11.4513 13.3334H4.11796C2.21205 13.3334 0.666992 11.7415 0.666992 9.77785C0.666992 7.95721 1.99519 6.45615 3.70773 6.24715Z" strokeLinejoin="round" stroke="black" strokeOpacity="0.4"/></svg>
);
const MONITOR_ICON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.5" y="3" width="13" height="9" rx="1.5" stroke="black" strokeOpacity="0.4" strokeLinejoin="round"/><path d="M8 12v2.5" stroke="black" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.5 14.5h5" stroke="black" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

// 对话历史
const CONVERSATIONS = [
  { id: "conv-1", label: "ChatComposer 输入框联调", statusDot: true, trailingIcon: MONITOR_ICON },
  { id: "conv-2", label: "周报生成与润色", trailingIcon: CLOUD_ICON },
  { id: "conv-3", label: "SQL 查询优化建议", trailingIcon: CLOUD_ICON },
];

export default function Sidebar({ mode = "office", onModeChange }) {
  const [activeId, setActiveId] = useState("new-chat");

  return (
    <aside className="cw-sidebar" data-active={activeId}>
      <div className="cw-brand">
        <span className="cw-brand-logo">
          <img src="./assets/uploads/workbench-logo.png" alt="" className="cw-brand-image" />
        </span>
        <span className="cw-brand-name">智能体一体机统一工作台</span>
        <div className="cw-brand-actions">
          <button type="button" className="cw-collapse" aria-label="搜索">
            <Icon mask="./assets/uploads/workbench-search.svg" size={28} />
          </button>
          <button type="button" className="cw-collapse" aria-label="收起导航栏">
            <Icon mask="./assets/uploads/workbench-collapse.svg" size={28} />
          </button>
        </div>
      </div>

      <div className="cw-mode">
        <Segmented block options={MODES} value={mode} onChange={onModeChange} />
      </div>

      <div className="cw-menu">
        <MenuItem
          items={MENU_ITEMS}
          level="level-1"
          dropdownIcon={false}
          leadingIcon
          onSelect={(item) => setActiveId(item.id)}
        />
      </div>

      <div className="cw-section">
        <p className="cw-section-title">项目</p>
        <MenuItem
          items={PROJECTS}
          level="level-1"
          dropdownIcon={false}
          leadingIcon
          trailingIcon
          onSelect={(item) => setActiveId(item.id)}
          onTrailingAction={(item) => console.log("项目更多操作", item.id)}
        />
      </div>

      <div className="cw-section cw-conversations">
        <p className="cw-section-title">对话</p>
        <MenuItem
          items={CONVERSATIONS}
          level="level-1"
          dropdownIcon={false}
          leadingIcon={false}
          trailingIcon
          onSelect={(item) => setActiveId(item.id)}
        />
      </div>

      <div className="cw-sidebar-footer">
        <div className="cw-user">
          <img className="cw-avatar" src="./assets/uploads/workbench-avatar.png" alt="用户头像" />
          <span className="cw-user-name">user_123</span>
        </div>
        <button type="button" className="cw-settings" aria-label="用户更多操作">
          <Icon mask="./assets/uploads/user-more.svg" size={32} />
        </button>
      </div>
    </aside>
  );
}
