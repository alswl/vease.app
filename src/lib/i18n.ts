import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import zh from "../locales/zh.json";

const languageDetector = new LanguageDetector();

await i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, zh: { translation: zh } },
    supportedLngs: ["en", "zh"],
    fallbackLng: "en",
    load: "languageOnly",
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "vease-language",
      caches: [],
      convertDetectedLanguage: (language) =>
        /^zh(?:-|$)/i.test(language) ? "zh" : "en",
    },
    interpolation: { escapeValue: false },
  });

function synchronizeLanguage(): void {
  if (typeof document === "undefined") return;
  const language = i18n.resolvedLanguage === "zh" ? "zh-CN" : "en";
  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;
}

synchronizeLanguage();
i18n.on("languageChanged", synchronizeLanguage);

export function changeLanguage(): void {
  const language = i18n.resolvedLanguage === "zh" ? "en" : "zh";
  languageDetector.cacheUserLanguage(language, ["localStorage"]);
  void i18n.changeLanguage(language);
}

export default i18n;
