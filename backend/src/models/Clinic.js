const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Clinic = sequelize.define('Clinic', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  address: { type: DataTypes.STRING(500) },
  image: { type: DataTypes.STRING(255) },
  descriptionHTML: { type: DataTypes.TEXT('long') },
  descriptionMarkdown: { type: DataTypes.TEXT('long') }
}, {
  tableName: 'clinics',
  timestamps: true
});

module.exports = Clinic;
