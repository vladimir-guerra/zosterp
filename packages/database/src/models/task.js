import { DataTypes, Op } from "sequelize";
import { sequelize } from "../connection.js";

const updateParentProgress = async (parentId) => {
  if (!parentId) return;

  const total = await Task.count({ where: { parentId } });
  const done = await Task.count({
    where: { parentId, finishedAt: { [Op.ne]: null } },
  });

  const parent = await Task.findByPk(parentId);
  if (parent) {
    const newPercent = total > 0 ? Math.round((done * 100) / total) : 0;
    if (
      parent.percentDone !== newPercent ||
      (newPercent === 100 && !parent.finishedAt)
    ) {
      parent.percentDone = newPercent;
      if (newPercent === 100) parent.finishedAt = new Date();
      else parent.finishedAt = null;
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
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
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
    hooks: {
        afterSave: async (task) => {
          if (task.parentId) await updateParentProgress(task.parentId);
        },
        afterDestroy: async (task) => {
          if (task.parentId) await updateParentProgress(task.parentId);
        },
    },
  },
);