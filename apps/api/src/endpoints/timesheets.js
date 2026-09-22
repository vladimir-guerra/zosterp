import { Role, Timesheet, User, Task, Assignment, Associate } from "@repo/database";
import createError from "http-errors";

export const getTimesheets = async (req, res, next) => {
    try {
        const { companyId } = req.params;

        const timesheets = await Timesheet.findAll({
            include: [
                {
                    model: Task,
                    attributes: ['title']
                },
                {
                    model: Assignment,
                    required: true,
                    include: [{
                        model: Associate,
                        where: { companyId: companyId },
                        include: [{
                            model: User,
                            attributes: ['name', 'surname']
                        }]
                    }]
                }
            ]
        });

        if (!timesheets || timesheets.length === 0) {
            return res.status(200).json({ response: "No hay registros", data: [] });
        }

        res.status(200).json({ response: "Resultados encontrados", data: timesheets });
    } catch (error) {
        next(error);
    }
};

export const createTimesheet = async (req, res, next) => {
    try {
        const { taskId, assignmentId, startedAt, finishedAt } = req.body;

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
        const { startedAt, finishedAt, assignmentId } = req.body;

        const [updatedRows] = await Timesheet.update({
            assignmentId,
            startedAt,
            finishedAt
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