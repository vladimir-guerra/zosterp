import createError from "http-errors";

export const isAuth = async (req, _, next) => {
  try {
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1];

    if (!token) throw createError(400, "not_session");

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      throw createError(400, error);
    }

    req.user = { id: decoded.userId };
    req.language = decoded.language;
    return next();
  } catch (error) {
    next(error);
  }
};

export const setBodyLanguage = async (req, _, next) => {
  try {
    req.body.language = req.language;
    next();
  } catch (error) {
    next(error);
  }
};
