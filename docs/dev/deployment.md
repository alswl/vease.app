# 静态站点发布 / Static site delivery

仓库通过 `wrangler.jsonc` 配置 Cloudflare Workers Static Assets。以下列出仓库配置与 Workers Builds 设置，供维护发布流程时使用。线上项目设置和访问策略需在 Cloudflare 控制台核对。
The repository configures Cloudflare Workers Static Assets through `wrangler.jsonc`. Use the settings below to maintain the delivery workflow. Verify live project settings and access policies in the Cloudflare dashboard.

Cloudflare Workers Builds 项目使用以下设置：

- Worker name：`vease-app`（与 `wrangler.jsonc` 一致）
- Production branch：`master`
- Build command：`npm run build`
- Deploy command：`npx wrangler deploy`
- Preview command：`npx wrangler preview`
- Root directory：`/`
- Build variable：`NODE_VERSION=22`

`wrangler.jsonc` 指定上传 `dist/`，无需 Worker 脚本。未匹配的路径返回 404，不回退到首页。Wrangler 版本由 `package-lock.json` 锁定。自定义域名 `vease.app` 在 Cloudflare 项目的 Domains & Routes 中配置；`CNAME` 文件保留为静态资产，不负责 Cloudflare 域名绑定。

GitHub Actions 在 Pull Request 上运行测试与构建，不执行部署。Cloudflare Workers Builds 的构建与部署命令需在项目中配置。公开官网应允许匿名访问；预览环境可按需保护。

Configure Workers Builds with Worker name `vease-app`, production branch `master`, build command `npm run build`, deploy command `npx wrangler deploy`, preview command `npx wrangler preview`, root directory `/`, and build variable `NODE_VERSION=22`. Wrangler uploads `dist/` as static assets without a Worker script. Unknown paths return 404. Configure the custom domain in Cloudflare Domains & Routes; the retained `CNAME` file does not bind the domain. GitHub Actions runs tests and builds on pull requests without deploying. Configure build and deploy commands in Workers Builds.

[开发文档 / Developer docs](README.md) · [文档首页 / Documentation](../README.md)
