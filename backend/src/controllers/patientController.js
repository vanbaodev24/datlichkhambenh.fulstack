const { User, MedicalHistory } = require("../models");
const bcrypt = require("bcryptjs");

// Lấy hồ sơ bệnh nhân đầy đủ
const getFullProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [{ model: MedicalHistory, as: "medicalHistories" }],
    });
    return res.json({ errCode: 0, data: user });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// Cập nhật thông tin bệnh nhân
const updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      address,
      dob,
      gender,
      bhytCode,
      occupation,
      ethnicity,
      nationality,
    } = req.body;
    await User.update(
      {
        firstName,
        lastName,
        phone,
        address,
        dob,
        gender,
        bhytCode,
        occupation,
        ethnicity,
        nationality,
      },
      { where: { id: req.user.id } },
    );
    const updated = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    return res.json({ errCode: 0, message: "Updated", data: updated });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// Thêm tiền sử bệnh
const addMedicalHistory = async (req, res) => {
  try {
    const { disease, symptoms, since, treatment, allergies, note } = req.body;
    const history = await MedicalHistory.create({
      patientId: req.user.id,
      disease,
      symptoms,
      since,
      treatment,
      allergies,
      note,
    });
    return res.status(201).json({ errCode: 0, data: history });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// Lấy tiền sử bệnh
const getMedicalHistory = async (req, res) => {
  try {
    const histories = await MedicalHistory.findAll({
      where: { patientId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    return res.json({ errCode: 0, data: histories });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// Xóa tiền sử bệnh
const deleteMedicalHistory = async (req, res) => {
  try {
    await MedicalHistory.destroy({
      where: { id: req.params.id, patientId: req.user.id },
    });
    return res.json({ errCode: 0, message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

module.exports = {
  getFullProfile,
  updateProfile,
  addMedicalHistory,
  getMedicalHistory,
  deleteMedicalHistory,
};
