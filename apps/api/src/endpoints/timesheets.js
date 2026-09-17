import { Role, Timesheet, User } from "@repo/database";
import createError from "http-errors";

export const getTimesheets = async (req, res, next) => {
    try {
        const { taskId } = req.query;

        const whereClause = {};
        if (taskId) whereClause.taskId = taskId;

        const timesheets = await Timesheet.findAll({
            where: whereClause
        });

        if (!timesheets || timesheets.length === 0) {
            throw createError(404, "No se han encontrado registros de tiempo");
        }

        res.status(200).json({ response: "Resultados encontrados", data: timesheets });
    } catch (error) {
        next(error);
    }
};

export const createTimesheet = async (req, res, next) => {
    try {
        const { taskId, assignmentId, startedAt, finishedAt } = req.body;
        const { userId } = req.user;

        const userData = await User.findOne({ where: { id: userId } });
        if (!userData) throw createError(404, "Usuario no encontrado");

        const userRole = await Role.findOne({ where: { id: userData.roleId } });

        if (!userRole) throw createError(403, "Rol no válido o sin permisos");

        const timesheet = await Timesheet.create({
            taskId,
            assignmentId,
            startedAt,
            finishedAt
        });

        res.status(201).json({ response: "Registro creado exitosamente", data: timesheet });
    } catch (error) {
        next(error);
    }
};

export const updateTimesheet = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { startedAt, finishedAt } = req.body;

        const { userId } = req.user;
        const userData = await User.findOne({ where: { id: userId } });

        const userRole = await Role.findOne({ where: { id: userData.roleId } });
        if (!userRole) throw createError(403, "Rol no válido o sin permisos");

        const [updatedRows] = await Timesheet.update({
            startedAt,
            finishedAt,
        }, {
            where: { id }
        });

        if (updatedRows === 0) {
            throw createError(404, "No se encontró el registro o no hubo cambios");
        }

        res.status(200).json({ response: "Información actualizada exitosamente" });
    } catch (error) {
        next(error);
    }
};

export const deleteTimesheet = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;

        const dataFound = await User.findOne({ where: { id: userId } });
        const roleFound = await Role.findOne({ where: { id: dataFound.roleId } });

        if (!roleFound) {
            throw createError(404, "Rol inválido");
        }
        const deletedRows = await Timesheet.destroy({
            where: { id }
        });

        if (deletedRows === 0) {
            throw createError(404, "El registro de tiempo no existe");
        }

        res.status(200).json({ response: "Registro eliminado exitosamente" });
    } catch (error) {
        next(error);
    }
};