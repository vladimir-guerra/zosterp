import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";

export const Company = sequelize.define(
  "Company",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    socialReason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...["SRL", "SA"]),
      allowNull: false,
    },
    commercialName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

export const Associate = sequelize.define(
  "Associate",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    companyId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        key: "id",
        model: "companies",
      },
      unique: "uq_associate",
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        key: "id",
        model: "users",
      },
      unique: "uq_associate",
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);
