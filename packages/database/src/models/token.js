import { sequelize } from "../config.js";
import { DataTypes, Op } from "sequelize";

export const Token = sequelize.define(
  "Token",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: "uq_token",
      references: {
        model: "users",
        key: "id",
      },
    },
    device: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "uq_token",
    },
  },
  {
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ["user_id", "device"] }],
  },
);
