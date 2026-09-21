import createError from "http-errors";

/**
 * Valida req.body comparandolo con un esquema Zod. 
 * La información parseada pasa a req.data
 */
export default function validate(schema) {
  return (req, _, next) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const message = result.error.issues.map((i) => i.message).join(",");
        throw createError(400, message);
      }

      req.data = result.data;
      next();
    } catch (error) {
      return next(error);
    }
  };
}