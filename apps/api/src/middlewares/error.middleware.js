/**
 * Middleware para manejar devolución de errores.
 * @returns {Function} Middleware de manejo de errores centralizado.
 */
export default function handleErrors(err, req, res, next) {
  try {
    const status = err.status || err.statusCode || 500;
    const message =
      typeof err.message === "string" ? err.message : "Internal Server Error";

    const errors = [...new Set(message.split(",").map((c) => c.trim()))];
    const info = { errors };

    console.error(`[ERROR ${status}]:`, err);

    return res.status(status).json({
      success: false,
      status,
      info,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  } catch (error) {
    console.error("Critical failure in error handler:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
