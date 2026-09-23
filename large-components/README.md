# Large Components

组合组件实现位于 `components/<Name>/`，直接引用 `atom-components` 的源码。单独预览：该目录下的 `preview.html`；本层总览：`index.html`。

```sh
node scripts/build.mjs large TaskCard
node scripts/verify.mjs large TaskCard
node scripts/build.mjs large --gallery
```

从工程根目录运行。详细目录与工作流见 [工程说明](../README.md)。
