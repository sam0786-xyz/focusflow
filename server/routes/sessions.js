const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// Get all sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.findAll({
      order: [['date', 'DESC']]
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new session
router.post('/', async (req, res) => {
  try {
    const { date, duration, mode, notes } = req.body;
    const session = await Session.create({
      date: date || new Date(),
      duration,
      mode,
      notes
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a session
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Session.destroy({
      where: { id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 