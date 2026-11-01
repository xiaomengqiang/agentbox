# Agentbox 组件工程

基于 `agentbox-component` 技能体系的组件与页面预览工程。源码是唯一事实来源；构建产物为自包含的离线 HTML，双击即可打开。

## 目录结构

```text
agentbox/
├── assets/                        共享资产源(唯一编辑入口)
│   ├── font/                      HarmonyOS Sans 字体
│   ├── library/                   React / ReactDOM / Babel 本地库与 Lucide 图标表
│   ├── style/                     主题 token(base / light / theme / dark / glass)
│   └── uploads/                   图片资源(功能图标、模型 logo 等)
├── preview-components/            组件工作台 scaffold
│   ├── components/                14 个原子组件(Button、Icon、Tab…)
│   ├── views/                     每个组件一个预览视图(Configurator / 状态矩阵 / Color spec)
│   ├── styles/                    公共样式(预览文档布局,仅供 views 使用)
│   ├── util/                      公共 JSX 工具(ColorSpec 色彩规范表、ContractTable 等)
│   ├── assets/                    同步生成的资产副本(勿手动编辑)
│   ├── demo.jsx                   入口:DemoMenu 侧栏导航 + 各组件视图
│   └── index.components.html      构建产物(组件总览)
├── preview/                       业务页 scaffold
│   ├── components/                可复用原子(与 preview-components 同源)
│   ├── views/
│   │   ├── ChatComposer/          AI 输入框组件
│   │   └── ChatWorkspace/         业务页:侧栏菜单(功能/历史分组)+ 居中输入区
│   ├── assets/                    同步生成的资产副本(勿手动编辑)
│   ├── demo.jsx                   入口
│   └── index.components.html      构建产物(业务页)
├── .agents/skills/agentbox-component/   技能与工具链(见下)
└── index.html                     工程导航页
```

## 常用命令

所有脚本位于 `.agents/skills/agentbox-component/scripts/`,在工程根目录执行:

```bash
# 同步资产:把根 assets/ 推送到所有 scaffold(自动发现含 demo.jsx 的一级目录)
node .agents/skills/agentbox-component/scripts/sync-assets.mjs

# 构建并验证组件总览
node .agents/skills/agentbox-component/scripts/build.mjs --dir preview-components
node .agents/skills/agentbox-component/scripts/verify-build.mjs --dir preview-components

# 构建并验证业务页
node .agents/skills/agentbox-component/scripts/build.mjs --dir preview
node .agents/skills/agentbox-component/scripts/verify-build.mjs --dir preview
```

## 资产流程

根 `assets/` 是全工程唯一的资产编辑入口;scaffold 内的 `assets/` 是同步生成的副本。

```text
修改根 assets/(token / 图标 / 字体)
  → node .../sync-assets.mjs        # 同步到各 scaffold
  → node .../build.mjs --dir <目标>  # 重新构建
```

- 同步是单向覆盖、不删除:源里删掉的文件需手动清理副本
- 新增 scaffold(含 `demo.jsx`)会被同步脚本自动发现,无需配置

## 开发约定

- **组件自包含**:组件样式只写在自己的 `index.css`,颜色一律使用 `assets/style` 的主题 token,不依赖外部公共样式
- **公共样式/工具**:`styles/` 与 `util/` 只服务预览视图,不进组件;视图覆盖公共类必须用视图前缀类(如 `tt-configurator`),禁止重新声明公共类选择器
- **图标**:统一使用 `components/Icon`(三级渲染:内联精绘图标 → src 资源 → Lucide 离线表,构建时注入)
- **离线产物**:构建时本地图片自动内联为 data URL,产物不发起文件请求,`file://` 双击可用;字体保持外链(离线时回退系统字体,经 http 服务打开时生效)

## 技能

`.agents/skills/agentbox-component/` 是本工程的技能与工具链:

- `SKILL.md` — 组件与页面开发工作流(scaffold 结构、ES Module 约定、构建验证流程)
- `scripts/init.mjs` — 初始化新 scaffold
- `scripts/build.mjs` — 构建(模块打包、token lint、Lucide 注入、图片内联)
- `scripts/verify-build.mjs` — 无头验证产物(编译 + 渲染调用检查)
- `scripts/sync-assets.mjs` — 资产同步
