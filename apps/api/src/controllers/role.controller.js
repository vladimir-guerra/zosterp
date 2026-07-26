import { Permission, Role } from "@repo/database";
import sendError from "http-errors";
import base from "../base.js";

export const createRole = base(async (req, res, next) => {
  const where = { companyId: req.companyId, name: req.data.name };
  const [role, created] = await Role.findOrCreate({
    where,
    defaults: where,
    plain: true,
  });
  return res.status(200).json({ role });
});

export const createPermission = base(async (req, res, next) => {
  const { action, resource } = req.data;
  const where = { roleId: req.params.roleId, action, resource };
  const [permission] = await Permission.findOrCreate({
    where,
    defaults: where,
    plain: true,
  });
  return res.status(200).json({ permission });
});
