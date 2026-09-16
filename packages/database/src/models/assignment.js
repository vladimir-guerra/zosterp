import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";

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
  {
    underscored: true,
  },
);

export const Permission = sequelize.define(
  "Permission",
  {
    roleId: {
      primaryKey: true,
      allowNull: true,
      references: {
        key: "id",
        model: "roles",
      },
      type: DataTypes.UUID
    },
    action: {
      type: DataTypes.JSON(),
      defaultValue: [],
      allowNull: false,
      validate: {
        isAnArray(value) {
          if (!Array.isArray(value)) { throw new Error("the field must be an array"); }

          const allowedValues = ["0", "1", "2", "3"]; /** C.R.U.D  reference :OOOO*/

          for (let item of value) {
            if (!allowedValues.includes(item)) {
              throw new Error(`${item} its not allowed, you may add into ${allowedValues}`);
            }
          }
        }
      }
    },
    resource: {
      type: DataTypes.JSON(),
      defaultValue: [],
      allowNull: false,
      validate: {
        isAnArray(value) {
          if (!Array.isArray(value)) throw new Error("the field must be an array");

          const allowedValues = ["company", "user", "task", "assignment", "timesheet"]; /*tablas*/

          for (let item of value) {
            if (!allowedValues.includes(item)) {
              throw new Error(`${item} its not allowed, you may add into ${allowedValues}`);
            }
          }
        }
      }
    }
  },
  { underscored: true },
);


