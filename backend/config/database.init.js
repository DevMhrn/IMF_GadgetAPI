import logger from '../utils/logger.js';

export const initializeDatabase = async (sequelize, force = false, alter = false) => {
  try {
    // First check connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // Only sync if explicitly requested through environment variables
    if (force || alter) {
      logger.info(`Syncing database with force: ${force}, alter: ${alter}`);
      await sequelize.sync({ force, alter });
      logger.info('Database synchronized successfully');
    } else {
      logger.info('Skipping database sync - using existing schema');
    }
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
};
