// backend/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import logger from './utils/logger.js';  // note the .js extension
import db from './models/index.js';
import gadgetRoutes from './routes/gadget.js';
import authRoutes from './routes/auth.js';
import {errorHandler} from './middlewares/error.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.body,
    ip: req.ip
  });
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} completed in ${duration}ms`);
  });
  next();
});

// Middleware
// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []; // Array for potential future multiple origins
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200, // Important for preflight requests
};

if (process.env.NODE_ENV === 'development') {
  app.use(cors()); // Allow all in development for easier testing
} else {
  app.use(cors(corsOptions)); // Apply restricted CORS in production
}
app.use(express.json());

// Routes
app.use('/api/gadgets', gadgetRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use(errorHandler);

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', {
    promise,
    reason
  });
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Wait for database to sync
    await db.sequelize.authenticate();
    
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;