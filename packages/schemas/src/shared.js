import { z } from "zod";

export const str = z.string({ error: "Valor inválido" }).trim();
export const requiredStr = str.min(1, { error: "Campo obligatorio" });
export const requiredUuid = z
  .uuid({ error: "UUID inválida" })
  .min(1, { error: "UUID requerida" });

export const requiredEmail = z
  .email({ error: "Email inválido" })
  .min(1, { error: "Email obligatorio" });

export const bool = z.boolean({ error: "Bool inválido" });

export const validateData = (schema, data) => {
  const r = schema.safeParse(data);
  if (!r.success) {
    return {
      success: false,
      error: r.error.issues.map((i) => i.message).join(","),
    };
  }
  return { success: true, data: r.data };
};
