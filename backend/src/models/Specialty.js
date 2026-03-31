const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Specialty = sequelize.define('Specialty', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  image: { type: DataTypes.STRING(255) },
  descriptionHTML: { type: DataTypes.TEXT('long') },
  descriptionMarkdown: { type: DataTypes.TEXT('long') }
}, {
  tableName: 'specialties',
  timestamps: true
});

module.exports = Specialty;
