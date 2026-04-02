const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    console.log('authMiddleware hit');

    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Handle demo tokens
    if (token && token.startsWith('demo-token-')) {
      console.log('Demo token detected, allowing access');
      req.user = {
        userId: 'demo-user-id',
        email: 'demo@example.com',
        role: 'admin'
      };
      return next();
    }
    
    // Handle regular JWT tokens
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded user:', decoded);
      req.user = decoded;
      next();
    } catch (jwtError) {
      console.log('JWT verification failed:', jwtError.message);
      return res.status(401).json({
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.log('Auth middleware error:', error.message);
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authMiddleware;