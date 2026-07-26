import express from "express";
import { checkRole, validate } from "../middlewares/index.js";
import { companyInput, emailSchema } from "@repo/schemas";
import {
  createCompany,
  activateCompany,
  get,
  getAll,
  remove,
  renewEmail,
  requestEmail,
} from "../controllers/index.js";
import { Associate, Company, Role } from "@repo/database";
import { ACTION as A, RESOURCE as R } from "@repo/enums";
import { roleRouter, associateRouter, taskRouter } from "./company/index.js";

export const companyRouter = express.Router();

// Associate -> Role -> Company
companyRouter.get(
  "/",
  getAll(Associate, (req) => ({
    where: { userId: req.userId },
    attributes: [],
    include: {
      model: Role,
      include: {
        model: Company,
        required: true,
      },
    },
  })),
);

companyRouter.post("/", validate(companyInput), createCompany);
companyRouter.get("/:companyId/activate", activateCompany);
companyRouter.get("/:companyId", get(Company));
companyRouter.delete("/:companyId", checkRole(A.D, R.COMPANY), remove(Company));

companyRouter.post(
  "/:companyId/email",
  checkRole(A.U, R.COMPANY),
  validate(emailSchema),
  requestEmail("company"),
);

companyRouter.get(
  "/:companyId/email",
  checkRole(A.U, R.COMPANY),
  renewEmail(Company),
);

// companyRouter.patch("/:companyId", checkGeneralRole("U", "COMPANY"));

companyRouter.use("/:companyId/associates", associateRouter);
companyRouter.use("/:companyId/roles", roleRouter);
companyRouter.use("/:companyId/tasks", taskRouter);
