const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // format: Bearer <token>
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // contains id and email
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
