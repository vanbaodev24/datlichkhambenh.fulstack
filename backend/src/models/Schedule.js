const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Schedule = sequelize.define('Schedule', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  timeType: { type: DataTypes.STRING(50), allowNull: false }, // T1-T8
  maxNumber: { type: DataTypes.INTEGER, defaultValue: 10 },
  currentNumber: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'schedules',
  timestamps: true
});

module.exports = Schedule;
