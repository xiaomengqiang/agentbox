import React from "react";
import Sidebar from "./Sidebar.jsx";
import ChatComposer from "../ChatComposer/index.jsx";
import "./index.css";

export default function ChatWorkspace() {
  return (
    <div className="cw-page">
      <Sidebar />
      <main className="cw-main">
        <div className="cw-hero">
          <h1 className="cw-hero-title">您好，我是 AgentBox 助手</h1>
          <p className="cw-hero-sub">可以帮您写代码、查资料、创作内容，试试下面的输入框。</p>
        </div>
        <div className="cw-composer">
          <ChatComposer />
        </div>
        <p className="cw-footnote">内容由 AI 生成，请仔细核实</p>
      </main>
    </div>
  );
}
