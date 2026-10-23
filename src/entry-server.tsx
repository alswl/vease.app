import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import i18n from "./lib/i18n";

// 预渲染与 index.html 的 lang、title、description 保持一致，固定中文。
export async function render(): Promise<string> {
  await i18n.changeLanguage("zh");
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
