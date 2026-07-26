import { DataTypes } from "sequelize";
import { sequelize } from "../config.js";
import { ACTION, RESOURCE } from "@repo/enums";

export const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "companies",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    underscored: true,
    timestamps: true,
    indexes: [{ unique: true, fields: ["name", "company_id"] }],
  },
);

export const Permission = sequelize.define(
  "Permission",
  {
    roleId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "roles",
        key: "id",
      },
      primaryKey: true,
    },
    action: {
      type: DataTypes.ENUM(...Object.keys(ACTION)),
      allowNull: false,
      primaryKey: true,
    },
    resource: {
      type: DataTypes.ENUM(...Object.keys(RESOURCE)),
      allowNull: false,
      primaryKey: true,
    },
  },
  { underscored: true },
);
