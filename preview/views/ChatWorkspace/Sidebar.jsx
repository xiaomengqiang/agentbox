import React, { useState, useEffect, useRef } from "react";
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

// 在树中按 id 将节点置为展开/收起(不可变更新,未命中时返回原引用)
function setExpandedDeep(nodes, id, expanded) {
  let changed = false;
  const next = nodes.map((node) => {
    if (node.id === id) {
      changed = true;
      return { ...node, expanded };
    }
    if (node.children) {
      const children = setExpandedDeep(node.children, id, expanded);
      if (children !== node.children) {
        changed = true;
        return { ...node, children };
      }
    }
    return node;
  });
  return changed ? next : nodes;
}

// 标签截断:超长时截取为「前 n 字 + …」形式(子菜单项标签区约容 14 个中文字符)
function truncateLabel(text, n) {
  const t = (text || "").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}

// 在目标节点下追加子节点并展开父节点(不可变更新)
function appendChildDeep(nodes, parentId, child) {
  let changed = false;
  const next = nodes.map((node) => {
    if (node.id === parentId) {
      changed = true;
      return { ...node, expanded: true, children: [...(node.children || []), child] };
    }
    if (node.children) {
      const children = appendChildDeep(node.children, parentId, child);
      if (children !== node.children) {
        changed = true;
        return { ...node, children };
      }
    }
    return node;
  });
  return changed ? next : nodes;
}

export default function Sidebar({ mode = "office", onModeChange, sessionTitle, sessionId }) {
  const [activeId, setActiveId] = useState("new-chat");
  // 项目/对话菜单树:支持在任意节点下创建子对话(新建对话)
  const [projects, setProjects] = useState(PROJECTS);
  const [conversations, setConversations] = useState(CONVERSATIONS);

  // 新会话开始(cs-title 生成):在首个项目下自动创建「新对话」子节点,
  // 标签同步会话标题(与 cs-title 同源,超长截断为…)并携带显示器图标,同时选中;
  // 同一会话(sessionId)只创建一次;主菜单「新建对话」标签始终保持不变
  const handledSessionsRef = useRef(new Set());
  useEffect(() => {
    if (!sessionId || !sessionTitle || handledSessionsRef.current.has(sessionId)) return;
    handledSessionsRef.current.add(sessionId);
    const childId = `chat-${Date.now()}`;
    const child = {
      id: childId,
      label: truncateLabel(sessionTitle, 14),
      trailingIcon: MONITOR_ICON,
    };
    setProjects((list) => appendChildDeep(list, PROJECTS[0].id, child));
    setActiveId(childId);
  }, [sessionId, sessionTitle]);

  // 点击行内「新建对话」:在目标节点下创建子节点,展开父节点并选中新子节点
  // 子菜单项形态:纯文本 + 右侧显示器图标(同 conv-1 的 MONITOR_ICON,表示会话进行中)
  const createChildChat = (setter) => (item) => {
    const childId = `chat-${Date.now()}`;
    const count = (item.children || []).length;
    const child = {
      id: childId,
      label: count ? `新对话 ${count + 1}` : "新对话",
      trailingIcon: MONITOR_ICON,
    };
    setter((list) => appendChildDeep(list, item.id, child));
    setActiveId(childId);
  };

  // 展开/收起箭头:同步树节点的 expanded 状态
  const toggleNode = (setter) => (item) => setter((list) => setExpandedDeep(list, item.id, item.expanded));

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
          items={projects}
          level="level-1"
          dropdownIcon={false}
          leadingIcon
          trailingIcon
          activeId={activeId}
          onSelect={(item) => setActiveId(item.id)}
          onToggle={toggleNode(setProjects)}
          onTrailingAction={(item) => console.log("项目更多操作", item.id)}
          onNewChatAction={createChildChat(setProjects)}
        />
      </div>

      <div className="cw-section cw-conversations">
        <p className="cw-section-title">对话</p>
        <MenuItem
          items={conversations}
          level="level-1"
          dropdownIcon={false}
          leadingIcon={false}
          trailingIcon
          newChatAction={false}
          activeId={activeId}
          onSelect={(item) => setActiveId(item.id)}
          onToggle={toggleNode(setConversations)}
          onNewChatAction={createChildChat(setConversations)}
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
