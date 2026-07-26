import express from "express";
import {
  inputUser,
  login as loginSchema,
  codeSchema,
  emailSchema,
  renewPassword as renewPasswordSchema,
} from "@repo/schemas";
import {
  login,
  logout,
  refresh,
  register,
  renewPassword,
  requestPassword,
  TwoFA,
  responseAssociate,
} from "../controllers/auth.controller.js";
import { validate, getDevice } from "../middlewares/index.js";
export const authRouter = express.Router();

authRouter.post("/register", validate(inputUser), getDevice, register);
authRouter.post("/login", validate(loginSchema), getDevice, login);
authRouter.post("/2FA", validate(codeSchema), TwoFA);
authRouter.get("/refresh", refresh);
authRouter.get("/logout", logout);
authRouter.post("/password", validate(emailSchema), requestPassword);
authRouter.patch("/password", validate(renewPasswordSchema), renewPassword);
authRouter.get("/associate", responseAssociate);
