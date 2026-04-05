import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { bookingAPI, doctorAPI, consultationAPI } from "../services/api";

const STATUS_BOOKING = {
  S1: { label: "Mới đặt", color: "#f39c12", bg: "#fff3cd" },
  S2: { label: "Đã xác nhận", color: "#3498db", bg: "#d1ecf1" },
  S3: { label: "Đã khám", color: "#2ecc71", bg: "#d4edda" },
  S4: { label: "Đã hủy", color: "#e74c3c", bg: "#f8d7da" },
};

const PRIORITY = {
  normal: { label: "Bình thường", color: "#3498db" },
  urgent: { label: "Khẩn", color: "#f39c12" },
  emergency: { label: "Cấp cứu", color: "#e74c3c" },
};

const ConsultantDashboard = () => {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings");
  const [selectedDate, setSelectedDate] = useState("");

  // Modal chỉ định bác sĩ
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [assignForm, setAssignForm] = useState({
    doctorId: "",
    reason: "",
    symptoms: "",
    priority: "normal",
    note: "",
  });
  const [assignLoading, setAssignLoading] = useState(false);

  // Modal tạo phiếu khám mới
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    doctorId: "",
    date: moment().format("YYYY-MM-DD"),
    timeType: "T1",
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    patientGender: "M",
    patientAddress: "",
    patientReason: "",
  });
  const [createLoading, setCreateLoading] = useState(false);

  const TIME_LABELS = {
    T1: "8:00-8:30",
    T2: "8:30-9:00",
    T3: "9:00-9:30",
    T4: "9:30-10:00",
    T5: "10:00-10:30",
    T6: "10:30-11:00",
    T7: "14:00-14:30",
    T8: "14:30-15:00",
  };

  useEffect(() => {
    if (!user || !["admin", "consultant"].includes(user.role)) {
      navigate("/");
      return;
    }
    fetchAll();
    doctorAPI.getAll({ limit: 100 }).then((r) => setDoctors(r.data || []));
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [selectedDate]);

  useEffect(() => {
    if (activeTab === "consultations") fetchConsultations();
  }, [activeTab]);

  const fetchAll = () => {
    setLoading(true);
    const params = {};
    if (selectedDate) params.date = selectedDate;
    bookingAPI
      .getAll(params)
      .then((r) => setBookings(r.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  const fetchConsultations = () => {
    consultationAPI
      .getMy()
      .then((r) => setConsultations(r.data || []))
      .catch(() => setConsultations([]));
  };

  const handleUpdateBookingStatus = async (id, statusId) => {
    try {
      await bookingAPI.updateStatus(id, statusId);
      toast.success("Cập nhật trạng thái thành công!");
      fetchAll();
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const handleOpenAssign = async (booking) => {
    setSelectedBooking(booking);
    // Load existing consultation nếu có
    try {
      const r = await consultationAPI.getByBooking(booking.id);
      if (r.data) {
        setAssignForm({
          doctorId: r.data.doctorId || "",
          reason: r.data.reason || "",
          symptoms: r.data.symptoms || "",
          priority: r.data.priority || "normal",
          note: r.data.note || "",
        });
      } else {
        setAssignForm({
          doctorId: "",
          reason: "",
          symptoms: "",
          priority: "normal",
          note: "",
        });
      }
    } catch {
      setAssignForm({
        doctorId: "",
        reason: "",
        symptoms: "",
        priority: "normal",
        note: "",
      });
    }
    setShowAssignModal(true);
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assignForm.doctorId) return toast.error("Vui lòng chọn bác sĩ!");
    setAssignLoading(true);
    try {
      await consultationAPI.create({
        bookingId: selectedBooking.id,
        ...assignForm,
      });
      toast.success("Chỉ định bác sĩ thành công!");
      setShowAssignModal(false);
      fetchAll();
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
    setAssignLoading(false);
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (
      !createForm.patientName ||
      !createForm.patientPhone ||
      !createForm.doctorId
    ) {
      return toast.error("Vui lòng điền đầy đủ thông tin!");
    }
    setCreateLoading(true);
    try {
      await bookingAPI.create(createForm);
      toast.success("Tạo phiếu khám thành công!");
      setShowCreateModal(false);
      setCreateForm({
        doctorId: "",
        date: moment().format("YYYY-MM-DD"),
        timeType: "T1",
        patientName: "",
        patientPhone: "",
        patientEmail: "",
        patientGender: "M",
        patientAddress: "",
        patientReason: "",
      });
      fetchAll();
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra!");
    }
    setCreateLoading(false);
  };

  const stats = [
    {
      label: "Tổng lịch hẹn",
      value: bookings.length,
      color: "#3498db",
      icon: "📅",
    },
    {
      label: "Mới đặt",
      value: bookings.filter((b) => b.statusId === "S1").length,
      color: "#f39c12",
      icon: "🆕",
    },
    {
      label: "Đã xác nhận",
      value: bookings.filter((b) => b.statusId === "S2").length,
      color: "#9b59b6",
      icon: "✅",
    },
    {
      label: "Đã khám",
      value: bookings.filter((b) => b.statusId === "S3").length,
      color: "#2ecc71",
      icon: "🏥",
    },
    {
      label: "Đã hủy",
      value: bookings.filter((b) => b.statusId === "S4").length,
      color: "#e74c3c",
      icon: "❌",
    },
  ];

  return (
    <div
      style={{ minHeight: "calc(100vh - 68px)", background: "var(--bg-light)" }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a3a52, #0d2137)",
          padding: "32px 0",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1 style={{ color: "#fff", fontSize: "1.6rem", fontWeight: 800 }}>
              💼 Dashboard Tư vấn viên
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>
              Xin chào, {user?.lastName} {user?.firstName}
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            ➕ Tạo phiếu khám
          </button>
        </div>
      </div>

      <div className="container" style={{ padding: "28px 20px" }}>
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5,1fr)",
            gap: 14,
            marginBottom: 24,
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: 18,
                borderTop: `4px solid ${s.color}`,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.5rem" }}>{s.icon}</div>
              <div
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  color: s.color,
                  margin: "6px 0",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-medium)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          className="card"
          style={{
            padding: "14px 20px",
            marginBottom: 20,
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            className={`btn btn-sm ${activeTab === "bookings" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setActiveTab("bookings")}
          >
            📋 Danh sách đặt khám
          </button>
          <button
            className={`btn btn-sm ${activeTab === "consultations" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setActiveTab("consultations")}
          >
            💼 DS tư vấn của tôi
          </button>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-medium)",
              }}
            >
              📅 Lọc ngày:
            </label>
            <input
              type="date"
              className="form-control"
              style={{ width: "auto" }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            {selectedDate && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedDate("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tab: Danh sách đặt khám */}
        {activeTab === "bookings" &&
          (loading ? (
            <div className="spinner" />
          ) : bookings.length === 0 ? (
            <div
              className="card"
              style={{ padding: "60px 20px", textAlign: "center" }}
            >
              <div style={{ fontSize: "3rem", marginBottom: 12 }}>📭</div>
              <h3>Không có lịch hẹn nào</h3>
            </div>
          ) : (
            <div className="card">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Bệnh nhân</th>
                      <th>Bác sĩ</th>
                      <th>Ngày & Giờ</th>
                      <th>Lý do</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => (
                      <tr key={b.id}>
                        <td
                          style={{
                            color: "var(--text-light)",
                            fontSize: "0.82rem",
                          }}
                        >
                          {i + 1}
                        </td>
                        <td>
                          <strong
                            style={{ display: "block", fontSize: "0.9rem" }}
                          >
                            {b.patientName}
                          </strong>
                          <span
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--text-medium)",
                            }}
                          >
                            {b.patientPhone}
                          </span>
                        </td>
                        <td style={{ fontSize: "0.85rem" }}>
                          {b.doctorData?.userData ? (
                            `BS. ${b.doctorData.userData.lastName} ${b.doctorData.userData.firstName}`
                          ) : (
                            <span style={{ color: "var(--text-light)" }}>
                              Chưa chỉ định
                            </span>
                          )}
                        </td>
                        <td>
                          <strong
                            style={{ display: "block", fontSize: "0.85rem" }}
                          >
                            {moment(b.date).format("DD/MM/YYYY")}
                          </strong>
                          <span
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--text-medium)",
                            }}
                          >
                            {b.timeTypeData?.valueVi}
                          </span>
                        </td>
                        <td
                          style={{
                            fontSize: "0.82rem",
                            color: "var(--text-medium)",
                            maxWidth: 140,
                          }}
                        >
                          {b.patientReason || "—"}
                        </td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              background: STATUS_BOOKING[b.statusId]?.bg,
                              color: STATUS_BOOKING[b.statusId]?.color,
                            }}
                          >
                            {STATUS_BOOKING[b.statusId]?.label}
                          </span>
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              gap: 6,
                              flexDirection: "column",
                            }}
                          >
                            {b.statusId === "S1" && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleOpenAssign(b)}
                              >
                                👨‍⚕️ Chỉ định BS
                              </button>
                            )}
                            {b.statusId === "S2" && (
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => handleOpenAssign(b)}
                              >
                                ✏️ Sửa chỉ định
                              </button>
                            )}
                            <select
                              className="form-control"
                              style={{
                                fontSize: "0.78rem",
                                padding: "4px 8px",
                              }}
                              value={b.statusId}
                              onChange={(e) =>
                                handleUpdateBookingStatus(b.id, e.target.value)
                              }
                            >
                              {Object.entries(STATUS_BOOKING).map(([k, v]) => (
                                <option key={k} value={k}>
                                  {v.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

        {/* Tab: DS tư vấn của tôi */}
        {activeTab === "consultations" &&
          (consultations.length === 0 ? (
            <div
              className="card"
              style={{ padding: "60px 20px", textAlign: "center" }}
            >
              <div style={{ fontSize: "3rem", marginBottom: 12 }}>💼</div>
              <h3>Chưa có phiếu tư vấn nào</h3>
            </div>
          ) : (
            <div className="card">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Bệnh nhân</th>
                      <th>Bác sĩ chỉ định</th>
                      <th>Ngày khám</th>
                      <th>Ưu tiên</th>
                      <th>Lý do</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consultations.map((c, i) => (
                      <tr key={c.id}>
                        <td style={{ color: "var(--text-light)" }}>{i + 1}</td>
                        <td>
                          <strong
                            style={{ display: "block", fontSize: "0.9rem" }}
                          >
                            {c.patientName}
                          </strong>
                          <span
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--text-medium)",
                            }}
                          >
                            {c.patientPhone}
                          </span>
                        </td>
                        <td style={{ fontSize: "0.85rem" }}>
                          {c.doctorData?.userData
                            ? `BS. ${c.doctorData.userData.lastName} ${c.doctorData.userData.firstName}`
                            : "—"}
                        </td>
                        <td style={{ fontSize: "0.85rem" }}>
                          {c.bookingData?.date
                            ? moment(c.bookingData.date).format("DD/MM/YYYY")
                            : "—"}
                          <span
                            style={{
                              display: "block",
                              fontSize: "0.78rem",
                              color: "var(--text-medium)",
                            }}
                          >
                            {c.bookingData?.timeTypeData?.valueVi}
                          </span>
                        </td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              background: PRIORITY[c.priority]?.color + "22",
                              color: PRIORITY[c.priority]?.color,
                            }}
                          >
                            {PRIORITY[c.priority]?.label}
                          </span>
                        </td>
                        <td
                          style={{
                            fontSize: "0.82rem",
                            color: "var(--text-medium)",
                            maxWidth: 160,
                          }}
                        >
                          {c.reason || "—"}
                        </td>
                        <td>
                          <select
                            className="form-control"
                            style={{
                              fontSize: "0.78rem",
                              padding: "4px 8px",
                              width: 130,
                            }}
                            value={c.status}
                            onChange={async (e) => {
                              await consultationAPI.updateStatus(
                                c.id,
                                e.target.value,
                              );
                              toast.success("Đã cập nhật!");
                              fetchConsultations();
                            }}
                          >
                            <option value="pending">Chờ xử lý</option>
                            <option value="assigned">Đã chỉ định</option>
                            <option value="examining">Đang khám</option>
                            <option value="done">Hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </div>

      {/* Modal chỉ định bác sĩ */}
      {showAssignModal && selectedBooking && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget && setShowAssignModal(false)
          }
        >
          <div className="modal-box" style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h3>👨‍⚕️ Chỉ định bác sĩ khám</h3>
              <button
                className="modal-close"
                onClick={() => setShowAssignModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAssign} style={{ padding: "20px 24px" }}>
              {/* Thông tin bệnh nhân */}
              <div
                style={{
                  background: "var(--bg-light)",
                  borderRadius: 8,
                  padding: "12px 16px",
                  marginBottom: 18,
                  fontSize: "0.85rem",
                }}
              >
                <strong>Bệnh nhân:</strong> {selectedBooking.patientName} —{" "}
                {selectedBooking.patientPhone}
                <br />
                <strong>Ngày khám:</strong>{" "}
                {moment(selectedBooking.date).format("DD/MM/YYYY")} |{" "}
                {selectedBooking.timeTypeData?.valueVi}
                {selectedBooking.patientReason && (
                  <>
                    <br />
                    <strong>Lý do:</strong> {selectedBooking.patientReason}
                  </>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Chọn bác sĩ *</label>
                <select
                  className="form-control"
                  value={assignForm.doctorId}
                  onChange={(e) =>
                    setAssignForm((f) => ({ ...f, doctorId: e.target.value }))
                  }
                  required
                >
                  <option value="">-- Chọn bác sĩ --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      BS. {d.userData?.lastName} {d.userData?.firstName} —{" "}
                      {d.specialtyData?.name || "Đa khoa"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Mức độ ưu tiên</label>
                <select
                  className="form-control"
                  value={assignForm.priority}
                  onChange={(e) =>
                    setAssignForm((f) => ({ ...f, priority: e.target.value }))
                  }
                >
                  <option value="normal">Bình thường</option>
                  <option value="urgent">Khẩn</option>
                  <option value="emergency">Cấp cứu</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Triệu chứng bệnh nhân mô tả
                </label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={assignForm.symptoms}
                  onChange={(e) =>
                    setAssignForm((f) => ({ ...f, symptoms: e.target.value }))
                  }
                  placeholder="Ghi lại triệu chứng bệnh nhân nêu..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lý do chỉ định</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={assignForm.reason}
                  onChange={(e) =>
                    setAssignForm((f) => ({ ...f, reason: e.target.value }))
                  }
                  placeholder="Lý do chỉ định bác sĩ này..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ghi chú thêm</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={assignForm.note}
                  onChange={(e) =>
                    setAssignForm((f) => ({ ...f, note: e.target.value }))
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowAssignModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={assignLoading}
                >
                  {assignLoading ? "Đang xử lý..." : "✅ Xác nhận chỉ định"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal tạo phiếu khám */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget && setShowCreateModal(false)
          }
        >
          <div className="modal-box" style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <h3>➕ Tạo phiếu khám mới</h3>
              <button
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={handleCreateBooking}
              style={{
                padding: "20px 24px",
                maxHeight: "70vh",
                overflowY: "auto",
              }}
            >
              <div className="form-group">
                <label className="form-label">Chọn bác sĩ *</label>
                <select
                  className="form-control"
                  value={createForm.doctorId}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, doctorId: e.target.value }))
                  }
                  required
                >
                  <option value="">-- Chọn bác sĩ --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      BS. {d.userData?.lastName} {d.userData?.firstName} —{" "}
                      {d.specialtyData?.name || "Đa khoa"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Ngày khám *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={createForm.date}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, date: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Khung giờ *</label>
                  <select
                    className="form-control"
                    value={createForm.timeType}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, timeType: e.target.value }))
                    }
                  >
                    {Object.entries(TIME_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Họ và tên *</label>
                  <input
                    className="form-control"
                    value={createForm.patientName}
                    onChange={(e) =>
                      setCreateForm((f) => ({
                        ...f,
                        patientName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Số điện thoại *</label>
                  <input
                    className="form-control"
                    value={createForm.patientPhone}
                    onChange={(e) =>
                      setCreateForm((f) => ({
                        ...f,
                        patientPhone: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={createForm.patientEmail}
                    onChange={(e) =>
                      setCreateForm((f) => ({
                        ...f,
                        patientEmail: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Giới tính</label>
                  <select
                    className="form-control"
                    value={createForm.patientGender}
                    onChange={(e) =>
                      setCreateForm((f) => ({
                        ...f,
                        patientGender: e.target.value,
                      }))
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
                  value={createForm.patientAddress}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      patientAddress: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Lý do khám / Triệu chứng</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={createForm.patientReason}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      patientReason: e.target.value,
                    }))
                  }
                  placeholder="Mô tả triệu chứng..."
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={createLoading}
                >
                  {createLoading ? "Đang xử lý..." : "✅ Tạo phiếu khám"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantDashboard;
