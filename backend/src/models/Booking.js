const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patientId: { type: DataTypes.INTEGER },
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  timeType: { type: DataTypes.STRING(50), allowNull: false },
  statusId: { type: DataTypes.STRING(50), defaultValue: 'S1' }, // S1=new, S2=confirmed, S3=done, S4=cancelled
  token: { type: DataTypes.STRING(255) },
  patientName: { type: DataTypes.STRING(100), allowNull: false },
  patientPhone: { type: DataTypes.STRING(15), allowNull: false },
  patientEmail: { type: DataTypes.STRING(100) },
  patientAddress: { type: DataTypes.STRING(255) },
  patientReason: { type: DataTypes.TEXT },
  patientGender: { type: DataTypes.STRING(10) },
  patientDob: { type: DataTypes.DATEONLY }
}, {
  tableName: 'bookings',
  timestamps: true
});

module.exports = Booking;
