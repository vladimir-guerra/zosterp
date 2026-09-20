import { getTimesheets, createTimesheet, updateTimesheet, deleteTimesheet } from "../endpoints/timesheets.js";
import { isAuth } from "../middlewares/auth.js";
import { Router } from "express";

export const timesheetRouter = Router();

timesheetRouter.use(isAuth);

timesheetRouter.get("/", getTimesheets);
timesheetRouter.post("/", createTimesheet);
timesheetRouter.put("/:id", updateTimesheet);
timesheetRouter.delete("/:id", deleteTimesheet);