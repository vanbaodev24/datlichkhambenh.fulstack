const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const MedicalResult = sequelize.define(
  "MedicalResult",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bookingId: { type: DataTypes.INTEGER, allowNull: false },
    doctorId: { type: DataTypes.INTEGER, allowNull: false },
    patientName: { type: DataTypes.STRING(100) },
    patientGender: { type: DataTypes.STRING(10) },
    patientDob: { type: DataTypes.DATEONLY },
    patientAddress: { type: DataTypes.STRING(255) },
    patientCode: { type: DataTypes.STRING(50) },
    diagnosis: { type: DataTypes.TEXT },
    conclusion: { type: DataTypes.TEXT },
    note: { type: DataTypes.TEXT },
    resultDate: { type: DataTypes.DATEONLY },
    status: {
      type: DataTypes.ENUM("pending", "completed"),
      defaultValue: "pending",
    },
    // Kết quả xét nghiệm dạng JSON
    testResults: { type: DataTypes.JSON },
    totalAmount: { type: DataTypes.INTEGER, defaultValue: 0 },
    discount: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: "medical_results",
    timestamps: true,
  },
);

module.exports = MedicalResult;
