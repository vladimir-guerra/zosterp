import { UAParser } from "ua-parser-js";

export const getDevice = async (req, _res, next) => {
  try {
    const uaResult = new UAParser(req.headers["user-agent"]).getResult();
    const device = uaResult
      ? `${uaResult?.browser?.name} ${uaResult?.browser?.major} - ${uaResult?.os?.name}`
      : "Unkwon";

    req.ua = { device, result: uaResult };
    return next();
  } catch (error) {
    return next(error);
  }
};
