# 国际化 / Internationalization

Landing 页使用 `i18next`、`react-i18next` 和 `i18next-browser-languagedetector`。
中英文文案分别维护在 `src/locales/en.json`、`src/locales/zh.json`，两个文件的 key 应保持一致。
组件使用 `useTranslation()`；含换行、强调或渐变样式的文案使用 `<Trans>`。

默认语言为英文；首次访问根据浏览器首选语言选择中英文，其余语言回退为英文。
语言选择通过 detector 的 `cacheUserLanguage` 接口存储，只有手动切换时写入偏好。
手动切换的选择保存在 `localStorage` 的 `vease-language`，优先于浏览器语言，并兼容已有的 `zh-CN` 值。
语言资源随静态站点打包，无需翻译服务或后端。当前首页展示下载即将开放提示，不请求下载元数据。
构建时预渲染中文首页。`index.html` 中的 title、description、canonical 和分享元数据为静态内容，不随浏览器语言切换。浏览器端更新文档的 `lang` 和 `data-language`。

Landing copy lives in `src/locales/en.json` and `src/locales/zh.json`, rendered with
`useTranslation()` and `<Trans>`. English is the fallback; a Chinese browser preference
selects Chinese. Manual choices take precedence and persist under `vease-language`.
Resources are bundled locally. The current landing page shows a coming-soon download message and does not request release metadata.
The build prerenders Chinese content. Title, description, canonical, and social metadata in `index.html` remain static when visitors switch languages. The browser updates the document’s `lang` and `data-language` attributes.

[开发文档 / Developer docs](README.md) · [文档首页 / Documentation](../README.md)
