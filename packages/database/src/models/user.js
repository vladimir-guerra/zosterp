import { DataTypes, Op } from "sequelize";
import { sequelize } from "../index";
import { languages } from "@repo/locales";
import { hash, compare, genSalt } from "bcrypt";

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
      defaultValue: false,
    },
    language: {
      type: DataTypes.ENUM(...languages),
      defaultValue: "en",
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: DataTypes.VIRTUAL,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    hooks: {
      beforeValidate: async (user) => {
        if (user.changed("password")) {
          const salt = await genSalt(10);
          user.passwordHash = await hash(user.password, salt);
        }
      },
    },
    defaultScope: { attributes: { exclude: ["passwordHash"] } },
  },
);

export const Token = sequelize.define(
  "Token",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        key: "id",
        model: "users",
      },
    },
    device: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
    hooks: {
      afterCreate: async (token, options) => {
        await Token.destroy({
          where: {
            userId: token.userId,
            device: token.device,
            id: {
              [Op.ne]: token.id,
            },
          },
          transaction: options.transaction,
        });
      },
    },
  },
);

User.prototype.validatePassword = async function (password) {
  return await compare(password, this.password_hash);
};
