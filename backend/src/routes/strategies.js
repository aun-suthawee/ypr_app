/* eslint-disable */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getStrategies,
  getStrategyById,
  createStrategy,
  updateStrategy,
  deleteStrategy,
  getStrategyStats
} = require('../controllers/strategyController');

// Validation rules
const createValidation = [
  body('strategic_issue_id')
    .isUUID()
    .withMessage('รหัสประเด็นยุทธศาสตร์ไม่ถูกต้อง'),
  body('name')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('ชื่อกลยุทธ์ต้องมี 3-255 ตัวอักษร'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('รายละเอียดต้องไม่เกิน 2000 ตัวอักษร')
];

const updateValidation = [
  body('strategic_issue_id')
    .optional()
    .isUUID()
    .withMessage('รหัสประเด็นยุทธศาสตร์ไม่ถูกต้อง'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('ชื่อกลยุทธ์ต้องมี 3-255 ตัวอักษร'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('รายละเอียดต้องไม่เกิน 2000 ตัวอักษร')
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

// Preflight requests are handled by the global CORS middleware in server.js

// Public routes (ไม่ต้อง authentication)
// GET /api/strategies/public - ดึงกลยุทธ์ทั้งหมดแบบ public
router.get('/public', getStrategies);

// GET /api/strategies/public/stats - ดึงสถิติกลยุทธ์แบบ public
router.get('/public/stats', getStrategyStats);

// Protected routes (ต้อง authentication)
// GET /api/strategies - ดึงกลยุทธ์ทั้งหมด
router.get('/',
  authenticate,
  authorize('strategies', 'read'),
  getStrategies
);

// GET /api/strategies/stats - ดึงสถิติกลยุทธ์
router.get('/stats',
  authenticate,
  authorize('strategies', 'read'),
  getStrategyStats
);

// GET /api/strategies/:id - ดึงกลยุทธ์ตาม ID
router.get('/:id',
  authenticate,
  authorize('strategies', 'read'),
  getStrategyById
);

// POST /api/strategies - สร้างกลยุทธ์ใหม่
router.post('/',
  authenticate,
  authorize('strategies', 'create'),
  createValidation,
  handleValidationErrors,
  createStrategy
);

// PUT /api/strategies/:id - อัปเดตกลยุทธ์
router.put('/:id',
  authenticate,
  authorize('strategies', 'update'),
  updateValidation,
  handleValidationErrors,
  updateStrategy
);

// DELETE /api/strategies/:id - ลบกลยุทธ์
router.delete('/:id',
  authenticate,
  authorize('strategies', 'delete'),
  deleteStrategy
);

module.exports = router;
