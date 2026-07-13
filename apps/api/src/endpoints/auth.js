import sendError from "http-errors";
import { User, Token } from "@repo/database";
import { getLocale } from "../utils/index.js";
import { sendMail } from "@repo/email";
import { randomInt } from "crypto";
import jwt from "jsonwebtoken";

const generateTokens = async (res, userId, language, device) => {
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

  res.cookie("language", language, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
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
    const locale = (await getLocale(user.language, "email"))["auth"]["TwoFA"];
    await sendMail(user.email, locale["title"], `<p>${code}</p>`);
    const PAYLOAD = { code, userId: user.id, device };
    const token = jwt.sign(PAYLOAD, process.env.JWT_2FA, { expiresIn: "5m" });
    res.status(200).json({ token });
    return false;
  }
  await generateTokens(res, user.id, user.language, device);
  return true;
};

export const login = async (req, res, next) => {
  try {
    const { password, email } = req.data;
    const u = await User.unscoped().findOne({ where: { email }, plain: true });
    if (await authenticate(res, u, password, req.device)) next();
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { password, email, confirmPassword, ...data } = req.data;
    const [u] = await User.unscoped().findOrCreate({
      where: { email },
      defaults: { password, email, ...data },
      plain: true,
    });
    if (await authenticate(res, u, password, req.device)) next();
  } catch (error) {
    next(error);
  }
};

export const TwoFA = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw sendError(404, "auth.token.not_found");

    const { code, userId, device } = jwt.verify(token, process.env.JWT_2FA);
    if (req.data.code !== code) throw sendError(401, "auth.TwoFA.invalid");

    const user = await User.findByPk(userId, { plain: true });

    if (!user) throw sendError(404, "auth.not_found");
    if (!user.isValid && user.has_2fa)
      await user.update({ has_2fa: false, isValid: true });

    return await generateTokens(res, user.id, user.language, device);
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw sendError(404, "auth.token.not_found");

    const { tokenId } = jwt.verify(refreshToken, process.env.JWT_REFRESH);
    const token = await Token.findByPk(tokenId, { plain: true });
    if (!token) throw sendError(404, "auth.token.not_found");

    const user = await User.findByPk(token.userId, { plain: true });
    if (!user) throw sendError(404, "auth.not_found");

    await token.destroy();
    return await generateTokens(res, user.id, user.language, token.device);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    res.clearCookie("refreshToken");
    res.clearCookie("language");
    if (refreshToken) {
      const { tokenId: id } = jwt.verify(refreshToken, process.env.JWT_REFRESH);
      await Token.destroy({ where: { id } });
    }
    return res.sendStatus(200);
  } catch (error) {
    return next(error);
  }
};

export const requestPassword = async (req, res, next) => {
  try {
    const { email } = req.data;
    const user = await User.findOne({ where: { email }, plain: true });

    if (!user) return res.sendStatus(404);

    const SECRET = process.env.JWT_RENEW_PW;
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "5m" });

    const loc = (await getLocale(user.language, "email"))["auth"]["password"];
    await sendMail(
      email,
      loc["title"],
      `<a href="${process.env.FRONTEND_URL}/auth/password/renew?token=${token}">${loc["send"]}</a>`,
    );

    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const renewPassword = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw sendError(404, "auth.token.not_found");
    const { userId: id } = jwt.verify(token, process.env.JWT_RENEW_PW);
    await User.update({ password: req.data.password }, { where: { id } });
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
