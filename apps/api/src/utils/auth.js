import jwt from "jsonwebtoken";
import { Token } from "@repo/database/src/models/user.js";

export default async function generateTokens(req, res) {
  const { headers, user } = req;
  const PAYLOAD = { userId: user.id, userAgent: headers["user-agent"] || "unknown" };
  const { id: tokenId } = (await Token.create(PAYLOAD)).dataValues;

  const refreshToken = jwt.sign({ tokenId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

  return res.status(200).json({ accessToken });
}