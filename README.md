# Vease Home

[Vease](https://github.com/alswl/vease.app) 的静态官网，支持简体中文和 English，使用 Vite、React 与 TypeScript 构建，由 Cloudflare Pages 托管。

- 官网：<https://vease.app/>（`public/CNAME` 在构建时复制到发布根目录）

[Vease](https://github.com/alswl/vease.app) is a static website in Simplified Chinese and English, built with Vite, React, and TypeScript and hosted on Cloudflare Pages.

- Website: <https://vease.app/> (`public/CNAME` is copied to the publish root during build)

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
Build output is written to `dist/`; Vite uses `/` as the base for the custom domain.

Cloudflare Pages 项目使用以下构建设置：

- Framework preset：Vite
- Build command：`npm run build`
- Build output directory：`dist`
- Node.js：22

GitHub Actions 仅在 Pull Request 上运行构建检查；Cloudflare Pages 负责部署。

Configure Cloudflare Pages with the same settings: Vite preset, `npm run build`, `dist` output directory, and Node.js 22. GitHub Actions only checks pull request builds; Cloudflare Pages handles deployment.
