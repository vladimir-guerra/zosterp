import { Router } from "express";
import {validate}  from "../middlewares/index.js";
import { isAuth, getToken } from "../middlewares/index.js";
import {
  insertUserSchema, 
  loginSchema, 
  recoverPasswordSchema,
  newPasswordSchema,
  twoFASchema
} from "@repo/schemas";
import { generateTokens } from "../utils/index.js";
import {
  login,
  logout,
  refresh,
  register,
  renewPassword,
  requestNewPassword,
  TwoFA
} from "../endpoints/index.js";

export const authRouter = Router();

authRouter.post(
  "/login",
  validate(loginSchema),
  login,
  generateTokens,
);

authRouter.post(
  "/register",
  validate(insertUserSchema),
  register,
  generateTokens,
);

authRouter.post("/2FA", validate(twoFASchema), getToken, TwoFA, generateTokens);
authRouter.get("/refresh", refresh, generateTokens);
authRouter.get("/logout", logout);
authRouter.post("/password", validate(recoverPasswordSchema), requestNewPassword);
authRouter.patch("/password", validate(newPasswordSchema), getToken, renewPassword);
