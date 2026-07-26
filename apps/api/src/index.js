import "dotenv-safe/config.js";
import { sequelize } from "@repo/database";
import express from "express";
import cookieParser from "cookie-parser";
import { isAuth, errorHandler } from "./middlewares/index.js";
import { authRouter, meRouter, companyRouter } from "./routers/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/me", isAuth, meRouter);
app.use("/companies", isAuth, companyRouter);

app.use(errorHandler);

async function startAPI() {
  try {
    await sequelize.sync({ force: false });
    console.log("DB OK");
    app.listen(process.env.PORT || 3000, () => console.log("API OK"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

startAPI();
