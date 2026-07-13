import { languages } from "@repo/locales";
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
    language: {
      type: DataTypes.ENUM(...languages),
      defaultValue: languages[0],
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

/**
 * Limpia usuarios no validados hace 5 minutos
 */
async function cleanUsers() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  await User.destroy({
    where: {
      isValid: false,
      createdAt: { [Op.lt]: fiveMinutesAgo },
    },
  });
}
