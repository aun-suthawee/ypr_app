/* eslint-disable */
const StrategicIssue = require('../models/StrategicIssue');

const convertToDisplayFormat = (issue) => {
  if (!issue) return null;
  
  return issue;
};

const convertArrayToDisplayFormat = (issues) => {
  return issues.map(convertToDisplayFormat);
};

// ดึงประเด็นยุทธศาสตร์ทั้งหมด
const getStrategicIssues = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      year: req.query.year ? parseInt(req.query.year) : null,
      start_year: req.query.start_year ? parseInt(req.query.start_year) : null,
      end_year: req.query.end_year ? parseInt(req.query.end_year) : null,
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

    const issues = await StrategicIssue.findAll(filters);
    const total = await StrategicIssue.count(filters);

    // Convert years to Buddhist Era for display
    const displayIssues = convertArrayToDisplayFormat(issues);

    res.json({
      success: true,
      message: 'ดึงข้อมูลประเด็นยุทธศาสตร์สำเร็จ',
      data: {
        issues: displayIssues,
        pagination: {
          total,
          limit: filters.limit || total,
          offset: filters.offset || 0,
          pages: filters.limit ? Math.ceil(total / filters.limit) : 1
        }
      }
    });
  } catch (error) {
    console.error('Get strategic issues error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประเด็นยุทธศาสตร์'
    });
  }
};

// ดึงประเด็นยุทธศาสตร์ตาม ID
const getStrategicIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await StrategicIssue.findById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบประเด็นยุทธศาสตร์ที่ต้องการ'
      });
    }

    // Convert years to Buddhist Era for display
    const displayIssue = convertToDisplayFormat(issue);

    res.json({
      success: true,
      message: 'ดึงข้อมูลประเด็นยุทธศาสตร์สำเร็จ',
      data: { issue: displayIssue }
    });
  } catch (error) {
    console.error('Get strategic issue by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประเด็นยุทธศาสตร์'
    });
  }
};

// สร้างประเด็นยุทธศาสตร์ใหม่
const createStrategicIssue = async (req, res) => {
  try {
    const { title, description, start_year, end_year, order, status } = req.body;

    // ตรวจสอบปีที่สิ้นสุดต้องไม่น้อยกว่าปีเริ่มต้น (ปีที่ได้มาจากการแปลงใน validation แล้ว)
    if (end_year < start_year) {
      return res.status(400).json({
        success: false,
        message: 'ปีที่สิ้นสุดต้องไม่น้อยกว่าปีเริ่มต้น'
      });
    }

    // หาลำดับถัดไปอัตโนมัติถ้าไม่ได้ระบุ
    let issueOrder = order;
    if (!issueOrder) {
      const existingIssues = await StrategicIssue.findAll({
        start_year: parseInt(start_year),
        end_year: parseInt(end_year)
      });
      issueOrder = existingIssues.length + 1;
    }

    const issueData = {
      title,
      description,
      start_year: parseInt(start_year),
      end_year: parseInt(end_year),
      order: parseInt(issueOrder),
      status: status || 'active',
      created_by: req.user.id
    };

    const issue = await StrategicIssue.create(issueData);

    // Convert years to Buddhist Era for display
    const displayIssue = convertToDisplayFormat(issue);

    res.status(201).json({
      success: true,
      message: 'สร้างประเด็นยุทธศาสตร์สำเร็จ',
      data: { issue: displayIssue }
    });
  } catch (error) {
    console.error('Create strategic issue error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างประเด็นยุทธศาสตร์'
    });
  }
};

// อัปเดตประเด็นยุทธศาสตร์
const updateStrategicIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // ตรวจสอบการมีอยู่ของประเด็นยุทธศาสตร์
    const existingIssue = await StrategicIssue.findById(id);
    if (!existingIssue) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบประเด็นยุทธศาสตร์ที่ต้องการอัปเดต'
      });
    }

    // ตรวจสอบสิทธิ์ (Department user สามารถแก้ไขได้เฉพาะที่ตนเองสร้าง)
    if (req.user.role === 'department' && existingIssue.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'คุณไม่มีสิทธิ์แก้ไขประเด็นยุทธศาสตร์นี้'
      });
    }

    // ตรวจสอบปี (ถ้ามีการอัปเดต)
    if (updateData.start_year && updateData.end_year) {
      if (parseInt(updateData.end_year) < parseInt(updateData.start_year)) {
        return res.status(400).json({
          success: false,
          message: 'ปีที่สิ้นสุดต้องไม่น้อยกว่าปีเริ่มต้น'
        });
      }
    }

    // แปลงปีเป็นตัวเลข
    if (updateData.start_year) updateData.start_year = parseInt(updateData.start_year);
    if (updateData.end_year) updateData.end_year = parseInt(updateData.end_year);
    if (updateData.order) updateData.order = parseInt(updateData.order);

    const issue = await StrategicIssue.update(id, updateData);

    // Convert years to Buddhist Era for display
    const displayIssue = convertToDisplayFormat(issue);

    res.json({
      success: true,
      message: 'อัปเดตประเด็นยุทธศาสตร์สำเร็จ',
      data: { issue: displayIssue }
    });
  } catch (error) {
    console.error('Update strategic issue error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการอัปเดตประเด็นยุทธศาสตร์'
    });
  }
};

// ลบประเด็นยุทธศาสตร์
const deleteStrategicIssue = async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบการมีอยู่ของประเด็นยุทธศาสตร์
    const existingIssue = await StrategicIssue.findById(id);
    if (!existingIssue) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบประเด็นยุทธศาสตร์ที่ต้องการลบ'
      });
    }

    // ตรวจสอบสิทธิ์ (Department user สามารถลบได้เฉพาะที่ตนเองสร้าง)
    if (req.user.role === 'department' && existingIssue.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'คุณไม่มีสิทธิ์ลบประเด็นยุทธศาสตร์นี้'
      });
    }

    await StrategicIssue.delete(id);

    res.json({
      success: true,
      message: 'ลบประเด็นยุทธศาสตร์สำเร็จ'
    });
  } catch (error) {
    console.error('Delete strategic issue error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการลบประเด็นยุทธศาสตร์'
    });
  }
};

// ดึงสถิติประเด็นยุทธศาสตร์
const getStrategicIssueStats = async (req, res) => {
  try {
    const stats = await StrategicIssue.getStats();

    res.json({
      success: true,
      message: 'ดึงสถิติประเด็นยุทธศาสตร์สำเร็จ',
      data: { stats }
    });
  } catch (error) {
    console.error('Get strategic issue stats error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงสถิติประเด็นยุทธศาสตร์'
    });
  }
};

module.exports = {
  getStrategicIssues,
  getStrategicIssueById,
  createStrategicIssue,
  updateStrategicIssue,
  deleteStrategicIssue,
  getStrategicIssueStats
};
