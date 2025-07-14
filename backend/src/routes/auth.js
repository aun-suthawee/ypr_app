/* eslint-disable */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, getProfile, logout } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'มีการพยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ในอีก 15 นาที'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('รูปแบบอีเมลไม่ถูกต้อง')
    .trim() // เอาช่องว่างต้นท้ายออกเท่านั้น
    .escape(), // ป้องกัน XSS attacks
  body('password')
    .isLength({ min: 6 })
    .withMessage('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
    .trim()
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: errors.array()
    });
  }
  
  next();
};

// Routes
// POST /api/auth/login
router.post('/login', 
  loginLimiter,
  loginValidation,
  handleValidationErrors,
  login
);

// GET /api/auth/profile
router.get('/profile', authenticate, getProfile);

// POST /api/auth/logout
router.post('/logout', authenticate, logout);

// GET /api/auth/verify - Check if token is valid
router.get('/verify', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Token ถูกต้อง',
    data: {
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        department: req.user.department,
        permissions: req.user.permissions
      }
    }
  });
});

module.exports = router;
