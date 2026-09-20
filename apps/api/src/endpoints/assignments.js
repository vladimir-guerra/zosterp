import { Role, User, Associate, Task, Assignment } from "@repo/database";
import createError from "http-errors";

export const createAssignment = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const { associateId } = req.body;

        const associate = await Associate.findOne({ where: { id: associateId } });
        const userFound = await User.findOne({ where: { id: associate.userId } });


        const task = await Task.findOne({ where: { id: taskId } });
        if (!task) throw createError(404, "La tarea no existe");

        const newAssignment = await Assignment.create({ taskId, associateId, roleId: userFound.roleId });

        res.status(201).json({
            response: "Asociado asignado a la tarea exitosamente",
            data: newAssignment
        });
    } catch (error) {
        next(error);
    }
};

export const getAssignments = async (req, res, next) => {
    try {
        const { taskId } = req.params;

        const assignments = await Assignment.findAll({
            where: { taskId },
            include: [
                {
                    model: Associate,
                    include: [{ model: User, attributes: ['name', 'surname', 'email'] }]
                },
                {
                    model: Role,
                    attributes: ['name']
                }
            ]
        });

        res.status(200).json({
            response: "Asignaciones encontradas",
            data: assignments
        });
    } catch (error) {
        next(error);
    }
};

export const updateAssignment = async (req, res, next) => {
    try {
        const { assignmentId } = req.params;
        const { associateId } = req.body;

        const [updatedRows] = await Assignment.update({ associateId }, { where: { id: assignmentId } });

        if (updatedRows === 0) throw createError(404, "Asignación no encontrada");

        res.status(200).json({ response: "Tarea reasignada al nuevo asociado exitosamente" });
    } catch (error) {
        next(error);
    }
};

export const deleteAssignment = async (req, res, next) => {
    try {
        const { assignmentId } = req.params;

        const deletedRows = await Assignment.destroy({ where: { id: assignmentId } });

        if (deletedRows === 0) throw createError(404, "La asignación no existe");

        res.status(200).json({ response: "Asociado removido de la tarea exitosamente" });
    } catch (error) {
        next(error);
    }
};