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

## 国际化 / Internationalization

Landing 页使用 `i18next`、`react-i18next` 和 `i18next-browser-languagedetector`。
中英文文案分别维护在 `src/locales/en.json`、`src/locales/zh.json`，两个文件的 key 应保持一致。
组件使用 `useTranslation()`；含换行、强调或渐变样式的文案使用 `<Trans>`。

默认语言为英文；首次访问根据浏览器首选语言选择中英文，其余语言回退为英文。
手动切换的选择保存在 `localStorage` 的 `vease-language`，优先于浏览器语言，并兼容已有的 `zh-CN` 值。
语言资源随静态站点打包，无需翻译服务或后端。切换语言不会重新请求下载元数据。
独立的 `/banner/` 分享说明页及静态 SEO 元数据暂保持原有内容。

Landing copy lives in `src/locales/en.json` and `src/locales/zh.json`, rendered with
`useTranslation()` and `<Trans>`. English is the fallback; a Chinese browser preference
selects Chinese. Manual choices take precedence and persist under `vease-language`.
Resources are bundled locally, and switching languages does not refetch release metadata.
The standalone `/banner/` page and static SEO metadata retain their existing content.

## 校验与测试 / Validation and tests

下载元数据通过 Zod schema 校验并推导类型，版本格式由 `semver` 校验；只接受无前缀、无空白、无 build metadata 的规范版本号。
URL 白名单、版本路径、格式唯一性、完整 SHA-256 和正整数字节数继续强制校验；撤回版本不暴露制品。
语言选择通过 detector 的 `cacheUserLanguage` 接口存储，只有手动切换时写入偏好。

```bash
npm test
```

回归测试使用本地合成 fixtures，不请求生产服务；PR CI 同时运行测试和构建。
