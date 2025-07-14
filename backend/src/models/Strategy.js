/* eslint-disable */
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Strategy {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.strategic_issue_id = data.strategic_issue_id;
    this.name = data.name;
    this.description = data.description;
    this.order = data.order || 1; // ลำดับกลยุทธ์
    this.created_by = data.created_by;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  // สร้างตาราง Strategies
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS strategies (
        id VARCHAR(36) PRIMARY KEY,
        strategic_issue_id VARCHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        \`order\` INT DEFAULT 1,
        created_by VARCHAR(36) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_strategic_issue (strategic_issue_id),
        INDEX idx_order (\`order\`),
        INDEX idx_created_by (created_by),
        FOREIGN KEY (strategic_issue_id) REFERENCES strategic_issues(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    
    try {
      await pool.execute(query);
    } catch (error) {
      throw error;
    }
  }

  // สร้างกลยุทธ์ใหม่
  static async create(strategyData) {
    const strategy = new Strategy(strategyData);
    
    const query = `
      INSERT INTO strategies 
      (id, strategic_issue_id, name, description, \`order\`, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    try {
      await pool.execute(query, [
        strategy.id,
        strategy.strategic_issue_id,
        strategy.name,
        strategy.description,
        strategy.order,
        strategy.created_by
      ]);
      
      return await this.findById(strategy.id);
    } catch (error) {
      throw error;
    }
  }

  // ค้นหากลยุทธ์ตาม ID
  static async findById(id) {
    const query = `
      SELECT s.*, 
             si.title as strategic_issue_title,
             si.description as strategic_issue_description,
             si.start_year as strategic_issue_start_year,
             si.end_year as strategic_issue_end_year,
             si.\`order\` as strategic_issue_order,
             u.first_name, u.last_name, u.title_prefix
      FROM strategies s
      LEFT JOIN strategic_issues si ON s.strategic_issue_id = si.id
      LEFT JOIN users u ON s.created_by = u.id
      WHERE s.id = ?
    `;
    
    try {
      const [rows] = await pool.execute(query, [id]);
      
      if (rows.length === 0) {
        return null;
      }
      
      const row = rows[0];
      return {
        id: row.id,
        strategic_issue_id: row.strategic_issue_id,
        name: row.name,
        description: row.description,
        order: row.order,
        created_by: row.created_by,
        created_at: row.created_at,
        updated_at: row.updated_at,
        strategic_issue: row.strategic_issue_title ? {
          id: row.strategic_issue_id,
          title: row.strategic_issue_title,
          description: row.strategic_issue_description,
          start_year: row.strategic_issue_start_year,
          end_year: row.strategic_issue_end_year,
          order: row.strategic_issue_order
        } : null,
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

  // ดึงกลยุทธ์ทั้งหมด
  static async findAll(filters = {}) {
    let query = `
      SELECT s.*, 
             si.title as strategic_issue_title,
             si.description as strategic_issue_description,
             si.start_year as strategic_issue_start_year,
             si.end_year as strategic_issue_end_year,
             si.\`order\` as strategic_issue_order,
             u.first_name, u.last_name, u.title_prefix
      FROM strategies s
      LEFT JOIN strategic_issues si ON s.strategic_issue_id = si.id
      LEFT JOIN users u ON s.created_by = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // กรองตามประเด็นยุทธศาสตร์
    if (filters.strategic_issue_id) {
      query += ' AND s.strategic_issue_id = ?';
      params.push(filters.strategic_issue_id);
    }
    
    // การค้นหาข้อความ
    if (filters.search) {
      query += ' AND (s.name LIKE ? OR s.description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    // เรียงลำดับ - เรียงตามประเด็นยุทธศาสตร์ก่อน แล้วตาม order ของกลยุทธ์
    let orderBy = 'si.start_year ASC, si.`order` ASC, s.`order` ASC';
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
        strategic_issue_id: row.strategic_issue_id,
        name: row.name,
        description: row.description,
        order: row.order,
        created_by: row.created_by,
        created_at: row.created_at,
        updated_at: row.updated_at,
        strategic_issue: row.strategic_issue_title ? {
          id: row.strategic_issue_id,
          title: row.strategic_issue_title,
          description: row.strategic_issue_description,
          start_year: row.strategic_issue_start_year,
          end_year: row.strategic_issue_end_year,
          order: row.strategic_issue_order
        } : null,
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

  // อัปเดตกลยุทธ์
  static async update(id, updateData) {
    const allowedFields = ['strategic_issue_id', 'name', 'description', 'order'];
    const updates = [];
    const values = [];
    
    // สร้างคำสั่ง UPDATE แบบไดนามิก
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (updates.length === 0) {
      throw new Error('ไม่มีข้อมูลที่ต้องการอัปเดต');
    }
    
    values.push(id);
    
    const query = `
      UPDATE strategies 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    try {
      const [result] = await pool.execute(query, values);
      
      if (result.affectedRows === 0) {
        throw new Error('ไม่พบกลยุทธ์ที่ต้องการอัปเดต');
      }
      
      return await this.findById(id);
    } catch (error) {
      console.error('❌ Error updating strategy:', error);
      throw error;
    }
  }

  // ลบกลยุทธ์
  static async delete(id) {
    const query = 'DELETE FROM strategies WHERE id = ?';
    
    try {
      const [result] = await pool.execute(query, [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('ไม่พบกลยุทธ์ที่ต้องการลบ');
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // นับจำนวนกลยุทธ์
  static async count(filters = {}) {
    let query = `
      SELECT COUNT(*) as total
      FROM strategies s
      LEFT JOIN strategic_issues si ON s.strategic_issue_id = si.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // กรองตามประเด็นยุทธศาสตร์
    if (filters.strategic_issue_id) {
      query += ' AND s.strategic_issue_id = ?';
      params.push(filters.strategic_issue_id);
    }
    
    // การค้นหาข้อความ
    if (filters.search) {
      query += ' AND (s.name LIKE ? OR s.description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    try {
      const [rows] = await pool.execute(query, params);
      return rows[0].total;
    } catch (error) {
      throw error;
    }
  }

  // ดึงสถิติกลยุทธ์
  static async getStats() {
    const queries = {
      total: 'SELECT COUNT(*) as count FROM strategies',
      byStrategicIssue: `
        SELECT si.title, COUNT(s.id) as count
        FROM strategic_issues si
        LEFT JOIN strategies s ON si.id = s.strategic_issue_id
        GROUP BY si.id, si.title
        ORDER BY count DESC
      `,
      byCreator: `
        SELECT CONCAT(u.title_prefix, u.first_name, ' ', u.last_name) as creator_name,
               COUNT(s.id) as count
        FROM users u
        LEFT JOIN strategies s ON u.id = s.created_by
        WHERE s.id IS NOT NULL
        GROUP BY u.id, creator_name
        ORDER BY count DESC
      `,
      recentActivity: `
        SELECT s.*, si.title as strategic_issue_title
        FROM strategies s
        LEFT JOIN strategic_issues si ON s.strategic_issue_id = si.id
        ORDER BY s.created_at DESC
        LIMIT 10
      `
    };
    
    try {
      const [totalResult] = await pool.execute(queries.total);
      const [byStrategicIssueResult] = await pool.execute(queries.byStrategicIssue);
      const [byCreatorResult] = await pool.execute(queries.byCreator);
      const [recentActivityResult] = await pool.execute(queries.recentActivity);
      
      return {
        total: totalResult[0].count,
        byStrategicIssue: byStrategicIssueResult,
        byCreator: byCreatorResult,
        recentActivity: recentActivityResult.map(row => ({
          id: row.id,
          name: row.name,
          strategic_issue_title: row.strategic_issue_title,
          created_at: row.created_at
        }))
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Strategy;
