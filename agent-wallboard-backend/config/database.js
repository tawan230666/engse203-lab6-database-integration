const mongoose = require('mongoose');
const logger = require('../utils/logger');

async function connectDatabase(uri) {
  try {
    await mongoose.connect(uri, { });
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error('MongoDB connection failed', { error: err.message });
    throw err;
  }
}

module.exports = { connectDatabase };
