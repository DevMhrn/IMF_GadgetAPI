import { Sequelize } from 'sequelize';
import config from '../config/config.js';
import logger from '../utils/logger.js';
import defineGadget from './gadget.js';
import defineUser from './user.js';
import { initializeDatabase } from '../config/database.init.js';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];


const sequelize = new Sequelize(dbConfig.url, {
  dialect: dbConfig.dialect,
  logging: (msg) => logger.debug('Sequelize:', msg),
  logQueryParameters: true,
  benchmark: true,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Initialize models
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = defineUser(sequelize, Sequelize.DataTypes);
db.Gadget = defineGadget(sequelize, Sequelize.DataTypes);

// Define associations
db.User.hasMany(db.Gadget);
db.Gadget.belongsTo(db.User);

// Initialize database with sync options from environment variables
const syncForce = process.env.DB_SYNC_FORCE === 'true';
const syncAlter = process.env.DB_SYNC_ALTER === 'true';

// Only initialize if not in test environment
if (process.env.NODE_ENV !== 'test') {
  initializeDatabase(sequelize, syncForce, syncAlter);
}


export default db;