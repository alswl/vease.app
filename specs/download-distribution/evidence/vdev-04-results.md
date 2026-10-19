# VDEV-04 官网 GA4 本地验收记录

日期：2026-10-17。官网 worktree 分支 `vdev-02-local-downloads`，基线 / 当前 HEAD `3ca752ae6c7a16f5f9f52b7b5a1a64a94f015469`，候选未提交。沿用 VDEV-02 工作树与本地隔离 Playwright 依赖；未创建工作树或分支。

## 实际运行

先确认 `127.0.0.1:4173` 无监听，再启动 `python3 -m http.server 4173 --bind 127.0.0.1`。Chrome 使用 Playwright pipe 和新建隔离 context；不加载负责人 profile。测试 ID `G-TEST000000` 仅由 localhost 导航响应路由注入；Google tag 请求由脚本替身拦截，Google Analytics 事件端点由路由 abort。DMG/ZIP URL 也由路由返回合成下载字节，不访问 CDN。

从仓库根执行：

```sh
VDEV02_TMPDIR="$PWD/.local-evidence/vdev02-downloads/tmp.YVwMsW" \
TMPDIR="$PWD/.local-evidence/vdev02-downloads/tmp.YVwMsW" \
node specs/download-distribution/evidence/vdev04-browser-check.mjs
```

结果：退出码 0，Chrome `155.0.8059.82`，全部 assertions passed。未配置 ID 时 meta 为空且不创建 Google tag、`gtag` 或 `dataLayer`；有效配置的每次页面加载发送单次 `page_view`，页面地址为 `http://127.0.0.1:4173/` 且不含 query/hash。DMG、ZIP 各点击一次并捕获合成下载；各发出一个 `download_click`，参数严格为 `format`、`arch=arm64`、`os=darwin`、`version=9.9.9-test.1`。页面 query 中 `SENSITIVE-CANARY` 未出现在事件中；未发生 Google Analytics 事件端点请求。no-artifacts、invalid、withdrawn 各有一次 `page_view` 且无 `download_click`、无下载链接。390×844 视口宽度与页面 scrollWidth 均为 390；无 page error。

## 截图

- [宽屏有效下载与 GA 接线](vdev04-ga-downloads.png)
- [窄屏有效下载](vdev04-ga-narrow.png)
- [无制品](vdev04-ga-no-artifact.png)
- [无效元数据且无下载](vdev04-ga-invalid-no-download.png)
- [撤回版本且无下载](vdev04-ga-withdrawn-no-download.png)

## 上线后验证

源码中的 GA4 测量 ID 保持空值。真实 GA4 Measurement ID、部署后的 Google tag 请求和 GA 属性报表回流均未验证，须上线配置后确认。本地测试 ID 没有写入源码，也没有向 Google 发送事件。
