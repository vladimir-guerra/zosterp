import jwt from "jsonwebtoken";
import { Token } from "@repo/database/src/models/user.js";
import createError from "http-errors";

export default async function generateTokens(req, res, next) {
  try {
    const { user, language, device } = req;
    const userId = user.id;

    const { id: tokenId } = (await Token.create({ userId, device })).dataValues;

    const refreshToken = jwt.sign({ tokenId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/auth/refresh",
    });

    res.cookie("language", language, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const accessToken = jwt.sign({ userId, language }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", 
      maxAge: 15 * 60 * 1000, 
    });

    return res.status(200).json({ message: "Autenticación exitosa" });
  } catch (error) {
    next(error);
  }
}