import { z } from "zod";
import { companyTypes } from "@repo/enums";
import { requiredEmail as email, requiredStr, str } from "./shared.js";

export const companyInput = z.object({
  email,
  type: z.enum(companyTypes, { error: "Tipo de empresa inválida" }),
  socialReason: requiredStr,
  commercialName: requiredStr,
  country: str.max(3, { error: "País ISO inválido" }),
});

export const associateInput = z.object({
  email,
  role: requiredStr,
});
