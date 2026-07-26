import "dotenv-safe/config.js";
import { sequelize } from "@repo/database";
import express from "express";
import cookieParser from "cookie-parser";
import { isAuth, errorHandler } from "./middlewares/index.js";
import { authRouter, meRouter, companyRouter } from "./routers/index.js";
import { slowDown } from "express-slow-down";
import { rateLimit, MINUTE } from "express-rate-limit";
import cors from "cors";

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutos
  delayAfter: 70, // Empieza a aplicar retardo a partir de la petición 70
  delayMs: (hits) => (hits - 70) * 150, // Incremento progresivo de 150ms por cada petición extra
  maxDelayMs: 2000, // Lámite máximo de retraso (2 segundos) para evitar bloqueos eternos en el cliente
  standardHeaders: "draft-8", // Cabeceras estándar modernas
  legacyHeaders: false,
});

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100, // Límite estricto de 100 solicitudes por ventana de 15 min
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: {
    status: 429,
    error:
      "Demasiadas solicitudes desde esta IP, por favor intente de nuevo más tarde.",
  },
});

const whitelist = [
  process.env.FRONTEND_URL,
  `http://localhost:${process.env.PORT}`,
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como aplicaciones móviles, Postman o curl)
    if (!origin) return callback(null, true);
    if (
      whitelist.indexOf(origin) !== -1 ||
      process.env.NODE_ENV === "development"
    )
      callback(null, true);
    else callback(new Error("Bloqueado por la política de CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Cabeceras permitidas
  credentials: true, // Necesario si usas cookies, tokens o sesiones
  optionsSuccessStatus: 200, // Para compatibilidad con navegadores antiguos (IE11)
  maxAge: 86400, // Tiempo (en segundos) que el navegador cachea la respuesta preflight (24 horas)
};

const app = express();
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(speedLimiter);
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
