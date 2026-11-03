import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import ChatComposer from "../ChatComposer/index.jsx";
import { Icon } from "../../components/Icon/index.jsx";
import ChatSession, { buildAgentReply } from "../ChatSession/index.jsx";
import "./index.css";

/* 底部快捷能力胶囊:src 为产品资源插画,未提供资源的项回退 Lucide 线性图标 */
const CAPABILITIES = [
  { id: "doc", label: "文档", icon: "file-text", src: "./assets/uploads/icon/skills/work/doc.svg" },
  { id: "slides", label: "幻灯片", icon: "presentation", src: "./assets/uploads/slides.svg" },
  { id: "sheet", label: "表格", icon: "table", src: "./assets/uploads/table.svg" },
  { id: "mail", label: "邮件", icon: "mail", src: "./assets/uploads/icon/skills/work/email.svg" },
  { id: "research", label: "调研报告", icon: "file-search", src: "./assets/uploads/research-report.svg" },
  { id: "image", label: "图片生成", icon: "image", src: "./assets/uploads/icon/skills/work/picture.svg" },
];

export default function ChatWorkspace() {
  // 会话消息列表：为空 → 欢迎页；非空 → 会话页（消息流 + 工作流）
  const [messages, setMessages] = useState([]);
  const inSession = messages.length > 0;

  // 发送：追加一条用户消息，并构造一次流式生成 + 授权等待的 Agent 回复
  const handleSend = (payload) => {
    const reply = buildAgentReply(payload);
    const ts = Date.now();
    setMessages((ms) => [
      ...ms,
      {
        id: "u-" + ts,
        role: "user",
        text: payload.text,
        chips: payload.chips,
        files: payload.files,
        meta: payload.meta,
      },
      {
        id: "a-" + ts,
        role: "agent",
        blocks: reply.blocks,
        failMode: reply.failMode,
        meta: payload.meta,
      },
    ]);
  };

  return (
    <div className="cw-page">
      <Sidebar />
      <main className={"cw-main" + (inSession ? " cw-main--session" : "")}>
        {inSession ? (
          /* ---- 会话页：顶栏 + 消息流 + 底部输入 ---- */
          <ChatSession
            messages={messages}
            onReset={() => setMessages([])}
            composer={<ChatComposer onSend={handleSend} />}
          />
        ) : (
          /* ---- 欢迎页：Hero + 居中输入框 + 快捷能力胶囊 ---- */
          <>
            <div className="cw-hero">
              <img className="cw-hero-slogan" src="./assets/uploads/slogan.png" alt="您好，我是 AgentBox 助手" />
            </div>
            <div className="cw-composer">
              <ChatComposer onSend={handleSend} />
            </div>
            <div className="cw-capabilities">
              {CAPABILITIES.map((it) => (
                <button key={it.id} type="button" className="cw-cap">
                  <Icon name={it.icon} src={it.src} size={16} />
                  <span>{it.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
