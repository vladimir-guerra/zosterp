import "dotenv-safe/config.js";
import { sequelize } from "@repo/database";
import express from "express";
import cookieParser from "cookie-parser";
import { isAuth, errorHandler } from "./middlewares/index.js";
import { authRouter, meRouter, companyRouter } from "./routers/index.js";
import { slowDown } from "express-slow-down";
import { rateLimit, MINUTE } from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 15 * MINUTE, // SECOND, MINUTE, HOUR, and DAY constants are available, or a use bare number for milliseconds
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
});

const limiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 5, // Allow 5 requests per 15 minutes.
  delayMs: (hits) => hits * 100, // Add 100 ms of delay to every request after the 5th one.
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(limiter);
app.use(rateLimiter);

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
