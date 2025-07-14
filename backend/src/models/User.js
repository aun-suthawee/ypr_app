/* eslint-disable */
const { pool } = require('../config/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

class User {
  // Create users table
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'department') NOT NULL DEFAULT 'department',
        title_prefix VARCHAR(50),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        position VARCHAR(100),
        department VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_department (department)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    try {
      await pool.execute(query);
      console.log('✅ Users table created successfully');
    } catch (error) {
      console.error('❌ Error creating users table:', error.message);
      throw error;
    }
  }

  // Create new user
  static async create(userData) {
    const {
      email,
      password,
      role = 'department',
      title_prefix,
      first_name,
      last_name,
      position,
      department
    } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = uuidv4();

    const query = `
      INSERT INTO users (
        id, email, password, role, title_prefix, 
        first_name, last_name, position, department
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      await pool.execute(query, [
        userId, email, hashedPassword, role, title_prefix,
        first_name, last_name, position, department
      ]);

      return {
        id: userId,
        email,
        role,
        title_prefix,
        first_name,
        last_name,
        position,
        department
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
      }
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const query = `
      SELECT 
        id, email, password, role, title_prefix,
        first_name, last_name, position, department,
        is_active, created_at
      FROM users 
      WHERE LOWER(email) = LOWER(?) AND is_active = true
    `;

    try {
      const [rows] = await pool.execute(query, [email]);
      
      if (rows.length === 0) {
        return null;
      } else {
        return rows[0];
      }
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    const query = `
      SELECT 
        id, email, role, title_prefix,
        first_name, last_name, position, department,
        is_active, created_at
      FROM users 
      WHERE id = ? AND is_active = true
    `;

    try {
      const [rows] = await pool.execute(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  // Find all users with filters
  static async findAll({ filters = {}, limit = 10, offset = 0, search = '' } = {}) {
    let whereClause = 'WHERE 1=1';
    let params = [];

    // Apply filters
    if (filters && filters.role) {
      whereClause += ' AND role = ?';
      params.push(filters.role);
    }
    
    if (filters && filters.department) {
      whereClause += ' AND department = ?';
      params.push(filters.department);
    }
    
    if (filters && filters.is_active !== undefined) {
      whereClause += ' AND is_active = ?';
      params.push(filters.is_active);
    }

    // Apply search
    if (search) {
      whereClause += ' AND (email LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR position LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const query = `
      SELECT 
        id, email, role, title_prefix,
        first_name, last_name, position, department,
        is_active, created_at
      FROM users 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${parseInt(limit) || 10} OFFSET ${parseInt(offset) || 0}
    `;

    try {
      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Error finding users:', error);
      throw error;
    }
  }

  // Count users with filters
  static async count({ filters = {}, search = '' }) {
    let whereClause = 'WHERE 1=1';
    const params = [];

    // Apply filters
    if (filters.role) {
      whereClause += ' AND role = ?';
      params.push(filters.role);
    }
    
    if (filters.department) {
      whereClause += ' AND department = ?';
      params.push(filters.department);
    }
    
    if (filters.is_active !== undefined) {
      whereClause += ' AND is_active = ?';
      params.push(filters.is_active);
    }

    // Apply search
    if (search) {
      whereClause += ' AND (email LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR position LIKE ?)';

      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const query = `
      SELECT COUNT(*) as total
      FROM users 
      ${whereClause}
    `;

    try {
      const [rows] = await pool.execute(query, params);
      return rows[0].total;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async update(id, userData) {
    const {
      email,
      role,
      title_prefix,
      first_name,
      last_name,
      position,
      department
    } = userData;

    // Filter out undefined values
    const updates = {};
    if (email !== undefined) updates.email = email;
    if (role !== undefined) updates.role = role;
    if (title_prefix !== undefined) updates.title_prefix = title_prefix;
    if (first_name !== undefined) updates.first_name = first_name;
    if (last_name !== undefined) updates.last_name = last_name;
    if (position !== undefined) updates.position = position;
    if (department !== undefined) updates.department = department;

    if (Object.keys(updates).length === 0) {
      throw new Error('No update data provided');
    }

    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);

    const query = `
      UPDATE users 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    try {
      await pool.execute(query, values);
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete user (soft delete)
  static async delete(id) {
    const query = `
      UPDATE users 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    try {
      await pool.execute(query, [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Activate user
  static async activate(id) {
    const query = `
      UPDATE users 
      SET is_active = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    try {
      await pool.execute(query, [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Deactivate user
  static async deactivate(id) {
    const query = `
      UPDATE users 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    try {
      await pool.execute(query, [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Change password
  static async changePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    const query = `
      UPDATE users 
      SET password = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    try {
      await pool.execute(query, [hashedPassword, id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get user permissions based on role
  static getUserPermissions(role) {
    const permissions = {
      admin: {
        strategic_issues: ['read', 'create', 'update', 'delete'],
        strategies: ['read', 'create', 'update', 'delete'],
        projects: ['read', 'create', 'update', 'delete'],
        users: ['read', 'create', 'update', 'delete']
      },
      department: {
        strategic_issues: ['read'], // read access for department users
        strategies: ['read'], // read access for department users
        projects: ['read', 'create', 'update', 'delete'], // own projects only
        users: [] // no access
      }
    };

    return permissions[role] || permissions.department;
  }

  // Get user statistics
  static async getStats() {
    const queries = {
      total: 'SELECT COUNT(*) as count FROM users',
      active: 'SELECT COUNT(*) as count FROM users WHERE is_active = true',
      inactive: 'SELECT COUNT(*) as count FROM users WHERE is_active = false',
      admin: 'SELECT COUNT(*) as count FROM users WHERE role = "admin"',
      department: 'SELECT COUNT(*) as count FROM users WHERE role = "department"',
      byDepartment: `
        SELECT department, COUNT(*) as count 
        FROM users 
        WHERE department IS NOT NULL AND department != ''
        GROUP BY department
        ORDER BY count DESC
      `,
      recentUsers: `
        SELECT 
          id, email, first_name, last_name, role, department, created_at
        FROM users 
        ORDER BY created_at DESC 
        LIMIT 5
      `
    };

    try {
      const results = {};
      
      for (const [key, query] of Object.entries(queries)) {
        const [rows] = await pool.execute(query);
        if (key === 'byDepartment' || key === 'recentUsers') {
          results[key] = rows;
        } else {
          results[key] = rows[0].count;
        }
      }

      return results;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
