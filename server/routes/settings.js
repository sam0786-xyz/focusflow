const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// Get settings (always returns the first settings record or creates default)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({
        workDuration: 25,
        shortBreak: 5,
        longBreak: 15,
        soundEnabled: true,
        theme: 'light'
      });
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update settings
router.put('/', async (req, res) => {
  try {
    const { workDuration, shortBreak, longBreak, soundEnabled, theme } = req.body;
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create settings if none exist
      settings = await Settings.create({
        workDuration,
        shortBreak,
        longBreak,
        soundEnabled,
        theme
      });
    } else {
      // Update existing settings
      await settings.update({
        workDuration,
        shortBreak,
        longBreak,
        soundEnabled,
        theme
      });
    }
    
    res.json(settings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 