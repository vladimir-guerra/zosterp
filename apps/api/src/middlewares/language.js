import { languages } from "@repo/locales";

export const getLanguage = async (req, res, next) => {
  try {
    if (req.cookies.language) {
      req.language = req.cookies.language;
      return next();
    }
    const rawPrefix = req.headers["accept-language"] || "en";
    const parsedPrefix = rawPrefix
      .split(",")[0]
      ?.split("-")[0]
      ?.trim()
      .toLowerCase();
    req.language = languages.includes(parsedPrefix) ? parsedPrefix : "en";
    res.cookie("language", req.language, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    });
    next();
  } catch (error) {
    next(error);
  }
};
