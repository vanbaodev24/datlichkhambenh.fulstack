const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Notification = sequelize.define(
  "Notification",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false }, // Người nhận
    senderId: { type: DataTypes.INTEGER }, // Người gửi (null = hệ thống)
    type: {
      type: DataTypes.ENUM(
        "booking_new", // Có lịch hẹn mới
        "booking_confirmed", // Lịch hẹn được xác nhận
        "booking_cancelled", // Lịch hẹn bị hủy
        "booking_reminder", // Nhắc lịch hẹn
        "result_ready", // Có kết quả khám
        "prescription_new", // Có đơn thuốc mới
        "doctor_assigned", // Được chỉ định bác sĩ
        "system", // Thông báo hệ thống
      ),
      defaultValue: "system",
    },
    title: { type: DataTypes.STRING(255), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    link: { type: DataTypes.STRING(255) }, // Link điều hướng khi click
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    data: { type: DataTypes.JSON }, // Dữ liệu thêm (bookingId, doctorId...)
  },
  {
    tableName: "notifications",
    timestamps: true,
  },
);

module.exports = Notification;
