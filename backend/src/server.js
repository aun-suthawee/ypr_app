/* eslint-disable */
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection } = require('./config/database');
const authRoutes = require('./routes/auth');
const strategicIssuesRoutes = require('./routes/strategicIssues');
const strategiesRoutes = require('./routes/strategies');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Global rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // Higher limit for development
  message: {
    success: false,
    message: 'มีการเรียกใช้ API มากเกินไป กรุณาลองใหม่ในภายหลัง'
  },
  skip: (req) => {
    // Skip rate limiting for development environment
    return process.env.NODE_ENV === 'development';
  }
});

// CORS configuration
// Allow configuring multiple frontend URLs via FRONTEND_URLS (comma-separated) or FRONTEND_URL
const frontendUrlsEnv = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '';
const envOrigins = frontendUrlsEnv
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const defaultProdOrigins = ['https://ypr.yalapeo.go.th', 'https://www.ypr.yalapeo.go.th'];
const defaultDevOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

const normalize = (u) => (u ? u.replace(/\/$/, '') : u);

const allowedOrigins = Array.from(
  new Set([
    ...envOrigins,
    ...(process.env.NODE_ENV === 'production' ? defaultProdOrigins : [...defaultProdOrigins, ...defaultDevOrigins])
  ])
).map(normalize);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without Origin (e.g., curl, server-to-server)
    if (!origin) return callback(null, true);
    const o = normalize(origin);
    if (allowedOrigins.includes(o)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control'
  ]
};

// Middleware
app.use(globalLimiter);
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers (CORS is handled by the cors middleware above)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/strategic-issues', strategicIssuesRoutes);
app.use('/api/strategies', strategiesRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'YPR Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint ไม่พบ'
  });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error('Global error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'เกิดข้อผิดพลาดในระบบ' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    app.listen(PORT, () => {
      const publicBaseUrl = process.env.PUBLIC_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://ypr.yalapeo.go.th' : `http://localhost:${PORT}`);
      console.log(`🚀 YPR Backend API running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS allowed origins: ${allowedOrigins.join(', ')}`);
      console.log(`🔗 Health check: ${publicBaseUrl}/health`);
      console.log(`🔐 Auth endpoints: ${publicBaseUrl}/api/auth`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer();

module.exports = app;
