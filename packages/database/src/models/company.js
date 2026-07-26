import { sequelize } from "../config.js";
import { DataTypes } from "sequelize";
import { COMPANY } from "@repo/enums";

export const Company = sequelize.define(
  "Company",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    socialReason: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    commercialName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.keys(COMPANY)),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: true, underscored: true, paranoid: true },
);
