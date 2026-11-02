import React from "react";
import Sidebar from "./Sidebar.jsx";
import ChatComposer from "../ChatComposer/index.jsx";
import { Icon } from "../../components/Icon/index.jsx";
import "./index.css";

/* 底部快捷能力胶囊:src 为产品资源插画,未提供资源的项回退 Lucide 线性图标 */
const CAPABILITIES = [
  { id: "doc", label: "文档", icon: "file-text", src: "./assets/uploads/document.svg" },
  { id: "slides", label: "幻灯片", icon: "presentation", src: "./assets/uploads/slides.svg" },
  { id: "sheet", label: "表格", icon: "table", src: "./assets/uploads/table.svg" },
  { id: "mail", label: "邮件", icon: "mail" },
  { id: "research", label: "调研报告", icon: "file-search", src: "./assets/uploads/research-report.svg" },
  { id: "image", label: "图片生成", icon: "image" },
];

export default function ChatWorkspace() {
  return (
    <div className="cw-page">
      <Sidebar />
      <main className="cw-main">
        <div className="cw-hero">
          <img className="cw-hero-slogan" src="./assets/uploads/slogan.png" alt="您好，我是 AgentBox 助手" />
        </div>
        <div className="cw-composer">
          <ChatComposer />
        </div>
        <div className="cw-capabilities">
          {CAPABILITIES.map((it) => (
            <button key={it.id} type="button" className="cw-cap">
              <Icon name={it.icon} src={it.src} size={16} />
              <span>{it.label}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
