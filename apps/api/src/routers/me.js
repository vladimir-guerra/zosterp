import express from "express";
import { getDevice, validate } from "../middlewares/index.js";
import { emailSchema, updateUser } from "@repo/schemas";
import {
  deleteSession,
  deleteUser,
  get,
  getSessions,
  renewEmail,
  requestEmail,
  update,
} from "../endpoints/me.js";
export const meRouter = express.Router();

meRouter.get("/", get);
meRouter.get("/sessions", getDevice, getSessions);
meRouter.delete("/sessions/:id", deleteSession);
meRouter.delete("/", deleteUser);
meRouter.post("/email", validate(emailSchema), requestEmail);
meRouter.patch("/email", renewEmail);
meRouter.patch("/", validate(updateUser), update);
