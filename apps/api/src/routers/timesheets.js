import { getTimesheets, createTimesheet, updateTimesheet, deleteTimesheet } from "../endpoints/timesheets.js";
import { isAuth } from "../middlewares/auth.js";
import { verifyTaskAdmin } from "../middlewares/roles.js";
import { Router } from "express";

export const timesheetRouter = Router();

timesheetRouter.use(isAuth);

timesheetRouter.get("/:companyId", getTimesheets);
timesheetRouter.post("/:companyId", verifyTaskAdmin, createTimesheet);
timesheetRouter.patch("/:companyId/:id", verifyTaskAdmin, updateTimesheet);
timesheetRouter.delete("/:companyId/:id", verifyTaskAdmin, deleteTimesheet);