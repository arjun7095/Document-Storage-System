// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Get token from header
  
  if (!token) {
    return res.status(401).send("Access denied, no token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach decoded user information to req.user
    next();  // Proceed to the next middleware (uploadDoc)
  } catch (error) {
    return res.status(400).send("Invalid token.");
  }
};

module.exports = authMiddleware;
