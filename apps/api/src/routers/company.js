import { Router } from "express";
import { createCompany, getCompanies, getTasks, updateCompany, deleteCompany, getTaskAssignments, createTask, updateTask, deleteTask } from "../endpoints/company.js";
import { isAuth } from "../middlewares/auth.js";
import { verifyTaskAdmin } from "../middlewares/roles.js";
export const companyRouter = Router();

companyRouter.use(isAuth);

companyRouter.get("/", getCompanies);
companyRouter.get("/:companyId/tasks", verifyTaskAdmin, getTasks);
companyRouter.get("/:companyId/tasks/assignments", verifyTaskAdmin, getTaskAssignments);

companyRouter.post("/", createCompany);
companyRouter.post("/:companyId", verifyTaskAdmin, createTask);

companyRouter.patch("/:companyId", verifyTaskAdmin, updateCompany);
companyRouter.patch("/:companyId/tasks/:taskId", verifyTaskAdmin, updateTask);

companyRouter.delete("/:companyId", verifyTaskAdmin, deleteCompany);
companyRouter.delete("/:companyId/tasks/:taskId", verifyTaskAdmin, deleteTask);