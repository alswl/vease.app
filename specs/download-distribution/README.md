# 官网下载分发接线

功能约定见 [spec.md](spec.md)。

官网从 `https://vlogo-dl.dijingchao.com/releases/channels/stable.json` 读取 stable 发布元数据；只展示 `darwin/arm64` 的 DMG 与 ZIP。版本、发布日期、字节大小、SHA-256 和每种格式的链接均取自 stable 指向的同一版本，下载 URL 必须使用 HTTPS、发布下载主机及该版本的 `releases/<version>/` 路径。

元数据加载失败或格式不合约时不显示下载链接；已撤回版本不提供下载；缺失格式会明确显示不可用；没有制品时显示无可下载制品。GA4 测量 ID 由部署配置写入空的 `ga4-measurement-id` meta；未配置时不加载 tag、不排队事件。本地 fixture 只供 localhost 浏览器验收，页面忽略其他主机上的 fixture 参数。

## 本地浏览器验收

在仓库根运行 `python3 -m http.server 4173 --bind 127.0.0.1`，然后用全新浏览器 profile 访问 `http://127.0.0.1:4173/?fixture=available`。Playwright harness 通过 Chrome pipe 建立 CDP 控制通道，不使用 Unix socket 或负责人浏览器 profile。执行示例：

```sh
npm install --prefix .local-evidence/vdev02-downloads/tmp.YVwMsW/harness \
  --cache .local-evidence/vdev02-downloads/tmp.YVwMsW/npm-cache \
  --save-exact playwright-core@1.64.1
VDEV02_PLAYWRIGHT="$PWD/.local-evidence/vdev02-downloads/tmp.YVwMsW/harness/node_modules/playwright-core" \
VDEV02_TMPDIR="$PWD/.local-evidence/vdev02-downloads/tmp.YVwMsW" \
TMPDIR="$PWD/.local-evidence/vdev02-downloads/tmp.YVwMsW" \
node specs/download-distribution/evidence/browser-check.mjs
```

fixture 有 `available`、`zip-only`、`withdrawn`、`no-artifacts`、`invalid`、`untrusted-url` 六种；`missing` 用 HTTP 404 模拟，网络中断由 harness 拦截并 abort。`available` 中的版本、哈希、大小与 URL 都是明确的合成数据；下载点击被 harness 拦截并返回合成字节，禁止作为线上发布信息或真实制品使用。

Stage03 浏览器截图和结果见 `evidence/results.md`；Stage04 GA4 本地接线、浏览器验收结果与截图见 [`evidence/vdev-04-results.md`](evidence/vdev-04-results.md)。外部 CDN CORS、线上 stable 指针、实际制品可达性、真实 GA 属性和报表回流须在上线配置后另行验证。

## 隐私文案本机审阅

亮点区当前宣传文案、候选 WIP 身份及本机浏览器截图见[中文 HTML 审阅报告](evidence/privacy-copy-review.html)。报告中的截图由本机 Chrome 渲染，非线上截图或独立 QA 结果。
