import { Token } from "./token.js";
import { User } from "./user.js";

User.hasMany(Token, { foreignKey: "userId", onDelete: "cascade" });
Token.belongsTo(User, { foreignKey: "userId", onDelete: "cascade" });

export { Token, User };
