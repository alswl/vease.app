# Stage06 官网仓冻结交付材料

日期：2026-10-18。范围仅为官网仓现有工作树的只读盘点与本交付材料；官网代码、构建和既有验收结果未改写。

## 会话与仓库状态

- 当前会话状态（Captain 状态栏观察）：Luna low；27% context；98% weekly left。此项为 Captain 提供的状态栏读数，不是本地工具查询结果。
- 仓库：`vlog-trimmer-home`；分支 `vdev-02-local-downloads`。
- HEAD：`3ca752ae6c7a16f5f9f52b7b5a1a64a94f015469`。
- 本地 `master`、当前分支和 `origin/master` 当前都指向同一 HEAD；未执行 fetch。交付比较基线取 `master` / HEAD 同一提交。
- 工作树有混合候选改动；无法仅凭当前 Git 状态断定每个改动的作者或是否全部属于 Stage06。保持原样，不提交、不推送、不建 PR。
- 本仓未发现适用的 `AGENTS.md`、`CLAUDE.md` 或 `guides/` 目录。已读本仓 `specs/download-distribution/spec.md`、feature README、既有 VDEV-02/VDEV-04 结果，以及指定的 `cr-brief` 与 `pr` 技能。
- 已创建任务专用 scratch/TMPDIR：`.local-evidence/stage06-freeze-20261018-105143-99414/tmp/`（目录权限 0700）。

## QA 状态（历史报告与当前快照）

此前 Captain 亲核的产品仓 R3 run `20261018-022503-1936-1` 为历史结果：API 25 PASS；UI 35 PASS、12 SKIP、0 FAIL。它不代表后续运行或当前官网验收；本交付文档不保留只能在特定机器打开的本地 QA 报告超链接。QA 报告由独立 QA 工作区管理，本官网 worktree 未读取该报告或 QA 在途文件。

**QA 最终 return（2026-10-19，Captain 确认）：**R5 候选身份未变：source `17627ae8…`、ZIP `876b1e3e…`、DMG `1424a189…`。全量 run `101031` 的 FAIL 保留（API 25 PASS；UI 54 PASS、7 SKIP、4 FAIL，失败为 96–99，涉及共享测试账号额度污染及 helper 二次异常）；run `110000` 仅对 75→96–99 范围作定向隔离验证（API 25 PASS；UI 5 PASS、0 SKIP、0 FAIL；exit 0、stop 0），不与全量结果拼成 full PASS。最终 return 的适用结论是：未发现阻止冻结候选进入人工亲验的、已证实的本地强制需求缺口；本地独立验收工作包可按报告限制交付进入人工 b。报告限制标记为 40/61/62/102 条件限制、43 不适用、56 独立 PASS、70 额外 probe；线上差异归上线日志。App operator 已提供，目前仅静态检查、尚未实启。完整报告入口仍为 QA 原工作树 `specs/050-vlogo-first-launch-local/verification/report.html`（`my-tests`）；本官网 worktree 未访问该报告或 QA 在途文件。上述交付资格不表示已完成人工亲验，也不表示发布或提交；官网隐私文案本地自验结论保持不变，官网未发布。

## 本仓验收记录

- VDEV-02：[`evidence/results.md`](evidence/results.md) 记录 Chrome 155 / Playwright pipe 下的本地 stable fixture、制品下载拦截与状态分支；不验证真实 CDN、stable 指针或线上可达性。
- VDEV-04：[`evidence/vdev-04-results.md`](evidence/vdev-04-results.md) 记录 GA4 本地浏览器结果和五张截图。有效事件、无 ID 失败关闭、敏感 query canary 与无效/撤回状态均通过；Google 事件端点被拦截，没有发出真实事件。
- 本轮未执行任何既有测试、构建或线上探测。这里只引用已留存记录。

## 文件变更导读（WIP）

这棵工作树包含官网 Stage03 下载接线和 Stage04 GA4 候选，不能把全部差异归为产品仓 Stage06；该产品报告与官网改动是两个独立证据来源。

| 归因 | 路径 | 变化与关系 |
|---|---|---|
| 主干 | `index.html` | 唯一 tracked 修改，当前相对 HEAD 基线 `+225/-11`。加入 release card、stable JSON 校验/渲染与 ZIP/DMG 链接（Stage03）；加入空 GA4 meta、有效配置才加载 tag、`page_view` 和 `download_click`（Stage04）；后续追加隐私文案，见本文件末尾冻结附记。这些都是本仓用户可见行为。 |
| 伴生文档 | `specs/download-distribution/spec.md`、`README.md` | 描述 stable 元数据、制品 URL 校验、页面状态、GA4 事件及部署/上线验证边界。 |
| 伴生验收源码 | `specs/download-distribution/evidence/browser-check.mjs`、`vdev04-browser-check.mjs` | Playwright pipe 浏览器验收入口，分别覆盖下载状态与 GA4 契约。脚本依赖 `.local-evidence/vdev02-downloads/fixtures/` 和隔离 Playwright 安装。 |
| 伴生验收记录 | `evidence/results.md`、`evidence/vdev-04-results.md`、`evidence/vdev04-handoff.md` | 保存 Stage03/04 本地运行事实、截图入口和上线后待验证项；handoff 中“浏览器未执行”的文字是运行前交接状态，之后的实测应以 VDEV-04 results 为准。 |
| 伴生视觉证据 | `evidence/vdev02-*.png`（9 张）、`evidence/vdev04-ga-*.png`（5 张） | 本地浏览器截图。图像重复内容有相同 SHA-256，见下方指纹清单；未改动旧文件。 |
| 本地验收数据 | `.local-evidence/vdev02-downloads/fixtures/*.json`（6 个） | 合成 stable metadata fixtures；浏览器 harness 当前直接引用这些路径。它们不是真实发布元数据。 |
| 本地运行产物 | `.local-evidence/vdev02-downloads/tmp.YVwMsW/` | Playwright 安装 116 个文件、npm cache 6 个文件，以及复制页面/脚本、HTTP 日志、fixture 响应和各 40B 合成 DMG/ZIP 下载。不是官网源文件或发布制品，不列入拟提交路径。 |
| 本次新材料 | `specs/download-distribution/stage06-frozen-delivery.md` | 本冻结记录。为避免自引用循环，不在本文件的指纹表中哈希本文件；本文件自身 SHA-256 在完成后由回传给出。 |

对外可见面：默认获取 `https://vlogo-dl.dijingchao.com/releases/channels/stable.json` 并依其内容显示 macOS Apple Silicon DMG/ZIP；有效链接直接指向制品地址；部署方可通过空白 `ga4-measurement-id` meta 配置 GA4。该官网没有新增服务端 API、CLI、数据库 schema 或构建步骤。下载及事件行为影响官网访客与部署官网的人员。

## 下载包与 metadata 接口要求

本仓官网是发布 metadata 的只读消费者，不构建或上传 Vlogo 包。根据本仓 spec、页面实现和本地 fixture，官网侧接口约束如下：

- Metadata URL：`GET https://vlogo-dl.dijingchao.com/releases/channels/stable.json`；跨域 JSON 必须允许 `https://vlogo.0xyz.com` 读取（CORS 尚未线上验证）。
- 顶层：`schemaVersion: 1`、`channel: "stable"`、可解析时间 `updatedAt`、SemVer `latest`、`releases[]`。
- 被 `latest` 精确指中的 release：`version` 与 latest 相同、可解析 `releasedAt`、`artifacts[]`；撤回状态可带 `withdrawn.reason`、`withdrawn.replacedBy`。
- 可下载制品：只接受 `os: "darwin"`、`arch: "arm64"`，`format: "dmg" | "zip"`，每格式至多一个；`size` 为正安全整数字节数；`sha256` 为 64 位小写十六进制。
- `url` 必须为 HTTPS，主机精确为 `vlogo-dl.dijingchao.com`，路径位于该版本的 `/releases/<version>/` 下。官网展示完整字节数与 SHA-256；包名/扩展名可作为下载文件名，但页面当前没有单独校验命名约定。
- 下载通过浏览器对 metadata 中的 HTTPS URL 发起直接 GET。线上 CDN 必须允许浏览器取包，且 URL 对应真实、不可变、与 metadata size/hash 相符的发布物。官网本地验收通过路由返回合成下载数据，不证明这些条件已在线成立。
- 仅当测量 ID 符合 `G-` + 10 位大写字母/数字时加载 tag；事件为一次 `page_view` 与有效链接点击触发的 `download_click`。下载事件字段仅 `format`、`arch`、`os`、`version`；页面地址去 query/hash。生产 ID 保持空白。

本仓只明确官网消费契约。早先产品 R3 的 API 25/UI 35 历史测试描述未在本仓展开接口详情；不从历史或局部通过数量推导产品 API、包内文件结构、签名、公证或安装器约束。具体包格式与签名策略须以产品仓发布规范为准。当前 QA 状态以本文件“QA 状态”一节所记 Captain 同步为准。

## 线上与本地差异

| 项目 | 本地已验证 | 上线尚未验证 |
|---|---|---|
| Metadata | 本地合成 JSON fixture；校验字段和失效状态 | 生产 stable JSON 当前指针、生产数据完整性、CORS 与缓存行为 |
| 下载包 | route 拦截并返回合成字节；点击流程与事件触发 | CDN DNS/TLS/CORS（若需要）、文件可达性、真实包体与 size/SHA 对应、浏览器下载兼容性 |
| GA4 | 注入测试 ID；tag 替身；Analytics 端点被拦截，零真实请求 | 配置真实 Measurement ID、生产 tag 加载、属性接收与报表回流 |
| 产品 QA | `101031` 完整 FAIL 保留；`110000` 为 75→96–99 定向验证通过，不拼成 full PASS；QA 最终 return 认为可按报告限制交付进入人工 b | 仍待人工亲验；未提交、未发布；QA 报告入口见“QA 状态”一节；官网本地自验不替代 App 验收 |

未发起公网业务请求、云 API、真实 GA 发送、部署或账号写入。

## 候选路径与指纹

算法：SHA-256。以下列出当前混合候选里的源码、文档、metadata fixtures 和截图。新建的本冻结记录自身排除以免循环；本地依赖与 npm cache 不纳入候选源码/doc 指纹。Git 状态确认 `CNAME`、`README.md`（仓库根）、`llms.txt`、`og-image.jpg`、`robots.txt` 未修改。

### Tracked 与候选文档/源码

以下指纹表是 2026-10-18 Stage06 冻结时的历史快照。表内 `index.html` 的 `ab985…` 不代表当前 WIP；当前指纹以文末 2026-10-19 附记为准，原始历史值保留用于追溯。

| 状态 | 路径 | SHA-256 |
|---|---|---|
| Modified | `index.html` | `ab985faaa7d808243f007264d748cff1c2c3479aed32a4aa60aee178bc11f978` |
| Untracked | `.local-evidence/vdev02-downloads/fixtures/available.json` | `8c9b8746e1970a13ebdd00ee5ac9cec9c83a4c87707833da9df050af09ee79c3` |
| Untracked | `.local-evidence/vdev02-downloads/fixtures/invalid.json` | `99cdb8a152cf3e99cb1a8e5ba29189605a476a6a6298e8eba47fe59fe060bbb4` |
| Untracked | `.local-evidence/vdev02-downloads/fixtures/no-artifacts.json` | `7a4dcebf25406d0c94514bb92b2fc76cadba4447311b71471719516fd8934ea2` |
| Untracked | `.local-evidence/vdev02-downloads/fixtures/untrusted-url.json` | `b0a780eedef20aa29335daa08c26036f31a2e594347decf3d744b7ca8d5fe641` |
| Untracked | `.local-evidence/vdev02-downloads/fixtures/withdrawn.json` | `9d780dbc419fd7313102c26a6d0493bc7dcd70db357ce168d8aaa092fa56dc7c` |
| Untracked | `.local-evidence/vdev02-downloads/fixtures/zip-only.json` | `88771c601de04519cd0c53b2f247ab498807ab444bfe364b953a64c7f0f07d5f` |
| Untracked | `specs/download-distribution/README.md` | `39978ae92fe751494b8e36659183e047726c00ad0288829bd486308c91ae41b7` |
| Untracked | `specs/download-distribution/spec.md` | `c97df41b12220918275bff3a6c8e1109c64ee7e03e56ce34435d02642e22c2af` |
| Untracked | `specs/download-distribution/evidence/browser-check.mjs` | `81b32d28ce41e326711945baf8795a75369a341a8a724c817e8b8c311273a868` |
| Untracked | `specs/download-distribution/evidence/results.md` | `6ec8212e2bf6017480b7340402bf3860d5c303da160d9cb6698a9a9cd0cfafdb` |
| Untracked | `specs/download-distribution/evidence/vdev-04-results.md` | `a39ab737cdf3571723057d0a4d518e1820c537bb72cfb57dcfb2944a4a14c6cd` |
| Untracked | `specs/download-distribution/evidence/vdev04-browser-check.mjs` | `9695a0262be8a316bdc328786f5ccdb00da0f3f89b90266997b569b058276405` |
| Untracked | `specs/download-distribution/evidence/vdev04-handoff.md` | `2a40767c4731c3beff11345f00b5d36b3ebe93bad35d2adbb4576422d4949dcf` |

### 浏览器截图

| 路径 | SHA-256 |
|---|---|
| `specs/download-distribution/evidence/vdev02-invalid-metadata.png` | `c8cdc7e21d4ddffab26e360efa0ea4eaf3de9593bebb54c3bd00769e90926d23` |
| `specs/download-distribution/evidence/vdev02-load-failure.png` | `085f37839d1aee17dcb5ca8e87dc9f2219ca64bcbf67df4832186c1db33dd354` |
| `specs/download-distribution/evidence/vdev02-narrow-available.png` | `205044cbd15e4774faf777e326f7e16dd676e9b75d85f8f08a403a0651e7aafc` |
| `specs/download-distribution/evidence/vdev02-network-failure.png` | `7e3edf527e776ec53eaa74040b84ebcd55e917e7df2f2e6d393cbbdca1f8424a` |
| `specs/download-distribution/evidence/vdev02-no-artifacts.png` | `a84292c2c35a60abda084d645dc531b27dafe00eae2667704ae2ad3bc1aad41b` |
| `specs/download-distribution/evidence/vdev02-untrusted-url.png` | `c8cdc7e21d4ddffab26e360efa0ea4eaf3de9593bebb54c3bd00769e90926d23` |
| `specs/download-distribution/evidence/vdev02-wide-available.png` | `9a0a6bd461bd6e290823538bc443e207cb4433eda4541c55b421a45eecd6548c` |
| `specs/download-distribution/evidence/vdev02-withdrawn.png` | `830469a0f3f9b528027abef88ac1af19e13f4f586045adb6b54fb1f44fcc655a` |
| `specs/download-distribution/evidence/vdev02-zip-only.png` | `1cfd06416777f3d6ac84400e4adfde3ef1dae918604f275860ca042b21b7cedd` |
| `specs/download-distribution/evidence/vdev04-ga-downloads.png` | `bfbdea76417e66d54a95c371fd72cdc622f570f0a1eb61167d2e10b62b7aa0c7` |
| `specs/download-distribution/evidence/vdev04-ga-invalid-no-download.png` | `c8cdc7e21d4ddffab26e360efa0ea4eaf3de9593bebb54c3bd00769e90926d23` |
| `specs/download-distribution/evidence/vdev04-ga-narrow.png` | `205044cbd15e4774faf777e326f7e16dd676e9b75d85f8f08a403a0651e7aafc` |
| `specs/download-distribution/evidence/vdev04-ga-no-artifact.png` | `a84292c2c35a60abda084d645dc531b27dafe00eae2667704ae2ad3bc1aad41b` |
| `specs/download-distribution/evidence/vdev04-ga-withdrawn-no-download.png` | `830469a0f3f9b528027abef88ac1af19e13f4f586045adb6b54fb1f44fcc655a` |

### 本地运行文件（未列为拟提交项）

这部分来自更早的本地验收工作树，冻结前仅盘点，未修改。以下哈希用于区分可见的非依赖运行文件；隔离依赖目录有 116 个文件，npm cache 有 6 个文件，未逐项读源码或哈希。

| 路径 | SHA-256 |
|---|---|
| `.local-evidence/vdev02-downloads/tmp.YVwMsW/homepage.html` | `eb43041caedda7d2c1bdc70de0b672519ad411a9f226e63bdd8d757f2dbec2b4` |
| `.local-evidence/vdev02-downloads/tmp.YVwMsW/http-server.log` | `ee5bb303a8c379b0c287dedce54d508147332da021fc11e19b6f842f6a3eeb20` |
| `.local-evidence/vdev02-downloads/tmp.YVwMsW/available.json` | `8c9b8746e1970a13ebdd00ee5ac9cec9c83a4c87707833da9df050af09ee79c3` |
| `.local-evidence/vdev02-downloads/tmp.YVwMsW/harness/package-lock.json` | `6c9b1672acada88060d827318d9fccbe2f9b470bbd98452be1178e04f43f8d45` |
| `.local-evidence/vdev02-downloads/tmp.YVwMsW/harness/package.json` | `e62905207b92a4620b2c67f68ed042e1b0864d5df79aa79c79e05cfb2edc9f2c` |
| `.local-evidence/vdev02-downloads/tmp.YVwMsW/website.js` | `769e90ad80921e25c404cb1ae951bb4cd0dbcd9c10ca1903b1156f89eb742fd0` |
| `.local-evidence/vdev02-downloads/tmp.YVwMsW/downloads/Vlogo-9.9.9-test.1-darwin-arm64.zip` | `7b6c33b7b21b8032a7e3db1d31e46cd15fe84ac6a48ef89563e45faec895fa10` |
| `.local-evidence/vdev02-downloads/tmp.YVwMsW/downloads/Vlogo-9.9.9-test.1-darwin-arm64.dmg` | `844a1712bbe9f8a035a6aebc50c1d7d96bc240fe6fe8e6a8def429bca9c230fe` |

## 中文 PR 草稿（未发布）

### Summary

```text
官网 index.html
  ├─ stable.json → 校验 stable/latest 与 darwin/arm64 制品 metadata
  ├─ 有效 DMG/ZIP → 显示大小、SHA-256 与直接下载链接
  └─ 有效部署 Measurement ID → page_view / download_click
       空/无效 ID → 不加载 tag、不排队事件
```

官网下载入口消费 stable release metadata，并为访客提供 macOS Apple Silicon DMG/ZIP；GA4 接线仅在部署配置有效 ID 后启用。该工作树还含 Stage03/Stage04 混合候选；产品 R3 报告是独立验收。

### Evidence

- **Before:** 官网下载入口此前为禁用 CTA；产品仓旧 R3 run `20261018-022503-1936-1` 曾由 Captain 亲核 PASS（API 25 PASS；UI 35 PASS、12 SKIP、0 FAIL），仅作为历史信息。当前产品 QA 状态见“QA 状态”一节。
- **After:** 本仓既有 Playwright pipe 记录：[VDEV-02](evidence/results.md) 与 [VDEV-04](evidence/vdev-04-results.md)。截图见 `evidence/` 下 `vdev02-*.png`、`vdev04-ga-*.png`。本地验收不覆盖真实 CDN 或 GA；真实线上行为未验证。

### Merge Danger

**Door:** two-way；官网静态 HTML 可回滚。

**Blast Radius:** 官网下载

访客会从 stable JSON 获取公开下载链接；配置 GA ID 后会加载 Google tag 并发送约定事件。合并前需确保 production stable metadata/CORS/CDN 与真实包体已配置；GA 测量 ID 目前为空。

## 拟提交路径（草稿）

建议候选提交路径：

- `index.html`
- `specs/download-distribution/README.md`
- `specs/download-distribution/spec.md`
- `specs/download-distribution/evidence/browser-check.mjs`
- `specs/download-distribution/evidence/results.md`
- `specs/download-distribution/evidence/vdev-04-results.md`
- `specs/download-distribution/evidence/vdev04-browser-check.mjs`
- `specs/download-distribution/evidence/vdev02-*.png`
- `specs/download-distribution/evidence/vdev04-ga-*.png`
- `.local-evidence/vdev02-downloads/fixtures/*.json`（六份合成 metadata fixture，供浏览器脚本使用）

`.local-evidence/` 还含本地运行依赖、npm cache、临时下载与浏览器运行文件；这些均不属于候选，不提交。六份合成 JSON fixture 显式纳入本次候选，以满足浏览器脚本对固定路径的引用。`vdev04-handoff.md` 是轮换文档，不是建议发布文档；`stage06-frozen-delivery.md` 是本地冻结记录，是否随 PR 发布可由 Captain 决定。未暂存、提交或推送任何文件。

## 后续官网文案 delta（2026-10-18）

Stage06 原始指纹记录是当时的混合候选快照；此后官网 `index.html` 增加隐私说明文案，不改变原 Stage03 下载 / Stage04 GA4 候选身份。当前身份：HEAD `3ca752ae6c7a16f5f9f52b7b5a1a64a94f015469`，分支 `vdev-02-local-downloads`；`index.html` 仍为未提交 WIP。历史冻结 index SHA 为 `ab985faaa7d808243f007264d748cff1c2c3479aed32a4aa60aee178bc11f978`；当前 index 为 297445 bytes，SHA-256 `5769c8c306ac419283a3167bdcfa5d9ef5bd5e123c59970ea44cb45f771835a3`。

历史隐私文案审阅入口曾为 6463 bytes（SHA-256 `0baf3f794b9fdd13cbf0c7c97caa9c6a3bf3b847669113c8aac8875648a32aac`），历史运行记录为 3094 bytes（SHA-256 `8d4c7fa330a2760cce6941775f77fa20eb08e5fbb90b19ca55a97e1fba888125`）；两者均为旧文案版证据。当前负责人反馈后的报告入口为 [privacy-copy-review.html](evidence/privacy-copy-review.html)（3901 bytes，SHA-256 `b0f9b75650843af9c8166c0e40b70989f0131ecc27a7e0498c4825619d7c7b23`），README 链接该报告；旧版详细运行记录不纳入本候选。报告中的本地自验不等于 Captain 所述独立 QA 全量回归，也不表示 App 通过或线上发布。官网 WIP 不改变 Vlogo App 628 源码或包身份。

## Captain 提供的外部交付绑定（官网席未访问或核验目标）

以下路径、大小和摘要由 Captain 核实后提供；官网席仅将其登记于本冻结文档，未打开目标、检查文件存在性或独立校验摘要。

| 项目 | 绝对路径 | 大小 | SHA-256 |
|---|---|---:|---|
| R5 ZIP | `/Users/alswl/dev/github.com/alswl/vlogo/.claude/worktrees/cloud-preparation-docs/frontend/release/Vlogo-0.1.0-darwin-arm64.zip` | 410193008 bytes | `876b1e3e6ecca4b45c93f3badfc3c96cfb70abac6981227b1df6319a6d2bec7f` |
| R5 DMG | `/Users/alswl/dev/github.com/alswl/vlogo/.claude/worktrees/cloud-preparation-docs/frontend/release/Vlogo-0.1.0-darwin-arm64.dmg` | 619308811 bytes | `1424a18950fd4e8bb01398854ef8520943998e328522ecb6c7f356c8e067e01d` |
| 上线日志入口 | `/Users/alswl/dev/forgejo.localhost/i/my-logbooks/.claude/worktrees/belute-gaminess-skinworm/projects/vlogo/docs/2026-10-first-launch.md` | — | — |
| operator 说明 | `/Users/alswl/dev/github.com/alswl/my-tests/050-vlogo-first-launch-local/specs/050-vlogo-first-launch-local/verification/local-fixture-operator.md` | — | — |

R5 source 的既有标识仍仅为 Captain 提供的前缀 `17627ae8…`；本次同步未提供其完整路径、大小或 SHA-256。上线日志/operator 路径是交付清单绑定，不代表线上差异已由官网席验证；其余线上待验仍按“线上与本地差异”表记录。

## 官网宣传文案反馈 delta（2026-10-19）

负责人本轮反馈后，官网宣传卡片文案更新为“原片不上云，安心剪辑”及“原始视频保留在你的设备上，本地完成素材处理。使用 AI 功能时，仅发送必要的分析数据。”本轮仅更新官网候选文案与对应审阅证据；不改变 App 冻结源码或 ZIP/DMG 包身份，也不表示零上传、零留存或已发布。Stage06 原始官网身份和 2026-10-18 隐私文案指纹作为历史记录保留，不被本次候选覆盖。

本轮官网候选 `index.html` 为未提交 WIP，大小 297273 bytes，SHA-256 `a39f189d744b70e4bf35af08fe31c2cbbe5050cab7785f2950a96bfe00ebeb85`。审阅报告入口：[privacy-copy-review.html](evidence/privacy-copy-review.html)。报告中的桌面/窄屏截图来自本树隔离本地运行 `.local-evidence/privacy-copy-review-20261019-1918/desktop-1440.png` 与 `mobile-390.png`，并以相同字节副本保存在 `evidence/privacy-copy-desktop-1440.png` 与 `evidence/privacy-copy-mobile-390.png` 供 PR 报告显示；原有旧截图及指纹继续留存于旧证据目录和报告折叠历史中。

仅按本地 `index.html` 的 href 检查，未发现隐私告知或隐私政策入口；未访问外网，也未据此推断隐私告知或协议本身的内容。
