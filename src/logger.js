const pino = require('pino');

const isPretty = process.env.LOG_PRETTY === 'true';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie'],
    remove: true,
  },
}, isPretty ? pino.transport({ target: 'pino-pretty' }) : undefined);

module.exports = logger;
