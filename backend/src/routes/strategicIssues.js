/* eslint-disable */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Helper functions for Buddhist Era (BE) conversion
const toBuddhistYear = (gregorianYear) => gregorianYear + 543;
const toGregorianYear = (buddhistYear) => buddhistYear - 543;

// Custom validator for Buddhist Era years
const validateBuddhistYear = (value, { req, path }) => {
  const buddhistYear = parseInt(value);
  
  // Check if the Buddhist year is in valid range (2463-2573 BE = 1920-2030 CE)
  if (buddhistYear < 2463 || buddhistYear > 2573) {
    throw new Error(`${path === 'start_year' ? 'ปีเริ่มต้น' : 'ปีสิ้นสุด'}ต้องอยู่ระหว่าง พ.ศ. 2463-2573`);
  }
  
  // Keep the Buddhist year for storage (don't convert to Gregorian)
  req.body[path] = buddhistYear;
  return true;
};
const { authenticate, authorize } = require('../middleware/auth');
const {
  getStrategicIssues,
  getStrategicIssueById,
  createStrategicIssue,
  updateStrategicIssue,
  deleteStrategicIssue,
  getStrategicIssueStats
} = require('../controllers/strategicIssueController');

// Validation rules
const createValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('ชื่อประเด็นยุทธศาสตร์ต้องมี 3-255 ตัวอักษร'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('รายละเอียดต้องไม่เกิน 2000 ตัวอักษร'),
  body('start_year')
    .isInt()
    .custom(validateBuddhistYear)
    .withMessage('ปีเริ่มต้นต้องเป็นปี พ.ศ. ระหว่าง 2463-2573'),
  body('end_year')
    .isInt()
    .custom(validateBuddhistYear)
    .withMessage('ปีสิ้นสุดต้องเป็นปี พ.ศ. ระหว่าง 2463-2573'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'completed'])
    .withMessage('สถานะต้องเป็น active, inactive หรือ completed')
];

const updateValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('ชื่อประเด็นยุทธศาสตร์ต้องมี 3-255 ตัวอักษร'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('รายละเอียดต้องไม่เกิน 2000 ตัวอักษร'),
  body('start_year')
    .optional()
    .isInt()
    .custom(validateBuddhistYear)
    .withMessage('ปีเริ่มต้นต้องเป็นปี พ.ศ. ระหว่าง 2463-2573'),
  body('end_year')
    .optional()
    .isInt()
    .custom(validateBuddhistYear)
    .withMessage('ปีสิ้นสุดต้องเป็นปี พ.ศ. ระหว่าง 2463-2573'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'completed'])
    .withMessage('สถานะต้องเป็น active, inactive หรือ completed')
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
// GET /api/strategic-issues/public - ดึงประเด็นยุทธศาสตร์ทั้งหมดแบบ public
router.get('/public', getStrategicIssues);

// GET /api/strategic-issues/public/stats - ดึงสถิติประเด็นยุทธศาสตร์แบบ public
router.get('/public/stats', getStrategicIssueStats);

// Protected routes (ต้อง authentication)
// GET /api/strategic-issues - ดึงประเด็นยุทธศาสตร์ทั้งหมด
router.get('/',
  authenticate,
  authorize('strategic_issues', 'read'),
  getStrategicIssues
);

// GET /api/strategic-issues/stats - ดึงสถิติประเด็นยุทธศาสตร์
router.get('/stats',
  authenticate,
  authorize('strategic_issues', 'read'),
  getStrategicIssueStats
);

// GET /api/strategic-issues/:id - ดึงประเด็นยุทธศาสตร์ตาม ID
router.get('/:id',
  authenticate,
  authorize('strategic_issues', 'read'),
  getStrategicIssueById
);

// POST /api/strategic-issues - สร้างประเด็นยุทธศาสตร์ใหม่
router.post('/',
  authenticate,
  authorize('strategic_issues', 'create'),
  createValidation,
  handleValidationErrors,
  createStrategicIssue
);

// PUT /api/strategic-issues/:id - อัปเดตประเด็นยุทธศาสตร์
router.put('/:id',
  authenticate,
  authorize('strategic_issues', 'update'),
  updateValidation,
  handleValidationErrors,
  updateStrategicIssue
);

// DELETE /api/strategic-issues/:id - ลบประเด็นยุทธศาสตร์
router.delete('/:id',
  authenticate,
  authorize('strategic_issues', 'delete'),
  deleteStrategicIssue
);

module.exports = router;
