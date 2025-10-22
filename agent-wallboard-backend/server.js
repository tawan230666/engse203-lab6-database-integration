require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { Server } = require('socket.io');

const logger = require('./utils/logger');
const { connectDatabase } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CORS_ORIGIN?.split(',') || '*' } });

// Basic middlewares
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), max: parseInt(process.env.RATE_LIMIT_MAX || '100') }));

// Routes
app.get('/', (req, res) => res.json({ ok: true, app: 'Agent Wallboard Backend' }));
app.use('/api/agents', require('./routes/agents'));

// Health
app.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV
  };
  try {
    // simple ping by reading connection readyState
    const mongoose = require('mongoose');
    health.database = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    if (health.database !== 'connected') health.status = 'ERROR';
  } catch (e) {
    health.status = 'ERROR';
    health.database = 'unknown';
  }
  res.status(health.status === 'OK' ? 200 : 503).json(health);
});

// Error handler
app.use(errorHandler);

// WebSocket demo (broadcast status updates hook point)
io.on('connection', (socket) => {
  logger.info('Socket connected', { id: socket.id });
  socket.on('disconnect', () => logger.info('Socket disconnected', { id: socket.id }));
});

// Start
const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/callcenter_dev';

connectDatabase(DB_URL).then(() => {
  server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}).catch((err) => {
  logger.error('Fatal: DB connect failed', { error: err.message });
  process.exit(1);
});

module.exports = app; // for testing
