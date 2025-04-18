const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');

// Get all exams
router.get('/', async (req, res) => {
  try {
    const exams = await Exam.findAll({
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new exam
router.post('/', async (req, res) => {
  try {
    const { subject, code, date, time } = req.body;
    const exam = await Exam.create({
      subject,
      code,
      date,
      time
    });
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an exam
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, code, date, time, completed } = req.body;
    
    const exam = await Exam.findByPk(id);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    await exam.update({
      subject,
      code,
      date,
      time,
      completed
    });
    
    res.json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Toggle exam completion status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findByPk(id);
    
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    await exam.update({ completed: !exam.completed });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an exam
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Exam.destroy({
      where: { id }
    });
    
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Exam not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 