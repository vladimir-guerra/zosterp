import { User, Token } from "@repo/database/src/models/user.js";
import createError from "http-errors";
import { randomInt } from "crypto";
import { sendMail } from "@repo/email";
import jwt from "jsonwebtoken";
import { Role } from "@repo/database";

const TFAHandler = async (password, res, recordUser, userAgent = "unknown", verifyPassword = true) => {
  if (verifyPassword && !(await recordUser?.comparePassword(password)))
    throw createError(400, "Credenciales inválidas");

  const { name, surname, email, id: userId, ...user } = recordUser.get({ plain: true });

  if (user.has_2fa) {
    const code = randomInt(100000).toString().padStart(6, "0");
    const SECRET = process.env.JWT_2FA_SECRET;
    const token = jwt.sign({ userId, code, userAgent }, SECRET, { expiresIn: "5m" });

    const { url } = await sendMail({
      to: email,
      subject: "2FA",
      html: `<p>¡Hola, ${name} ${surname}! Tu codigo es: <b>${code}</b></p>`,
    });
    if(process.env.NODE_ENV === "development") console.log(url)
    res.status(200).json({ token });
    return false;
  }
  return true;
};

export const login = async (req, res, next) => {
  const { email, password } = req.data;
  const user = await User.findOne({ where: { email } });

  if (!user) 
    throw createError(400, "Credenciales inválidas");

  req.user = user; 
  if (await TFAHandler(password, res, user, req.headers["user-agent"])) next();
};
export const register = async (req, res, next) => {
  const { confirmPassword, email, password, ...userRest } = req.data;
  const [user] = await User.findOrCreate({
    where: { email },
    defaults: {email, password, ...userRest},
  });
  if (await TFAHandler(password, res, user, req.headers["user-agent"], false)) next();
};

export const TwoFA = async (req, res, next) => {
  const { userId, userAgent, code } = jwt.verify(req.token, process.env.JWT_2FA_SECRET);
  const foundUser = await User.findByPk(userId);

  if (!foundUser) throw createError(404, "Usuario no hallado");
  if (req.data.code !== code) throw createError(400, "Código inválido");
  if (!foundUser.isValid) {
    foundUser.isValid = true;
    foundUser.has_2fa = false;
    await foundUser.save();
  }

  req.user = foundUser.get({ plain: true }); 
  next();
};

export const refresh = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw createError(400, "Token vacío");
  
  const { tokenId } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const foundToken = await Token.findByPk(tokenId);
  
  if (!foundToken) throw createError(404, "Sesión finalizada");
  const foundUser = await User.findByPk(foundToken.userId, {attributes: {exclude: ["passwordHash"]}});
  if (!foundUser) throw createError(404, "Usuario no hallado");
  req.user = foundUser;
  await foundToken.destroy();
  next();
};

export const logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  res.clearCookie("refreshToken", { path: '/' });

  if (refreshToken) {
    const { tokenId: id } = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
    );
    await Token.destroy({ where: { id } });
  }
  return res.sendStatus(200);
};

export const requestNewPassword = async (req, res) => {
  const { email } = req.data;
  const user = await User.findOne({
    where: { email },
    plain: true,
  });

  if (!user) return res.sendStatus(404);
  const userId = user.id;
  const SECRET = process.env.JWT_RENEW_PASSWORD_SECRET;
  const token = jwt.sign({ userId }, SECRET, { expiresIn: "10m" });

  const { url } = await sendMail({
    to: email,
    subject: "Renovar",
    html: `<a href="${process.env.API_ORIGIN}/auth/password/${token}">Renovar</a>`,
  });

  return res.status(200).json({ url });
};

export const renewPassword = async (req, res, next) => {
  const SECRET = process.env.JWT_RENEW_PASSWORD_SECRET;
  const { userId: id } = jwt.verify(req.token, SECRET);
  await User.update({ password: req.data.password }, { where: { id } });
  return res.sendStatus(200);
};
