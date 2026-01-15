const express = require('express');

const healthRoutes = require('./routes/health');
const taskRoutes = require('./routes/tasks');
const { router: metricsRoutes, metricsMiddleware } = require('./routes/metrics');

const app = express();

app.use(express.json());
app.use(metricsMiddleware);
app.use(healthRoutes);
app.use(taskRoutes);
app.use(metricsRoutes);

module.exports = app;
