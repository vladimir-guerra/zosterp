import { sequelize } from "../config.js";
import { DataTypes } from "sequelize";

export const Associate = sequelize.define(
  "Associate",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
    },
    taskId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "tasks",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [{ unique: true, fields: ["user_id", "role_id", "task_id"] }],
  },
);
