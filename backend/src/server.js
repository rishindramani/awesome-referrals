const app = require('./app');
const { connectDB } = require('./config/database');
const config = require('./config');
const logger = require('./utils/logger');

// Set up unhandled rejection handling
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Set up uncaught exception handling
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    const dbConnected = await connectDB();
    
    if (!dbConnected) {
      logger.error('Database connection failed, server will not start');
      process.exit(1);
    }
    
    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
      logger.info(`API Health check: http://localhost:${config.port}/api/health`);
      
      if (config.nodeEnv === 'development') {
        logger.info(`API Documentation: http://localhost:${config.port}/api-docs`);
      }
    });
    
    // Handle graceful shutdown
    const exitHandler = () => {
      if (server) {
        server.close(() => {
          logger.info('Server closed');
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };
    
    // Handle shutdown signals
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      exitHandler();
    });
    
    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      exitHandler();
    });
    
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

// Run the server
startServer(); 