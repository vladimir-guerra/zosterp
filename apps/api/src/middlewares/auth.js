import jwt from 'jsonwebtoken';
import createError from "http-errors";

export const isAuth = async (req, _res, next) => {
  let decoded = jwt.verify(req.token, process.env.JWT_ACCESS_SECRET);
  req.user = { id: decoded.userId };
  next();
};

export const getToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw createError(401, "Token no proporcionado o formato inválido")
  
  req.token = authHeader.split(" ")[1];
  next();
};