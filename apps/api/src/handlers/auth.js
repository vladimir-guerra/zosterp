import jwt from "jsonwebtoken";
import { Token } from "@repo/database";

export const generateTokens = async (req, res, next) => {
  try {
    const { device } = req.ua;
    const { id: userId, language } = req.user;

    const days = 7 * 24 * 60 * 60 * 1000; //7 days
    const expiredAt = new Date(Date.now() + days);
    const { id: tokenId } = (await Token.create({ userId, device, expiredAt }))
      .dataValues;

    const refreshToken = jwt.sign(
      { tokenId, language },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: days,
    });

    const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });

    return res.status(200).json({ user: req.user, accessToken });
  } catch (error) {
    next(error);
  }
};