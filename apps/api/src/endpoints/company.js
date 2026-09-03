import { Company, Associate } from "@repo/database/src/models/company.js";
import { Transaction } from "@repo/database/src/models/transaction.js";
import { Task } from "@repo/database/src/models/task.js";
import createError from "http-errors";


export const createCompany = async (req, res, next) => {
  try {
    const ownerId = req.user.id;

    const [companyRecord, created] = await Company.unscoped().findOrCreate({
      where: {
        socialReason: req.body.socialReason,
        type: req.body.type,
        commercialName: req.body.commercialName,
      },
    });

    if (created) {
      await Associate.create({
        userId: ownerId,
        companyId: companyRecord.id,
      });
      return res.status(201).json({
        message: "Empresa creada exitosamente",
        data: companyRecord
      });
    }

    return res.status(200).json({
      message: "La empresa ya existe",
      data: companyRecord
    });
  } catch (error) {
    next(error);
  }
};


export const createTask = async (req, res, next) => {
  try {
    const { title, description, startedAt, approximateFinishDate, parentId } = req.body;

    const { companyId } = req.params;

    const userId = req.user.id;

    if (!companyId || companyId === "undefined" || companyId === "null") {
      throw createError(400, "Se requiere el ID de la empresa para crear la tarea");
    }

    const associate = await Associate.findOne({
      where: { userId, companyId }
    });

    if (!associate) {
      throw createError(403, "No tienes permisos en esta empresa para crear tareas");
    }

    const task = await Task.create({
      associateId: associate.id,
      title,
      description,
      startedAt,
      approximateFinishDate,
      parentId: parentId || null
    });

    return res.status(201).json({
      message: "Tarea creada exitosamente",
      data: task
    });

  } catch (error) {
    next(error);
  }
};


export const getCompanies = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const userAssociations = await Associate.findAll({
      where: { userId }
    });

    const companyIds = userAssociations.map(assoc => assoc.companyId);

    const companies = await Company.findAll({
      where: { id: companyIds }
    });
    res.status(200).json({ message: "Empresas obtenidas", data: companies });
  } catch (error) { next(error); }
};

export const getAssociates = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const associates = await Associate.findAll({
      where: { companyId },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });
    res.status(200).json({ message: "Asociados de la empresa obtenidos", data: associates });
  } catch (error) { next(error); }
};

export const getTransactions = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const transactions = await Transaction.findAll({ where: { companyId } });
    res.status(200).json({ message: "Transacciones de la empresa obtenidas", data: transactions });
  } catch (error) { next(error); }
};

export const getTasks = async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const associates = await Associate.findAll({ where: { companyId }, attributes: ['id'] });
    console.log(JSON.stringify(associates));

    const associateIds = associates.map(assoc => assoc.id);

    const tasks = await Task.findAll({
      where: { associateId: associateIds }
    });
    console.log(JSON.stringify(tasks));
    
    
    res.status(200).json({ message: "Tareas de la empresa obtenidas", data: tasks });

  } catch (error) { next(error); }
};

export const getTaskAssignments = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const userId = req.user.id;

    if (!companyId) {
      throw createError(400, "Se requiere el ID de la empresa");
    }

    const associate = await Associate.findOne({
      where: { userId, companyId }
    });

    if (!associate) {
      throw createError(403, "No tienes permisos para ver las tareas de esta empresa");
    }

    const taskAssignments = await Task.findAll({
      where: { companyId },
      attributes: ['id', 'title', 'startedAt', 'approximateFinishDate'],
      include: [
        {
          model: Associate,
          as: 'assignees',
          attributes: ['id', 'role'],
          include: [{ model: User, attributes: ['name'] }]
        }
      ]
    });

    res.status(200).json({ message: "Asociaciones de tareas obtenidas", data: taskAssignments });
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const updateData = req.body;

    const [updatedRows] = await Company.update(updateData, { where: { id: companyId } });

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Empresa no encontrada o sin cambios" });
    }

    res.status(200).json({ message: "Empresa actualizada" });
  } catch (error) { next(error); }
};

export const deleteCompany = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const deletedRows = await Company.destroy({ where: { id: companyId } });

    if (deletedRows === 0) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    res.status(200).json({ message: "Empresa eliminada" });
  } catch (error) { next(error); }
};

export const updateTask = async (req, res, next) => {
  try {
    const { companyId, taskId } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    if (!companyId || !taskId) {
      throw createError(400, "Se requiere el ID de la empresa y de la tarea");
    }

    const associate = await Associate.findOne({
      where: { userId, companyId }
    });

    if (!associate) {
      throw createError(403, "No tienes permisos en esta empresa para editar tareas");
    }

    const task = await Task.findOne({
      where: { id: taskId, companyId }
    });

    if (!task) {
      throw createError(404, "Tarea no encontrada en esta empresa");
    }

    await task.update(updateData);

    return res.status(200).json({
      message: "Tarea actualizada exitosamente",
      data: task
    });

  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { companyId, taskId } = req.params;
    const userId = req.user.id;

    if (!companyId || !taskId) {
      throw createError(400, "Se requiere el ID de la empresa y de la tarea");
    }

    const associate = await Associate.findOne({
      where: { userId, companyId }
    });

    if (!associate) {
      throw createError(403, "No tienes permisos en esta empresa para eliminar tareas");
    }

    const task = await Task.findOne({
      where: { id: taskId, companyId }
    });

    if (!task) {
      throw createError(404, "Tarea no encontrada en esta empresa");
    }
    await task.destroy();
    return res.status(200).json({
      message: "Tarea eliminada exitosamente"
    });

  } catch (error) {
    next(error);
  }
};