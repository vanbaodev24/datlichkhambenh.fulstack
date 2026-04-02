const { MedicalResult, Booking, Doctor, User, Allcode } = require("../models");

const createResult = async (req, res) => {
  try {
    const {
      bookingId,
      patientName,
      patientGender,
      patientDob,
      patientAddress,
      patientCode,
      diagnosis,
      conclusion,
      note,
      resultDate,
      testResults,
      totalAmount,
      discount,
    } = req.body;

    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctor)
      return res.status(404).json({ errCode: 1, message: "Doctor not found" });

    const existing = await MedicalResult.findOne({ where: { bookingId } });
    if (existing) {
      await existing.update({
        patientName,
        patientGender,
        patientDob,
        patientAddress,
        patientCode,
        diagnosis,
        conclusion,
        note,
        resultDate,
        testResults,
        totalAmount,
        discount,
        status: "completed",
      });
      return res.json({ errCode: 0, message: "Updated", data: existing });
    }

    const result = await MedicalResult.create({
      bookingId,
      doctorId: doctor.id,
      patientName,
      patientGender,
      patientDob,
      patientAddress,
      patientCode,
      diagnosis,
      conclusion,
      note,
      resultDate,
      testResults,
      totalAmount,
      discount,
      status: "completed",
    });

    await Booking.update({ statusId: "S3" }, { where: { id: bookingId } });

    return res
      .status(201)
      .json({ errCode: 0, message: "Created", data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const getResultByBooking = async (req, res) => {
  try {
    const result = await MedicalResult.findOne({
      where: { bookingId: req.params.bookingId },
    });
    return res.json({ errCode: 0, data: result });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const getMyResults = async (req, res) => {
  try {
    const results = await MedicalResult.findAll({
      include: [
        {
          model: Booking,
          as: "bookingData",
          where: { patientId: req.user.id },
          include: [{ model: Allcode, as: "timeTypeData" }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.json({ errCode: 0, data: results });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

module.exports = { createResult, getResultByBooking, getMyResults };
