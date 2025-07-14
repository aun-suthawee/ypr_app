/* eslint-disable */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Login controller
const login = async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกอีเมลและรหัสผ่าน'
      });
    }

    // Find user by email
    console.log('🔍 Finding user:', email);
    const user = await User.findByEmail(email);
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({
        success: false,
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    console.log('✅ User found:', user.email);

    // Verify password
    console.log('🔐 Verifying password...');
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return res.status(401).json({
        success: false,
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    console.log('✅ Password verified');

    // Generate token
    console.log('🎫 Generating token...');
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      department: user.department
    };

    const token = generateToken(tokenPayload);
    console.log('✅ Token generated');

    // Get user permissions
    console.log('🔑 Getting user permissions...');
    const permissions = User.getUserPermissions(user.role);
    console.log('✅ Permissions retrieved:', permissions);

    // Prepare user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      title_prefix: user.title_prefix,
      first_name: user.first_name,
      last_name: user.last_name,
      position: user.position,
      department: user.department,
      permissions
    };

    console.log('✅ Login successful for:', user.email);
    res.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      data: {
        user: userData,
        token,
        expires_in: process.env.JWT_EXPIRES_IN || '24h'
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในระบบ'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    const permissions = User.getUserPermissions(user.role);

    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      title_prefix: user.title_prefix,
      first_name: user.first_name,
      last_name: user.last_name,
      position: user.position,
      department: user.department,
      permissions
    };

    res.json({
      success: true,
      data: { user: userData }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในระบบ'
    });
  }
};

// Logout (client-side token removal)
const logout = (req, res) => {
  res.json({
    success: true,
    message: 'ออกจากระบบสำเร็จ'
  });
};

module.exports = {
  login,
  getProfile,
  logout,
  generateToken,
  verifyToken
};
