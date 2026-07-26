import { Op } from "sequelize";
import { User, Company } from "./models/index.js";

async function cleanInvalids() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const where = {
    isValid: false,
    createdAt: { [Op.lt]: fiveMinutesAgo },
  };
  await User.destroy({ where });
  await Company.destroy({ where });
}
