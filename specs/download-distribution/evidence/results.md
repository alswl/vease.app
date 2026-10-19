# VDEV-02 本地验收记录

日期：2026-10-17。官网 worktree 分支 `vdev-02-local-downloads`，基线 `3ca752a`。本记录来自本地 fixture；不证明真实 CDN、线上 stable 指针或生产可达性。

## 浏览器路径

首次依照 agent-browser skill 启动隔离 namespace/session 并读取页面。`session info --json` 显示 CLI 将 socketDir 固定为 `/Users/alswl/.agent-browser/namespaces/vdev02-downloads/run`，`agent-browser --help` 仅提供 `--namespace`，未提供自定义 socket/runtime-dir 参数。`TMPDIR` 只影响 Chrome 临时目录，不能移动该 socket；检查显示专属 socket 为 0 字节。按约束没有搬移或删除此路径，也未继续用 agent-browser 做验收。

随后使用本地隔离的 `playwright-core@1.64.1`，启动本机 Chrome `155.0.8059.82`，`launch({ pipe: true })`，新建无 profile 状态的 context；`TMPDIR`、Chrome 临时 profile、下载和浏览器依赖均在本 worktree 的唯一 `.local-evidence/vdev02-downloads/tmp.YVwMsW/` 目录。没有读取负责人浏览器 profile。下载 URL 全部由 Playwright route 拦截并返回合成字节，没有向 CDN 发起请求。

首次 harness 启动因 Node ESM 不读取 `NODE_PATH` 报 `ERR_MODULE_NOT_FOUND`；改用 Node 正式 `createRequire` API 指向隔离安装的 Playwright 包后通过。未把依赖装入官网项目或全局路径。

运行命令（从仓库根目录，静态服务器已在 127.0.0.1:4173 启动）：

```sh
VDEV02_TMPDIR="$PWD/.local-evidence/vdev02-downloads/tmp.YVwMsW" \
TMPDIR="$PWD/.local-evidence/vdev02-downloads/tmp.YVwMsW" \
node specs/download-distribution/evidence/browser-check.mjs
```

## 实际结果

- Chrome 155，宽屏 1440×1000、窄屏 390×844；窄屏 `documentElement.scrollWidth <= innerWidth`。
- 点击首屏“下载 macOS 版”滚动到下载区。
- 页面显示与 `available.json` 完全一致的版本、DMG/ZIP URL、大小及 SHA-256。
- 不带 fixture 参数时，浏览器请求的默认 stable 地址精确为 `https://vlogo-dl.dijingchao.com/releases/channels/stable.json`；验收路由提供本地夹具响应。
- 实际点击 DMG、ZIP 两个链接；分别捕获到同版本格式 URL，拦截后下载文件名匹配 `Vlogo-9.9.9-test.1-darwin-arm64.{dmg,zip}`。
- `zip-only`：ZIP 可用，DMG 明确无制品。
- `withdrawn`：显示撤回原因/替代版本，无下载链接。
- `no-artifacts`：显示无制品，无下载链接。
- `invalid`（SHA 错误）及 `untrusted-url`：均拒绝并不显示下载链接。
- `missing` fixture HTTP 404 与浏览器网络请求 abort：均显示错误，不显示下载链接；404 场景点击重试后再次失败，状态仍正确。
- 全部 Playwright assertions 通过；浏览器截图如下。

## 截图

- [宽屏有效版本](vdev02-wide-available.png)
- [窄屏有效版本](vdev02-narrow-available.png)
- [仅 ZIP 可用](vdev02-zip-only.png)
- [撤回版本](vdev02-withdrawn.png)
- [无制品](vdev02-no-artifacts.png)
- [无效 SHA](vdev02-invalid-metadata.png)
- [不允许的制品主机](vdev02-untrusted-url.png)
- [stable 加载 HTTP 失败](vdev02-load-failure.png)
- [stable 加载网络失败](vdev02-network-failure.png)

静态服务器另外返回官网 HTTP 200、有效 fixture HTTP 200、缺失 fixture HTTP 404；内嵌 JavaScript `node --check` 与基础 HTML 结构检查通过。协调仓 checkbox 未改。
