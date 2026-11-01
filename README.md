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

## 工作流程

### 组件开发(preview-components)

修改或新增原子组件的完整闭环:

1. 在 `preview-components/components/<Name>/` 修改实现(`index.jsx` / `index.css` / `README.md`)
2. 新增组件时:在 `preview-components/views/<Name>/` 创建预览视图,并在 `demo.jsx` 中挂载视图与其样式
3. 构建并验证(每次改完必须执行):

   ```bash
   node .agents/skills/agentbox-component/scripts/build.mjs --dir preview-components
   node .agents/skills/agentbox-component/scripts/verify-build.mjs --dir preview-components
   ```

4. 浏览器**强刷**(Ctrl + F5,file:// 缓存顽固)检查 `preview-components/index.components.html`
5. 组件被业务页复用时:把整个 `components/<Name>/` 目录复制到 `preview/components/` — 两个 scaffold 的组件副本靠这一步手工保持一致

### 业务页开发(preview)

1. 在 `preview/views/` 修改页面区块(可组合 `preview/components/` 中的原子组件)
2. 构建并验证(每次改完必须执行):

   ```bash
   node .agents/skills/agentbox-component/scripts/build.mjs --dir preview
   node .agents/skills/agentbox-component/scripts/verify-build.mjs --dir preview
   ```

3. 强刷 `preview/index.components.html`

### 修改共享资产(assets)

1. **只改根 `assets/`**(scaffold 内的 `assets/` 是同步副本,直接编辑会被下次同步覆盖)
2. 同步到所有 scaffold:

   ```bash
   node .agents/skills/agentbox-component/scripts/sync-assets.mjs
   ```

3. 重建受影响的 scaffold(命令同上),强刷查看效果

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

## 资产同步规则

根 `assets/` 是全工程唯一的资产编辑入口;scaffold 内的 `assets/` 是同步生成的副本(操作流程见上方[工作流程](#工作流程))。

- 同步是单向覆盖、不删除:源里删掉的文件需手动清理副本
- 新增 scaffold(含 `demo.jsx`)会被同步脚本自动发现,无需配置

## 开发约定

- **组件自包含**:组件样式只写在自己的 `index.css`,颜色一律使用 `assets/style` 的主题 token,不依赖外部公共样式
- **公共样式/工具**:`styles/` 与 `util/` 只服务预览视图,不进组件;视图覆盖公共类必须用视图前缀类(如 `tt-configurator`),禁止重新声明公共类选择器
- **图标**:统一使用 `components/Icon`,三条通路见下方[图标体系](#图标体系)
- **图表**:优先 ECharts 6.1(SVG 渲染),使用 `components/Chart` 组件;构建器检测到 echarts 使用时自动注入本地库,禁止 CDN 引入或 npm import
- **离线产物**:构建时本地图片自动内联为 data URL,产物不发起文件请求,`file://` 双击可用;字体保持外链(离线时回退系统字体,经 http 服务打开时生效)

## 组件硬约束

构建器以固定模式打包模块,以下规则违反时多数**构建不报错、运行时才炸**。此处只列 skill 未覆盖的本工程规范;完整的 ES Module 语法约束(禁 `import * as`、别名导入、react 外依赖等)见 [SKILL.md](.agents/skills/agentbox-component/SKILL.md) 的 Step 2:

- **default import 名必须与导出函数名完全一致**:构建器把所有模块打进一个共享 `__export` 池,`import ButtonPreview from ...` 要求该模块确实 `export default function ButtonPreview()`。名字不一致时解构出 `undefined`,渲染报 React #130(最小化错误,难排查)
- **每个组件必须支持 `id / style / className`**:作用于根元素,`className` 与内部类名合并,`style` 与内部样式合并且调用方优先

## 图标体系

| 通路 | 用法 | 颜色 | 适用 |
|---|---|---|---|
| Lucide 离线表 | `<Icon name="chevron-down" />` | 描边跟随 `currentColor`(或 `color` 覆盖) | 默认首选,通用线性图标 |
| mask 资源图 | `<Icon mask="./assets/uploads/x.svg" />` | 跟随 `currentColor`(svg 只贡献形状) | Lucide 没有的单色精绘图标,需跟色变色 |
| src 资源图 | `<Icon src="./assets/uploads/x.png" />` 或 `<img>` | 不跟色,原样渲染 | 多彩图形、位图 |

命名规则、运行时拼名陷阱、废弃旧名对照等详见 skill 的 [icons.md](.agents/skills/agentbox-component/references/icons.md)。Lucide 全表在 `assets/library/lucide-icon-nodes.json`,更新走根 assets → sync。如果 Lucide 中没有合适的图标,请自行编写 `.svg` 存入 `assets/uploads/icon/`,按上表 mask(单色跟色)或 src(多彩)通路引用。

## 技能

`.agents/skills/agentbox-component/` 是本工程的技能与工具链:

- `SKILL.md` — 组件与页面开发工作流(scaffold 结构、ES Module 约定、构建验证流程)
- `scripts/init.mjs` — 初始化新 scaffold
- `scripts/build.mjs` — 构建(模块打包、token lint、Lucide 注入、图片内联)
- `scripts/verify-build.mjs` — 无头验证产物(编译 + 渲染调用检查)
- `scripts/sync-assets.mjs` — 资产同步
