/* eslint-disable */
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Project {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.key_activities = data.key_activities;
    this.budget = data.budget;
    this.expected_results = data.expected_results;
    this.project_type = data.project_type; // 'new' or 'continuous'
    this.start_date = data.start_date;
    this.end_date = data.end_date;
    this.responsible_title_prefix = data.responsible_title_prefix;
    this.responsible_first_name = data.responsible_first_name;
    this.responsible_last_name = data.responsible_last_name;
    this.responsible_position = data.responsible_position;
    this.responsible_phone = data.responsible_phone;
    this.responsible_email = data.responsible_email;
    this.activity_location = data.activity_location;
    this.districts = data.districts; // JSON array of district names
    this.province = data.province || 'ยะลา';
    this.strategic_issues = data.strategic_issues; // JSON array of strategic issue IDs
    this.strategies = data.strategies; // JSON array of strategy IDs
    this.document_links = data.document_links; // JSON array of document links
    this.status = data.status || 'planning'; // planning, active, completed, cancelled
    this.created_by = data.created_by;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  // สร้างตาราง Projects
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        key_activities TEXT,
        budget DECIMAL(15,2),
        expected_results TEXT,
        project_type ENUM('new', 'continuous') DEFAULT 'new',
        start_date DATE,
        end_date DATE,
        responsible_title_prefix VARCHAR(50),
        responsible_first_name VARCHAR(100),
        responsible_last_name VARCHAR(100),
        responsible_position VARCHAR(100),
        responsible_phone VARCHAR(20),
        responsible_email VARCHAR(100),
        activity_location TEXT,
        districts JSON,
        province VARCHAR(50) DEFAULT 'ยะลา',
        strategic_issues JSON,
        strategies JSON,
        document_links JSON,
        status ENUM('planning', 'active', 'completed', 'cancelled') DEFAULT 'planning',
        created_by VARCHAR(36) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_project_type (project_type),
        INDEX idx_start_date (start_date),
        INDEX idx_end_date (end_date),
        INDEX idx_created_by (created_by),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    
    try {
      await pool.execute(query);
      console.log('✅ Projects table created successfully');
    } catch (error) {
      console.error('❌ Error creating Projects table:', error);
      throw error;
    }
  }

  // สร้างโครงการใหม่
  static async create(projectData) {
    const project = new Project(projectData);
    
    const query = `
      INSERT INTO projects 
      (id, name, key_activities, budget, expected_results, project_type, start_date, end_date,
       responsible_title_prefix, responsible_first_name, responsible_last_name, responsible_position,
       responsible_phone, responsible_email, activity_location, districts, province,
       strategic_issues, strategies, document_links, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    try {
      await pool.execute(query, [
        project.id,
        project.name,
        project.key_activities,
        project.budget,
        project.expected_results,
        project.project_type,
        project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : null,
        project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : null,
        project.responsible_title_prefix,
        project.responsible_first_name,
        project.responsible_last_name,
        project.responsible_position,
        project.responsible_phone,
        project.responsible_email,
        project.activity_location,
        JSON.stringify(project.districts || []),
        project.province,
        JSON.stringify(project.strategic_issues || []),
        JSON.stringify(project.strategies || []),
        JSON.stringify(project.document_links || []),
        project.status,
        project.created_by
      ]);
      
      return await this.findById(project.id);
    } catch (error) {
      console.error('❌ Error creating project:', error);
      throw error;
    }
  }

  // ค้นหาโครงการตาม ID
  static async findById(id) {
    const query = `
      SELECT p.*, 
             u.first_name as creator_first_name, 
             u.last_name as creator_last_name, 
             u.title_prefix as creator_title_prefix
      FROM projects p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.id = ?
    `;
    
    try {
      const [rows] = await pool.execute(query, [id]);
      
      if (rows.length === 0) {
        return null;
      }
      
      const row = rows[0];
      const project = this.formatProject(row);
      
      // Get related strategic issues and strategies with names
      await this.populateRelationships(project);
      
      return project;
    } catch (error) {
      console.error('❌ Error finding project:', error);
      throw error;
    }
  }

  // ดึงโครงการทั้งหมด
  static async findAll(filters = {}) {
    let query = `
      SELECT p.*, 
             u.first_name as creator_first_name, 
             u.last_name as creator_last_name, 
             u.title_prefix as creator_title_prefix
      FROM projects p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // กรองตามสถานะ
    if (filters.status) {
      query += ' AND p.status = ?';
      params.push(filters.status);
    }
    
    // กรองตามประเภทโครงการ
    if (filters.project_type) {
      query += ' AND p.project_type = ?';
      params.push(filters.project_type);
    }
    
    // กรองตามช่วงวันที่
    if (filters.start_date) {
      query += ' AND p.start_date >= ?';
      params.push(filters.start_date);
    }
    
    if (filters.end_date) {
      query += ' AND p.end_date <= ?';
      params.push(filters.end_date);
    }
    
    // กรองตามงบประมาณ
    if (filters.min_budget) {
      query += ' AND p.budget >= ?';
      params.push(filters.min_budget);
    }
    
    if (filters.max_budget) {
      query += ' AND p.budget <= ?';
      params.push(filters.max_budget);
    }
    if (filters.search) {
      query += ' AND (p.name LIKE ? OR p.key_activities LIKE ? OR p.expected_results LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    // กรองตามผู้สร้าง (สำหรับผู้ใช้ที่ไม่ใช่ admin)
    if (filters.created_by) {
      query += ' AND p.created_by = ?';
      params.push(filters.created_by);
    }
    
    // เรียงลำดับ
    const orderBy = filters.orderBy || 'p.created_at';
    const orderDirection = filters.orderDirection || 'DESC';
    // Validate orderBy และ orderDirection เพื่อป้องกัน SQL injection
    const validOrderBy = ['p.created_at', 'p.name', 'p.budget', 'p.start_date', 'p.end_date'];
    const validOrderDirection = ['ASC', 'DESC'];
    
    const safeOrderBy = validOrderBy.includes(orderBy) ? orderBy : 'p.created_at';
    const safeOrderDirection = validOrderDirection.includes(orderDirection) ? orderDirection : 'DESC';
    
    query += ` ORDER BY ${safeOrderBy} ${safeOrderDirection}`;
    
    // จำกัดจำนวน - ใช้ string interpolation แทน prepared statement
    if (filters.limit) {
      const limitValue = parseInt(filters.limit);
      if (!isNaN(limitValue) && limitValue > 0 && limitValue <= 1000) { // ป้องกัน limit ที่มากเกินไป
        query += ` LIMIT ${limitValue}`;
        
        if (filters.offset) {
          const offsetValue = parseInt(filters.offset);
          if (!isNaN(offsetValue) && offsetValue >= 0) {
            query += ` OFFSET ${offsetValue}`;
          }
        }
      }
    }
    
    try {
      const [rows] = await pool.execute(query, params);
      const projects = rows.map(row => this.formatProject(row));
      
      // Populate relationships for all projects
      for (const project of projects) {
        await this.populateRelationships(project);
      }
      
      return projects;
    } catch (error) {
      console.error('❌ Error finding projects:', error);
      console.error('❌ Query:', query);
      console.error('❌ Params:', params);
      throw error;
    }
  }

  // อัปเดตโครงการ
  static async update(id, updateData) {
    // Test database connection first
    try {
      await pool.execute('SELECT 1');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      throw new Error('Database connection failed');
    }
    
    const allowedFields = [
      'name', 'key_activities', 'budget', 'expected_results', 'project_type',
      'start_date', 'end_date', 'responsible_title_prefix', 'responsible_first_name',
      'responsible_last_name', 'responsible_position', 'responsible_phone',
      'responsible_email', 'activity_location', 'districts', 'province',
      'strategic_issues', 'strategies', 'document_links', 'status'
    ];
    
    const updates = [];
    const values = [];
    
    // สร้างคำสั่ง UPDATE แบบไดนามิก
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        
        // แปลง arrays เป็น JSON strings
        if (['districts', 'strategic_issues', 'strategies', 'document_links'].includes(key)) {
          const jsonValue = JSON.stringify(value || []);
          values.push(jsonValue);
        } 
        // แปลง dates เป็น DATE format
        else if (['start_date', 'end_date'].includes(key)) {
          let dateValue;
          if (value.includes('T')) {
            // ISO date format
            dateValue = new Date(value).toISOString().split('T')[0];
          } else {
            // Already in YYYY-MM-DD format
            dateValue = value;
          }
          values.push(dateValue);
        }
        else {
          values.push(value);
        }
      }
    }
    
    
    if (updates.length === 0) {
      throw new Error('ไม่มีข้อมูลที่ต้องการอัปเดต');
    }
    
    values.push(id);
    
    const query = `
      UPDATE projects 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    try {
      const [result] = await pool.execute(query, values);
      
      if (result.affectedRows === 0) {
        const exists = await pool.execute('SELECT id FROM projects WHERE id = ?', [id]);
        throw new Error('ไม่พบโครงการที่ต้องการอัปเดต');
      }
      
      const updatedProject = await this.findById(id);
      
      return updatedProject;
    } catch (error) {
      throw error;
    }
  }

  // ลบโครงการ
  static async delete(id) {
    const query = 'DELETE FROM projects WHERE id = ?';
    
    try {
      const [result] = await pool.execute(query, [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('ไม่พบโครงการที่ต้องการลบ');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error deleting project:', error);
      throw error;
    }
  }

  // นับจำนวนโครงการ
  static async count(filters = {}) {
    let query = 'SELECT COUNT(*) as total FROM projects WHERE 1=1';
    const params = [];
    
    // Apply same filters as findAll
    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }
    
    if (filters.project_type) {
      query += ' AND project_type = ?';
      params.push(filters.project_type);
    }
    
    if (filters.search) {
      query += ' AND (name LIKE ? OR key_activities LIKE ? OR expected_results LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    // กรองตามผู้สร้าง (สำหรับผู้ใช้ที่ไม่ใช่ admin)
    if (filters.created_by) {
      query += ' AND created_by = ?';
      params.push(filters.created_by);
    }
    
    try {
      const [rows] = await pool.execute(query, params);
      return rows[0].total;
    } catch (error) {
      throw error;
    }
  }

  // ดึงสถิติโครงการ
  static async getStats(filters = {}) {
    // เตรียม WHERE clause สำหรับ filters
    let whereClause = '';
    let params = [];
    
    if (filters.created_by) {
      whereClause = 'WHERE created_by = ?';
      params.push(filters.created_by);
    }

    const queries = {
      total: `SELECT COUNT(*) as count FROM projects ${whereClause}`,
      byStatus: `
        SELECT status, COUNT(*) as count 
        FROM projects 
        ${whereClause}
        GROUP BY status
      `,
      byType: `
        SELECT project_type, COUNT(*) as count 
        FROM projects 
        ${whereClause}
        GROUP BY project_type
      `,
      budgetStats: `
        SELECT 
          COUNT(*) as total_projects,
          SUM(budget) as total_budget,
          AVG(budget) as avg_budget,
          MIN(budget) as min_budget,
          MAX(budget) as max_budget
        FROM projects
        ${whereClause ? whereClause + ' AND ' : 'WHERE '} budget IS NOT NULL
      `,
      recentProjects: `
        SELECT id, name, status, budget, start_date
        FROM projects
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT 10
      `
    };
    
    try {
      const [totalResult] = await pool.execute(queries.total, params);
      const [byStatusResult] = await pool.execute(queries.byStatus, params);
      const [byTypeResult] = await pool.execute(queries.byType, params);
      
      // สำหรับ budgetStats ต้องปรับ params
      const budgetParams = whereClause ? [...params] : [];
      const [budgetStatsResult] = await pool.execute(queries.budgetStats, budgetParams);
      const [recentProjectsResult] = await pool.execute(queries.recentProjects, params);
      
      return {
        total: totalResult[0].count,
        byStatus: byStatusResult,
        byType: byTypeResult,
        budget: budgetStatsResult[0],
        recentProjects: recentProjectsResult
      };
    } catch (error) {
      throw error;
    }
  }

  // Helper method to format project data
  static formatProject(row) {
    // Helper function to safely parse JSON or return array from string
    const safeJsonParse = (value, fallback = []) => {
      if (!value) return fallback;
      
      try {
        // If it's already an object/array, return it
        if (typeof value === 'object') return value;
        
        // Try to parse as JSON
        return JSON.parse(value);
      } catch (error) {
        // If parsing fails, treat as comma-separated string
        if (typeof value === 'string') {
          return value.split(',').map(item => item.trim()).filter(item => item);
        }
        return fallback;
      }
    };

    return {
      id: row.id,
      name: row.name,
      key_activities: row.key_activities,
      budget: parseFloat(row.budget) || 0,
      expected_results: row.expected_results,
      project_type: row.project_type,
      start_date: row.start_date,
      end_date: row.end_date,
      responsible_title_prefix: row.responsible_title_prefix,
      responsible_first_name: row.responsible_first_name,
      responsible_last_name: row.responsible_last_name,
      responsible_position: row.responsible_position,
      responsible_phone: row.responsible_phone,
      responsible_email: row.responsible_email,
      activity_location: row.activity_location,
      districts: safeJsonParse(row.districts, []),
      province: row.province,
      strategic_issues: safeJsonParse(row.strategic_issues, []),
      strategies: safeJsonParse(row.strategies, []),
      document_links: safeJsonParse(row.document_links, []),
      status: row.status,
      created_by: row.created_by,
      created_at: row.created_at,
      updated_at: row.updated_at,
      creator: {
        name: `${row.creator_title_prefix || ''}${row.creator_first_name || ''} ${row.creator_last_name || ''}`.trim(),
        first_name: row.creator_first_name,
        last_name: row.creator_last_name,
        title_prefix: row.creator_title_prefix
      }
    };
  }

  // Helper method to populate relationships (strategic issues and strategies)
  static async populateRelationships(project) {
    
    try {
      // Populate strategic issues
      if (project.strategic_issues && Array.isArray(project.strategic_issues) && project.strategic_issues.length > 0) {
        const strategicIssueIds = project.strategic_issues.filter(id => id && typeof id === 'string');
        
        if (strategicIssueIds.length > 0) {
          const placeholders = strategicIssueIds.map(() => '?').join(',');
          const strategicIssuesQuery = `
            SELECT id, title, description 
            FROM strategic_issues 
            WHERE id IN (${placeholders})
          `;
          
          const [strategicIssuesRows] = await pool.execute(strategicIssuesQuery, strategicIssueIds);
          
          project.strategic_issues_details = strategicIssuesRows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description
          }));
        } else {
          project.strategic_issues_details = [];
        }
      } else {
        project.strategic_issues_details = [];
      }

      // Populate strategies
      if (project.strategies && Array.isArray(project.strategies) && project.strategies.length > 0) {
        const strategyIds = project.strategies.filter(id => id && typeof id === 'string');
        
        if (strategyIds.length > 0) {
          const placeholders = strategyIds.map(() => '?').join(',');
          const strategiesQuery = `
            SELECT s.id, s.name, s.description, si.title as strategic_issue_title
            FROM strategies s
            LEFT JOIN strategic_issues si ON s.strategic_issue_id = si.id
            WHERE s.id IN (${placeholders})
          `;
          
          
          const [strategiesRows] = await pool.execute(strategiesQuery, strategyIds);
          
          
          project.strategies_details = strategiesRows.map(row => ({
            id: row.id,
            name: row.name,
            description: row.description,
            strategic_issue_title: row.strategic_issue_title
          }));
        } else {
          project.strategies_details = [];
        }
      } else {
        project.strategies_details = [];
      }
      
      
    } catch (error) {
      project.strategic_issues_details = [];
      project.strategies_details = [];
    }
  }
}

module.exports = Project;
