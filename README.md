# Vease Home

[Vease](https://github.com/alswl/vease.app) 的静态官网，支持简体中文和 English，使用 Vite、React 与 TypeScript 构建，由 Cloudflare Workers Static Assets 托管。

- 官网：<https://vease.app/>（`public/CNAME` 在构建时复制到发布根目录）

[Vease](https://github.com/alswl/vease.app) is a static website in Simplified Chinese and English, built with Vite, React, and TypeScript and hosted on Cloudflare Workers Static Assets.

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

Cloudflare Workers Builds 项目使用以下设置：

- Worker name：`vease-app`（与 `wrangler.jsonc` 一致）
- Production branch：`master`
- Build command：`npm run build`
- Deploy command：`npx wrangler deploy`
- Preview command：`npx wrangler preview`
- Root directory：`/`
- Build variable：`NODE_VERSION=22`

`wrangler.jsonc` 指定上传 `dist/`，无需 Worker 脚本。`/banner/` 对应独立静态页面；未匹配的路径返回 404，不回退到首页。Wrangler 版本由 `package-lock.json` 锁定。自定义域名 `vease.app` 在 Cloudflare 项目的 Domains & Routes 中配置；`CNAME` 文件保留为静态资产，不负责 Cloudflare 域名绑定。

GitHub Actions 仅在 Pull Request 上运行构建检查；Cloudflare Workers Builds 负责部署。公开官网的生产访问不启用 Cloudflare Access；预览环境可按需保护。

Configure Workers Builds with Worker name `vease-app`, production branch `master`, build command `npm run build`, deploy command `npx wrangler deploy`, preview command `npx wrangler preview`, root directory `/`, and build variable `NODE_VERSION=22`. Wrangler uploads `dist/` as static assets without a Worker script. Unknown paths return 404. Configure the custom domain in Cloudflare Domains & Routes; the retained `CNAME` file does not bind the domain. GitHub Actions only checks pull request builds.
