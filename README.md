# Vease · vease.app

官网 / Website：**[vease.app](https://vease.app/)**

Vease 是面向 macOS Apple Silicon 的 AI 视频剪辑应用，主打「一分钟出片」。导入一个素材文件夹，AI 帮你挑镜头、排故事、剪出第一版；成片时长由你选择。预览后，直接说出想改的地方，确认满意再导出。当前为邀请内测，使用 App 需邀请码，DMG 下载链接将稍后提供。

Vease is an AI video editing app for macOS Apple Silicon, built around getting a video in one minute. Import a folder of footage and let AI pick shots, shape a story, and make a first cut. Choose your video length, preview the result, ask for changes, and approve the export. The app is in private beta and requires an invitation code; a DMG download link is coming soon.

本仓库为 Vease 静态官网，支持简体中文和 English，使用 Vite、React 与 TypeScript 构建，由 Cloudflare Workers Static Assets 托管。

This repository contains the Vease static website in Simplified Chinese and English, built with Vite, React, and TypeScript and hosted on Cloudflare Workers Static Assets.

## 快速开始 / Quick start

在仓库根目录执行以下命令，启动本地开发服务器。
Run these commands from the repository root to start the development server.

```bash
npm ci
npm run dev
```

构建、预览与环境说明见[本地开发与构建](docs/dev/setup.md)。
See [local development and build](docs/dev/setup.md) for build, preview, and environment details.

## 文档 / Documentation

从[文档首页 / Documentation](docs/README.md)进入，或按任务选择：
Start with the documentation index, or choose a task below.

<a id="开发--development"></a>
<a id="构建与本地静态预览--build-and-preview"></a>
<a id="国际化--internationalization"></a>
<a id="校验与测试--validation-and-tests"></a>

| 任务 / Task | 文档 / Document |
|---|---|
| 开发、构建与预览 / Develop, build, preview | [本地开发与构建 / Local development and build](docs/dev/setup.md) |
| 查看静态发布设置 / Check static delivery settings | [静态站点发布 / Static site delivery](docs/dev/deployment.md) |
| 修改翻译与语言选择 / Edit translations and language selection | [国际化 / Internationalization](docs/dev/internationalization.md) |
| 校验下载元数据与运行测试 / Validate download metadata and run tests | [校验与测试 / Validation and tests](docs/dev/validation.md) |
| 查看截图来源与采集范围 / Check screenshot provenance and scope | [Product screenshots](src/assets/README.md) |
