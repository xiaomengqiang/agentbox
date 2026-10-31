import ChatComposer from "./components/ChatComposer/index.jsx";
import "./demo.css";

export default function Demo() {
  return (
    <div className="demo-page">
      <header className="demo-header">
        <div className="demo-title">
          <img src="./assets/uploads/logo.svg" alt="logo" style={{ width: 28, height: 28 }} />
          <span>组件预览</span>
        </div>
        <p className="demo-subtitle">罗列当前组件的多种形态，均可直接交互。</p>
      </header>

      <section className="demo-section">
        <div className="demo-section-header">
          <h2 className="demo-section-name">ChatComposer</h2>
          <span className="demo-section-tag">对话输入框</span>
        </div>
        <p className="demo-section-desc">
          AI 工具消息输入框：灰色外框 800×188（左右包裹 4px）内嵌输入卡 792×140；
          卡内底部左下为 加号 / 图标+单Agent模式 / 图标+请求权限，右侧为 图标+auto 与发送按钮；
          灰色外框下方左侧为图标+「选择项目空间」。点击 chip 可体验下拉交互。
        </p>

        <div className="demo-composer">
          <div className="demo-card demo-card-composer">
            <div className="demo-card-top">
              <h3 className="demo-item-title">空态</h3>
              <span className="demo-measure">外灰 800×188 · 输入卡 792×140 · 包裹 4px</span>
            </div>
            <ChatComposer />
          </div>
        </div>
      </section>
    </div>
  );
}
