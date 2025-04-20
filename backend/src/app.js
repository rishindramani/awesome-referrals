const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

const config = require('./config');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const jobRoutes = require('./routes/job.routes');
const referralRoutes = require('./routes/referral.routes');
const companyRoutes = require('./routes/company.routes');
const notificationRoutes = require('./routes/notification.routes');
// Add our new routes
const conversationRoutes = require('./routes/conversation.routes');
const messageRoutes = require('./routes/message.routes');
const statsRoutes = require('./routes/stats.routes');
const externalJobRoutes = require('./routes/externalJob.routes');

// Create Express app
const app = express();

// Enable CORS - must be before other middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests
app.options('*', cors());

// Set security HTTP headers
app.use(helmet());

// Development logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Rate limiting - only apply to auth endpoints that need protection
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // increased from 100 to 500
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting only to auth routes that need protection
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/reset-password', authLimiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Decrypt sensitive data in request body
const decryptPayload = require('./middleware/decryptPayload');
app.use(decryptPayload);

// Compression middleware
app.use(compression());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/external-jobs', externalJobRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is up and running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    apis: {
      auth: 'READY',
      jobs: 'READY',
      referrals: 'READY',
      companies: 'READY',
      notifications: 'READY',
      conversations: 'READY',
      messages: 'READY',
      stats: 'READY',
      'external-jobs': 'READY'
    }
  });
});

// API docs
if (config.nodeEnv === 'development') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerJsDoc = require('swagger-jsdoc');
  
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Awesome Referrals API',
        version: '1.0.0',
        description: 'API documentation for the Awesome Referrals platform'
      },
      servers: [
        {
          url: `http://localhost:${config.port}/api`,
          description: 'Development server'
        }
      ]
    },
    apis: ['./src/routes/*.js']
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  
  // Log that swagger docs are available
  logger.info(`API Documentation available at http://localhost:${config.port}/api-docs`);
}

// Serve static assets in production
if (config.nodeEnv === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
  });
}

// Handle 404 routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app; 