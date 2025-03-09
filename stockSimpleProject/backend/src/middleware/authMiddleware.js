const jwt = require("jsonwebtoken");

const authMiddleware = async (request, response, next) => {
  const token = request.header("Authorization");

  if (!token) {
    return response.status(403).json({ error: "Access denied." });
  }

  try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      request.user = verified;
      next();
  } catch (error) {
      response.status(400).json({ message: "Invalid token" });
  }
};

module.exports = { authMiddleware };