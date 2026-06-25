import { DataTypes } from "sequelize";
import { sequelize } from "../index";

export const Transaction = sequelize.define(
  "Transaction",
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
        model: "transactions",
      },
    },
    assignmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        key: "id",
        model: "assignments",
      },
    },
    timesheetId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        key: "id",
        model: "timesheets",
      },
    },
    
  },
  { timestamps: true, paranoid: true, underscored: true },
);
