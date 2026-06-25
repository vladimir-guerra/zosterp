import { Router } from "express";
import createError from "http-errors";
import { User, Token } from "@repo/database";
import { sendMail } from "@repo/email";
import { setBodyLanguage, getDevice, validate } from "../middlewares";
import { emailSchema } from "@repo/schemas";
import { generateTokens } from "../handlers";
import jwt from "jsonwebtoken";

export const authRouter = Router();

authRouter.post("/email", validate(emailSchema), async (req, res, next) => {
  try {
    const { email } = req.data;
    const json = await import(`@repo/locales/src/${req.language}/api.json`);
    await sendMail({
      to: email,
      subject: `${json["change-email"]}`,
      html: "<p>",
    });
  } catch (error) {
    next(error);
  }
});

authRouter.patch("/email", validate(emailSchema), async (req, res, next) => {
  try {
    const { email } = req.data;
    const json = await import(`@repo/locales/src/${req.language}/api.json`);
    await sendMail({
      to: email,
      subject: `${json["change-email"]}`,
      html: "<p>",
    });
  } catch (error) {
    next(error);
  }
});
