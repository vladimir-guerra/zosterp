import { languages } from "@repo/locales";
import { str, requiredEmail as email, requiredStr, bool } from "./shared.js";
import { z } from "zod";

const password = str.min(10, { error: "pw.short" });
const name = requiredStr.toLowerCase();
const language = z.enum(languages, { error: "lang_invalid" });
const pwValidation = [
  (d) => d.password === d.confirmPassword,
  { message: "pw.confirm", path: ["confirmPassword"] },
];

export const inputUser = z
  .object({
    name,
    surname: name,
    email,
    password,
    confirmPassword: password,
    language: language.default(languages[0]),
  })
  .refine(...pwValidation);

export const codeSchema = z.object({ code: str.length(6, "code_invalid") });
export const login = z.object({ email, password });
export const emailSchema = z.object({ email });
export const renewPassword = z
  .object({ password, confirmPassword: password })
  .refine(...pwValidation);

export const updateUser = z.object({
  has_2fa: bool.optional(),
  language: language.optional(),
});
