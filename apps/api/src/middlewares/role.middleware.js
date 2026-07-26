import { Associate, Role, Permission } from "@repo/database";
import sendError from "http-errors";
import base from "../base.js";

/**
 * Middlewre para manejar autorizaciones y roles.
 * @param {string} action - La acción a realizar.
 * @param {string} resource - El recurso donde se realizará la acción.
 * @returns {Function} Middleware de manejo de errores centralizado.
 */
export default function checkRole(action, resource) {
  return base(async (req, res, next) => {
    const { userId } = req;
    const { companyId, taskId } = req.params;
    const where = { userId, taskId: taskId || req.query?.taskId || null };
    if (!companyId) throw sendError(400, "UUID inválida");
    req.companyId = companyId;
    req.taskId = where.taskId;

    const role = await Associate.findOne({
      where,
      include: {
        model: Role,
        required: true,
        where: { companyId },
        include: {
          model: Permission,
          required: true,
          where: { action, resource },
        },
      },
    });

    if (!role) throw sendError(403, "Acceso no autorizado.");
    next();
  });
}
