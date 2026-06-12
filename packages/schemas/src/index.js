import { z } from "zod";

const emailSchema = z.email("INVALID_EMAIL");
const passwordSchema = z.string().min(8, "PW_TOO_SHORT");

export const insertUserSchema = z
  .object({
    name: z.string().min(1, "NAME_REQUIRED"),
    surname: z.string().min(1, "SURNAME_REQUIRED"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "CONFIRM_PW_REQUIRED"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "PW_DONT_MATCH",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const companySchema = z.object({
  id: z.uuid().optional(),
  socialReason: z.string().min(1, "SOCIAL_REASON_REQUIRED"),
  commercialName: z.string().min(1, "COMMERCIAL_NAME_REQUIRED"),
  industry: z.string().min(1, "INDUSTRY_REQUIRED"),
  email: emailSchema,
});

export const insertCompanySchema = companySchema.omit({ id: true });
