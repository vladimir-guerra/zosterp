import express from "express";
import { checkRole, validate } from "../../middlewares/index.js";
import { associateInput, emailSchema } from "@repo/schemas";
import { ACTION as A, RESOURCE as R } from "@repo/enums";
import { get, getAll, remove } from "../../controllers/shared.controller.js";
import { requestAssociate } from "../../controllers/associate.controller.js";
import { Associate, Op, Role } from "@repo/database";

export const associateRouter = express.Router({ mergeParams: true });

associateRouter.post(
  "/",
  checkRole(A.C, R.ASSOC),
  validate(associateInput),
  requestAssociate,
);

associateRouter.get(
  "/",
  checkRole(A.R, R.ASSOC),
  getAll(Associate, (req) => ({
    where: { taskId: req.taskId, userId: { [Op.ne]: req.userId } },
    include: {
      model: Role,
      where: { companyId: req.companyId },
      required: true,
    },
  })),
);

associateRouter.get("/:associateId", checkRole(A.R, R.ASSOC), get(Associate));

associateRouter.delete(
  "/:associateId",
  checkRole(A.D, R.ASSOC),
  remove(Associate),
);
