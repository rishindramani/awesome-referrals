const { Sequelize } = require('sequelize');
const config = require('./index');
const logger = require('../utils/logger');
const path = require('path');

// Create Sequelize instance
let sequelize;

// Use SQLite for development
if (config.nodeEnv === 'development') {
  const dbPath = path.join(__dirname, '../../db.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: config.database.logging ? msg => logger.debug(msg) : false
  });
  logger.info(`Using SQLite database at ${dbPath}`);
} else {
  // Use PostgreSQL for production
  sequelize = new Sequelize(
    config.database.database,
    config.database.username,
    config.database.password,
    {
      host: config.database.host,
      port: config.database.port,
      dialect: config.database.dialect,
      logging: config.database.logging ? msg => logger.debug(msg) : false,
      pool: config.database.pool
    }
  );
}

// Test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    
    // Sync database in development mode
    if (config.nodeEnv === 'development') {
      // Force sync should be used carefully as it drops all tables
      // await sequelize.sync({ force: true });
      await sequelize.sync({ alter: true });
      logger.info('Database synced successfully');
    }
    
    return true;
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    return false;
  }
};

module.exports = { sequelize, connectDB }; 