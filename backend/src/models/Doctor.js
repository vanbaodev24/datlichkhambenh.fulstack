const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Doctor = sequelize.define('Doctor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  specialtyId: { type: DataTypes.INTEGER },
  clinicId: { type: DataTypes.INTEGER },
  description: { type: DataTypes.TEXT },
  contentMarkdown: { type: DataTypes.TEXT('long') },
  contentHTML: { type: DataTypes.TEXT('long') },
  priceId: { type: DataTypes.STRING(50) },
  paymentId: { type: DataTypes.STRING(50) },
  provinceId: { type: DataTypes.STRING(50) },
  nameClinic: { type: DataTypes.STRING(255) },
  addressClinic: { type: DataTypes.STRING(255) },
  note: { type: DataTypes.STRING(500) },
  count: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'doctors',
  timestamps: true
});

module.exports = Doctor;
