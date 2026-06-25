import { languages } from "@repo/locales";

export const getLanguage = async (req, _res, next) => {
  try {
    const rawPrefix = req.headers["accept-language"] || "en";
    const parsedPrefix = rawPrefix
      .split(",")[0]
      ?.split("-")[0]
      ?.trim()
      .toLowerCase();
    req.language = languages.includes(parsedPrefix) ? parsedPrefix : "en";
    return next();
  } catch (error) {
    return next(error);
  }
};
