// 1. Re-exportamos la conexión ya inicializada
export { sequelize } from "./connection.js";

// 2. Exportamos TODOS los modelos y relaciones que ya armaste
export * from "./models/index.js";