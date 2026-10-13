const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const mongoose = require('mongoose');

const errorHandler = require('./middleware/errorHandler');

/**
 * Builds the Express app without starting a server, so tests can import it
 * directly. The Socket.IO instance is attached later with app.set('io', io).
 */
function createApp() {
  const app = express();
  const origins = process.env.CORS_ORIGIN?.split(',') || '*';

  app.use(helmet());
  app.use(express.json());
  app.use(cors({ origin: origins }));
  if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
  app.use(rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  }));

  app.get('/', (req, res) => res.json({ ok: true, app: 'Agent Wallboard Backend' }));
  app.use('/api/agents', require('./routes/agents'));
  app.use('/api/messages', require('./routes/messages'));

  app.get('/health', (req, res) => {
    const database = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const status = database === 'connected' ? 'OK' : 'ERROR';
    res.status(status === 'OK' ? 200 : 503).json({
      status,
      database,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    });
  });

  app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found' }));
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
