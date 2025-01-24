// backend/controllers/auth.controller.js
import jwt from 'jsonwebtoken';
import  db  from '../models/index.js';

export const login = async (req, res) => {
  try {
    const { firebaseToken, email } = req.body;

    if (!firebaseToken || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Firebase token and email are required'
      });
    }

    // Find or create user
    const [user] = await db.User.findOrCreate({
      where: { email },
      defaults: {
        firebaseUid: firebaseToken,
        lastLogin: new Date()
      }
    });

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Authentication failed',
      message: 'Internal server error during authentication'
    });
  }
};