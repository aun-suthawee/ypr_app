/* eslint-disable */
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

// Public routes (ไม่ต้อง authentication)
// GET /api/projects/public - ดึงโครงการทั้งหมดแบบ public (ข้อมูลเบื้องต้น)
router.get('/public', projectController.getPublicProjects);

// GET /api/projects/public/stats - ดึงสถิติโครงการแบบ public
router.get('/public/stats', projectController.getPublicProjectStats);

// Protected routes (ต้อง authentication)
// ป้องกันทุก route ด้วย middleware auth
router.use(auth.authenticate);

// GET /api/projects - ดึงโครงการทั้งหมด
router.get('/', projectController.getProjects);

// GET /api/projects/stats - ดึงสถิติโครงการ
router.get('/stats', projectController.getProjectStats);

// GET /api/projects/:id - ดึงโครงการตาม ID
router.get('/:id', projectController.getProjectById);

// POST /api/projects - สร้างโครงการใหม่
router.post('/', projectController.createProject);

// PUT /api/projects/:id - อัปเดตโครงการ
router.put('/:id', projectController.updateProject);

// DELETE /api/projects/:id - ลบโครงการ
router.delete('/:id', projectController.deleteProject);

module.exports = router;
