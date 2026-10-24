# 本地开发与构建 / Local development and build

以下命令均在仓库根目录执行。
Run these commands from the repository root.

## 开发 / Development

```bash
npm ci
npm run dev
```

## 构建与本地静态预览 / Build and preview

```bash
npm run build
npm run preview
```

构建结果写入 `dist/`，Vite 使用 `/` 作为自定义域名的站点 base。
构建最后一步用 `src/entry-server.tsx` 把中文首页预渲染进 `dist/index.html`，供搜索引擎直接读取正文；浏览器端中文直接水合，其他语言重新渲染。
Build output is written to `dist/`; Vite uses `/` as the base for the custom domain.
The final build step prerenders the Chinese landing page into `dist/index.html` via `src/entry-server.tsx` so crawlers can read the body; Chinese visitors hydrate it, other languages re-render.

[开发文档 / Developer docs](README.md) · [文档首页 / Documentation](../README.md)
