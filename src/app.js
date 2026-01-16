const express = require('express');
const crypto = require('crypto');
const pinoHttp = require('pino-http');

const logger = require('./logger');
const healthRoutes = require('./routes/health');
const taskRoutes = require('./routes/tasks');
const { router: metricsRoutes, metricsMiddleware } = require('./routes/metrics');

const app = express();

const requestLogger = pinoHttp({
  logger,
  genReqId: (req, res) => {
    const header = req.headers['x-request-id'];
    const id = Array.isArray(header) ? header[0] : header;
    const requestId = id || crypto.randomUUID();
    res.setHeader('x-request-id', requestId);
    return requestId;
  },
});

app.use(requestLogger);
app.use(express.json());
app.use(metricsMiddleware);
app.use(healthRoutes);
app.use(taskRoutes);
app.use(metricsRoutes);

module.exports = app;
