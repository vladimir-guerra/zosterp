import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { languages } from "@repo/locales";
import ResourcesToBackend from "i18next-resources-to-backend";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    ResourcesToBackend(
      (lng, ns) => import(`../../../../packages/locales/src/${lng}/${ns}.json`),
    ),
  )
  .init({
    ns: ["web", "schemas", "api"],
    defaultNS: "web",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    fallbackLng: "en",
    supportedLngs: languages,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
