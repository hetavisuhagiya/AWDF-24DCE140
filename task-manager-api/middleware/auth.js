const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization && authorization.startsWith("Bearer ")
    ? authorization.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication token is required" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = authenticate;