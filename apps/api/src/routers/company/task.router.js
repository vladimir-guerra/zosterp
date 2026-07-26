import express from "express";
import { checkRole, validate } from "../../middlewares/index.js";
import { ACTION as A, RESOURCE as R } from "@repo/enums";
import { get, getAll, remove } from "../../controllers/index.js";
import { Associate, Role, Task } from "@repo/database";

export const taskRouter = express.Router({ mergeParams: true });

// Compány -> Role -> Associate -> Task
taskRouter.get(
  "/",
  checkRole(A.R, R.TASK),
  getAll(Associate, (req) => ({
    attributes: [],
    where: { userId: req.userId },
    include: [
      {
        model: Role,
        required: true,
        attributes: [],
        where: { companyId: req.companyId },
      },
      {
        model: Task,
        required: true,
      },
    ],
  })),
);

taskRouter.get(
  "/:taskId",
  checkRole(A.R, R.TASK),
  get(Task, { include: { model: Task } }),
);

taskRouter.post("/", checkRole(A.C, R.TASK));
