const { Notification } = require("../models");

// Hàm tạo thông báo
const createNotification = async (
  userId,
  type,
  title,
  message,
  link = null,
  data = null,
  senderId = null,
) => {
  try {
    await Notification.create({
      userId,
      senderId,
      type,
      title,
      message,
      link,
      isRead: false,
      data,
    });
  } catch (err) {
    console.error("Create notification error:", err.message);
  }
};

// Các loại thông báo cụ thể
const notify = {
  // Bệnh nhân đặt lịch mới → thông báo cho bác sĩ
  bookingNew: async (doctorUserId, patientName, date, timeLabel, bookingId) => {
    await createNotification(
      doctorUserId,
      "booking_new",
      "📅 Có lịch hẹn mới",
      `Bệnh nhân ${patientName} đã đặt lịch khám vào ${timeLabel} ngày ${date}`,
      "/doctor-dashboard",
      { bookingId },
    );
  },

  // Xác nhận lịch hẹn → thông báo cho bệnh nhân
  bookingConfirmed: async (
    patientId,
    doctorName,
    date,
    timeLabel,
    bookingId,
  ) => {
    await createNotification(
      patientId,
      "booking_confirmed",
      "✅ Lịch hẹn đã được xác nhận",
      `Lịch khám với BS. ${doctorName} vào ${timeLabel} ngày ${date} đã được xác nhận`,
      "/my-bookings",
      { bookingId },
    );
  },

  // Hủy lịch hẹn → thông báo cho bệnh nhân
  bookingCancelled: async (patientId, doctorName, date, bookingId) => {
    await createNotification(
      patientId,
      "booking_cancelled",
      "❌ Lịch hẹn đã bị hủy",
      `Lịch khám với BS. ${doctorName} ngày ${date} đã bị hủy`,
      "/my-bookings",
      { bookingId },
    );
  },

  // Có kết quả khám → thông báo cho bệnh nhân
  resultReady: async (patientId, doctorName, resultId) => {
    await createNotification(
      patientId,
      "result_ready",
      "📋 Kết quả khám đã sẵn sàng",
      `BS. ${doctorName} đã cập nhật kết quả khám của bạn`,
      `/medical-result-view/${resultId}`,
      { resultId },
    );
  },

  // Có đơn thuốc mới → thông báo cho bệnh nhân
  prescriptionNew: async (patientId, doctorName, prescriptionId) => {
    await createNotification(
      patientId,
      "prescription_new",
      "💊 Bạn có đơn thuốc mới",
      `BS. ${doctorName} đã kê đơn thuốc cho bạn`,
      `/prescription-view/${prescriptionId}`,
      { prescriptionId },
    );
  },

  // Chỉ định bác sĩ → thông báo cho bác sĩ
  doctorAssigned: async (
    doctorUserId,
    patientName,
    consultantName,
    bookingId,
  ) => {
    await createNotification(
      doctorUserId,
      "doctor_assigned",
      "👨‍⚕️ Bạn được chỉ định khám bệnh nhân",
      `Tư vấn viên ${consultantName} đã chỉ định bạn khám cho bệnh nhân ${patientName}`,
      "/doctor-dashboard",
      { bookingId },
    );
  },

  // Thông báo hệ thống
  system: async (userId, title, message, link = null) => {
    await createNotification(userId, "system", title, message, link);
  },
};

module.exports = { createNotification, notify };
