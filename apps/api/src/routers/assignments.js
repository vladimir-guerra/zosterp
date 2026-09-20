import { createAssignment, updateAssignment, deleteAssignment, getAssignments } from "../endpoints/assignments.js";
import { isAuth } from "../middlewares/auth.js";
import { verifyTaskAdmin } from "../middlewares/roles.js";
import { Router } from "express";

export const assignmentRouter = Router();

assignmentRouter.use(isAuth);

assignmentRouter.get("/task/:taskId", getAssignments);

assignmentRouter.post("/:companyId/:taskId", verifyTaskAdmin, createAssignment);
assignmentRouter.put("/:companyId/:assignmentId", verifyTaskAdmin, updateAssignment);
assignmentRouter.delete("/:companyId/:assignmentId", verifyTaskAdmin, deleteAssignment);