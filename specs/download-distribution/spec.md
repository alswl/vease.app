# 官网 macOS 下载入口规格

## 范围

在现有 GitHub Pages 官网接通 stable 发布元数据、macOS Apple Silicon 下载入口和 GA4 页面/下载事件，沿用原页面布局与视觉系统。仅展示 ZIP、DMG；不部署、不接云 API。

## 发布元数据

默认读取 `https://vlogo-dl.dijingchao.com/releases/channels/stable.json`。渠道名为 `stable`，官网以 `latest` 精确匹配 `releases[].version`，并从该 release 读取 `darwin/arm64` 制品。制品 URL 必须是 HTTPS、`vlogo-dl.dijingchao.com` 主机，并位于对应 `releases/<version>/` 路径。每种格式最多一项；SHA-256 必须为 64 位小写十六进制，大小为正整数。

版本号、发布日期、元数据更新时间、字节大小、完整 SHA-256 与下载 URL 都直接来自该次 stable 响应；不得由旧本地渠道快照或页面常量推导线上版本。

## 页面状态

- 可用版本：显示版本、日期；DMG 与 ZIP 分别显示下载链接、精确字节数和完整 SHA-256。
- 缺少某一格式：保留可用格式，并明确标出缺少的格式。
- 无制品：不显示下载链接，说明当前没有可下载制品。
- 最新版本已撤回：不提供下载，显示撤回原因及替代版本（如有）。
- 元数据不可读、格式错误或下载主机不允许：不显示下载链接，提供重试入口。

本地 fixture 参数只在 localhost 生效，fixture 与合成下载响应不得代表真实版本。线上 stable JSON 的跨域可读性、CDN 主机配置与实际制品访问归后续上线配置及验证。

## Google Analytics 4

官网仅发送一次 `page_view` 与有效下载链接的 `download_click`。下载事件参数严格为 `format`（`dmg|zip`）、`arch`（`arm64`）、`os`（`darwin`）和 stable 元数据版本。页面地址不含 query/hash；不采集邮箱、OTP、素材、账户信息或用户输入。

`<meta name="ga4-measurement-id">` 是部署输入，默认留空。只接受形如 `G-` 加 10 位大写字母/数字的测量 ID；未配置或格式错误时不加载 Google tag，也不发出或排队事件。真实测量 ID、Google tag 请求与报表回流由上线配置验证。本地 Playwright 只用响应拦截注入显式测试 ID，并拦截 Google tag，不向 Google 发送事件。

## 官网隐私文案（2026-10-18）

亮点区说明应区分本机剪辑与云端场记：原片留在本机、不上传且只读；剪辑 Agent 在本机运行；云端场记会收到从镜头抽取的压缩关键帧，每个镜头最多 3 张。实际上传的帧在负责人专属私有存储中长期保留，仅负责人可读。不得据此暗示全部数据不上云、纯离线或零留存。

本轮仅更新亮点卡片的标题和说明，不改变下载、GA、隐私处理功能或布局。合同来源为责任产品 worktree `specs/013-first-launch/contracts/frame-retention.md` §8；本机截图、浏览器和候选指纹见 [隐私文案审阅报告](evidence/privacy-copy-review.html) 与 [本地结果](evidence/privacy-copy-results.md)。
