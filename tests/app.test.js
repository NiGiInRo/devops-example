process.env.LOG_LEVEL = 'silent';
process.env.LOG_PRETTY = 'false';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/devopsdb';

const request = require('supertest');
const app = require('../src/app');
const { prisma, pool } = require('../src/db/prisma');

describe('health and metrics', () => {
  afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

  test('GET /health', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('GET /metrics', async () => {
    const res = await request(app).get('/metrics');

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('http_request_duration_seconds');
  });
});
