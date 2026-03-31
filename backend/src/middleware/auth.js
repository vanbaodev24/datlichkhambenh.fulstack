const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ errCode: 1, message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ errCode: 1, message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ errCode: 1, message: 'Admin access required' });
  next();
};

const isDoctor = (req, res, next) => {
  if (!['admin', 'doctor'].includes(req.user.role)) return res.status(403).json({ errCode: 1, message: 'Doctor access required' });
  next();
};

module.exports = { verifyToken, isAdmin, isDoctor };
