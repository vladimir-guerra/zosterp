import { UAParser } from "ua-parser-js";

export default async function getDevice(req, _res, next) {
  try {
    const uaResult = new UAParser(req.headers["user-agent"]).getResult();
    const device = uaResult
      ? `${uaResult?.browser?.name} ${uaResult?.browser?.major} - ${uaResult?.os?.name}`
      : "Unkwon";

    req.device = device;
    next();
  } catch (error) {
    next(error);
  }
}
