import { DataTypes } from "sequelize";
import { sequelize } from "../index";

export const Assignment = sequelize.define(
  "Assignment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    associateId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        key: "id",
        model: "associates",
      },
      unique: "uq_assignments",
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        key: "id",
        model: "roles",
      },
      unique: "uq_assignments",
    },
    taskId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        key: "id",
        model: "tasks",
      },
      unique: "uq_assignments",
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

export const Role = sequelize.define(
  "Role",
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
        model: "roles",
      },
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  { underscored: true },
);

export const Permission = sequelize.define(
  "Permission",
  {
    roleId: {
      primaryKey: true,
      allowNull: false,
      references: {
        key: "id",
        model: "roles",
      },
    },
    action: {
        primaryKey: true,
      type: DataTypes.ENUM(...[0, 1, 2, 3]) /*C R U D*/,
    },
    resource: {
        primaryKey: true,
        type: DataTypes.ENUM(...[""]) /*tablas*/
    }
  },
  { underscored: true },
);
