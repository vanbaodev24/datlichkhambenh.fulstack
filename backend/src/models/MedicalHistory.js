const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const MedicalHistory = sequelize.define(
  "MedicalHistory",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    patientId: { type: DataTypes.INTEGER, allowNull: false },
    disease: { type: DataTypes.STRING(255) }, // Tên bệnh
    symptoms: { type: DataTypes.TEXT }, // Triệu chứng
    since: { type: DataTypes.DATEONLY }, // Từ khi nào
    treatment: { type: DataTypes.TEXT }, // Đang điều trị
    allergies: { type: DataTypes.TEXT }, // Dị ứng
    note: { type: DataTypes.TEXT },
  },
  {
    tableName: "medical_histories",
    timestamps: true,
  },
);

module.exports = MedicalHistory;
