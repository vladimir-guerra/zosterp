import { Router } from "express";
import { getDevice, validate } from "../middlewares";
import { emailSchema, insertUserSchema, loginSchema } from "@repo/schemas";
import { generateTokens } from "../utils";
import {
  login,
  logout,
  refresh,
  register,
  renewPassword,
  requestNewPassword,
  TwoFA,
  validateUser,
  verify,
} from "../endpoints";

export const authRouter = Router();

authRouter.post(
  "/login",
  validate(loginSchema),
  getDevice,
  login,
  generateTokens,
);

authRouter.post(
  "/register",
  async (req, _res, next) => {
    req.body.language = req.language;
    next();
  },
  validate(insertUserSchema),
  getDevice,
  register,
  generateTokens,
);

authRouter.post("/2FA", validate(twoFaSchema), TwoFA, generateTokens);
authRouter.post(
  "/register/validate",
  validate(tokenSchema),
  validateUser,
  generateTokens,
);
authRouter.get("/refresh", refresh, generateTokens);
authRouter.get("/logout", logout);
authRouter.post("/password", validate(emailSchema), requestNewPassword);
authRouter.patch("/password", validate(renewPasswordSchema), renewPassword);
