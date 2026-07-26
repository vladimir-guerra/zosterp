import express from "express";
import { getDevice, validate } from "../middlewares/index.js";
import { emailSchema, updateUser } from "@repo/schemas";
import {
  renewEmail,
  requestEmail,
  get,
  getAll,
  remove,
  updateMe,
} from "../controllers/index.js";
import { Op, Token, User } from "@repo/database";
export const meRouter = express.Router();

meRouter.get("/", get(User));
meRouter.get(
  "/tokens",
  getDevice,
  getAll(Token, (req) => ({
    where: { userId: req.userId, id: { [Op.ne]: req.cookies.refreshToken } },
  })),
);
meRouter.delete("/tokens/:tokenId", remove(Token));
meRouter.delete("/", remove(User));
meRouter.post("/email", validate(emailSchema), requestEmail("user"));
meRouter.get("/email", renewEmail(User));
meRouter.patch("/", validate(updateUser), updateMe);
