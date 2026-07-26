import { DataTypes } from "sequelize";
import { sequelize } from "../config.js";

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
        model: "tasks",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estimatedFinishDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    finishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { underscored: true, timestamps: true, paranoid: true },
);

export const Timesheet = sequelize.define(
  "Timesheet",
  {
    taskId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: "tasks",
        key: "id",
      },
    },
    associateId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: "associates",
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    startHour: {
      type: DataTypes.TIME,
      defaultValue: DataTypes.NOW,
    },
    finishHour: {
      type: DataTypes.TIME,
      allowNull: true,
    },
  },
  { underscored: true, paranoid: true, timestamps: true },
);
