const User = require("./User");
const MedicalResult = require("./MedicalResult");
const MedicalHistory = require("./MedicalHistory");
const ExaminationRecord = require("./ExaminationRecord");
const ConsultationRecord = require("./ConsultationRecord");
const Prescription = require("./Prescription");
const PrescriptionItem = require("./PrescriptionItem");
const Notification = require("./Notification");
const Doctor = require("./Doctor");
const Specialty = require("./Specialty");
const Clinic = require("./Clinic");
const Schedule = require("./Schedule");
const Booking = require("./Booking");
const Allcode = require("./Allcode");

// ============================================================
// ASSOCIATIONS — all with constraints: false
// This prevents Sequelize from generating FOREIGN KEY clauses
// in CREATE TABLE SQL, avoiding MySQL errno 150 errors when
// referencing VARCHAR keyMap columns in allcodes.
// Joins still work perfectly for all queries.
// ============================================================
const FK = { foreignKeyConstraint: false, constraints: false };

// User <-> Doctor
Doctor.belongsTo(User, { foreignKey: "userId", as: "userData", ...FK });
User.hasOne(Doctor, { foreignKey: "userId", as: "doctorData", ...FK });

// Doctor <-> Specialty
Doctor.belongsTo(Specialty, {
  foreignKey: "specialtyId",
  as: "specialtyData",
  ...FK,
});
Specialty.hasMany(Doctor, { foreignKey: "specialtyId", as: "doctors", ...FK });

// Doctor <-> Clinic
Doctor.belongsTo(Clinic, { foreignKey: "clinicId", as: "clinicData", ...FK });
Clinic.hasMany(Doctor, { foreignKey: "clinicId", as: "doctors", ...FK });

// Schedule <-> Doctor
Schedule.belongsTo(Doctor, { foreignKey: "doctorId", as: "doctorData", ...FK });

// Schedule <-> Allcode (timeType -> keyMap)
Schedule.belongsTo(Allcode, {
  foreignKey: "timeType",
  targetKey: "keyMap",
  as: "timeTypeData",
  ...FK,
});

// Booking <-> User / Doctor / Allcode
Booking.belongsTo(User, { foreignKey: "patientId", as: "patientData", ...FK });
Booking.belongsTo(Doctor, { foreignKey: "doctorId", as: "doctorData", ...FK });
Booking.belongsTo(Allcode, {
  foreignKey: "statusId",
  targetKey: "keyMap",
  as: "statusData",
  ...FK,
});
Booking.belongsTo(Allcode, {
  foreignKey: "timeType",
  targetKey: "keyMap",
  as: "timeTypeData",
  ...FK,
});

// Doctor <-> Allcode (price / payment / province)
Doctor.belongsTo(Allcode, {
  foreignKey: "priceId",
  targetKey: "keyMap",
  as: "priceData",
  ...FK,
});
Doctor.belongsTo(Allcode, {
  foreignKey: "paymentId",
  targetKey: "keyMap",
  as: "paymentData",
  ...FK,
});
Doctor.belongsTo(Allcode, {
  foreignKey: "provinceId",
  targetKey: "keyMap",
  as: "provinceData",
  ...FK,
});

// User <-> Allcode (position)
User.belongsTo(Allcode, {
  foreignKey: "positionId",
  targetKey: "keyMap",
  as: "positionData",
  ...FK,
});

MedicalResult.belongsTo(Booking, {
  foreignKey: "bookingId",
  as: "bookingData",
  ...FK,
});
MedicalResult.belongsTo(Doctor, {
  foreignKey: "doctorId",
  as: "doctorData",
  ...FK,
});

MedicalHistory.belongsTo(User, {
  foreignKey: "patientId",
  as: "patientData",
  ...FK,
});
User.hasMany(MedicalHistory, {
  foreignKey: "patientId",
  as: "medicalHistories",
  ...FK,
});

ExaminationRecord.belongsTo(Booking, {
  foreignKey: "bookingId",
  as: "bookingData",
  ...FK,
});
ExaminationRecord.belongsTo(Doctor, {
  foreignKey: "doctorId",
  as: "doctorData",
  ...FK,
});
ExaminationRecord.belongsTo(User, {
  foreignKey: "patientId",
  as: "patientData",
  ...FK,
});
ExaminationRecord.belongsTo(MedicalResult, {
  foreignKey: "medicalResultId",
  as: "medicalResultData",
  ...FK,
});
Booking.hasOne(ExaminationRecord, {
  foreignKey: "bookingId",
  as: "examinationRecord",
  ...FK,
});

ConsultationRecord.belongsTo(Booking, {
  foreignKey: "bookingId",
  as: "bookingData",
  ...FK,
});
ConsultationRecord.belongsTo(User, {
  foreignKey: "consultantId",
  as: "consultantData",
  ...FK,
});
ConsultationRecord.belongsTo(Doctor, {
  foreignKey: "doctorId",
  as: "doctorData",
  ...FK,
});
Booking.hasOne(ConsultationRecord, {
  foreignKey: "bookingId",
  as: "consultationRecord",
  ...FK,
});

Prescription.belongsTo(Booking, {
  foreignKey: "bookingId",
  as: "bookingData",
  ...FK,
});
Prescription.belongsTo(Doctor, {
  foreignKey: "doctorId",
  as: "doctorData",
  ...FK,
});
Prescription.belongsTo(User, {
  foreignKey: "patientId",
  as: "patientData",
  ...FK,
});
Prescription.hasMany(PrescriptionItem, {
  foreignKey: "prescriptionId",
  as: "items",
  ...FK,
});
PrescriptionItem.belongsTo(Prescription, {
  foreignKey: "prescriptionId",
  as: "prescription",
  ...FK,
});
Booking.hasOne(Prescription, {
  foreignKey: "bookingId",
  as: "prescription",
  ...FK,
});
Notification.belongsTo(User, { foreignKey: "userId", as: "receiver", ...FK });
Notification.belongsTo(User, { foreignKey: "senderId", as: "sender", ...FK });
User.hasMany(Notification, {
  foreignKey: "userId",
  as: "notifications",
  ...FK,
});
module.exports = {
  User,
  Doctor,
  Specialty,
  Clinic,
  Schedule,
  Booking,
  Allcode,
  MedicalResult,
  MedicalHistory,
  ExaminationRecord,
  ConsultationRecord,
  Prescription,
  PrescriptionItem,
  Notification,
};
