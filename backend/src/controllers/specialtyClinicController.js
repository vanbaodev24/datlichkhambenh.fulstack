const { Specialty, Clinic, Doctor, User, Allcode } = require('../models');
const path = require('path');
const fs = require('fs');

// === SPECIALTY ===
const getAllSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.findAll({ order: [['name', 'ASC']] });
    return res.json({ errCode: 0, data: specialties });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const getSpecialtyById = async (req, res) => {
  try {
    const specialty = await Specialty.findByPk(req.params.id, {
      include: [{
        model: Doctor, as: 'doctors',
        include: [{ model: User, as: 'userData', where: { isActive: true }, attributes: { exclude: ['password'] } },
          { model: Allcode, as: 'priceData' }]
      }]
    });
    if (!specialty) return res.status(404).json({ errCode: 1, message: 'Not found' });
    return res.json({ errCode: 0, data: specialty });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const createSpecialty = async (req, res) => {
  try {
    const { name, descriptionHTML, descriptionMarkdown } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const specialty = await Specialty.create({ name, image, descriptionHTML, descriptionMarkdown });
    return res.status(201).json({ errCode: 0, data: specialty });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const updateSpecialty = async (req, res) => {
  try {
    const specialty = await Specialty.findByPk(req.params.id);
    if (!specialty) return res.status(404).json({ errCode: 1, message: 'Not found' });
    const image = req.file ? `/uploads/${req.file.filename}` : specialty.image;
    await specialty.update({ ...req.body, image });
    return res.json({ errCode: 0, data: specialty });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const deleteSpecialty = async (req, res) => {
  try {
    await Specialty.destroy({ where: { id: req.params.id } });
    return res.json({ errCode: 0, message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// === CLINIC ===
const getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.findAll({ order: [['name', 'ASC']] });
    return res.json({ errCode: 0, data: clinics });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const getClinicById = async (req, res) => {
  try {
    const clinic = await Clinic.findByPk(req.params.id, {
      include: [{
        model: Doctor, as: 'doctors',
        include: [{ model: User, as: 'userData', where: { isActive: true }, attributes: { exclude: ['password'] } }]
      }]
    });
    if (!clinic) return res.status(404).json({ errCode: 1, message: 'Not found' });
    return res.json({ errCode: 0, data: clinic });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const createClinic = async (req, res) => {
  try {
    const { name, address, descriptionHTML, descriptionMarkdown } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const clinic = await Clinic.create({ name, address, image, descriptionHTML, descriptionMarkdown });
    return res.status(201).json({ errCode: 0, data: clinic });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const updateClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findByPk(req.params.id);
    if (!clinic) return res.status(404).json({ errCode: 1, message: 'Not found' });
    const image = req.file ? `/uploads/${req.file.filename}` : clinic.image;
    await clinic.update({ ...req.body, image });
    return res.json({ errCode: 0, data: clinic });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

const deleteClinic = async (req, res) => {
  try {
    await Clinic.destroy({ where: { id: req.params.id } });
    return res.json({ errCode: 0, message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

module.exports = {
  getAllSpecialties, getSpecialtyById, createSpecialty, updateSpecialty, deleteSpecialty,
  getAllClinics, getClinicById, createClinic, updateClinic, deleteClinic
};
