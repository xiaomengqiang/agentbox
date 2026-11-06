import { useState, useEffect } from "react";
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
  const [workspaceMode, setWorkspaceMode] = useState("office");
  // Keep each workspace conversation separate when switching modes.
  const [conversations, setConversations] = useState({ office: [], code: [] });
  const messages = conversations[workspaceMode];
  const setMessages = (next) => setConversations((previous) => ({
    ...previous,
    [workspaceMode]: typeof next === "function" ? next(previous[workspaceMode]) : next,
  }));
  const isCode = workspaceMode === "code";
  /* 会话标题与标识(首条用户消息):会话开始时由侧栏在首个项目下创建「新对话」子节点并同步标题 */
  const firstMsg = messages.length > 0 ? messages[0] : null;
  const sessionTitle = firstMsg && firstMsg.text ? firstMsg.text : null;
  const sessionId = firstMsg ? firstMsg.id : null;
  const capabilities = isCode ? [
    { id: "build", label: "项目开发", icon: "code-xml" },
    { id: "review", label: "代码审查", icon: "scan-search" },
    { id: "debug", label: "问题排查", icon: "bug" },
    { id: "test", label: "编写测试", icon: "check" },
  ] : CAPABILITIES;
  const inSession = messages.length > 0;
  // 会话创建时的模式:传给会话页输入框,使其显示与会话一致的模式(蜂群会话 → 蜂群模式)
  const sessionModeId =
    inSession && messages[0].meta && messages[0].meta.modeId === "swarm"
      ? "swarm"
      : "single";

  // 生成中标记 + 停止信号（点击停止按钮时递增，AgentRun 感知后跳到结尾）
  const [generating, setGenerating] = useState(false);
  const [stopGen, setStopGen] = useState(0);

  // 蜂群群聊模式:右侧 SwarmPanel 处于群聊(辩论)页签时,
  // 左侧输入框的发送只向右侧追加聊天内容,左侧会话流不变
  const [swarmChatMode, setSwarmChatMode] = useState(false);
  const [swarmChat, setSwarmChat] = useState([]);
  const pushSwarmChat = (item) => setSwarmChat((list) => [...list, item]);
  // 离开会话页(重置/切工作台)时复位群聊模式与追加消息
  useEffect(() => {
    if (!inSession) {
      setSwarmChatMode(false);
      setSwarmChat([]);
    }
  }, [inSession]);

  // 发送：追加一条用户消息，并构造一次流式生成 + 授权等待的 Agent 回复
  const handleSend = (payload) => {
    // 蜂群群聊模式:仅右侧 SwarmPanel 追加聊天,左侧不变
    if (swarmChatMode) {
      const ts = Date.now();
      pushSwarmChat({
        id: "uc-" + ts,
        role: "user_123",
        avatar: "./assets/uploads/workbench-avatar.png",
        time: "2026/06/20 13:23",
        paragraphs: [
          "@项目研究专家 再收集一些竞品的UI方案我想看看空闲时间和重合的时间是怎么展示的？",
        ],
        side: "right",
      });
      window.setTimeout(() => {
        pushSwarmChat({
          id: "ac-" + Date.now(),
          role: "项目研究专家",
          avatar: "./assets/uploads/avatar-research.svg",
          time: "2026/06/20 13:23",
          paragraphs: [
            "@User_123 收到！我现在按照之前的竞品研究思路去收集相关的设计方案。",
          ],
          side: "left",
        });
      }, 3000);
      return;
    }

    const reply = buildAgentReply(payload);
    const ts = Date.now();
    setGenerating(true);
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

  // 停止生成：递增停止信号，AgentRun 跳到结尾；按钮恢复初始态
  const handleStop = () => {
    setStopGen((n) => n + 1);
    setGenerating(false);
  };

  // 会话消息附件卡片操作:remove 移除附件卡片 / retry 清除失败态(模拟重试成功)
  const handleFileAction = (msgId, fileId, kind) => {
    setMessages((ms) =>
      ms.map((m) => {
        if (m.id !== msgId || !m.files) return m;
        if (kind === "remove") {
          return { ...m, files: m.files.filter((f) => f.id !== fileId) };
        }
        return { ...m, files: m.files.map((f) => (f.id === fileId ? { ...f, failed: false } : f)) };
      })
    );
  };

  return (
    <div className="cw-page">
      <Sidebar mode={workspaceMode} onModeChange={setWorkspaceMode} sessionTitle={sessionTitle} sessionId={sessionId} />
      <main key={workspaceMode} data-workspace={workspaceMode} className={"cw-main" + (inSession ? " cw-main--session" : "")}>
        {inSession ? (
          /* ---- 会话页：顶栏 + 消息流 + 底部输入 ---- */
          <ChatSession
            messages={messages}
            onReset={() => setMessages([])}
            onGeneratingChange={setGenerating}
            stopGen={stopGen}
            swarmExtraChat={swarmChat}
            onSwarmViewChange={setSwarmChatMode}
            onFileAction={handleFileAction}
            composer={
              <ChatComposer
                onSend={handleSend}
                chatMode
                isGenerating={generating}
                onStop={handleStop}
                modeId={sessionModeId}
              />
            }
          />
        ) : (
          /* ---- 欢迎页：Hero + 居中输入框 + 快捷能力胶囊 ---- */
          <>
            <div className="cw-hero">
              {isCode ? (
                <>
                  <h1 className="cw-code-title">代码开发工作台</h1>
                  <p className="cw-code-subtitle">选择项目空间，开始开发、审查代码或排查问题</p>
                </>
              ) : <img className="cw-hero-slogan" src="./assets/uploads/slogan.png" alt="您好，我是 AgentBox 助手" />}
            </div>
            <div className="cw-composer">
              <ChatComposer onSend={handleSend} placeholder={isCode ? "描述开发需求、粘贴代码，或选择项目空间开始…" : undefined} />
            </div>
            <div className="cw-capabilities">
              {capabilities.map((it) => (
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
