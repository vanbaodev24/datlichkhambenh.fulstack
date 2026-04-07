const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Prescription = sequelize.define(
  "Prescription",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bookingId: { type: DataTypes.INTEGER, allowNull: false },
    doctorId: { type: DataTypes.INTEGER, allowNull: false },
    patientId: { type: DataTypes.INTEGER },
    patientName: { type: DataTypes.STRING(100) },
    patientDob: { type: DataTypes.DATEONLY },
    patientGender: { type: DataTypes.STRING(10) },
    patientAddress: { type: DataTypes.STRING(255) },
    diagnosis: { type: DataTypes.TEXT }, // Chẩn đoán
    note: { type: DataTypes.TEXT }, // Lời dặn
    prescribedDate: { type: DataTypes.DATEONLY }, // Ngày kê đơn
    revisitDate: { type: DataTypes.DATEONLY }, // Ngày tái khám
    status: {
      type: DataTypes.ENUM("active", "completed", "cancelled"),
      defaultValue: "active",
    },
  },
  {
    tableName: "prescriptions",
    timestamps: true,
  },
);

module.exports = Prescription;
