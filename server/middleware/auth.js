const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'uts_secret_key_2026';

// Middleware to authenticate JWT token and attach user info to request
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    req.user = decodedUser;
    next();
  });
};

// Middleware to check if the authenticated user has admin role
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({ success: false, message: 'Admins only' });
};

module.exports = {
  authenticateToken,
  isAdmin
};