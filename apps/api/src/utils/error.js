import { languages } from "@repo/locales";
import { getLocales } from ".";

const translationsCache = new Map();

export default async function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const DEFAULT_CODE = "internal_server_error";
  const rawMessage = err.message || DEFAULT_CODE;

  const codes = [...new Set(rawMessage.split(",").map((c) => c.trim()))];
  const lang = languages.includes(req.language) ? req.language : "en";

  let translations = translationsCache.get(lang);

  if (!translations) {
    try {
      translations = await getLocales(lang);
      translationsCache.set(lang, translations);
    } catch (e) {
      console.error("Error loading locales:", e);
      translations = {}; // Fallback en caso de fallo al leer locales
    }
  }

  const info = {};
  for (const c of codes)
    info[c] = translations[c] || translations[DEFAULT_CODE];

  console.error(`[Error ${status}]:`, info);

  return res.status(status).json({
    error: true,
    status,
    info,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
