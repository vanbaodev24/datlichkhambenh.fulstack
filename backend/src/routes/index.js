const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  verifyToken,
  isAdmin,
  isDoctor,
  isConsultant,
} = require("../middleware/auth");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Controllers
const authCtrl = require("../controllers/authController");
const userCtrl = require("../controllers/userController");
const doctorCtrl = require("../controllers/doctorController");
const bookingCtrl = require("../controllers/bookingController");
const spClinicCtrl = require("../controllers/specialtyClinicController");
const medicalResultCtrl = require("../controllers/medicalResultController");
const patientCtrl = require("../controllers/patientController");
// === AUTH ===
router.post("/auth/register", authCtrl.register);
router.post("/auth/login", authCtrl.login);
router.get("/auth/profile", verifyToken, authCtrl.getProfile);

// === ALLCODES ===
router.get("/allcodes", userCtrl.getAllcodes);

// === USERS (Admin) ===
router.get("/users", verifyToken, isAdmin, userCtrl.getAllUsers);
router.get("/users/:id", verifyToken, userCtrl.getUserById);
router.post(
  "/users",
  verifyToken,
  isAdmin,
  upload.single("avatar"),
  userCtrl.createUser,
);
router.put(
  "/users/:id",
  verifyToken,
  upload.single("avatar"),
  userCtrl.updateUser,
);
router.delete("/users/:id", verifyToken, isAdmin, userCtrl.deleteUser);

// === DOCTORS ===

router.get("/doctors/top", doctorCtrl.getTopDoctors);
router.get("/doctors/schedule", doctorCtrl.getDoctorSchedule);
router.post(
  "/doctors/schedule",
  verifyToken,
  isDoctor,
  doctorCtrl.createSchedule,
);
router.post("/doctors/info", verifyToken, isAdmin, doctorCtrl.upsertDoctorInfo);
router.get("/doctors", doctorCtrl.getAllDoctors);
router.get("/doctors/:id", doctorCtrl.getDoctorById);

// === BOOKINGS ===
router.post("/bookings", bookingCtrl.createBooking);
router.get("/bookings/patient", verifyToken, bookingCtrl.getPatientBookings);
router.get(
  "/bookings/doctor",
  verifyToken,
  isDoctor,
  bookingCtrl.getDoctorBookings,
);
router.get("/bookings", verifyToken, isAdmin, bookingCtrl.getAllBookings);
router.put(
  "/bookings/:id/status",
  verifyToken,
  isDoctor,
  bookingCtrl.updateBookingStatus,
);

// === SPECIALTIES ===
router.get("/specialties", spClinicCtrl.getAllSpecialties);
router.get("/specialties/:id", spClinicCtrl.getSpecialtyById);
router.post(
  "/specialties",
  verifyToken,
  isAdmin,
  upload.single("image"),
  spClinicCtrl.createSpecialty,
);
router.put(
  "/specialties/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  spClinicCtrl.updateSpecialty,
);
router.delete(
  "/specialties/:id",
  verifyToken,
  isAdmin,
  spClinicCtrl.deleteSpecialty,
);

// === CLINICS ===
router.get("/clinics", spClinicCtrl.getAllClinics);
router.get("/clinics/:id", spClinicCtrl.getClinicById);
router.post(
  "/clinics",
  verifyToken,
  isAdmin,
  upload.single("image"),
  spClinicCtrl.createClinic,
);
router.put(
  "/clinics/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  spClinicCtrl.updateClinic,
);
router.delete("/clinics/:id", verifyToken, isAdmin, spClinicCtrl.deleteClinic);
// === MEDICAL RESULTS ===
router.post(
  "/medical-results",
  verifyToken,
  isDoctor,
  medicalResultCtrl.createResult,
);
router.get(
  "/medical-results/booking/:bookingId",
  verifyToken,
  medicalResultCtrl.getResultByBooking,
);
router.get("/medical-results/my", verifyToken, medicalResultCtrl.getMyResults);
router.get("/medical-results/:id", verifyToken, medicalResultCtrl.getById);
// === EXAMINATION RECORDS ===
const examinationCtrl = require("../controllers/examinationController");
router.post(
  "/examinations",
  verifyToken,
  isDoctor,
  examinationCtrl.upsertExamination,
);
router.get(
  "/examinations/booking/:bookingId",
  verifyToken,
  examinationCtrl.getByBooking,
);
router.get(
  "/examinations/doctor",
  verifyToken,
  isDoctor,
  examinationCtrl.getDoctorExaminations,
);
router.get(
  "/examinations/patient",
  verifyToken,
  examinationCtrl.getPatientExaminations,
);
router.get(
  "/examinations",
  verifyToken,
  isAdmin,
  examinationCtrl.getAllExaminations,
);

// === CONSULTATION RECORDS ===
const consultationCtrl = require("../controllers/consultationController");
router.post(
  "/consultations",
  verifyToken,
  isConsultant,
  consultationCtrl.createConsultation,
);
router.get(
  "/consultations/booking/:bookingId",
  verifyToken,
  consultationCtrl.getByBooking,
);
router.get(
  "/consultations/my",
  verifyToken,
  isConsultant,
  consultationCtrl.getMyConsultations,
);
router.put(
  "/consultations/:id/status",
  verifyToken,
  isConsultant,
  consultationCtrl.updateStatus,
);
router.get(
  "/consultations",
  verifyToken,
  isAdmin,
  consultationCtrl.getAllConsultations,
);

// === PATIENT PROFILE ===
router.get("/patient/profile", verifyToken, patientCtrl.getFullProfile);
router.put("/patient/profile", verifyToken, patientCtrl.updateProfile);
router.get(
  "/patient/medical-history",
  verifyToken,
  patientCtrl.getMedicalHistory,
);
router.post(
  "/patient/medical-history",
  verifyToken,
  patientCtrl.addMedicalHistory,
);
router.delete(
  "/patient/medical-history/:id",
  verifyToken,
  patientCtrl.deleteMedicalHistory,
);

module.exports = router;
