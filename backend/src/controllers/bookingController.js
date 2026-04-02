const { Booking, Doctor, User, Schedule, Allcode } = require("../models");
const { v4: uuidv4 } = require("uuid");

const createBooking = async (req, res) => {
  try {
    const {
      doctorId,
      date,
      timeType,
      patientName,
      patientPhone,
      patientEmail,
      patientAddress,
      patientReason,
      patientGender,
      patientDob,
      patientId,
    } = req.body;

    if (!doctorId || !date || !timeType || !patientName || !patientPhone) {
      return res
        .status(400)
        .json({ errCode: 1, message: "Missing required fields" });
    }

    // Check schedule availability
    const schedule = await Schedule.findOne({
      where: { doctorId, date, timeType },
    });
    if (!schedule)
      return res
        .status(400)
        .json({ errCode: 1, message: "Schedule not available" });
    if (schedule.currentNumber >= schedule.maxNumber) {
      return res.status(400).json({ errCode: 1, message: "Schedule is full" });
    }

    const token = uuidv4();
    const booking = await Booking.create({
      doctorId,
      date,
      timeType,
      patientId: patientId || null,
      patientName,
      patientPhone,
      patientEmail,
      patientAddress,
      patientReason,
      patientGender,
      patientDob,
      token,
      statusId: "S1",
    });

    await schedule.increment("currentNumber");

    return res.status(201).json({
      errCode: 0,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const getPatientBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
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
        { model: Allcode, as: "statusData" },
        { model: Allcode, as: "timeTypeData" },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.json({ errCode: 0, data: bookings });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const getDoctorBookings = async (req, res) => {
  try {
    const { date } = req.query;
    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctor)
      return res.status(404).json({ errCode: 1, message: "Doctor not found" });

    const where = { doctorId: doctor.id };
    if (date) where.date = date;

    const bookings = await Booking.findAll({
      where,
      include: [
        { model: Allcode, as: "statusData" },
        { model: Allcode, as: "timeTypeData" },
      ],
      order: [
        ["date", "DESC"],
        ["timeType", "ASC"],
      ],
    });
    return res.json({ errCode: 0, data: bookings });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusId } = req.body;
    const booking = await Booking.findByPk(id);
    if (!booking)
      return res.status(404).json({ errCode: 1, message: "Booking not found" });
    await booking.update({ statusId });
    return res.json({ errCode: 0, message: "Booking updated", data: booking });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, date } = req.query;
    const where = {};
    if (status) where.statusId = status;
    if (date) where.date = date;

    const { count, rows } = await Booking.findAndCountAll({
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
        { model: Allcode, as: "statusData" },
        { model: Allcode, as: "timeTypeData" },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });
    return res.json({ errCode: 0, data: rows, total: count });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const assignDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorId, note } = req.body;
    const booking = await Booking.findByPk(id);
    if (!booking)
      return res.status(404).json({ errCode: 1, message: "Booking not found" });
    await booking.update({
      doctorId,
      statusId: "S2",
      patientReason: note || booking.patientReason,
    });
    return res.json({ errCode: 0, message: "Doctor assigned", data: booking });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

module.exports = {
  createBooking,
  getPatientBookings,
  getDoctorBookings,
  updateBookingStatus,
  getAllBookings,
  assignDoctor,
};
