const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

// Import middleware
const {
  errorHandler,
  requestLogger,
  performanceMonitor,
  sanitizeInput,
  healthCheck
} = require('./middleware/errorHandler');

const {
  aiRateLimit,
  questionSubmissionLimit,
  generalApiLimit,
  userQuestionLimit,
  userRegenerateLimit,
  imageGenerationLimit
} = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth');
const aiAnsweringRoutes = require('./routes/aiAnswering');
const imageGenerationRoutes = require('./routes/imageGeneration');
const dashboardRoutes = require('./routes/dashboard');
const chatRoutes = require('./routes/chat');

// Import database
const { initDatabase } = require('./config/database');

// Validate environment variables
const { validateEnvironment } = require('./config/validateEnv');
validateEnvironment();

// Create Express app
const app = express();

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000', // Development
  'http://localhost:5173', // Vite dev server
  process.env.FRONTEND_URL, // Production URL from env
  // Add your production domains here
  // 'https://your-app.vercel.app',
  // 'https://your-app.netlify.app'
].filter(Boolean); // Remove falsy values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression middleware
app.use(compression({
  level: 6, // Good balance between compression and speed
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    // Don't compress images, videos, or already compressed files
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging and monitoring
app.use(requestLogger);
app.use(performanceMonitor);

// Input sanitization
app.use(sanitizeInput);

// General API rate limiting
app.use('/api', generalApiLimit);

// Health check endpoint (no rate limiting)
app.get('/health', healthCheck);
app.get('/api/health', healthCheck);

// AI routes with specific rate limiting
app.use('/api/ai/ask', questionSubmissionLimit);
app.use('/api/ai/ask', userQuestionLimit);
app.use('/api/ai/regenerate', userRegenerateLimit);
app.use('/api/ai', aiRateLimit);

// Image generation rate limiting
app.use('/api/images/generate', imageGenerationLimit);

// Route handlers
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiAnsweringRoutes);
app.use('/api/images', imageGenerationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat', chatRoutes);
// Serve uploaded images
app.use('/api/images/uploads', express.static(path.join(__dirname, '../../uploads/images')));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: 'NOT_FOUND'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database on startup
const initializeApp = async () => {
  try {
    await initDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);

  // Close database connections
  const { db } = require('./config/database');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = { app, initializeApp };