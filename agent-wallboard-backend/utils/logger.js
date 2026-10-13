const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: format.combine(format.timestamp(), format.json()),
  silent: process.env.NODE_ENV === 'test',
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' }),
    new transports.File({ filename: 'error.log', level: 'error' })
  ]
});

module.exports = logger;
