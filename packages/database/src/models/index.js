import { sequelize } from "../connection.js";
import { User, Token } from "./user.js";
import { Company, Associate } from "./company.js";
import { Task } from "./task.js";
import { Assignment, Role, Permission } from "./assignment.js";
import { Timesheet } from "./timesheet.js";
import { Transaction } from "./transaction.js";

// --- Relaciones de Usuario ---
User.hasMany(Token, { foreignKey: "userId" });
Token.belongsTo(User, { foreignKey: "userId" });

// --- Compañía y Asociados ---
Company.hasMany(Associate, { foreignKey: "companyId" });
Associate.belongsTo(Company, { foreignKey: "companyId" });

User.hasMany(Associate, { foreignKey: "userId" });
Associate.belongsTo(User, { foreignKey: "userId" });

// --- Roles y Permisos ---
Role.hasMany(Permission, { foreignKey: "roleId" });
Permission.belongsTo(Role, { foreignKey: "roleId" });

// --- Tareas (Estructura de árbol) ---
Task.hasMany(Task, { as: "Subtasks", foreignKey: "parentId" });
Task.belongsTo(Task, { as: "Parent", foreignKey: "parentId" });

// --- Tareas y Asociados ---
Associate.hasMany(Task, { foreignKey: "associateId" });
Task.belongsTo(Associate, { foreignKey: "associateId" });

// --- Asignaciones ---
Associate.hasMany(Assignment, { foreignKey: "associateId" });
Assignment.belongsTo(Associate, { foreignKey: "associateId" });

Role.hasMany(Assignment, { foreignKey: "roleId" });
Assignment.belongsTo(Role, { foreignKey: "roleId" });

Task.hasMany(Assignment, { foreignKey: "taskId" });
Assignment.belongsTo(Task, { foreignKey: "taskId" });

// --- Timesheets y Transacciones ---
Task.hasMany(Timesheet, { foreignKey: "taskId" });
Timesheet.belongsTo(Task, { foreignKey: "taskId" });

Assignment.hasMany(Timesheet, { foreignKey: "assignmentId" });
Timesheet.belongsTo(Assignment, { foreignKey: "assignmentId" });

Assignment.hasMany(Transaction, { foreignKey: "assignmentId" });
Transaction.belongsTo(Assignment, { foreignKey: "assignmentId" });

Timesheet.hasMany(Transaction, { foreignKey: "timesheetId" });
Transaction.belongsTo(Timesheet, { foreignKey: "timesheetId" });

Transaction.belongsTo(Transaction, {
  as: "ParentTransaction",
  foreignKey: "parentId",
});

export {
  User,
  Token,
  Company,
  Associate,
  Role,
  Permission,
  Task,
  Assignment,
  Timesheet,
  Transaction,
};
