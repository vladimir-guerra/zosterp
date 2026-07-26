import { User, Token } from "./user.js";
import { Associate } from "./associate.js";
import { Company } from "./company.js";
import { Role, Permission } from "./role.js";
import { Task, Timesheet } from "./task.js";

User.hasMany(Token, { foreignKey: "userId", onDelete: "cascade" });
Token.belongsTo(User, { foreignKey: "userId", onDelete: "cascade" });

User.hasMany(Associate, { foreignKey: "userId", onDelete: "cascade" });
Associate.belongsTo(User, { foreignKey: "userId", onDelete: "cascade" });

User.hasMany(Associate, { foreignKey: "userId", onDelete: "cascade" });
Associate.belongsTo(User, { foreignKey: "userId", onDelete: "cascade" });

Company.hasMany(Associate, { foreignKey: "companyId", onDelete: "cascade" });
Associate.belongsTo(Company, { foreignKey: "companyId", onDelete: "cascade" });

Company.hasMany(Role, { foreignKey: "companyId", onDelete: "cascade" });
Role.belongsTo(Company, { foreignKey: "companyId", onDelete: "cascade" });

Role.hasMany(Associate, { foreignKey: "roleId", onDelete: "cascade" });
Associate.belongsTo(Role, { foreignKey: "roleId", onDelete: "cascade" });

Role.hasMany(Permission, { foreignKey: "roleId", onDelete: "cascade" });
Permission.belongsTo(Role, { foreignKey: "roleId", onDelete: "cascade" });

Task.hasMany(Associate, { foreignKey: "userId", onDelete: "cascade" });
Associate.belongsTo(Task, { foreignKey: "userId", onDelete: "cascade" });

Task.hasMany(Task, { foreignKey: "parentId", onDelete: "cascade" });
Task.belongsTo(Task, { foreignKey: "parentId", onDelete: "cascade" });

Task.hasMany(Timesheet, { foreignKey: "taskId", onDelete: "cascade" });
Timesheet.belongsTo(Task, { foreignKey: "taskId", onDelete: "cascade" });

Associate.hasMany(Timesheet, {
  foreignKey: "associateId",
  onDelete: "cascade",
});
Timesheet.belongsTo(Associate, {
  foreignKey: "associateId",
  onDelete: "cascade",
});

export { Token, User, Company, Associate, Role, Permission, Task, Timesheet };
