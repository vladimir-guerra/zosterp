import jwt from "jsonwebtoken";

export default async function isAuth(req, res, next) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw sendError(404, "auth.token.not_found");

    const { userId } = jwt.verify(token, process.env.JWT_ACCESS);
    req.userId = userId;
    
    next();
  } catch (error) {
    next(error);
  }
}
