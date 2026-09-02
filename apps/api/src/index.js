import "dotenv/config"
import cookieParser from "cookie-parser";
import express from "express";
import { sequelize } from "@repo/database";
import { getLanguage } from "./middlewares/index.js";
import { errorHandler } from "./utils/index.js";
import { authRouter } from "./routers/index.js";
import { companyRouter } from "./routers/company.js";
import {rateLimit} from "express-rate-limit"
import {slowDown} from 'express-slow-down'
import cors from 'cors'


const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggr
});

const slowLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 5, // Allow 5 requests per 15 minutes.
  delayMs: (hits) => hits * 100, // Add 100 ms of delay to every request after the 5th one.
});

const corsOptions = {
  origin: process.env.API_ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

const app = express();

app.use(slowLimiter);
app.use(rateLimiter);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(getLanguage);

app.use("/company", companyRouter);
app.use("/auth", authRouter);
app.use("/profile", authRouter);

app.use(errorHandler);

async function startServer() {
  try {
    await sequelize.sync({ alter: true, force: true});
    console.log("DB OK");
    app.listen(process.env.API_PORT || 3000, () => console.log("API OK"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

startServer();
