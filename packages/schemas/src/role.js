import { z } from "zod";
import { requiredStr } from "./shared";
import { ACTION, RESOURCE } from "@repo/enums";

export const permissionInput = z.object({
  action: z.enum([...Object.keys(ACTION)], { error: "Acción inválida" }),
  resource: z.enum([...Object.keys(RESOURCE)], { error: "Recurso inválida" }),
});

export const roleInput = z.object({ name: requiredStr });
