import { Router } from "express";
import { createCompany, getCompanies, getTasks, updateCompany, deleteCompany, getTaskAssignments, createTask, updateTask, deleteTask } from "../endpoints/company.js";
import { isAuth } from "../middlewares/auth.js";

export const companyRouter = Router();

//protección de rutas :^
companyRouter.use(isAuth);

companyRouter.post("/", createCompany);
companyRouter.post("/:companyId", createTask);

companyRouter.get("/", getCompanies);
companyRouter.get("/:companyId/tasks", getTasks);
companyRouter.get("/:companyId/tasks/assignments", getTaskAssignments);

companyRouter.patch("/:companyId", updateCompany);
companyRouter.patch("/:companyId/:taskId", updateTask);

companyRouter.delete("/:companyId", deleteCompany);
companyRouter.delete("/:companyId/:taskId", deleteTask);