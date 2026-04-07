const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const PrescriptionItem = sequelize.define(
  "PrescriptionItem",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    prescriptionId: { type: DataTypes.INTEGER, allowNull: false },
    medicineName: { type: DataTypes.STRING(200), allowNull: false }, // Tên thuốc
    medicineCode: { type: DataTypes.STRING(50) }, // Mã thuốc
    unit: { type: DataTypes.STRING(50) }, // Đơn vị: viên, chai, ống...
    quantity: { type: DataTypes.INTEGER }, // Số lượng
    dosage: { type: DataTypes.STRING(100) }, // Liều dùng: 1 viên/lần
    frequency: { type: DataTypes.STRING(100) }, // Tần suất: 2 lần/ngày
    duration: { type: DataTypes.STRING(100) }, // Thời gian: 7 ngày
    instruction: { type: DataTypes.TEXT }, // Cách dùng: Uống sau ăn
    note: { type: DataTypes.STRING(255) }, // Ghi chú thêm
  },
  {
    tableName: "prescription_items",
    timestamps: false,
  },
);

module.exports = PrescriptionItem;
