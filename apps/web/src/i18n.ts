import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { locales, languageList } from "@repo/locales";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    fallbackLng: "en",
    supportedLngs: languageList,
    interpolation: {
      escapeValue: false,
    },
    resources: locales,
  });

export default i18n;
