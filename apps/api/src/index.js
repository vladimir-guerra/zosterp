import "dotenv-safe/config.js";
import { sequelize } from "@repo/database";
import express from "express";
import cookieParser from "cookie-parser";
import { getLanguage } from "./middlewares/index.js";
import { handleErrors } from "./utils/index.js";
import { authRouter } from "./routers/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//setea el idioma desde donde se consulta
app.use(getLanguage);

app.use("/auth", authRouter);

//procesa la response en caso de errores
app.use(handleErrors);

async function startAPI() {
  try {
    await sequelize.sync({ force: true });
    console.log("DB OK");
    app.listen(process.env.PORT || 3000, () => console.log("API OK"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

startAPI();
