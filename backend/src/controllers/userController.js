/* eslint-disable */
const User = require('../models/User');

// Get all users with filters
const getUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      role, 
      department, 
      is_active,
      search 
    } = req.query;

    const filters = {};
    if (role) filters.role = role;
    if (department) filters.department = department;
    if (is_active !== undefined) filters.is_active = is_active === 'true';

    const offset = (page - 1) * limit;
    const users = await User.findAll({
      filters,
      limit: parseInt(limit),
      offset: parseInt(offset),
      search
    });

    const total = await User.count({ filters, search });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้'
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user can access this user data
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: 'ไม่มีสิทธิ์เข้าถึงข้อมูลผู้ใช้นี้'
      });
    }

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผู้ใช้ที่ระบุ'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้'
    });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      title_prefix,
      first_name,
      last_name,
      position,
      department
    } = req.body;

    // Validate required fields
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน'
      });
    }

    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'อีเมลนี้ถูกใช้แล้ว'
      });
    }

    const userData = {
      email,
      password,
      role: role || 'department',
      title_prefix,
      first_name,
      last_name,
      position,
      department
    };

    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      message: 'สร้างผู้ใช้สำเร็จ',
      data: { user }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้'
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email,
      role,
      title_prefix,
      first_name,
      last_name,
      position,
      department
    } = req.body;

    // Check if user can update this user data
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: 'ไม่มีสิทธิ์แก้ไขข้อมูลผู้ใช้นี้'
      });
    }

    // Regular users can't change their role
    if (req.user.role !== 'admin' && role !== undefined) {
      return res.status(403).json({
        success: false,
        message: 'ไม่มีสิทธิ์เปลี่ยนบทบาทผู้ใช้'
      });
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผู้ใช้ที่ระบุ'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== existingUser.email) {
      const emailExists = await User.findByEmail(email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'อีเมลนี้ถูกใช้แล้ว'
        });
      }
    }

    const updateData = {
      email,
      role,
      title_prefix,
      first_name,
      last_name,
      position,
      department
    };

    const updatedUser = await User.update(id, updateData);

    res.json({
      success: true,
      message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปเดตผู้ใช้'
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'ไม่สามารถลบผู้ใช้ตัวเองได้'
      });
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผู้ใช้ที่ระบุ'
      });
    }

    await User.delete(id);

    res.json({
      success: true,
      message: 'ลบผู้ใช้สำเร็จ'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบผู้ใช้'
    });
  }
};

// Activate user
const activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผู้ใช้ที่ระบุ'
      });
    }

    await User.activate(id);

    res.json({
      success: true,
      message: 'เปิดใช้งานผู้ใช้สำเร็จ'
    });
  } catch (error) {
    console.error('Error activating user:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเปิดใช้งานผู้ใช้'
    });
  }
};

// Deactivate user
const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deactivating themselves
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'ไม่สามารถปิดใช้งานผู้ใช้ตัวเองได้'
      });
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผู้ใช้ที่ระบุ'
      });
    }

    await User.deactivate(id);

    res.json({
      success: true,
      message: 'ปิดใช้งานผู้ใช้สำเร็จ'
    });
  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการปิดใช้งานผู้ใช้'
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Check if user can change this password
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: 'ไม่มีสิทธิ์เปลี่ยนรหัสผ่านของผู้ใช้นี้'
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผู้ใช้ที่ระบุ'
      });
    }

    // If not admin, verify current password
    if (req.user.role !== 'admin') {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'กรุณาระบุรหัสผ่านปัจจุบัน'
        });
      }

      const isCurrentPasswordValid = await User.verifyPassword(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง'
        });
      }
    }

    await User.changePassword(id, newPassword);

    res.json({
      success: true,
      message: 'เปลี่ยนรหัสผ่านสำเร็จ'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน'
    });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const stats = await User.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงสถิติผู้ใช้'
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
  changePassword,
  getUserStats
};
