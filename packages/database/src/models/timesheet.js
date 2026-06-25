import { DataTypes } from "sequelize";
import { sequelize } from "../index";

export const Timesheet = sequelize.define(
  "Timesheet",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    taskId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        key: "id",
        model: "tasks",
      },
    },
    assignmentId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        key: "id",
        model: "assignments",
      },
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
  },
);
