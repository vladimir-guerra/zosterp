import createError from "http-errors";

export const validate = (schema) => {
  return (req, _, next) => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const message = error.details.map((d) => d.message).join(",");
        throw createError(400, message);
      }

      req.data = value;
      return next();
    } catch (error) {
      return next(error);
    }
  };
};