require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const logger = require('./utils/logger');
const { connectDatabase } = require('./config/database');
const { createApp } = require('./app');

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/callcenter_dev';

const app = createApp();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CORS_ORIGIN?.split(',') || '*' } });

// Controllers broadcast agent and message events through this instance.
app.set('io', io);

io.on('connection', (socket) => {
  logger.info('Socket connected', { id: socket.id });
  socket.on('disconnect', () => logger.info('Socket disconnected', { id: socket.id }));
});

connectDatabase(DB_URL)
  .then(() => server.listen(PORT, () => logger.info(`Server running on port ${PORT}`)))
  .catch((err) => {
    logger.error('Fatal: DB connect failed', { error: err.message });
    process.exit(1);
  });

// Graceful shutdown: stop accepting requests, then close sockets and the DB.
function shutdown(signal) {
  logger.info(`${signal} received, shutting down`);
  io.close();
  server.close(async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
