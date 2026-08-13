import { User, Token } from "@repo/database/src/models/user.js";
import createError from "http-errors";
import { randomInt } from "crypto";
import { sendMail } from "@repo/email";
import getLocales from "../utils/locales.js";
import jwt from "jsonwebtoken";

const loginHandler = async (req, res, recordUser) => {
  if (!recordUser) {
    throw createError(400, "invalid_credentials");
  }

  const isValid = await recordUser.comparePassword(req.data.password);

  if (!isValid) {
    throw createError(400, "invalid_credentials");
  }

  const { passwordHash, ...user } = recordUser.get({ plain: true });

  if (user.has_2fa) {
    const code = randomInt(100000).toString().padStart(6, "0");
    const SECRET = process.env.JWT_2FA_SECRET;
    const { device } = req;

    const token = jwt.sign({ userId: user.id, code, device }, SECRET, {
      expiresIn: "5m",
    });

    const locale = await getLocales(user.language);
    const { url } = await sendMail({
      to: user.email,
      subject: locale["TwoFA"],
      html: `<p><b>${code}</b></p>`,
    });
    res.status(200).json({ token, url });
    return false;
  }
  req.user = user;
  return true;
};

export const me = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'twoFactorCode'] }
    });

    if (!result) {
      throw createError(404, "not_user_found");
    }

    return res.status(200).json({
      error: false,
      user: result
    });

  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email } = req.data;
    const foundUser = await User.unscoped().findOne({ where: { email } });
    if (await loginHandler(req, res, foundUser)) next();
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { confirmPassword, ...cleanUserData } = req.data;
    const { email } = cleanUserData;
    const [findOrCreatedUser, created] = await User.unscoped().findOrCreate({
      where: { email },
      defaults: cleanUserData,
    });

    if (created) {
      const userObj = findOrCreatedUser.toJSON();

      const { passwordHash, ...user } = userObj;

      const locale = await getLocales(user.language);
      const SECRET = process.env.JWT_REGISTER_USER_SECRET;

      const { device = "unknown" } = req;

      const token = jwt.sign({ userId: user.id, device }, SECRET, {
        expiresIn: "5m",
      });

      const { url } = await sendMail({
        to: email,
        subject: locale["register"],
        html: `<a href=?token=${token}>${locale["activate-account"]}</a>`,
      });

      return res.status(201).json({ url });
    } else if (await loginHandler(req, res, findOrCreatedUser)) {
      next();
    }
  } catch (error) {
    console.error("Error en el registro:", error);
    next(error);
  }
};

export const TwoFA = async (req, res, next) => {
  try {
    const { token, code } = req.body;
    const SECRET = process.env.JWT_2FA_SECRET;

    const { userId, device } = jwt.verify(token, SECRET);

    const foundUser = await User.findByPk(userId, { plain: true });

    if (!foundUser) {
      throw createError(404, "not_user_found");
    }

    if (foundUser.twoFactorCode !== code) {
      throw createError(400, "invalid_code");
    }

    await User.update({ twoFactorCode: null }, { where: { id: userId } });

    req.user = foundUser;
    req.device = device;
    next();

  } catch (error) {
    next(error);
  }
};

export const validateUser = async (req, res, next) => {
  try {
    const { token } = req.body;
    const SECRET = process.env.JWT_REGISTER_USER_SECRET;
    const { userId, device } = jwt.verify(token, SECRET);

    const foundUser = await User.findByPk(userId, { plain: true });
    if (!foundUser) throw createError(404, "not_user_found");

    foundUser.isValid = true;
    await foundUser.save();

    req.user = foundUser;
    req.device = device;
    next();
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw createError(400, "token_empty");

    const SECRET = process.env.JWT_REFRESH_SECRET;
    const { tokenId } = jwt.verify(refreshToken, SECRET);

    const foundToken = await Token.findByPk(tokenId, { plain: true });
    if (!foundToken) throw createError(404, "session_empty");

    const foundUser = await User.findByPk(foundToken.userId, { plain: true });
    if (!foundUser) throw createError(404, "not_user_found");

    req.user = foundUser;
    req.device = foundToken.device;
    await foundToken.destroy();

    next();
  } catch (error) {
    res.clearCookie("refreshToken");
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    res.clearCookie("refreshToken");
    res.clearCookie("language");

    if (refreshToken) {
      const { tokenId: id } = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
      );
      await Token.destroy({ where: { id } });
    }

    return res.sendStatus(200);
  } catch (error) {
    return next(error);
  }
};

export const requestNewPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { id, language } = await User.findOne({
      where: { email },
      plain: true,
    });

    if (!id) return res.sendStatus(404);
    const SECRET = process.env.JWT_RENEW_PASSWORD_SECRET;
    const token = jwt.sign({ userId: id }, SECRET, { expiresIn: "10m" });

    const locale = await getLocales(language);
    const { url } = await sendMail({
      to: email,
      subject: locale["recover-password"],
      html: `<a href="http://localhost:5173/auth/password?token=${token}">${locale["renew"]}</a><p>${locale["expired-at"]}</p>`,
    });

    return res.status(200).json({ url });
  } catch (error) {
    next(error);
  }
};

export const renewPassword = async (req, res, next) => {
  try {
    const { password, token } = req.body;
    const SECRET = process.env.JWT_RENEW_PASSWORD_SECRET;
    const { userId: id } = jwt.verify(token, SECRET);
    await User.update({ password }, { where: { id } });
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }

};
