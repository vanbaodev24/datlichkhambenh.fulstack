const {
  ExaminationRecord,
  Booking,
  Doctor,
  User,
  MedicalResult,
  Allcode,
} = require("../models");

// Tạo hoặc cập nhật phiếu khám
const upsertExamination = async (req, res) => {
  try {
    const {
      bookingId,
      chiefComplaint,
      clinicalExam,
      diagnosis,
      treatmentPlan,
      followUpDate,
      bloodPressure,
      heartRate,
      temperature,
      weight,
      height,
      status,
      note,
    } = req.body;

    if (!bookingId)
      return res.status(400).json({ errCode: 1, message: "Missing bookingId" });

    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctor)
      return res.status(404).json({ errCode: 1, message: "Doctor not found" });

    const booking = await Booking.findByPk(bookingId);
    if (!booking)
      return res.status(404).json({ errCode: 1, message: "Booking not found" });

    const [record, created] = await ExaminationRecord.findOrCreate({
      where: { bookingId },
      defaults: {
        bookingId,
        doctorId: doctor.id,
        patientId: booking.patientId,
        chiefComplaint,
        clinicalExam,
        diagnosis,
        treatmentPlan,
        followUpDate,
        bloodPressure,
        heartRate,
        temperature,
        weight,
        height,
        status: status || "examining",
        note,
      },
    });

    if (!created) {
      await record.update({
        chiefComplaint,
        clinicalExam,
        diagnosis,
        treatmentPlan,
        followUpDate,
        bloodPressure,
        heartRate,
        temperature,
        weight,
        height,
        status,
        note,
      });
    }

    // Nếu done thì cập nhật booking thành S3
    if (status === "done") {
      await Booking.update({ statusId: "S3" }, { where: { id: bookingId } });
    }

    return res.json({
      errCode: 0,
      message: created ? "Created" : "Updated",
      data: record,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// Lấy phiếu khám theo bookingId
const getByBooking = async (req, res) => {
  try {
    const record = await ExaminationRecord.findOne({
      where: { bookingId: req.params.bookingId },
      include: [
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
    });
    return res.json({ errCode: 0, data: record });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// DS đã khám của bác sĩ
const getDoctorExaminations = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, date } = req.query;
    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctor)
      return res.status(404).json({ errCode: 1, message: "Doctor not found" });

    const where = { doctorId: doctor.id };
    if (status) where.status = status;

    const { count, rows } = await ExaminationRecord.findAndCountAll({
      where,
      include: [
        {
          model: Booking,
          as: "bookingData",
          where: date ? { date } : {},
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

// DS đã khám của bệnh nhân
const getPatientExaminations = async (req, res) => {
  try {
    const records = await ExaminationRecord.findAll({
      where: { patientId: req.user.id },
      include: [
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
        { model: MedicalResult, as: "medicalResultData" },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.json({ errCode: 0, data: records });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// Admin xem tất cả
const getAllExaminations = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, date } = req.query;
    const where = {};
    if (status) where.status = status;

    const { count, rows } = await ExaminationRecord.findAndCountAll({
      where,
      include: [
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
          where: date ? { date } : {},
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
  upsertExamination,
  getByBooking,
  getDoctorExaminations,
  getPatientExaminations,
  getAllExaminations,
};
