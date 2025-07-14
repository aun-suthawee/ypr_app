/* eslint-disable */
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class StrategicIssue {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.title = data.title;
    this.description = data.description;
    this.start_year = data.start_year;
    this.end_year = data.end_year;
    this.order = data.order || 1; // ลำดับประเด็นยุทธศาสตร์
    this.status = data.status || 'active'; // active, inactive, completed
    this.created_by = data.created_by;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  // สร้างตาราง Strategic Issues
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS strategic_issues (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_year INT NOT NULL,
        end_year INT NOT NULL,
        \`order\` INT DEFAULT 1,
        status ENUM('active', 'inactive', 'completed') DEFAULT 'active',
        created_by VARCHAR(36) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_years (start_year, end_year),
        INDEX idx_order (\`order\`),
        INDEX idx_created_by (created_by),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    
    try {
      await pool.execute(query);
    } catch (error) {
      throw error;
    }
  }

  // สร้างประเด็นยุทธศาสตร์ใหม่
  static async create(issueData) {
    const issue = new StrategicIssue(issueData);
    
    const query = `
      INSERT INTO strategic_issues 
      (id, title, description, start_year, end_year, \`order\`, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    try {
      await pool.execute(query, [
        issue.id,
        issue.title,
        issue.description,
        issue.start_year,
        issue.end_year,
        issue.order,
        issue.status,
        issue.created_by
      ]);
      
      return await this.findById(issue.id);
    } catch (error) {
      throw error;
    }
  }

  // ค้นหาประเด็นยุทธศาสตร์ตาม ID
  static async findById(id) {
    const query = `
      SELECT si.*, 
             u.first_name, u.last_name, u.title_prefix
      FROM strategic_issues si
      LEFT JOIN users u ON si.created_by = u.id
      WHERE si.id = ?
    `;
    
    try {
      const [rows] = await pool.execute(query, [id]);
      
      if (rows.length === 0) {
        return null;
      }
      
      const row = rows[0];
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        start_year: row.start_year,
        end_year: row.end_year,
        order: row.order,
        status: row.status,
        created_by: row.created_by,
        created_at: row.created_at,
        updated_at: row.updated_at,
        creator: {
          name: `${row.title_prefix || ''}${row.first_name || ''} ${row.last_name || ''}`.trim(),
          first_name: row.first_name,
          last_name: row.last_name,
          title_prefix: row.title_prefix
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // ดึงประเด็นยุทธศาสตร์ทั้งหมด
  static async findAll(filters = {}) {
    let query = `
      SELECT si.*, 
             u.first_name, u.last_name, u.title_prefix
      FROM strategic_issues si
      LEFT JOIN users u ON si.created_by = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // กรองตามสถานะ
    if (filters.status) {
      query += ' AND si.status = ?';
      params.push(filters.status);
    }
    
    // กรองตามปี
    if (filters.year) {
      query += ' AND ? BETWEEN si.start_year AND si.end_year';
      params.push(filters.year);
    }
    
    // กรองตามช่วงปี
    if (filters.start_year) {
      query += ' AND si.start_year >= ?';
      params.push(filters.start_year);
    }
    
    if (filters.end_year) {
      query += ' AND si.end_year <= ?';
      params.push(filters.end_year);
    }
    
    // การค้นหาข้อความ
    if (filters.search) {
      query += ' AND (si.title LIKE ? OR si.description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    // เรียงลำดับ - เปลี่ยนเป็นเรียงตาม order ก่อน แล้วปีเริ่มต้น
    let orderBy = 'si.start_year ASC, si.`order` ASC';
    if (filters.orderBy) {
      orderBy = filters.orderBy;
      if (filters.orderDirection) {
        orderBy += ` ${filters.orderDirection}`;
      }
    }
    query += ` ORDER BY ${orderBy}`;
    
    // จำกัดจำนวน
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
      
      if (filters.offset) {
        query += ' OFFSET ?';
        params.push(parseInt(filters.offset));
      }
    }
    
    try {
      const [rows] = await pool.execute(query, params);
      
      return rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        start_year: row.start_year,
        end_year: row.end_year,
        order: row.order,
        status: row.status,
        created_by: row.created_by,
        created_at: row.created_at,
        updated_at: row.updated_at,
        creator: {
          name: `${row.title_prefix || ''}${row.first_name || ''} ${row.last_name || ''}`.trim(),
          first_name: row.first_name,
          last_name: row.last_name,
          title_prefix: row.title_prefix
        }
      }));
    } catch (error) {
      throw error;
    }
  }

  // อัปเดตประเด็นยุทธศาสตร์
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    
    const allowedFields = ['title', 'description', 'start_year', 'end_year', 'order', 'status'];
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(updateData[field]);
      }
    });
    
    if (fields.length === 0) {
      throw new Error('ไม่มีข้อมูลที่จะอัปเดต');
    }
    
    values.push(id);
    
    const query = `
      UPDATE strategic_issues 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    try {
      const [result] = await pool.execute(query, values);
      
      if (result.affectedRows === 0) {
        throw new Error('ไม่พบประเด็นยุทธศาสตร์ที่ต้องการอัปเดต');
      }
      
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // ลบประเด็นยุทธศาสตร์
  static async delete(id) {
    const query = 'DELETE FROM strategic_issues WHERE id = ?';
    
    try {
      const [result] = await pool.execute(query, [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('ไม่พบประเด็นยุทธศาสตร์ที่ต้องการลบ');
      }
      
      return { success: true, message: 'ลบประเด็นยุทธศาสตร์สำเร็จ' };
    } catch (error) {
      throw error;
    }
  }

  // นับจำนวนประเด็นยุทธศาสตร์
  static async count(filters = {}) {
    let query = 'SELECT COUNT(*) as total FROM strategic_issues WHERE 1=1';
    const params = [];
    
    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }
    
    if (filters.year) {
      query += ' AND ? BETWEEN start_year AND end_year';
      params.push(filters.year);
    }
    
    try {
      const [rows] = await pool.execute(query, params);
      return rows[0].total;
    } catch (error) {
      throw error;
    }
  }

  // สถิติประเด็นยุทธศาสตร์
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive,
        MIN(start_year) as earliest_year,
        MAX(end_year) as latest_year
      FROM strategic_issues
    `;
    
    try {
      const [rows] = await pool.execute(query);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = StrategicIssue;
