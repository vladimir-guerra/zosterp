import { Router } from "express";
import createError from "http-errors";
import { User, Token } from "@repo/database";
import { sendMail } from "@repo/email";
import { setBodyLanguage, getDevice, validate } from "../middlewares";
import { emailSchema } from "@repo/schemas";
import { generateTokens } from "../handlers";
import jwt from "jsonwebtoken";

export const authRouter = Router();

authRouter.get("/me", async (req, res) => {
  const user = await User.findByPk(
    req.user.id, attributes: {exclude: ["passwordHash"]}
  );
  return { user: user.dataValues }
});

authRouter.post("/email", validate(loginSchema), async (req, res) => {
  const { email, password } = req.data;
  const user = await User.findByPk(req.user.id, {attributes: {exclude: ["passwordHash"]}})
  if(!(await user?.comparePassword(password)))
    throw createError(401, "Credenciales inválidas")
  if (email === user.email) throw createError(400, "Correo vigente.")
  await sendMail({
    to: email,
    subject: "Cambiar correo",
    html: `<a href="${process.env.API_URL}/me/password">Cambiar correo</a>`,
  });
});

authRouter.patch("/email", validate(emailSchema), async (req, res, next) => {
    const { email } = req.data;
    const json = await import(`@repo/locales/src/${req.language}/api.json`);
    await sendMail({
      to: email,
      subject: `${json["change-email"]}`,
      html: "<p>",
    });
});

