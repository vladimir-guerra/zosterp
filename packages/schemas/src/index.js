import { z } from "zod";

export const emailSchema = z.string().email("Email inválido");
const passwordSchema = z.string().min(8, "Contraseña debe tener más de 8 caracteres.");

export const insertUserSchema = z
  .object({
    name: z.string().min(1, "Nombre obligatorio"),
    surname: z.string().min(1, "Apellido obligatorio"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirme su contraseñaa"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export const newPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirme su contraseñaa"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const companySchema = z.object({
  id: z.uuid().optional(),
  socialReason: z.string().min(1, "SOCIAL_REASON_REQUIRED"),
  commercialName: z.string().min(1, "COMMERCIAL_NAME_REQUIRED"),
  type: z.string().min(1, "INDUSTRY_REQUIRED"),
});

export const insertTaskSchema = z.object({
  id: z.uuid().optional(),
  parentId: z.uuid().optional(),
  title: z.string().min(1, "NAME_REQUIRED"),
  description: z.string().optional(),
  approxFinishDate: z.string().optional(),
  startedAt: z.string(),
});

export const recoverPasswordSchema = z.object({
  email: emailSchema,
});

export const twoFASchema = z.object({
  code: z.string().length(6, "El código debe tener 6 dígitos"),
});