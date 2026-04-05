import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { bookingAPI, examinationAPI } from "../services/api";

const STATUS = {
  S1: { label: "Mới đặt", color: "#f39c12" },
  S2: { label: "Đã xác nhận", color: "#3498db" },
  S3: { label: "Đã khám", color: "#2ecc71" },
  S4: { label: "Đã hủy", color: "#e74c3c" },
};

const DoctorDashboard = () => {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD"),
  );
  const [filterStatus, setFilterStatus] = useState("");
  const [showExamModal, setShowExamModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [examForm, setExamForm] = useState({
    chiefComplaint: "",
    clinicalExam: "",
    diagnosis: "",
    treatmentPlan: "",
    followUpDate: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    weight: "",
    height: "",
    status: "done",
    note: "",
  });
  const [examLoading, setExamLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "doctor") {
      navigate("/");
      return;
    }
    fetchBookings();
  }, [user, selectedDate]);

  const fetchBookings = () => {
    setLoading(true);
    bookingAPI
      .getDoctor(selectedDate)
      .then((r) => setBookings(r.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  const handleOpenExam = async (booking) => {
    setSelectedBooking(booking);
    try {
      const r = await examinationAPI.getByBooking(booking.id);
      if (r.data) {
        setExamForm({
          chiefComplaint: r.data.chiefComplaint || "",
          clinicalExam: r.data.clinicalExam || "",
          diagnosis: r.data.diagnosis || "",
          treatmentPlan: r.data.treatmentPlan || "",
          followUpDate: r.data.followUpDate || "",
          bloodPressure: r.data.bloodPressure || "",
          heartRate: r.data.heartRate || "",
          temperature: r.data.temperature || "",
          weight: r.data.weight || "",
          height: r.data.height || "",
          status: r.data.status || "done",
          note: r.data.note || "",
        });
      } else {
        setExamForm({
          chiefComplaint: "",
          clinicalExam: "",
          diagnosis: "",
          treatmentPlan: "",
          followUpDate: "",
          bloodPressure: "",
          heartRate: "",
          temperature: "",
          weight: "",
          height: "",
          status: "done",
          note: "",
        });
      }
    } catch {}
    setShowExamModal(true);
  };

  const handleSaveExam = async (e) => {
    e.preventDefault();
    setExamLoading(true);
    try {
      await examinationAPI.upsert({
        bookingId: selectedBooking.id,
        ...examForm,
      });
      toast.success("Lưu phiếu khám thành công!");
      setShowExamModal(false);
      fetchBookings();
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
    setExamLoading(false);
  };

  const handleUpdateStatus = async (id, statusId) => {
    try {
      await bookingAPI.updateStatus(id, statusId);
      toast.success("Cập nhật thành công!");
      fetchBookings();
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const filtered = filterStatus
    ? bookings.filter((b) => b.statusId === filterStatus)
    : bookings;
  const stats = {
    total: bookings.length,
    new: bookings.filter((b) => b.statusId === "S1").length,
    confirmed: bookings.filter((b) => b.statusId === "S2").length,
    done: bookings.filter((b) => b.statusId === "S3").length,
  };

  return (
    <div
      style={{ minHeight: "calc(100vh - 68px)", background: "var(--bg-light)" }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0d2137, #1a3a52)",
          padding: "32px 0",
        }}
      >
        <div className="container">
          <h1 style={{ color: "#fff", fontSize: "1.6rem", fontWeight: 800 }}>
            🩺 Dashboard Bác sĩ
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>
            Xin chào, {user?.lastName} {user?.firstName}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: "32px 20px" }}>
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {[
            {
              label: "Tổng lịch hẹn",
              value: stats.total,
              color: "#3498db",
              icon: "📅",
            },
            {
              label: "Mới đặt",
              value: stats.new,
              color: "#f39c12",
              icon: "🆕",
            },
            {
              label: "Đã xác nhận",
              value: stats.confirmed,
              color: "#9b59b6",
              icon: "✅",
            },
            {
              label: "Đã khám",
              value: stats.done,
              color: "#2ecc71",
              icon: "🏥",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="card"
              style={{ padding: 20, borderTop: `4px solid ${s.color}` }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>
                {s.icon}
              </div>
              <div
                style={{ fontSize: "2rem", fontWeight: 800, color: s.color }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-medium)",
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div
          className="card"
          style={{
            padding: 20,
            marginBottom: 20,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                marginRight: 8,
                color: "var(--text-medium)",
              }}
            >
              📅 Ngày khám:
            </label>
            <input
              type="date"
              className="form-control"
              style={{ width: "auto", display: "inline-block" }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                marginRight: 8,
                color: "var(--text-medium)",
              }}
            >
              Trạng thái:
            </label>
            <select
              className="form-control"
              style={{ width: "auto", display: "inline-block" }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả</option>
              {Object.entries(STATUS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          <span
            style={{
              fontSize: "0.85rem",
              color: "var(--text-medium)",
              marginLeft: "auto",
            }}
          >
            {filtered.length} lịch hẹn
          </span>
        </div>

        {/* Booking list */}
        {loading ? (
          <div className="spinner" />
        ) : filtered.length === 0 ? (
          <div
            className="card"
            style={{ padding: "60px 20px", textAlign: "center" }}
          >
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>📭</div>
            <h3 style={{ marginBottom: 8 }}>Không có lịch hẹn nào</h3>
            <p style={{ color: "var(--text-medium)" }}>
              Chưa có bệnh nhân đặt lịch vào ngày{" "}
              {moment(selectedDate).format("DD/MM/YYYY")}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((b) => (
              <div
                key={b.id}
                className="card"
                style={{
                  padding: 20,
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: 16,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "var(--primary)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                    }}
                  >
                    {b.patientName?.charAt(0) || "?"}
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 4,
                      }}
                    >
                      <strong style={{ fontSize: "1rem" }}>
                        {b.patientName}
                      </strong>
                      <span
                        className="badge"
                        style={{
                          background: STATUS[b.statusId]?.color + "22",
                          color: STATUS[b.statusId]?.color,
                          fontWeight: 700,
                        }}
                      >
                        {STATUS[b.statusId]?.label}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        fontSize: "0.83rem",
                        color: "var(--text-medium)",
                        flexWrap: "wrap",
                      }}
                    >
                      <span>📞 {b.patientPhone}</span>
                      {b.patientEmail && <span>✉️ {b.patientEmail}</span>}
                      <span>⏰ {b.timeTypeData?.valueVi}</span>
                      {b.patientGender && (
                        <span>
                          {b.patientGender === "M" ? "👨 Nam" : "👩 Nữ"}
                        </span>
                      )}
                    </div>
                    {b.patientReason && (
                      <p
                        style={{
                          marginTop: 6,
                          fontSize: "0.82rem",
                          color: "var(--text-medium)",
                          background: "var(--bg-light)",
                          padding: "6px 10px",
                          borderRadius: 6,
                        }}
                      >
                        📋 {b.patientReason}
                      </p>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    minWidth: 160,
                  }}
                >
                  <Link
                    to={`/medical-result/${b.id}`}
                    className="btn btn-outline btn-sm"
                    style={{ textAlign: "center" }}
                  >
                    📋 Nhập KQ
                  </Link>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ textAlign: "center" }}
                    onClick={() => handleOpenExam(b)}
                  >
                    📝 Phiếu khám
                  </button>
                  <select
                    className="form-control"
                    style={{ fontSize: "0.82rem", padding: "6px 10px" }}
                    value={b.statusId}
                    onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                  >
                    {Object.entries(STATUS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal phiếu khám */}
      {showExamModal && selectedBooking && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget && setShowExamModal(false)
          }
        >
          <div className="modal-box" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <h3>📝 Phiếu khám — {selectedBooking.patientName}</h3>
              <button
                className="modal-close"
                onClick={() => setShowExamModal(false)}
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={handleSaveExam}
              style={{
                padding: "20px 24px",
                maxHeight: "70vh",
                overflowY: "auto",
              }}
            >
              {/* Chỉ số sinh tồn */}
              <h4
                style={{
                  marginBottom: 14,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                }}
              >
                💓 Chỉ số sinh tồn
              </h4>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Huyết áp (mmHg)</label>
                  <input
                    className="form-control"
                    value={examForm.bloodPressure}
                    onChange={(e) =>
                      setExamForm((f) => ({
                        ...f,
                        bloodPressure: e.target.value,
                      }))
                    }
                    placeholder="VD: 120/80"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nhịp tim (lần/phút)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={examForm.heartRate}
                    onChange={(e) =>
                      setExamForm((f) => ({ ...f, heartRate: e.target.value }))
                    }
                    placeholder="VD: 72"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nhiệt độ (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={examForm.temperature}
                    onChange={(e) =>
                      setExamForm((f) => ({
                        ...f,
                        temperature: e.target.value,
                      }))
                    }
                    placeholder="VD: 37.0"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cân nặng (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={examForm.weight}
                    onChange={(e) =>
                      setExamForm((f) => ({ ...f, weight: e.target.value }))
                    }
                    placeholder="VD: 65"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Chiều cao (cm)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={examForm.height}
                    onChange={(e) =>
                      setExamForm((f) => ({ ...f, height: e.target.value }))
                    }
                    placeholder="VD: 170"
                  />
                </div>
              </div>

              {/* Nội dung khám */}
              <h4
                style={{
                  marginBottom: 14,
                  marginTop: 8,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                }}
              >
                🩺 Nội dung khám
              </h4>
              <div className="form-group">
                <label className="form-label">Lý do khám chính</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={examForm.chiefComplaint}
                  onChange={(e) =>
                    setExamForm((f) => ({
                      ...f,
                      chiefComplaint: e.target.value,
                    }))
                  }
                  placeholder="Bệnh nhân đến khám vì..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Khám lâm sàng</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={examForm.clinicalExam}
                  onChange={(e) =>
                    setExamForm((f) => ({ ...f, clinicalExam: e.target.value }))
                  }
                  placeholder="Kết quả khám lâm sàng..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Chẩn đoán</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={examForm.diagnosis}
                  onChange={(e) =>
                    setExamForm((f) => ({ ...f, diagnosis: e.target.value }))
                  }
                  placeholder="Chẩn đoán bệnh..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Kế hoạch điều trị</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={examForm.treatmentPlan}
                  onChange={(e) =>
                    setExamForm((f) => ({
                      ...f,
                      treatmentPlan: e.target.value,
                    }))
                  }
                  placeholder="Phác đồ điều trị, thuốc..."
                />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Ngày tái khám</label>
                  <input
                    type="date"
                    className="form-control"
                    value={examForm.followUpDate}
                    onChange={(e) =>
                      setExamForm((f) => ({
                        ...f,
                        followUpDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Trạng thái</label>
                  <select
                    className="form-control"
                    value={examForm.status}
                    onChange={(e) =>
                      setExamForm((f) => ({ ...f, status: e.target.value }))
                    }
                  >
                    <option value="examining">Đang khám</option>
                    <option value="done">Đã hoàn thành</option>
                    <option value="transferred">Chuyển viện</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Ghi chú</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={examForm.note}
                  onChange={(e) =>
                    setExamForm((f) => ({ ...f, note: e.target.value }))
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowExamModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={examLoading}
                >
                  {examLoading ? "Đang lưu..." : "💾 Lưu phiếu khám"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
