import { Token, User, Op } from "@repo/database";
import sendError from "http-errors";
import { getLocale, paginateQuery } from "../utils/index.js";
import jwt from "jsonwebtoken";
import { sendMail, render } from "@repo/email";

export const get = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, { plain: true });
    if (!user) throw sendError(404, "me.not_found");
    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const where = { userId: req.userId, device: { [Op.ne]: req.device } };
    const res = await paginateQuery(Token, where, limit, page);
    return res.status(200).json(res);
  } catch (error) {
    next(error);
  }
};

export const deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Token.destroy({ where: { id } });
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.destroy({ where: { id: req.userId } });
    await Token.destroy({ where: { userId: req.userId } });
    res.clearCookie("refreshToken");
    res.clearCookie("language");
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const requestEmail = async (req, res, next) => {
  try {
    const { email } = req.data;
    const PAYLOAD = { userId: req.userId, email };
    const token = jwt.sign(PAYLOAD, process.env.JWT_RENEW_EMAIL, {
      expiresIn: "5m",
    });
    const locale = await getLocale(req.locale, "emails");
    await sendMail(
      email,
      locale["title"],
      `<a href="${process.env.FRONTEND_URL}/profile/email?token=${token}>${locale["send"]}</a>`,
    );
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const renewEmail = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw sendError(404, "auth.token.not_found");
    const { userId, email } = jwt.verify(token, process.env.JWT_RENEW_EMAIL);
    await User.update({ email }, { where: { id: userId } });
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { has_2fa, language } = req.data;
    const user = await User.findByPk(req.userId);
    if (has_2fa && has_2fa !== user.has_2fa) user.has_2fa = has_2fa;
    if (language && language !== user.language) user.language = language;
    if (user.changed("has_2fa") || user.changed("language")) await user.save();
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
