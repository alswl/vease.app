# 校验与测试 / Validation and tests

以下命令在仓库根目录执行。
Run the command from the repository root.

## 当前首页 / Current landing page

`src/App.tsx` 默认使用 `DownloadSection`，展示下载即将开放提示，不请求 stable 元数据。仅当构建变量 `VITE_RELEASE_DOWNLOADS_ENABLED=true` 时挂载 `ReleaseDownloadSection`。本地可用 `?fixture=alpha-candidate#download` 验证已登记候选映射；这不表示生产已开放下载。完整准备范围见 `docs/first-launch/download-readiness.md`。
The default build shows three platform cards without requesting metadata. Only an exact `VITE_RELEASE_DOWNLOADS_ENABLED=true` enables Apple Silicon release metadata; macOS Intel and Windows always remain non-interactive coming-soon cards. Local fixtures do not establish public download availability.

## 下载元数据模块 / Release metadata module

`src/lib/releases.ts` 使用 Zod schema 校验并推导类型。版本格式由 `semver` 校验，只接受无前缀、无空白、无 build metadata 的规范版本号。
URL 白名单、版本路径、格式唯一性、完整 SHA-256 和正整数字节数均须通过校验。撤回版本不暴露制品。

## 运行测试 / Run tests

```bash
npm test
```

回归测试使用本地合成 fixtures，不请求生产服务；PR CI 同时运行测试和构建。

截图来源与验证范围见[截图说明](../../src/assets/README.md)。历史截图不代表本次运行或生产验证。
See [screenshot provenance](../../src/assets/README.md) for capture scope. Historical captures do not represent a new run or production verification.

[开发文档 / Developer docs](README.md) · [文档首页 / Documentation](../README.md)
