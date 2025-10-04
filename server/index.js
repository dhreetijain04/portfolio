const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import database connection
const { closePool } = require('./config/database');

// Import routes
const contactRoutes = require('./routes/simple-contact');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175',
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Portfolio API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/contact', contactRoutes);

// Temporary static data for development
app.get('/api/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      firstName: 'Dhreeti',
      lastName: 'Jain',
      title: 'Full Stack Developer & AI Enthusiast',
      bio: 'ECE student at MAIT building innovative AI-powered solutions and next-generation web applications with expertise in full-stack development.',
      email: 'dhreetijain04@gmail.com',
      phone: '+91 9818909530',
      location: 'New Delhi, India'
    }
  });
});

app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        title: 'AgroAI - AI-Powered Farming Assistant',
        description: 'AI-Powered Farming Assistant with Google Gemini AI + YOLOv8 pest detection for crop disease identification and smart farming solutions',
        technologies: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'Google Gemini AI', 'YOLOv8', 'Python'],
        githubUrl: 'https://github.com/dhreetijain04/AgroAI',
        liveUrl: 'https://agro-ai-app.netlify.app',
        featured: true
      },
      {
        id: 2,
        title: 'AI Code Review Assistant',
        description: 'GitHub-integrated platform for automated development code review optimization with AI-powered suggestions and quality analysis',
        technologies: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'GitHub API', 'OpenAI API'],
        githubUrl: 'https://github.com/dhreetijain04/ai-code-review-assistant',
        liveUrl: 'https://ai-code-review-assistant.netlify.app',
        featured: true
      }
    ]
  });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await closePool();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await closePool();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS Origin: ${corsOptions.origin}`);
});

module.exports = app;