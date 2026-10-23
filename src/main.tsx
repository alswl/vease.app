import i18n from "./lib/i18n";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/site.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root mount point");

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// index.html 预渲染的是中文；其他语言直接替换，避免水合不匹配。
if (i18n.resolvedLanguage === "zh" && root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
