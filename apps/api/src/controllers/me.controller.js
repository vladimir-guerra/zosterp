import { Token, User, Op } from "@repo/database";
import sendError from "http-errors";
import jwt from "jsonwebtoken";
import base from "../base.js";

export const updateMe = base(async (req, res, next) => {
  const { has_2fa } = req.data;
  const user = await User.findByPk(req.userId);
  if (has_2fa && has_2fa !== user.has_2fa) {
    user.has_2fa = has_2fa;
    await user.save();
  }
  return res.sendStatus(200);
});
