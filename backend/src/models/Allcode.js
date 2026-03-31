const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Allcode = sequelize.define('Allcode', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  keyMap: { type: DataTypes.STRING(50), allowNull: false },
  type: { type: DataTypes.STRING(50), allowNull: false },
  valueVi: { type: DataTypes.STRING(200) },
  valueEn: { type: DataTypes.STRING(200) }
}, {
  tableName: 'allcodes',
  timestamps: false
});

module.exports = Allcode;
