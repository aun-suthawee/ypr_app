/* eslint-disable */
const { verifyToken } = require('../controllers/authController');
const User = require('../models/User');

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'ไม่พบ Token การเข้าสู่ระบบ'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token ไม่ถูกต้อง'
      });
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      department: user.department,
      permissions: User.getUserPermissions(user.role)
    };

    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token หมดอายุ กรุณาเข้าสู่ระบบใหม่'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token ไม่ถูกต้อง'
      });
    }

    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในระบบ'
    });
  }
};

// Authorization middleware factory
const authorize = (module, action) => {
  return (req, res, next) => {
    const { role, permissions } = req.user;

    // Admin has access to everything
    if (role === 'admin') {
      return next();
    }

    // Check if user has required permission
    if (!permissions[module] || !permissions[module].includes(action)) {
      return res.status(403).json({
        success: false,
        message: 'ไม่มีสิทธิ์เข้าถึงข้อมูลนี้'
      });
    }

    next();
  };
};

// Role-based middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'จำเป็นต้องมีสิทธิ์ผู้ดูแลระบบ'
    });
  }
  next();
};

module.exports = {
  authenticate,
  authorize,
  requireAdmin
};
