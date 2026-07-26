import { UAParser } from "ua-parser-js";
import base from "../base.js";

/**
 * Middlewre para obtener el dispositivo de la sesión.
 */
export const getDevice = base(async (req, res, next) => {
  const uaResult = new UAParser(req.headers["user-agent"]).getResult();
  const device = uaResult
    ? `${uaResult?.browser?.name} ${uaResult?.browser?.major} - ${uaResult?.os?.name}`
    : "Unkwon";

  req.device = device;
  next();
});
