const {
  Doctor,
  User,
  Specialty,
  Clinic,
  Schedule,
  Allcode,
} = require("../models");
const { Op } = require("sequelize");

const getAllDoctors = async (req, res) => {
  try {
    const { Sequelize } = require("sequelize");
    const { limit = 12, page = 1, specialtyId, search } = req.query;
    const offset = (page - 1) * limit;

    let matchedUserIds = [];
    let matchedSpecialtyIds = [];
    let matchedClinicIds = [];

    if (search) {
      // Tìm user khớp tên
      const matchedUsers = await User.findAll({
        where: {
          isActive: true,
          [Op.or]: [
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            Sequelize.where(
              Sequelize.fn(
                "CONCAT",
                Sequelize.col("lastName"),
                " ",
                Sequelize.col("firstName"),
              ),
              { [Op.like]: `%${search}%` },
            ),
            Sequelize.where(
              Sequelize.fn(
                "CONCAT",
                Sequelize.col("firstName"),
                " ",
                Sequelize.col("lastName"),
              ),
              { [Op.like]: `%${search}%` },
            ),
          ],
        },
        attributes: ["id"],
      });
      matchedUserIds = matchedUsers.map((u) => u.id);

      // Tìm specialtyId khớp tên chuyên khoa
      const matchedSpecialties = await Specialty.findAll({
        where: { name: { [Op.like]: `%${search}%` } },
        attributes: ["id"],
      });
      matchedSpecialtyIds = matchedSpecialties.map((s) => s.id);

      // Tìm clinicId khớp tên bệnh viện
      const matchedClinics = await Clinic.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { address: { [Op.like]: `%${search}%` } },
          ],
        },
        attributes: ["id"],
      });
      matchedClinicIds = matchedClinics.map((c) => c.id);
    }

    // Build doctorWhere
    const doctorWhere = {};
    if (specialtyId) doctorWhere.specialtyId = parseInt(specialtyId);

    if (search) {
      const orConditions = [
        { nameClinic: { [Op.like]: `%${search}%` } },
        { addressClinic: { [Op.like]: `%${search}%` } },
      ];
      if (matchedUserIds.length > 0) {
        orConditions.push({ userId: { [Op.in]: matchedUserIds } });
      }
      if (matchedSpecialtyIds.length > 0) {
        orConditions.push({ specialtyId: { [Op.in]: matchedSpecialtyIds } });
      }
      if (matchedClinicIds.length > 0) {
        orConditions.push({ clinicId: { [Op.in]: matchedClinicIds } });
      }
      doctorWhere[Op.or] = orConditions;
    }

    const { count, rows } = await Doctor.findAndCountAll({
      where: doctorWhere,
      include: [
        {
          model: User,
          as: "userData",
          attributes: { exclude: ["password"] },
          where: { isActive: true },
          required: true,
          include: [
            {
              model: Allcode,
              as: "positionData",
              attributes: ["valueVi", "valueEn"],
              required: false,
            },
          ],
        },
        {
          model: Specialty,
          as: "specialtyData",
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: Clinic,
          as: "clinicData",
          attributes: ["id", "name", "address"],
          required: false,
        },
        {
          model: Allcode,
          as: "priceData",
          attributes: ["valueVi", "valueEn"],
          required: false,
        },
        {
          model: Allcode,
          as: "paymentData",
          attributes: ["valueVi", "valueEn"],
          required: false,
        },
        {
          model: Allcode,
          as: "provinceData",
          attributes: ["valueVi", "valueEn"],
          required: false,
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
    });

    return res.json({
      errCode: 0,
      data: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error("getAllDoctors error:", err);
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      where: { userId: req.params.id },
      include: [
        {
          model: User,
          as: "userData",
          attributes: { exclude: ["password"] },
          include: [{ model: Allcode, as: "positionData" }],
        },
        { model: Specialty, as: "specialtyData" },
        { model: Clinic, as: "clinicData" },
        { model: Allcode, as: "priceData" },
        { model: Allcode, as: "paymentData" },
        { model: Allcode, as: "provinceData" },
      ],
    });
    if (!doctor)
      return res.status(404).json({ errCode: 1, message: "Doctor not found" });
    return res.json({ errCode: 0, data: doctor });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const getDoctorSchedule = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    const schedules = await Schedule.findAll({
      where: { doctorId, date },
      include: [{ model: Allcode, as: "timeTypeData" }],
      order: [["timeType", "ASC"]],
    });
    return res.json({ errCode: 0, data: schedules });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const getTopDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: [
        {
          model: User,
          as: "userData",
          where: { isActive: true },
          attributes: { exclude: ["password"] },
          include: [{ model: Allcode, as: "positionData", required: false }],
        },
        {
          model: Specialty,
          as: "specialtyData",
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: Allcode,
          as: "priceData",
          attributes: ["valueVi"],
          required: false,
        },
        {
          model: Allcode,
          as: "paymentData",
          attributes: ["valueVi"],
          required: false,
        },
        {
          model: Allcode,
          as: "provinceData",
          attributes: ["valueVi"],
          required: false,
        },
      ],
      order: [["count", "DESC"]],
      limit: 8,
    });
    return res.json({ errCode: 0, data: doctors });
  } catch (err) {
    console.error("getTopDoctors error:", err);
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};
const createSchedule = async (req, res) => {
  try {
    const { doctorId, arrSchedule } = req.body;
    if (!arrSchedule || !arrSchedule.length)
      return res.status(400).json({ errCode: 1, message: "Missing data" });

    for (const s of arrSchedule) {
      await Schedule.findOrCreate({
        where: { doctorId, date: s.date, timeType: s.timeType },
        defaults: { maxNumber: s.maxNumber || 10, currentNumber: 0 },
      });
    }
    return res.json({ errCode: 0, message: "Schedules created successfully" });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const upsertDoctorInfo = async (req, res) => {
  try {
    const {
      userId,
      specialtyId,
      clinicId,
      priceId,
      paymentId,
      provinceId,
      nameClinic,
      addressClinic,
      note,
      description,
      contentMarkdown,
      contentHTML,
    } = req.body;
    if (!userId)
      return res.status(400).json({ errCode: 1, message: "Missing userId" });

    const [doctor, created] = await Doctor.findOrCreate({
      where: { userId },
      defaults: {
        specialtyId,
        clinicId,
        priceId,
        paymentId,
        provinceId,
        nameClinic,
        addressClinic,
        note,
        description,
        contentMarkdown,
        contentHTML,
      },
    });

    if (!created) {
      await doctor.update({
        specialtyId,
        clinicId,
        priceId,
        paymentId,
        provinceId,
        nameClinic,
        addressClinic,
        note,
        description,
        contentMarkdown,
        contentHTML,
      });
    }

    await User.update(
      { positionId: req.body.positionId },
      { where: { id: userId } },
    );

    return res.json({ errCode: 0, message: "Doctor info saved", data: doctor });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getDoctorSchedule,
  getTopDoctors,
  createSchedule,
  upsertDoctorInfo,
};
