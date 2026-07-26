import createError from "http-errors";
import { validateData } from "@repo/schemas";
import base from "../base.js";

/**
 * Middleware para validar datos entrantes en req.body.
 * @param {ZodSchema} schema - Un esquema zod utilizado para la validación.
 * @returns {Function} Middleware de manejo de errores centralizado.
 */
export default function validate(schema) {
  return base(async (req, res, next) => {
    const result = validateData(schema, req.body);
    if (!result.success) throw createError(400, result.error);
    req.data = result.data;
    next();
  });
}
