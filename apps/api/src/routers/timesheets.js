import { getTimesheets, createTimesheet, updateTimesheet, deleteTimesheet } from "../endpoints/timesheets.js";
import { isAuth } from "../middlewares/auth.js";
import { Router } from "express";

export const timesheetRouter = Router();

timesheetRouter.use(isAuth);

timesheetRouter.get("/", getTimesheets);
timesheetRouter.post("/newTimesheet", createTimesheet);
timesheetRouter.put("/updateTimesheet", updateTimesheet);
timesheetRouter.delete("/deleteTimesheet", deleteTimesheet);

