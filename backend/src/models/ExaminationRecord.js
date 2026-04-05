const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ExaminationRecord = sequelize.define(
  "ExaminationRecord",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bookingId: { type: DataTypes.INTEGER, allowNull: false },
    doctorId: { type: DataTypes.INTEGER, allowNull: false },
    patientId: { type: DataTypes.INTEGER },
    medicalResultId: { type: DataTypes.INTEGER },
    // Thông tin khám
    chiefComplaint: { type: DataTypes.TEXT }, // Lý do khám chính
    clinicalExam: { type: DataTypes.TEXT }, // Khám lâm sàng
    diagnosis: { type: DataTypes.TEXT }, // Chẩn đoán
    treatmentPlan: { type: DataTypes.TEXT }, // Kế hoạch điều trị
    followUpDate: { type: DataTypes.DATEONLY }, // Ngày tái khám
    // Chỉ số sinh tồn
    bloodPressure: { type: DataTypes.STRING(20) }, // Huyết áp VD: 120/80
    heartRate: { type: DataTypes.INTEGER }, // Nhịp tim
    temperature: { type: DataTypes.FLOAT }, // Nhiệt độ
    weight: { type: DataTypes.FLOAT }, // Cân nặng (kg)
    height: { type: DataTypes.FLOAT }, // Chiều cao (cm)
    // Trạng thái
    status: {
      type: DataTypes.ENUM("examining", "done", "transferred"),
      defaultValue: "examining",
    },
    note: { type: DataTypes.TEXT },
  },
  {
    tableName: "examination_records",
    timestamps: true,
  },
);

module.exports = ExaminationRecord;
