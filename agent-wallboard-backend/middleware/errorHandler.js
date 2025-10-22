const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const payload = {
    success: false,
    message: status === 500 ? 'Internal server error' : err.message,
  };
  if (process.env.NODE_ENV === 'development') {
    payload.stack = err.stack;
  }
  logger.error('Request error', { status, message: err.message });
  res.status(status).json(payload);
}

module.exports = errorHandler;
