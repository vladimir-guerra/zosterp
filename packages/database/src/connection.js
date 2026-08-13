import { Sequelize } from "sequelize";

// Solo creamos la conexión y la exportamos
export const sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: false
});