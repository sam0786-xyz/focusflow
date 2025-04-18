const sequelize = require('./config/database');
const Settings = require('./models/Settings');
const Exam = require('./models/Exam');
const Session = require('./models/Session');

async function initializeDatabase() {
  try {
    // Sync all models with the database
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully');

    // Create default settings
    await Settings.create({
      workDuration: 25,
      shortBreak: 5,
      longBreak: 15,
      soundEnabled: true,
      theme: 'light'
    });
    console.log('Default settings created');

    // Create a sample exam
    await Exam.create({
      subject: 'Sample Subject',
      code: 'SAMPLE101',
      date: new Date().toISOString().split('T')[0],
      time: '09:00:00',
      completed: false
    });
    console.log('Sample exam created');

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the initialization
initializeDatabase(); 