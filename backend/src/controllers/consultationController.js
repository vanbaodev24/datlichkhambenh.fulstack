const {
  ConsultationRecord,
  Booking,
  Doctor,
  User,
  Allcode,
} = require("../models");

// Tạo phiếu tư vấn / chỉ định bác sĩ
const createConsultation = async (req, res) => {
  try {
    const { bookingId, doctorId, reason, symptoms, priority, note } = req.body;
    if (!bookingId)
      return res.status(400).json({ errCode: 1, message: "Missing bookingId" });

    const booking = await Booking.findByPk(bookingId);
    if (!booking)
      return res.status(404).json({ errCode: 1, message: "Booking not found" });

    // Kiểm tra đã có chưa
    const existing = await ConsultationRecord.findOne({ where: { bookingId } });
    if (existing) {
      await existing.update({
        doctorId,
        reason,
        symptoms,
        priority,
        note,
        status: doctorId ? "assigned" : "pending",
        assignedAt: doctorId ? new Date() : null,
      });
      // Cập nhật booking
      if (doctorId)
        await Booking.update({ statusId: "S2" }, { where: { id: bookingId } });
      return res.json({ errCode: 0, message: "Updated", data: existing });
    }

    const record = await ConsultationRecord.create({
      bookingId,
      consultantId: req.user.id,
      doctorId: doctorId || null,
      patientName: booking.patientName,
      patientPhone: booking.patientPhone,
      reason,
      symptoms,
      priority: priority || "normal",
      status: doctorId ? "assigned" : "pending",
      assignedAt: doctorId ? new Date() : null,
      note,
    });

    // Cập nhật booking nếu đã chỉ định bác sĩ
    if (doctorId)
      await Booking.update({ statusId: "S2" }, { where: { id: bookingId } });

    return res
      .status(201)
      .json({ errCode: 0, message: "Created", data: record });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// Lấy theo bookingId
const getByBooking = async (req, res) => {
  try {
    const record = await ConsultationRecord.findOne({
      where: { bookingId: req.params.bookingId },
      include: [
        {
          model: User,
          as: "consultantData",
          attributes: ["firstName", "lastName"],
        },
        {
          model: Doctor,
          as: "doctorData",
          include: [
            {
              model: User,
              as: "userData",
              attributes: ["firstName", "lastName", "avatar"],
            },
          ],
        },
        {
          model: Booking,
          as: "bookingData",
          include: [{ model: Allcode, as: "timeTypeData" }],
        },
      ],
    });
    return res.json({ errCode: 0, data: record });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// DS tư vấn của tư vấn viên
const getMyConsultations = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, date } = req.query;
    const where = { consultantId: req.user.id };
    if (status) where.status = status;

    const bookingWhere = {};
    if (date) bookingWhere.date = date;

    const { count, rows } = await ConsultationRecord.findAndCountAll({
      where,
      include: [
        {
          model: Booking,
          as: "bookingData",
          where: Object.keys(bookingWhere).length ? bookingWhere : undefined,
          include: [{ model: Allcode, as: "timeTypeData" }],
        },
        {
          model: Doctor,
          as: "doctorData",
          include: [
            {
              model: User,
              as: "userData",
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      distinct: true,
    });
    return res.json({ errCode: 0, data: rows, total: count });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// Cập nhật trạng thái
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const record = await ConsultationRecord.findByPk(id);
    if (!record)
      return res.status(404).json({ errCode: 1, message: "Not found" });
    await record.update({ status });
    return res.json({ errCode: 0, message: "Updated", data: record });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// Admin xem tất cả
const getAllConsultations = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const where = {};
    if (status) where.status = status;

    const { count, rows } = await ConsultationRecord.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "consultantData",
          attributes: ["firstName", "lastName"],
        },
        {
          model: Doctor,
          as: "doctorData",
          include: [
            {
              model: User,
              as: "userData",
              attributes: ["firstName", "lastName"],
            },
          ],
        },
        {
          model: Booking,
          as: "bookingData",
          include: [{ model: Allcode, as: "timeTypeData" }],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      distinct: true,
    });
    return res.json({ errCode: 0, data: rows, total: count });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

module.exports = {
  createConsultation,
  getByBooking,
  getMyConsultations,
  updateStatus,
  getAllConsultations,
};
