import sendError from "http-errors";
import jwt from "jsonwebtoken";
import base from "../base";

/**
 * Middlewre para autenticar acciones.
 */
export const isAuth = base(async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) throw sendError(404, "Token inválido.");
  const { userId } = jwt.verify(token, process.env.JWT_ACCESS);
  req.userId = userId;
  next();
});
