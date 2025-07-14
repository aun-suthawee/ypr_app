/* eslint-disable */
const Strategy = require('../models/Strategy');

// ดึงกลยุทธ์ทั้งหมด
const getStrategies = async (req, res) => {
  try {
    const filters = {
      strategic_issue_id: req.query.strategic_issue_id,
      search: req.query.search,
      orderBy: req.query.orderBy,
      orderDirection: req.query.orderDirection,
      limit: req.query.limit ? parseInt(req.query.limit) : null,
      offset: req.query.offset ? parseInt(req.query.offset) : null
    };

    // กรองเฉพาะค่าที่ไม่ใช่ null/undefined
    Object.keys(filters).forEach(key => {
      if (filters[key] === null || filters[key] === undefined || filters[key] === '') {
        delete filters[key];
      }
    });

    const strategies = await Strategy.findAll(filters);
    const total = await Strategy.count(filters);

    res.json({
      success: true,
      message: 'ดึงข้อมูลกลยุทธ์สำเร็จ',
      data: {
        strategies,
        pagination: {
          total,
          limit: filters.limit || total,
          offset: filters.offset || 0,
          pages: filters.limit ? Math.ceil(total / filters.limit) : 1
        }
      }
    });
  } catch (error) {
    console.error('Get strategies error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลกลยุทธ์'
    });
  }
};

// ดึงกลยุทธ์ตาม ID
const getStrategyById = async (req, res) => {
  try {
    const { id } = req.params;
    const strategy = await Strategy.findById(id);

    if (!strategy) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบกลยุทธ์ที่ต้องการ'
      });
    }

    res.json({
      success: true,
      message: 'ดึงข้อมูลกลยุทธ์สำเร็จ',
      data: { strategy }
    });
  } catch (error) {
    console.error('Get strategy by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลกลยุทธ์'
    });
  }
};

// สร้างกลยุทธ์ใหม่
const createStrategy = async (req, res) => {
  try {
    const { strategic_issue_id, name, description, order } = req.body;

    // หาลำดับถัดไปอัตโนมัติถ้าไม่ได้ระบุ
    let strategyOrder = order;
    if (!strategyOrder) {
      const existingStrategies = await Strategy.findAll({
        strategic_issue_id: strategic_issue_id
      });
      strategyOrder = existingStrategies.length + 1;
    }

    const strategyData = {
      strategic_issue_id,
      name,
      description,
      order: parseInt(strategyOrder),
      created_by: req.user.id
    };

    const strategy = await Strategy.create(strategyData);

    res.status(201).json({
      success: true,
      message: 'สร้างกลยุทธ์สำเร็จ',
      data: { strategy }
    });
  } catch (error) {
    console.error('Create strategy error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างกลยุทธ์'
    });
  }
};

// อัปเดตกลยุทธ์
const updateStrategy = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // ตรวจสอบการมีอยู่ของกลยุทธ์
    const existingStrategy = await Strategy.findById(id);
    if (!existingStrategy) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบกลยุทธ์ที่ต้องการอัปเดต'
      });
    }

    // ตรวจสอบสิทธิ์ (Department user สามารถแก้ไขได้เฉพาะที่ตนเองสร้าง)
    if (req.user.role === 'department' && existingStrategy.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'คุณไม่มีสิทธิ์แก้ไขกลยุทธ์นี้'
      });
    }

    // แปลงเป็นตัวเลข
    if (updateData.order) updateData.order = parseInt(updateData.order);

    const strategy = await Strategy.update(id, updateData);

    res.json({
      success: true,
      message: 'อัปเดตกลยุทธ์สำเร็จ',
      data: { strategy }
    });
  } catch (error) {
    console.error('Update strategy error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการอัปเดตกลยุทธ์'
    });
  }
};

// ลบกลยุทธ์
const deleteStrategy = async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบการมีอยู่ของกลยุทธ์
    const existingStrategy = await Strategy.findById(id);
    if (!existingStrategy) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบกลยุทธ์ที่ต้องการลบ'
      });
    }

    // ตรวจสอบสิทธิ์ (Department user สามารถลบได้เฉพาะที่ตนเองสร้าง)
    if (req.user.role === 'department' && existingStrategy.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'คุณไม่มีสิทธิ์ลบกลยุทธ์นี้'
      });
    }

    await Strategy.delete(id);

    res.json({
      success: true,
      message: 'ลบกลยุทธ์สำเร็จ'
    });
  } catch (error) {
    console.error('Delete strategy error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการลบกลยุทธ์'
    });
  }
};

// ดึงสถิติกลยุทธ์
const getStrategyStats = async (req, res) => {
  try {
    const stats = await Strategy.getStats();

    res.json({
      success: true,
      message: 'ดึงสถิติกลยุทธ์สำเร็จ',
      data: { stats }
    });
  } catch (error) {
    console.error('Get strategy stats error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงสถิติกลยุทธ์'
    });
  }
};

module.exports = {
  getStrategies,
  getStrategyById,
  createStrategy,
  updateStrategy,
  deleteStrategy,
  getStrategyStats
};
