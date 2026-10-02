import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";

const updateParentProgress = async (parentId) => {
  if (!parentId) return;

  const subtasks = await Task.findAll({
    where: { parentId },
    attributes: ["percentDone"],
  });

  const parent = await Task.findByPk(parentId);
  if (parent) {
    const total = subtasks.length;
    const sumPercent = subtasks.reduce((acc, sub) => acc + (sub.percentDone || 0), 0);
    const newPercent = total > 0 ? Math.round(sumPercent / total) : 0;

    if (
      parent.percentDone !== newPercent ||
      (newPercent === 100 && !parent.finishedAt) ||
      (newPercent < 100 && parent.finishedAt)
    ) {
      parent.percentDone = newPercent;
      parent.finishedAt = newPercent === 100 ? new Date() : null;
      await parent.save();
    }
  }
};

export const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        key: "id",
        model: "tasks",
      },
    },
    associateId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        key: "id",
        model: "associates",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    checklist: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    percentDone: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    approximateFinishDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    startedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    finishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      { fields: ["parent_id"] },
      { fields: ["associate_id"] },
    ],
    hooks: {
      beforeSave: (task) => {
        if (task.changed("checklist") && Array.isArray(task.checklist)) {
          const total = task.checklist.length;
          if (total > 0) {
            const completed = task.checklist.filter((item) => item.completed).length;
            const newPercent = Math.round((completed * 100) / total);
            task.percentDone = newPercent;
            task.finishedAt = newPercent === 100 ? new Date() : null;
          } else {
            task.percentDone = 0;
            task.finishedAt = null;
          }
        }
      },
      afterSave: async (task) => {
        if (task.parentId) await updateParentProgress(task.parentId);
      },
      afterDestroy: async (task) => {
        if (task.parentId) await updateParentProgress(task.parentId);
      },
    },
  }
);