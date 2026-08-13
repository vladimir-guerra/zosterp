import createError from "http-errors";

/**
 * Valida req.body comparandolo con un esquema Zod. 
 * La información parseada pasa a req.data
 */
export default function validate(schema) {
  return (req, _, next) => {
    try {
      // Usamos safeParse en lugar del antiguo validate de Joi
      const result = schema.safeParse(req.body);

      // Si la validación falla
      if (!result.success) {
        // Zod guarda los errores en "issues"
        const message = result.error.issues.map((i) => i.message).join(",");
        throw createError(400, message);
      }

      req.data = result.data;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}