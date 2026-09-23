# Agentbox 组件库

基础组件与组合组件使用同一套目录和构建方式。源码是唯一事实来源；每个组件有独立预览，精修时只生成这一页，确认后再生成该层总览。

```text
agentbox/
├── atom-components/             基础组件库
│   ├── registry.json            总览顺序、组件 ID 与目录名
│   ├── index.html               基础组件总览（生成）
│   └── components/Button/
│       ├── index.jsx            组件实现
│       ├── index.css            组件样式
│       ├── README.md            API 与使用说明
│       ├── preview.jsx          此组件的预览、配置器与文档
│       ├── preview.css          此组件的预览布局与状态演示
│       └── preview.html         独立预览（生成）
├── large-components/            组合组件库，相同结构
│   ├── registry.json
│   ├── index.html
│   └── components/TaskCard/…
├── assets/                     两层共用的字体、主题、图标与本地运行库
├── tooling/preview/             共用页面壳、预览样式和模块构建器
├── scripts/build.mjs            唯一构建入口
├── scripts/verify.mjs           唯一验证入口
└── index.html                  两层组件库导航
```

## 从 GitHub 获取并使用

需要 Node.js 22 或更高版本；当前构建工具已在 Node.js 22 验证，不需要 `npm install`。

```sh
git clone https://github.com/xiaomengqiang/agentbox.git
cd agentbox
node scripts/build.mjs --all
node scripts/verify.mjs --all
```

仓库已包含构建好的 HTML，clone 后无需构建即可用浏览器打开根目录 `index.html`，进入基础组件或组合组件总览。也可以直接打开某组件目录下的 `preview.html`。

后续更新已有副本：

```sh
git pull --ff-only
```

如果自己修改过源码，先提交或暂存自己的改动再拉取；分支有分歧时需先处理，`--ff-only` 不会自动创建合并提交。

`.agents/skills/` 中共享了三个项目技能的规范与参考文档，`AGENTS.md` 约定了局部编辑流程；使用支持项目技能的工具时可直接采用。技能内的旧脚手架脚本不随仓库共享，本工程统一使用根目录 `scripts/`，无需复制到个人技能目录。

## 将本地修改上传 GitHub

本仓库已配置远端 `https://github.com/xiaomengqiang/agentbox.git`。有该仓库写权限时，从工程根目录运行：

```sh
git status --short
git add -A
git diff --cached --stat
git commit -m "Restructure component libraries and preview workflow"
git push -u origin main
```

提交前确认暂存列表只包含准备共享的改动。GitHub 登录由你本机的 Git 凭据管理器或 SSH 配置处理。若 push 因远端有新提交而被拒绝，先获取并处理远端更新，不要直接强制推送。

没有写权限的使用者可 clone 使用；需要提交自己的改动时，在 GitHub Fork 后推送到自己的仓库，再按需要发起 Pull Request。私有仓库需要先授予访问权限才能 clone / pull。

## 哪些文件进入 Git

- **提交**：两层组件源码、README、注册表、共享 assets、构建工具、根目录导航页、所有独立预览与两层总览 HTML、`AGENTS.md` 与三个项目技能的规范。
- **忽略**：`.history/`、本地编辑器设置、依赖目录、缓存、日志、临时文件和 `.env`。
- clone / pull 后可直接打开已提交的 HTML；发布版本前运行全量构建与验证，将源码及生成 HTML 一起提交，保证预览与源码一致。
- `.gitignore` 不会清除已有 Git 历史。已跟踪的本地历史文件需从索引移除；这不影响保留的本地副本，也不会改写之前的提交。

## 精修单个组件

例如只修改 Button：

```sh
node scripts/build.mjs atom Button
node scripts/verify.mjs atom Button
```

打开 `atom-components/components/Button/preview.html`。它只包含 Button 预览及其依赖，不加载其他组件预览，也不会更新总览或其他独立页面。可传目录名 `TextFields` 或注册 ID `text-fields`。

精修组合组件的用法完全相同：

```sh
node scripts/build.mjs large TaskCard
node scripts/verify.mjs large TaskCard
```

打开 `large-components/components/TaskCard/preview.html`。组合组件直接 import 原子组件源码；修改一个原子组件后，重新构建使用它的组合组件即可看到变化，不需要先更新原子总览。

## 确认后汇总

```sh
node scripts/build.mjs atom --gallery
node scripts/verify.mjs atom --gallery
node scripts/build.mjs large --gallery
node scripts/verify.mjs large --gallery
```

分别更新 `atom-components/index.html` 和 `large-components/index.html`。总览从各组件源码生成，沿用相同的预览模块，不拼接或读取独立 HTML。总览中的组件样式各自限定作用范围，切换标签保留已访问面板的配置。

平时单组件页面与总览暂时不同是正常的：总览只在明确汇总时更新。

## 全量重建与检查

无需安装 npm 包，使用 Node.js 与仓库内的本地 React、Babel。

```sh
node scripts/build.mjs --all
node scripts/verify.mjs --all
node scripts/build.mjs --all --check
```

`--all` 生成两层全部独立页面和总览；也可用 `atom --all` / `large --all` 限定一层。`--check` 比较源码构建结果与现有 HTML，不写文件。所有生成的组件 HTML 都可删除后重建；没有旧 HTML 模板依赖。页面离线使用仓库内相对路径的 React 和字体，移动页面时须连同目录结构和 `assets/` 一起保留。

验证覆盖模块执行、每个组件的预览树、代表性配置和本地资源路径；真实交互和视觉效果仍需打开页面检查。

## 新增组件

1. 在对应 `components/` 下新增组件目录，包含实现、样式、README、`preview.jsx`、`preview.css`。
2. `preview.jsx` 使用标准 ES Module，导入真实组件，并 `export default` 一个预览组件。
3. 在该层 `registry.json` 中增加 `{ "id": "new-component", "name": "NewComponent" }`。
4. 单独构建和验证，完成后更新该层总览。

组合组件引用基础组件，例如：

```jsx
import Button from '../../../atom-components/components/Button/index.jsx';
```

共用组件图标从 `../../../assets/shared/icons.js` 导入。组合组件当前使用 `large-icons.js` 保留原有定制时钟外观；两个文件共用相同资源目录。此前组合工程中两份有差异的 prompt-input SVG 保存在 `assets/large/uploads/`，未覆盖基础库资源。

## 低上下文编辑约定

- 日常只读取目标组件的 README、`index.jsx`、`index.css`、`preview.jsx`、`preview.css`。
- 不读取或手改生成 HTML，也不遍历 `.history/`；只有调试构建输出时才检查相关片段。
- 修改预览内容改 `preview.jsx`，修改组件行为改 `index.jsx`，预览状态演示放 `preview.css`。
- 共享配置器样式集中在 `tooling/preview/`，只在修改共用布局时读取。
- 独立页和总览使用同一份源码，不复制组件实现或再次维护总览版本。
