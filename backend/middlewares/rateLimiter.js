// Rate limiting middleware
import rateLimit from 'express-rate-limit';

// Define your limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: 'Too many requests, please try again later.'
});

export default limiter;