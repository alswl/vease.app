# 版本与发布 tag

本仓独立演进自己的 SemVer 版本，发布 tag 为 `v<版本>`，不要求与其他仓同号。

| 项目 | 内容 |
| --- | --- |
| 权威来源（唯一手工维护） | `package.json` 的 `version`（当前 `1.0.0`，保留既有值） |
| 派生文件（`set` 同步写入，`check` 检测漂移） | `package-lock.json`（顶层与 `packages[""]`） |
| 独立版本（不随产品版本变化） | 官网下载区显示的 App 版本来自 App 渠道元数据，是 vease-app 的版本，与官网自身版本分开。 |
| 已有 tag | 当前没有 tag。 |

## 发布入口接入

仓库里没有发布或部署脚本（Cloudflare Workers Static Assets 的部署在仓库外执行）。部署前运行 `check --release`，需要时对构建出的 `dist` 归档使用 `--artifact`；后续部署作业接入这一步。

## 命令

| 命令 | 作用 |
| --- | --- |
| `scripts/semver-release.sh show` | 打印权威来源中的版本 |
| `scripts/semver-release.sh set <SemVer>` | 同时写入权威来源和全部派生文件；拒绝非 SemVer、`v<版本>` 已存在的版本。不做任何 Git 操作 |
| `scripts/semver-release.sh check [--expected-commit <sha>] [--artifact <文件>]... [--image-digest sha256:<hex>] [--manifest <路径>]` | 候选检查，输出发布清单 JSON |
| `scripts/semver-release.sh check --release ...` | 发布门禁：在候选检查之上，要求 `v<版本>` 已存在且指向 HEAD |

`check` 按顺序拒绝以下情况，任何一项不满足都以非零退出：

1. `--root` 不是 Git 仓库顶层（防止误查上层仓库）。
2. 版本不是 SemVer `MAJOR.MINOR.PATCH[-预发布][+构建]`。
3. 派生文件与权威来源不一致（版本漂移）。
4. 工作区不干净：已跟踪文件改动、已暂存改动、未被 `.gitignore` 忽略的未跟踪文件，都可能进入构建，一律拒绝。被忽略的 `.scratch/`、构建产物不计。
5. 指定了 `--expected-commit` 但 HEAD 不同。
6. `v<版本>` 已存在但指向其他提交。已发布的 tag 不移动、不复用，换提交必须先升版本。
7. 带 `--release` 时 `v<版本>` 不存在。

tag 状态：不存在时候选检查通过（`tag_state: absent`），用于无 tag 的候选构建；存在且指向 HEAD 时两种模式都通过（`tag_state: at-commit`），用于发布前核验。

工具只执行只读 Git 命令，不会创建、移动或删除 tag；它会忽略继承的 `GIT_DIR`、`GIT_WORK_TREE`、`GIT_INDEX_FILE` 等变量，只检查 `--root` 指定的仓库。

## 发布步骤

1. 候选冻结：`set <版本>`，提交，确认 `check` 通过（此时 tag 不存在）。
2. 获得 Git 操作授权后，由人创建 tag：`git tag -a v<版本> <候选提交>`，并推送。
3. 发布前运行 `check --release --expected-commit <候选提交>`，带上适用的 `--artifact` 或 `--image-digest`，用 `--manifest` 写出清单。不适用的字段留空，不填占位值。

清单字段：`repository`、`version`、`source`、`derived`、`tag`、`tag_state`、`commit`、`release`、`artifacts`（`name`、`sha256`、`size`，由工具对文件计算）、`image_digest`（由调用方给出，只校验格式）。清单请写到被忽略的目录（如 `.scratch/release/`）或仓库外，否则下一次检查会因为未跟踪文件而失败。
