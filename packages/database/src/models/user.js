import { sequelize } from "../config.js";
import { DataTypes, Op } from "sequelize";
import { compare, hash } from "bcrypt";

export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    has_2fa: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password: { type: DataTypes.VIRTUAL },
  },
  {
    underscored: true,
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeValidate: async (user) => {
        if (user.password) user.passwordHash = await hash(user.password, 10);
      },
      afterUpdate: async (user) => {
        if (user.changed("isValid") && user.isValid === true && user.has_2fa)
          user.has_2fa = false;
      },
    },
    defaultScope: { attributes: { exclude: ["passwordHash"] } },
  },
);

User.prototype.checkPassword = async function (password) {
  return await compare(password, this.passwordHash);
};

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
