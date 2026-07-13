import { sequelize } from "../config.js";
import { DataTypes, Op } from "sequelize";

export const Company = sequelize.define(
  "Company",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  },
  { timestamps: true, underscored: true, paranoid: true },
);
