# Vlogo 秒剪 — Home

[Vlogo 秒剪](https://github.com/alswl/vlogo) 的静态 landing page，使用 Vite、React 与 TypeScript 构建，由 GitHub Pages 托管。

- 线上地址：<https://vlogo.0xyz.com/>（`public/CNAME` 在构建时复制到发布根目录）

## 开发

```bash
npm ci
npm run dev
```

## 构建与本地静态预览

```bash
npm run build
npm run preview
```

构建结果写入 `dist/`，Vite 使用 `/` 作为自定义域名的站点 base。
