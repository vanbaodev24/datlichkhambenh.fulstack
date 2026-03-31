const bcrypt = require('bcryptjs');
const { User, Doctor, Allcode } = require('../models');

const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const where = { isActive: true };
    if (role) where.role = role;
    const { Op } = require('sequelize');
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      include: [{ model: Allcode, as: 'positionData' }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit
    });
    return res.json({ errCode: 0, data: rows, total: count });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ errCode: 1, message: 'User not found' });
    return res.json({ errCode: 0, data: user });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, gender, address, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ errCode: 1, message: 'Email already exists' });

    const hash = await bcrypt.hash(password || '123456', 10);
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;
    const user = await User.create({ email, password: hash, firstName, lastName, phone, gender, address, role, avatar });
    return res.status(201).json({ errCode: 0, data: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ errCode: 1, message: 'User not found' });
    const avatar = req.file ? `/uploads/${req.file.filename}` : user.avatar;
    const { password, ...rest } = req.body;
    const updates = { ...rest, avatar };
    if (password) updates.password = await bcrypt.hash(password, 10);
    await user.update(updates);
    return res.json({ errCode: 0, message: 'Updated', data: { id: user.id } });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.update({ isActive: false }, { where: { id: req.params.id } });
    return res.json({ errCode: 0, message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const getAllcodes = async (req, res) => {
  try {
    const { type } = req.query;
    const where = type ? { type } : {};
    const codes = await Allcode.findAll({ where });
    return res.json({ errCode: 0, data: codes });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, getAllcodes };
