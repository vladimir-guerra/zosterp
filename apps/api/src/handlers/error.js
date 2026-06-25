import { languages } from "@repo/locales";

const translationsCache = new Map();

export const errorHandler = async (err, req, res, _next) => {
  const status = err.status || 500;
  const rawMessage =
    typeof err.message === "string" ? err.message : "internal_server_error";

  const codes = rawMessage
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const ISE = "internal_server_error";
  const lang = languages.includes(req.language) ? req.language : "en";

  let translations;
  if (translationsCache.has(lang)) translations = translationsCache.get(lang);
  else {
    try {
      const module = await import(`@repo/locales/src/${lang}/api.json`, {
        assert: { type: "json" },
      });
      translations = module.default || module;
      translationsCache.set(lang, translations);
    } catch (e) {
      translations = {}; // Fallback seguro
    }
  }

  const info = {};
  const errorCodes = codes.length > 0 ? codes : [ISE];

  for (const c of errorCodes)
    info[c] =
      translations[c] || translations[ISE] || "An unexpected error occurred";

  console.error(`[Error ${status}]:`, info);

  return res.status(status).json({
    error: true,
    status,
    info,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
