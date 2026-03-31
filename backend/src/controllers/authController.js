const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, gender, address } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ errCode: 1, message: 'Missing required fields' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ errCode: 1, message: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, firstName, lastName, phone, gender, address });
    return res.status(201).json({ errCode: 0, message: 'Register successful', data: { id: user.id, email: user.email } });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ errCode: 1, message: 'Missing credentials' });

    const user = await User.findOne({ where: { email, isActive: true } });
    if (!user) return res.status(401).json({ errCode: 1, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ errCode: 1, message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    return res.json({
      errCode: 0,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    return res.json({ errCode: 0, data: user });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

module.exports = { register, login, getProfile };
