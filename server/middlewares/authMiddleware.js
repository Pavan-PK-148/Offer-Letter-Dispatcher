const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Decode and verify token integrity
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Inject authenticated user into req payload (minus password string)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authorization mismatch. Node not found.' });
      }
      
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Session validation token signature expired.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access Denied. Missing Authorization cryptographic header tokens.' });
  }
};

module.exports = { protectAdmin };