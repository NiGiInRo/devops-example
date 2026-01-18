const express = require('express');
const client = require('prom-client');

const router = express.Router();
const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

const metricsMiddleware = (req, res, next) => {
  if (req.path === '/metrics') {
    return next();
  }

  const end = httpRequestDurationSeconds.startTimer({ method: req.method });

  res.on('finish', () => {
    const route = req.route ? `${req.baseUrl}${req.route.path}` : req.path;
    end({ route, status_code: String(res.statusCode) });
  });

  return next();
};

router.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).json({ error: 'Metrics error' });
  }
});

module.exports = { router, metricsMiddleware };
