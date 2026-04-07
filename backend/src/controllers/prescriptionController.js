const {
  Prescription,
  PrescriptionItem,
  Booking,
  Doctor,
  User,
} = require("../models");
const { notify } = require("../utils/notificationHelper");

// Tạo hoặc cập nhật đơn thuốc
const upsertPrescription = async (req, res) => {
  try {
    const {
      bookingId,
      diagnosis,
      note,
      prescribedDate,
      revisitDate,
      patientName,
      patientDob,
      patientGender,
      patientAddress,
      items,
    } = req.body;

    if (!bookingId)
      return res.status(400).json({ errCode: 1, message: "Missing bookingId" });
    if (!items || !items.length)
      return res.status(400).json({ errCode: 1, message: "Missing items" });

    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctor)
      return res.status(404).json({ errCode: 1, message: "Doctor not found" });

    const booking = await Booking.findByPk(bookingId);
    if (!booking)
      return res.status(404).json({ errCode: 1, message: "Booking not found" });

    // Tìm hoặc tạo đơn thuốc
    let prescription = await Prescription.findOne({ where: { bookingId } });

    if (prescription) {
      await prescription.update({
        diagnosis,
        note,
        prescribedDate,
        revisitDate,
        patientName,
        patientDob,
        patientGender,
        patientAddress,
      });
      // Xóa items cũ rồi tạo lại
      await PrescriptionItem.destroy({
        where: { prescriptionId: prescription.id },
      });
    } else {
      prescription = await Prescription.create({
        bookingId,
        doctorId: doctor.id,
        patientId: booking.patientId,
        patientName: patientName || booking.patientName,
        patientDob,
        patientGender,
        patientAddress: patientAddress || booking.patientAddress,
        diagnosis,
        note,
        prescribedDate: prescribedDate || new Date(),
        revisitDate,
        status: "active",
      });
    }

    // Tạo items mới
    const createdItems = await PrescriptionItem.bulkCreate(
      items.map((item) => ({ ...item, prescriptionId: prescription.id })),
    );

    // Load lại với items
    const result = await Prescription.findByPk(prescription.id, {
      include: [{ model: PrescriptionItem, as: "items" }],
    });

    // Thông báo cho bệnh nhân
    try {
      const doc = await Doctor.findByPk(doctor.id, {
        include: [{ model: User, as: "userData" }],
      });
      const doctorName = doc?.userData
        ? `${doc.userData.lastName} ${doc.userData.firstName}`
        : "Bác sĩ";
      if (booking.patientId)
        await notify.prescriptionNew(
          booking.patientId,
          doctorName,
          prescription.id,
        );
    } catch (e) {
      console.error("Notify error:", e.message);
    }

    return res.json({ errCode: 0, message: "Saved", data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// Lấy đơn thuốc theo bookingId
const getByBooking = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      where: { bookingId: req.params.bookingId },
      include: [
        { model: PrescriptionItem, as: "items" },
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
    });
    return res.json({ errCode: 0, data: prescription });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// Lấy đơn thuốc theo id
const getById = async (req, res) => {
  try {
    const prescription = await Prescription.findByPk(req.params.id, {
      include: [
        { model: PrescriptionItem, as: "items" },
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
    });
    if (!prescription)
      return res.status(404).json({ errCode: 1, message: "Not found" });
    return res.json({ errCode: 0, data: prescription });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// DS đơn thuốc của bệnh nhân
const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.findAll({
      where: { patientId: req.user.id },
      include: [
        { model: PrescriptionItem, as: "items" },
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
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.json({ errCode: 0, data: prescriptions });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// DS đơn thuốc của bác sĩ
const getDoctorPrescriptions = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctor)
      return res.status(404).json({ errCode: 1, message: "Doctor not found" });

    const { page = 1, limit = 20 } = req.query;
    const { count, rows } = await Prescription.findAndCountAll({
      where: { doctorId: doctor.id },
      include: [{ model: PrescriptionItem, as: "items" }],
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
  upsertPrescription,
  getByBooking,
  getById,
  getPatientPrescriptions,
  getDoctorPrescriptions,
};
