const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    console.log('roleMiddleware hit');
    console.log('req.user:', req.user);
    console.log('allowedRoles:', allowedRoles);

    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: 'User information not found'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied. You do not have permission to access this resource'
      });
    }

    next();
  };
};

module.exports = roleMiddleware;