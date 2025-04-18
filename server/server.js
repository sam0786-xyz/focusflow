const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database and models
const sequelize = require('./config/database');
const Session = require('./models/Session');
const Exam = require('./models/Exam');
const Settings = require('./models/Settings');

// Import routes
const sessionsRouter = require('./routes/sessions');
const examsRouter = require('./routes/exams');
const settingsRouter = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/sessions', sessionsRouter);
app.use('/api/exams', examsRouter);
app.use('/api/settings', settingsRouter);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Sync database and start server
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });
