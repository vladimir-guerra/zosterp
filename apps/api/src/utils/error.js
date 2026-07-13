import getLocale from "./locale.js";

export default async function handleErrors(err, req, res, _next) {
  try {
    const { status = 500, message = "" } = err;
    const codes = [...new Set(message.split(",").map((c) => c.trim()))];
    const locale = await getLocale(req.language, req.locale || "api");

    let info = {};
    for (const c of codes) {
      const translation = c.split(".").reduce((obj, key) => {
        return obj && typeof obj === "object" ? obj[key] : undefined;
      }, locale);
      info[c] = translation || c;
    }

    console.error(`[ERROR ${status}]:`, info);

    return res.status(status).json({
      success: false,
      status,
      info,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  } catch (error) {
    console.error("Critical failure in error handler:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
