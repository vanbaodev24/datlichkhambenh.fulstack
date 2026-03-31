import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import { doctorAPI, bookingAPI } from "../services/api";
import "./DoctorDetail.css";

const timeSlots = [
  { key: "T1", label: "8:00 - 8:30" },
  { key: "T2", label: "8:30 - 9:00" },
  { key: "T3", label: "9:00 - 9:30" },
  { key: "T4", label: "9:30 - 10:00" },
  { key: "T5", label: "10:00 - 10:30" },
  { key: "T6", label: "10:30 - 11:00" },
  { key: "T7", label: "14:00 - 14:30" },
  { key: "T8", label: "14:30 - 15:00" },
];

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD"),
  );
  const [selectedTime, setSelectedTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [form, setForm] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    patientGender: "M",
    patientAddress: "",
    patientReason: "",
  });

  useEffect(() => {
    doctorAPI
      .getById(id)
      .then((r) => {
        setDoctor(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (doctor) {
      doctorAPI
        .getSchedule(doctor.id, selectedDate)
        .then((r) => setSchedules(r.data || []))
        .catch(() => setSchedules([]));
    }
  }, [doctor, selectedDate]);

  useEffect(() => {
    if (user)
      setForm((f) => ({
        ...f,
        patientName: `${user.lastName} ${user.firstName}`,
        patientPhone: user.phone || "",
        patientEmail: user.email || "",
      }));
  }, [user]);

  const getNext7Days = () =>
    Array.from({ length: 7 }, (_, i) => moment().add(i, "days"));

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedTime) return toast.error("Vui lòng chọn giờ khám");
    if (!form.patientName || !form.patientPhone)
      return toast.error("Vui lòng điền đầy đủ thông tin");

    setBookingLoading(true);
    try {
      const res = await bookingAPI.create({
        doctorId: doctor.id,
        date: selectedDate,
        timeType: selectedTime,
        patientId: user?.id,
        ...form,
      });
      if (res.errCode === 0) {
        toast.success("Đặt lịch thành công! 🎉");
        setShowModal(false);
        setSelectedTime("");
      }
    } catch (err) {
      toast.error(err.message || "Đặt lịch thất bại");
    }
    setBookingLoading(false);
  };

  const getScheduleForTime = (timeKey) =>
    schedules.find((s) => s.timeType === timeKey);

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (!doctor)
    return (
      <div
        className="container"
        style={{ textAlign: "center", padding: "80px 20px" }}
      >
        <h2>Không tìm thấy bác sĩ</h2>
      </div>
    );

  const u = doctor.userData;

  return (
    <div className="doctor-detail">
      {/* Profile banner */}
      <div className="dd-banner">
        <div className="container">
          <div className="dd-profile">
            <div className="dd-avatar">
              {u?.avatar ? (
                <img src={`http://localhost:8080${u.avatar}`} alt="" />
              ) : (
                <span>{u?.firstName?.charAt(0)}</span>
              )}
            </div>
            <div className="dd-info">
              <div className="dd-position">
                {u?.positionData?.valueVi || "Bác sĩ"}
              </div>
              <h1>
                {u?.lastName} {u?.firstName}
              </h1>
              <p className="dd-specialty">🏥 {doctor.specialtyData?.name}</p>
              {doctor.nameClinic && (
                <p className="dd-clinic">📍 {doctor.nameClinic}</p>
              )}
              <div className="dd-tags">
                {doctor.priceData && (
                  <span className="badge badge-primary">
                    💰 {doctor.priceData.valueVi}
                  </span>
                )}
                {doctor.paymentData && (
                  <span className="badge badge-secondary">
                    💳 {doctor.paymentData.valueVi}
                  </span>
                )}
                {doctor.provinceData && (
                  <span className="badge badge-secondary">
                    🗺️ {doctor.provinceData.valueVi}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container dd-body">
        <div className="dd-layout">
          {/* Left: Info */}
          <div className="dd-left">
            {doctor.description && doctor.description.trim() && (
              <div className="dd-section card">
                <h2>Giới thiệu</h2>
                <p>{doctor.description}</p>
              </div>
            )}
            {doctor.contentHTML && doctor.contentHTML.trim() && (
              <div className="dd-section card">
                <h2>Thông tin chi tiết</h2>
                <div
                  className="dd-content"
                  dangerouslySetInnerHTML={{ __html: doctor.contentHTML }}
                />
              </div>
            )}
            {doctor.clinicData && (
              <div className="dd-section card">
                <h2>Cơ sở khám</h2>
                <div className="clinic-info-box">
                  <strong>🏥 {doctor.clinicData.name}</strong>
                  <p>📍 {doctor.clinicData.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking */}
          <div className="dd-right">
            <div className="booking-card card">
              <h3>📅 Đặt lịch khám</h3>

              {/* Date picker */}
              <div className="date-scroll">
                {getNext7Days().map((d) => (
                  <button
                    key={d.format("YYYY-MM-DD")}
                    className={`date-btn ${selectedDate === d.format("YYYY-MM-DD") ? "active" : ""}`}
                    onClick={() => {
                      setSelectedDate(d.format("YYYY-MM-DD"));
                      setSelectedTime("");
                    }}
                  >
                    <span className="date-weekday">{d.format("ddd")}</span>
                    <span className="date-num">{d.format("DD")}</span>
                    <span className="date-month">{d.format("MM")}</span>
                  </button>
                ))}
              </div>

              {/* Time slots */}
              <div className="time-grid">
                {timeSlots.map((slot) => {
                  const sch = getScheduleForTime(slot.key);
                  const available = sch && sch.currentNumber < sch.maxNumber;
                  const full = sch && sch.currentNumber >= sch.maxNumber;
                  return (
                    <button
                      key={slot.key}
                      className={`time-btn ${selectedTime === slot.key ? "active" : ""} ${full ? "full" : ""} ${!sch ? "no-schedule" : ""}`}
                      disabled={!sch || full}
                      onClick={() => setSelectedTime(slot.key)}
                    >
                      {slot.label}
                      {full && <span className="time-full">Hết</span>}
                      {sch && !full && (
                        <span className="time-slots-left">
                          {sch.maxNumber - sch.currentNumber} chỗ
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {schedules.length === 0 && (
                <p className="no-schedule-msg">
                  ⚠️ Không có lịch khám vào ngày này
                </p>
              )}

              <div className="booking-price-row">
                <span>Phí khám:</span>
                <strong>{doctor.priceData?.valueVi || "Liên hệ"}</strong>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                disabled={!selectedTime}
                onClick={() => {
                  if (!user) {
                    navigate("/login");
                    return;
                  }
                  setShowModal(true);
                }}
              >
                {selectedTime
                  ? `Đặt lịch ${selectedTime ? timeSlots.find((t) => t.key === selectedTime)?.label : ""}`
                  : "Chọn giờ khám"}
              </button>

              {!user && (
                <p
                  style={{
                    fontSize: "0.82rem",
                    textAlign: "center",
                    marginTop: 10,
                    color: "var(--text-medium)",
                  }}
                >
                  <a
                    href="/login"
                    style={{ color: "var(--primary)", fontWeight: 600 }}
                  >
                    Đăng nhập
                  </a>{" "}
                  để đặt lịch
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="modal-box">
            <div className="modal-header">
              <h3>Xác nhận đặt lịch</h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-summary">
              <p>
                👨‍⚕️{" "}
                <strong>
                  {u?.positionData?.valueVi} {u?.lastName} {u?.firstName}
                </strong>
              </p>
              <p>
                📅 {moment(selectedDate).format("dddd, DD/MM/YYYY")} | ⏰{" "}
                {timeSlots.find((t) => t.key === selectedTime)?.label}
              </p>
            </div>
            <form onSubmit={handleBook}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Họ và tên *</label>
                  <input
                    className="form-control"
                    value={form.patientName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, patientName: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Số điện thoại *</label>
                  <input
                    className="form-control"
                    value={form.patientPhone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, patientPhone: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    value={form.patientEmail}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, patientEmail: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Giới tính</label>
                  <select
                    className="form-control"
                    value={form.patientGender}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, patientGender: e.target.value }))
                    }
                  >
                    <option value="M">Nam</option>
                    <option value="F">Nữ</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Địa chỉ</label>
                <input
                  className="form-control"
                  value={form.patientAddress}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, patientAddress: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Lý do khám</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.patientReason}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, patientReason: e.target.value }))
                  }
                  placeholder="Mô tả triệu chứng..."
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? "Đang xử lý..." : "✅ Xác nhận đặt lịch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDetail;
