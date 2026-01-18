require('dotenv').config();

const app = require('./src/app');
const logger = require('./src/logger');
const { prisma, pool } = require('./src/db/prisma');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info({ port }, 'Listening');
});

const shutdown = async () => {
  logger.info('Shutting down');
  await prisma.$disconnect();
  await pool.end();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
