const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  workDuration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 25
  },
  shortBreak: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  },
  longBreak: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 15
  },
  soundEnabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  theme: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'light'
  }
}, {
  timestamps: true
});

module.exports = Settings; 