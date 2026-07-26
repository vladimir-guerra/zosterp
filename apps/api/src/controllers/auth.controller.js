import sendError from "http-errors";
import { User, Token, Associate } from "@repo/database";
import { sendMail } from "@repo/email";
import { randomInt } from "crypto";
import jwt from "jsonwebtoken";
import base from "../base.js";

const generateTokens = async (res, userId, device) => {
  const token = await Token.create({ userId, device });
  const TSECRET = process.env.JWT_REFRESH;
  const refreshToken = jwt.sign({ tokenId: token.id }, TSECRET, {
    expiresIn: "7d",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    path: "/auth/refresh",
  });

  const SECRET = process.env.JWT_ACCESS;
  const accessToken = jwt.sign({ userId }, SECRET, { expiresIn: "15m" });
  return res.status(200).json({ accessToken });
};

const authenticate = async (res, user, password, device) => {
  if (!user?.checkPassword(password))
    throw sendError(401, "auth.invalid_credentials");

  if (user.has_2fa) {
    const code = randomInt(100000).toString().padStart(6, "0");
    await sendMail(user.email, "2FA", `<p>${code}</p>`);
    const PAYLOAD = { code, userId: user.id, device };
    const token = jwt.sign(PAYLOAD, process.env.JWT_2FA, { expiresIn: "5m" });
    res.status(200).json({ token });
    return false;
  }
  await generateTokens(res, user.id, device);
  return true;
};

export const login = base(async (req, res, next) => {
  const { password, email } = req.data;
  const u = await User.unscoped().findOne({ where: { email }, plain: true });
  if (await authenticate(res, u, password, req.device)) return;
});

export const register = base(async (req, res, next) => {
  const { password, email, confirmPassword, ...data } = req.data;
  const [u] = await User.unscoped().findOrCreate({
    where: { email },
    defaults: { password, email, ...data },
    plain: true,
  });
  if (await authenticate(res, u, password, req.device)) return;
});

export const TwoFA = base(async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) throw sendError(404, "auth.token.not_found");

  const { code, userId, device } = jwt.verify(token, process.env.JWT_2FA);
  if (req.data.code !== code) throw sendError(401, "auth.TwoFA.invalid");

  const user = await User.findByPk(userId, { plain: true });

  if (!user) throw sendError(404, "auth.not_found");
  if (!user.isValid && user.has_2fa)
    await user.update({ has_2fa: false, isValid: true });

  return await generateTokens(res, user.id, device);
});

export const refresh = base(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw sendError(404, "auth.token.not_found");

  const { tokenId } = jwt.verify(refreshToken, process.env.JWT_REFRESH);
  const token = await Token.findByPk(tokenId, { plain: true });
  if (!token) throw sendError(404, "auth.token.not_found");

  const user = await User.findByPk(token.userId, { plain: true });
  if (!user) throw sendError(404, "auth.not_found");

  await token.destroy();
  return await generateTokens(res, user.id, token.device);
});

export const logout = base(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  res.clearCookie("refreshToken");
  if (refreshToken) {
    const { tokenId: id } = jwt.verify(refreshToken, process.env.JWT_REFRESH);
    await Token.destroy({ where: { id } });
  }
  return res.sendStatus(200);
});

export const requestPassword = base(async (req, res, next) => {
  const { email } = req.data;
  const user = await User.findOne({ where: { email }, plain: true });

  if (user) {
    const SECRET = process.env.JWT_RENEW_PW;
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "5m" });

    const URL = `${process.env.FRONTEND_URL}/auth/password/renew?token=${token}`;
    await sendMail(
      email,
      "Recuperar contraseña",
      `<a href="${URL}">Recuperar contraseña</a>`,
    );
  }

  return res.sendStatus(200);
});

export const renewPassword = base(async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) throw sendError(404, "Token inválidos.");
  const { userId: id } = jwt.verify(token, process.env.JWT_RENEW_PW);
  await User.update({ password: req.data.password }, { where: { id } });
  return res.sendStatus(200);
});

export const responseAssociate = base(async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) throw sendError(404, "Token inválido.");
  const { email, ...ids } = jwt.verify(token, process.env.JWT_ASSOCIATE);

  const user = await User.findOne({ where: { email } });
  if (!user) throw sendError(404, "No tienes una cuenta");

  await Associate.create({ userId: user.id, ...ids });
  return res.sendStatus(201);
});
