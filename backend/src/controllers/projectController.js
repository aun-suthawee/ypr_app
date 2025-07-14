/* eslint-disable */
const Project = require('../models/Project');

// ดึงโครงการทั้งหมด
const getProjects = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      project_type: req.query.project_type,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      min_budget: req.query.min_budget ? parseFloat(req.query.min_budget) : null,
      max_budget: req.query.max_budget ? parseFloat(req.query.max_budget) : null,
      search: req.query.search,
      orderBy: req.query.orderBy,
      orderDirection: req.query.orderDirection,
      limit: req.query.limit ? parseInt(req.query.limit) : null,
      offset: req.query.offset ? parseInt(req.query.offset) : null
    };

    // กรองตามผู้ใช้ - admin เห็นทั้งหมด, user ทั่วไปเห็นของตัวเองเท่านั้น
    if (req.user.role !== 'admin') {
      filters.created_by = req.user.id;
    }

    // กรองเฉพาะค่าที่ไม่ใช่ null/undefined
    Object.keys(filters).forEach(key => {
      if (filters[key] === null || filters[key] === undefined || filters[key] === '') {
        delete filters[key];
      }
    });

    const projects = await Project.findAll(filters);
    const total = await Project.count(filters);

    res.json({
      success: true,
      message: 'ดึงข้อมูลโครงการสำเร็จ',
      data: {
        projects,
        pagination: {
          total,
          limit: filters.limit || total,
          offset: filters.offset || 0,
          pages: filters.limit ? Math.ceil(total / filters.limit) : 1
        }
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลโครงการ'
    });
  }
};

// ดึงโครงการตาม ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบโครงการที่ต้องการ'
      });
    }

    // ตรวจสอบสิทธิ์ (Department user สามารถดูได้เฉพาะที่ตนเองสร้าง)
    if (req.user.role === 'department' && project.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'คุณไม่มีสิทธิ์ดูโครงการนี้'
      });
    }

    res.json({
      success: true,
      message: 'ดึงข้อมูลโครงการสำเร็จ',
      data: { project }
    });
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลโครงการ'
    });
  }
};

// สร้างโครงการใหม่
const createProject = async (req, res) => {
  try {
    const {
      name,
      key_activities,
      budget,
      expected_results,
      project_type,
      start_date,
      end_date,
      responsible_title_prefix,
      responsible_first_name,
      responsible_last_name,
      responsible_position,
      responsible_phone,
      responsible_email,
      activity_location,
      districts,
      province,
      strategic_issues,
      strategies,
      document_links,
      status
    } = req.body;

    // ตรวจสอบวันที่
    if (start_date && end_date && new Date(end_date) < new Date(start_date)) {
      return res.status(400).json({
        success: false,
        message: 'วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น'
      });
    }

    // ตรวจสอบงบประมาณ
    if (budget && budget < 0) {
      return res.status(400).json({
        success: false,
        message: 'งบประมาณต้องเป็นจำนวนบวก'
      });
    }

    const projectData = {
      name,
      key_activities,
      budget: budget ? parseFloat(budget) : null,
      expected_results,
      project_type: project_type || 'new',
      start_date,
      end_date,
      responsible_title_prefix,
      responsible_first_name,
      responsible_last_name,
      responsible_position,
      responsible_phone,
      responsible_email,
      activity_location,
      districts: Array.isArray(districts) ? districts : [],
      province: province || 'ยะลา',
      strategic_issues: Array.isArray(strategic_issues) ? strategic_issues : [],
      strategies: Array.isArray(strategies) ? strategies : [],
      document_links: Array.isArray(document_links) ? document_links : [],
      status: status || 'planning',
      created_by: req.user.id
    };

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: 'สร้างโครงการสำเร็จ',
      data: { project }
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างโครงการ'
    });
  }
};

// อัปเดตโครงการ
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log('🔄 Updating project:', id);
    console.log('📝 Update data:', JSON.stringify(updateData, null, 2));
    console.log('👤 User:', req.user.id, req.user.role);

    // ตรวจสอบการมีอยู่ของโครงการ
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      console.log('❌ Project not found:', id);
      return res.status(404).json({
        success: false,
        message: 'ไม่พบโครงการที่ต้องการอัปเดต'
      });
    }

    console.log('✅ Found existing project, created_by:', existingProject.created_by);

    // ตรวจสอบสิทธิ์ (Department user สามารถแก้ไขได้เฉพาะที่ตนเองสร้าง)
    if (req.user.role === 'department' && existingProject.created_by !== req.user.id) {
      console.log('❌ Permission denied:', req.user.id, 'vs', existingProject.created_by);
      return res.status(403).json({
        success: false,
        message: 'คุณไม่มีสิทธิ์แก้ไขโครงการนี้'
      });
    }

    // ตรวจสอบวันที่ (ถ้ามีการอัปเดต)
    if (updateData.start_date && updateData.end_date) {
      if (new Date(updateData.end_date) < new Date(updateData.start_date)) {
        console.log('❌ Invalid date range:', updateData.start_date, updateData.end_date);
        return res.status(400).json({
          success: false,
          message: 'วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น'
        });
      }
    }

    // ตรวจสอบงบประมาณ
    if (updateData.budget && updateData.budget < 0) {
      console.log('❌ Invalid budget:', updateData.budget);
      return res.status(400).json({
        success: false,
        message: 'งบประมาณต้องเป็นจำนวนบวก'
      });
    }

    // แปลงงบประมาณเป็นตัวเลข
    if (updateData.budget) {
      updateData.budget = parseFloat(updateData.budget);
    }

    console.log('🔄 Calling Project.update...');
    const project = await Project.update(id, updateData);
    console.log('✅ Project updated successfully:', project.id);

    res.json({
      success: true,
      message: 'อัปเดตโครงการสำเร็จ',
      data: { project }
    });
  } catch (error) {
    console.error('❌ Update project error:', error);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการอัปเดตโครงการ'
    });
  }
};

// ลบโครงการ
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบการมีอยู่ของโครงการ
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบโครงการที่ต้องการลบ'
      });
    }

    // ตรวจสอบสิทธิ์ (Department user สามารถลบได้เฉพาะที่ตนเองสร้าง)
    if (req.user.role === 'department' && existingProject.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'คุณไม่มีสิทธิ์ลบโครงการนี้'
      });
    }

    await Project.delete(id);

    res.json({
      success: true,
      message: 'ลบโครงการสำเร็จ'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการลบโครงการ'
    });
  }
};

// ดึงสถิติโครงการ
const getProjectStats = async (req, res) => {
  try {
    // กรองสถิติตามผู้ใช้ - admin เห็นทั้งหมด, user ทั่วไปเห็นของตัวเองเท่านั้น
    const filters = {};
    if (req.user.role !== 'admin') {
      filters.created_by = req.user.id;
    }

    const stats = await Project.getStats(filters);

    res.json({
      success: true,
      message: 'ดึงสถิติโครงการสำเร็จ',
      data: { stats }
    });
  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงสถิติโครงการ'
    });
  }
};

// ดึงโครงการทั้งหมดแบบ public (ไม่ต้อง authentication)
const getPublicProjects = async (req, res) => {
  try {
    console.log('🔓 Public projects endpoint called');
    console.log('🔧 Request query:', req.query);
    
    const filters = {
      status: req.query.status,
      project_type: req.query.project_type,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      min_budget: req.query.min_budget ? parseFloat(req.query.min_budget) : null,
      max_budget: req.query.max_budget ? parseFloat(req.query.max_budget) : null,
      search: req.query.search,
      orderBy: req.query.orderBy,
      orderDirection: req.query.orderDirection,
      limit: req.query.limit ? parseInt(req.query.limit) : 10, // Default limit สำหรับ public
      offset: req.query.offset ? parseInt(req.query.offset) : null
    };

    console.log('📋 Filters before cleanup:', filters);

    // กรองเฉพาะค่าที่ไม่ใช่ null/undefined/empty และ validate numbers
    Object.keys(filters).forEach(key => {
      if (filters[key] === null || filters[key] === undefined || filters[key] === '') {
        delete filters[key];
      } else if (key === 'limit' || key === 'offset') {
        // Ensure limit and offset are valid positive integers
        const num = parseInt(filters[key]);
        if (isNaN(num) || num < 0) {
          delete filters[key];
        } else {
          filters[key] = num;
        }
      }
    });

    // Set default limit if not provided
    if (!filters.limit) {
      filters.limit = 10;
    }

    console.log('📋 Filters after cleanup:', filters);

    const projects = await Project.findAll(filters);
    console.log('✅ Projects found:', projects.length);
    
    const total = await Project.count(filters);
    console.log('📊 Total count:', total);

    res.json({
      success: true,
      message: 'ดึงข้อมูลโครงการสำเร็จ',
      data: {
        projects,
        pagination: {
          total,
          limit: filters.limit || total,
          offset: filters.offset || 0,
          pages: filters.limit ? Math.ceil(total / filters.limit) : 1
        }
      }
    });
  } catch (error) {
    console.error('❌ Get public projects error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลโครงการ',
      error: error.message
    });
  }
};

// ดึงสถิติโครงการแบบ public (ไม่ต้อง authentication)
const getPublicProjectStats = async (req, res) => {
  try {
    const stats = await Project.getStats();

    res.json({
      success: true,
      message: 'ดึงสถิติโครงการสำเร็จ',
      data: { stats }
    });
  } catch (error) {
    console.error('Get public project stats error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงสถิติโครงการ'
    });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
  getPublicProjects,
  getPublicProjectStats
};
