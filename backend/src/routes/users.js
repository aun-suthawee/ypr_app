/* eslint-disable */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// ป้องกันทุก route ด้วย middleware auth
router.use(auth.authenticate);

// GET /api/users - ดึงรายชื่อผู้ใช้ทั้งหมด (เฉพาะ admin)
router.get('/', auth.requireAdmin, userController.getUsers);

// GET /api/users/stats - ดึงสถิติผู้ใช้ (เฉพาะ admin)
router.get('/stats', auth.requireAdmin, userController.getUserStats);

// GET /api/users/:id - ดึงข้อมูลผู้ใช้ตาม ID
router.get('/:id', userController.getUserById);

// POST /api/users - สร้างผู้ใช้ใหม่ (เฉพาะ admin)
router.post('/', auth.requireAdmin, userController.createUser);

// PUT /api/users/:id - อัปเดตผู้ใช้
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id - ลบผู้ใช้ (เฉพาะ admin)
router.delete('/:id', auth.requireAdmin, userController.deleteUser);

// PUT /api/users/:id/activate - เปิดใช้งานผู้ใช้ (เฉพาะ admin)
router.put('/:id/activate', auth.requireAdmin, userController.activateUser);

// PUT /api/users/:id/deactivate - ปิดใช้งานผู้ใช้ (เฉพาะ admin)
router.put('/:id/deactivate', auth.requireAdmin, userController.deactivateUser);

// PUT /api/users/:id/change-password - เปลี่ยนรหัสผ่าน
router.put('/:id/change-password', userController.changePassword);

module.exports = router;
