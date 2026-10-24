# 校验与测试 / Validation and tests

以下命令在仓库根目录执行。
Run the command from the repository root.

## 当前首页 / Current landing page

`src/App.tsx` 使用 `DownloadSection`，展示下载即将开放提示。它不挂载 `ReleaseDownloadSection`，也不请求 stable 发布元数据。下述元数据测试覆盖保留的模块，不代表当前首页已开放下载。
`src/App.tsx` renders `DownloadSection`, which shows a coming-soon message. It does not mount `ReleaseDownloadSection` or request stable metadata. The metadata tests cover the retained module and do not establish that downloads are available on the landing page.

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
