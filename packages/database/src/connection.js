import { Sequelize, Op } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: false
});


export { sequelize, Op }