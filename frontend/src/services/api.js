import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    const message =
      err.response?.data?.message || err.message || "Lỗi kết nối máy chủ";
    return Promise.reject(new Error(message));
  },
);

// Auth
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getProfile: () => api.get("/auth/profile"),
};

// Doctors
export const doctorAPI = {
  getAll: (params) => api.get("/doctors", { params }),
  getTop: () => api.get("/doctors/top"),
  getById: (id) => api.get(`/doctors/${id}`),
  getSchedule: (doctorId, date) =>
    api.get("/doctors/schedule", { params: { doctorId, date } }),
  createSchedule: (data) => api.post("/doctors/schedule", data),
  upsertInfo: (data) => api.post("/doctors/info", data),
};

// Bookings
export const bookingAPI = {
  create: (data) => api.post("/bookings", data),
  getPatient: () => api.get("/bookings/patient"),
  getDoctor: (date) => api.get("/bookings/doctor", { params: { date } }),
  getAll: (params) => api.get("/bookings", { params }),
  updateStatus: (id, statusId) =>
    api.put(`/bookings/${id}/status`, { statusId }),
};

// Specialties
export const specialtyAPI = {
  getAll: () => api.get("/specialties"),
  getById: (id) => api.get(`/specialties/${id}`),
  create: (data) => api.post("/specialties", data),
  update: (id, data) => api.put(`/specialties/${id}`, data),
  delete: (id) => api.delete(`/specialties/${id}`),
};

// Clinics
export const clinicAPI = {
  getAll: () => api.get("/clinics"),
  getById: (id) => api.get(`/clinics/${id}`),
  create: (data) => api.post("/clinics", data),
  update: (id, data) => api.put(`/clinics/${id}`, data),
  delete: (id) => api.delete(`/clinics/${id}`),
};

// Users
export const userAPI = {
  getAll: (params) => api.get("/users", { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Allcodes
export const allcodeAPI = {
  getByType: (type) => api.get("/allcodes", { params: { type } }),
};

export const consultationAPI = {
  create: (data) => api.post("/consultations", data),
  getByBooking: (bookingId) => api.get(`/consultations/booking/${bookingId}`),
  getMy: (params) => api.get("/consultations/my", { params }),
  updateStatus: (id, status) =>
    api.put(`/consultations/${id}/status`, { status }),
  getAll: (params) => api.get("/consultations", { params }),
};

export const examinationAPI = {
  upsert: (data) => api.post("/examinations", data),
  getByBooking: (bookingId) => api.get(`/examinations/booking/${bookingId}`),
  getDoctor: (params) => api.get("/examinations/doctor", { params }),
  getPatient: () => api.get("/examinations/patient"),
  getAll: (params) => api.get("/examinations", { params }),
};
export const patientAPI = {
  getProfile: () => api.get("/patient/profile"),
  updateProfile: (data) => api.put("/patient/profile", data),
  getMedicalHistory: () => api.get("/patient/medical-history"),
  addMedicalHistory: (data) => api.post("/patient/medical-history", data),
  deleteMedicalHistory: (id) => api.delete(`/patient/medical-history/${id}`),
};
export const medicalResultAPI = {
  create: (data) => api.post("/medical-results", data),
  getByBooking: (bookingId) => api.get(`/medical-results/booking/${bookingId}`),
  getMyResults: () => api.get("/medical-results/my"),
  getById: (id) => api.get(`/medical-results/${id}`),
};
export default api;
