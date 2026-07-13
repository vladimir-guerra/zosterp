import createError from "http-errors";
import { validateData } from "@repo/schemas";

/**
 * Valida la información entrante en req.body y la inserta en req.data
 * * @param schema - Un esquema Zod para la comparación
 */
export default function validate(schema) {
  return (req, _res, next) => {
    const result = validateData(schema, req.body);
    if (!result.success) {
      req.locale = "schema";
      return next(createError(400, result.error));
    }
    req.data = result.data;
    next();
  };
}
