const express = require('express');

const { prisma } = require('../db/prisma');

const router = express.Router();
const allowedStatuses = new Set(['open', 'done']);

const parseId = (value) => {
  const id = Number.parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
};

router.get('/tasks', async (req, res) => {
  const status = typeof req.query.status === 'string' ? req.query.status : null;

  if (status && !allowedStatuses.has(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const tasks = await prisma.task.findMany({
    where: status ? { status } : undefined,
    orderBy: { id: 'asc' },
  });

  return res.json(tasks);
});

router.post('/tasks', async (req, res) => {
  const { title, status } = req.body;

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (status !== undefined) {
    if (typeof status !== 'string' || !allowedStatuses.has(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
  }

  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      status: status || 'open',
    },
  });

  return res.status(201).json(task);
});

router.get('/tasks/:id', async (req, res) => {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const task = await prisma.task.findUnique({ where: { id } });

  if (!task) {
    return res.status(404).json({ error: 'Not found' });
  }

  return res.json(task);
});

router.put('/tasks/:id', async (req, res) => {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const { title, status } = req.body;
  const data = {};

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Invalid title' });
    }
    data.title = title.trim();
  }

  if (status !== undefined) {
    if (typeof status !== 'string' || !allowedStatuses.has(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    data.status = status;
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  try {
    const task = await prisma.task.update({ where: { id }, data });
    return res.json(task);
  } catch (error) {
    if (error && error.code === 'P2025') {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(500).json({ error: 'Internal error' });
  }
});

router.delete('/tasks/:id', async (req, res) => {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    await prisma.task.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    if (error && error.code === 'P2025') {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(500).json({ error: 'Internal error' });
  }
});

module.exports = router;
