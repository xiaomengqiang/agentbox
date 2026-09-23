# 双层组件工作流

适用于已有以下布局的 Agentbox 工程。所有命令从工程根目录运行；本参考中的 `scripts/` 指工程根目录的脚本。

## 目录与依赖

```text
atom-components/                  基础组件层，对应 CLI 的 atom
  registry.json                   id、name、总览顺序
  index.html                      生成的总览
  components/<Name>/
    index.jsx / index.css         真实实现
    README.md                     静态 API 与使用文档
    preview.jsx / preview.css     此组件的交互预览源码
    preview.html                  生成的独立预览
large-components/                 组合组件层，对应 CLI 的 large；同上结构
assets/                           共用字体、主题、图标、本地运行库
tooling/preview/                  共用页面壳、预览控件与构建器
scripts/build.mjs                  两层共用构建入口
scripts/verify.mjs                 两层共用验证入口
index.html                        工程导航
```

HTML 是输出；独立页面与总览使用同一份 `preview.jsx` 和组件源码。总览重新汇总源码，不拼接独立 HTML，也不要求独立 HTML 已生成。不要复制一份“总览专用组件实现”。

组合组件引用示例：

```jsx
import Button from '../../../atom-components/components/Button/index.jsx';
```

两层的组件均使用 `../../../assets/…` 导入共享模块。保留实际使用的图标模块，例如组合库现有的 `large-icons.js`；不要在结构整理时顺带替换视觉资源。JSX 中资源 URL 的约定由现有构建器处理，不因预览 HTML 位于深层目录而修改每个组件的运行时 URL。

## 按任务选择构建范围

### 精修单组件（默认）

只读取目标的 README、实现和预览源码，按需沿 import 读取相关依赖。不要默认读取生成 HTML、其他组件或 `.history/`。

```sh
node scripts/build.mjs atom Button
node scripts/verify.mjs atom Button
# 组合组件同理
node scripts/build.mjs large TaskCard
node scripts/verify.mjs large TaskCard
```

交付 `<library>/components/<Name>/preview.html`。可用目录名 `TextFields` 或注册 ID `text-fields`。此操作只更新目标独立页面，总览与其他独立页面保留原状；这是精修期间的正常工作状态。

### 用户要求汇总

```sh
node scripts/build.mjs atom --gallery
node scripts/verify.mjs atom --gallery
node scripts/build.mjs large --gallery
node scripts/verify.mjs large --gallery
```

只执行用户要求的层。交付 `<library>/index.html`。汇总从最新源码读取，不需要先构建所有独立页。

### 全量重建或迁移验证

```sh
node scripts/build.mjs --all
node scripts/verify.mjs --all
node scripts/build.mjs --all --check
```

也可用 `atom --all` 或 `large --all` 限定一层。`--check` 只检查所选输出与源码是否一致，不写文件。精修期间未汇总的页面允许落后，因此不要把全量 `--check` 当作每次局部精修的必要检查。

## 新增组件

在正确层建立组件目录，编写实现、README、默认导出的 `preview.jsx` 与 `preview.css`，向该层 `registry.json` 增加 `{ "id": "new-component", "name": "NewComponent" }`。按单组件流程构建、验证和交付。除非用户要求集成或汇总，暂不重建总览。

新组件 README 采用 `component-readme`；交互预览采用 `component-preview-html`。注册表只维护目录名、ID 和顺序，不承载组件实现或预览内容。

## 节省上下文

- 工作上下文优先限制在一个组件目录；先定位对应函数、状态或样式再扩大读取范围。
- 配置器与表格样式复用 `tooling/preview/documentation.css`、`compact.css` 等实际存在的公共文件，不把整份样式复制进每个预览。
- 仅在维护构建工具或排查输出错误时读取生成 HTML 的相关片段。普通布局问题从源码与浏览器定位。
- 仅修改 README 时无需构建。公共样式或构建器变更才扩大到受影响的组件与总览验证。
