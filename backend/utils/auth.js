const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Promisify JWT methods
const signToken = promisify(jwt.sign);
const verifyToken = promisify(jwt.verify);

// Generate JWT token
const generateToken = (payload, expiresIn = '15m') => {
  return signToken(
    payload,
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

// Generate refresh token
const generateRefreshToken = () => {
  return require('crypto').randomBytes(40).toString('hex');
};

// Create both access and refresh tokens
const createTokens = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };

  const accessToken = generateToken(payload, '15m');
  const refreshToken = generateRefreshToken();

  return { accessToken, refreshToken };
};

// Set token in HTTP-only cookie
const setTokenCookie = (res, token) => {
  // Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure in production
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth/refresh-token'
  };

  // Set cookie
  res.cookie('refreshToken', token, cookieOptions);
};

// Verify and decode token
const verifyAndDecodeToken = async (token) => {
  try {
    return await verifyToken(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    throw new Error('Invalid token');
  }
};

// Generate password reset token
const generatePasswordResetToken = () => {
  const resetToken = require('crypto').randomBytes(32).toString('hex');
  const hashedToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  const resetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return { resetToken, hashedToken, resetTokenExpires };
};

module.exports = {
  generateToken,
  generateRefreshToken,
  createTokens,
  setTokenCookie,
  verifyAndDecodeToken,
  generatePasswordResetToken
};
