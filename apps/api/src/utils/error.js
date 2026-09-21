export default async function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  
  console.error(`[Error ${status}]:`, err);

  return res.status(status).json({
    error: true,
    status,
    message: err.message || "Error interno del servidor",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}