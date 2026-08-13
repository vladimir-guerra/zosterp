import { Router } from "express";
import {validate}  from "../middlewares/index.js";
import {getDevice} from "../middlewares/device.js";
import { isAuth } from "../middlewares/index.js";
import { emailSchema, insertUserSchema, loginSchema, recoverPasswordSchema } from "@repo/schemas";
import { generateTokens } from "../utils/index.js";
import {
  login,
  logout,
  refresh,
  register,
  renewPassword,
  requestNewPassword,
  TwoFA,
  validateUser,
  me
} from "../endpoints/index.js";

export const authRouter = Router();

authRouter.get("/me", isAuth, me)

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

//esquemas no existentes (twoFaSchema) && (tokenSchema)
// authRouter.post("/2FA", validate(twoFaSchema), TwoFA, generateTokens);
// authRouter.post(
//   "/register/validate",
//   validate(tokenSchema),
//   validateUser,
//   generateTokens,
// );
authRouter.get("/refresh", refresh, generateTokens);
authRouter.get("/logout", logout);
authRouter.post("/password", validate(recoverPasswordSchema), requestNewPassword);
authRouter.patch("/password", renewPassword);
