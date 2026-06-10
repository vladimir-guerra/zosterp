import enBase from "./en/base.json";
import esBase from "./es/base.json";

export const locales = {
  en: {
    translation: {
      ...enBase,
    },
  },
  es: {
    translation: {
      ...esBase,
    },
  },
};

export type Language = keyof typeof locales;
export const languageList = Object.keys(locales) as [Language, ...Language[]];
