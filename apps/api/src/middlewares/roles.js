import { User, Associate, Role } from "@repo/database";
import createError from "http-errors";

export const verifyTaskAdmin = async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const { companyId } = req.params; 

        const isUser = await User.findOne({ where: { id: userId } });
        if (!isUser) throw createError(404, "Usuario no encontrado");

        const isAssociate = await Associate.findOne({ where: { userId, companyId } });
        if (!isAssociate) throw createError(403, "No eres asociado a la empresa");

        const hasPermissions = await Role.findOne({ where: { id: isUser.roleId } });
        if (!hasPermissions) throw createError(404, "Rol no encontrado en el sistema");

        const allowedRoles = ['owner', 'adminTask'];
        if (!allowedRoles.includes(hasPermissions.name)) {
            throw createError(403, "No tienes permisos para modificar tareas o asignaciones en esta empresa");
        }

        next();
    } catch (error) {
        next(error);
    }
};