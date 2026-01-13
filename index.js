require('dotenv').config();

const app = require('./src/app');
const { prisma, pool } = require('./src/db/prisma');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  await pool.end();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
