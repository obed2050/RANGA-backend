const jwt = require('jsonwebtoken');

// hardcoded admin token used by frontend AuthContext
const ADMIN_STATIC_TOKEN = 'admin-token-secure-001';
const ADMIN_STATIC_USER  = { id: 5, role: 'admin' };

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const parts = header.split(' ');
  const token = parts[parts.length - 1]; // handle "Bearer Bearer <token>"

  // accept frontend hardcoded admin token
  if (token === ADMIN_STATIC_TOKEN) {
    req.user = ADMIN_STATIC_USER;
    return next();
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const isAllowed = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: 'Access denied' });
  next();
};

module.exports = { auth, isAllowed };
