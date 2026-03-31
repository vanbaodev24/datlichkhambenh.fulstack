const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  firstName: { type: DataTypes.STRING(50), allowNull: false },
  lastName: { type: DataTypes.STRING(50), allowNull: false },
  phone: { type: DataTypes.STRING(15) },
  gender: { type: DataTypes.ENUM('M', 'F', 'Other'), defaultValue: 'M' },
  address: { type: DataTypes.STRING(255) },
  dob: { type: DataTypes.DATEONLY },
  avatar: { type: DataTypes.STRING(255) },
  role: { type: DataTypes.ENUM('admin', 'doctor', 'patient'), defaultValue: 'patient' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  positionId: { type: DataTypes.STRING(50) }, // GS, PGS, BS, ThS
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
