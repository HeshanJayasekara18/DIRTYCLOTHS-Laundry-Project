const jwt = require("jsonwebtoken");
const rateLimit = require('express-rate-limit');
const { RateLimiterMemory } = require('rate-limiter-flexible');

// Rate limiting for auth endpoints
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// In-memory storage for rate limiting (consider using Redis in production)
const rateLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 60 * 15, // Per 15 minutes
});

const verifyToken = (req, res, next) => {
  // Check for token in cookies first, then in Authorization header
  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No authentication token, authorization denied',
      code: 'UNAUTHORIZED'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired, please login again',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
      code: 'INVALID_TOKEN'
    });
  }
};

// Middleware to check user role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this route',
        code: 'FORBIDDEN'
      });
    }

    next();
  };
};

// Rate limiting middleware
const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        code: 'TOO_MANY_REQUESTS'
      });
    });
};

module.exports = { 
  verifyToken, 
  authorize, 
  loginLimiter,
  rateLimiterMiddleware 
};