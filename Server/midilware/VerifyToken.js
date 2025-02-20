import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token || token === "undefined") {
    return res
      .status(401)
      .json({ message: "Access Denied: Token missing or invalid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded._id };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    }
    return res.status(400).json({ message: "Invalid Token" });
  }
}
