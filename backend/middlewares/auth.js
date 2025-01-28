import jwt from 'jsonwebtoken';
import db from '../models/index.js';

/**
 * Middleware to authenticate JWT tokens
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'No authorization header provided' 
      });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          error: 'Invalid token',
          message: err.message
        });
      }
      
      // Verify user exists in database
      const user = await db.User.findByPk(decoded.id);
      if (!user) {
        return res.status(403).json({
          error: 'Invalid user',
          message: 'User no longer exists'
        });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Authentication failed',
      message: 'Internal server error during authentication'
    });
  }
};