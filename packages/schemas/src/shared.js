import { z } from "zod";

export const str = z.string({ error: "str.invalid" }).trim();
export const requiredStr = str.min(1, { error: "str.required" });

export const email = z.email({ error: "email.invalid" });
export const requiredEmail = email.min(1, { error: "email.required" });

export const bool = z.boolean({ error: "bool_invalid" });

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
