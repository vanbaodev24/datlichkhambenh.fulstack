const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ConsultationRecord = sequelize.define(
  "ConsultationRecord",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bookingId: { type: DataTypes.INTEGER, allowNull: false },
    consultantId: { type: DataTypes.INTEGER, allowNull: false }, // Tư vấn viên
    doctorId: { type: DataTypes.INTEGER }, // Bác sĩ được chỉ định
    patientName: { type: DataTypes.STRING(100) },
    patientPhone: { type: DataTypes.STRING(15) },
    reason: { type: DataTypes.TEXT }, // Lý do chỉ định
    symptoms: { type: DataTypes.TEXT }, // Triệu chứng bệnh nhân mô tả
    priority: {
      // Mức độ ưu tiên
      type: DataTypes.ENUM("normal", "urgent", "emergency"),
      defaultValue: "normal",
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "assigned",
        "examining",
        "done",
        "cancelled",
      ),
      defaultValue: "pending",
    },
    assignedAt: { type: DataTypes.DATE }, // Thời điểm chỉ định
    note: { type: DataTypes.TEXT },
  },
  {
    tableName: "consultation_records",
    timestamps: true,
  },
);

module.exports = ConsultationRecord;
