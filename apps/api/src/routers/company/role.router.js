import express from "express";
import { checkRole, validate } from "../../middlewares/index.js";
import { roleInput, permissionInput } from "@repo/schemas";
import { RESOURCE as R, ACTION as A } from "@repo/enums";
import { Permission, Role } from "@repo/database";
import {
  create,
  get,
  getAll,
  remove,
  update,
} from "../../controllers/index.js";

export const roleRouter = express.Router({ mergeParams: true });

roleRouter.get(
  "/",
  checkRole(A.R, R.ROLE),
  getAll(Role, (req) => ({ where: { companyId: req.companyId } })),
);

roleRouter.post(
  "/",
  checkRole(A.C, R.ROLE),
  validate(roleInput),
  create(Role, (req) => ({
    where: { companyId: req.companyId, name: req.data.name },
  })),
);
roleRouter.get("/:roleId", checkRole(A.R, R.ROLE), get(Role));
roleRouter.patch(
  "/:roleId",
  checkRole(A.U, R.ROLE),
  validate(roleInput),
  update(
    Role,
    (req) => req.data,
    (req) => ({ where: { id: req.params.roleId } }),
  ),
);
roleRouter.delete("/:roleId", checkRole(A.D, R.ROLE), remove(Role));

roleRouter.get(
  "/:roleId/permissions",
  checkRole(A.R, R.PERMISS),
  getAll(Permission, (req) => ({ where: { roleId: req.params.roleId } })),
);

roleRouter.post(
  "/:roleId/permissions",
  checkRole(A.C, R.PERMISS),
  validate(permissionInput),
  create(Permission, (req) => ({
    where: {
      roleId: req.params.roleId,
      action: req.data.action,
      resource: req.data.resource,
    },
  })),
);

roleRouter.delete(
  "/:roleId/permissions",
  checkRole(A.D, R.PERMISS),
  validate(permissionInput),
  remove(Permission, (req) => ({
    where: { action: req.data.action, resource: req.data.resource },
  })),
);
