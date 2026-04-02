import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { bookingAPI, doctorAPI } from "../services/api";
import api from "../services/api";

const STATUS = {
  S1: { label: "Mới đặt", color: "#f39c12", bg: "#fff3cd" },
  S2: { label: "Đã xác nhận", color: "#3498db", bg: "#d1ecf1" },
  S3: { label: "Đã khám", color: "#2ecc71", bg: "#d4edda" },
  S4: { label: "Đã hủy", color: "#e74c3c", bg: "#f8d7da" },
};

const ConsultantDashboard = () => {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [assignForm, setAssignForm] = useState({ doctorId: "", note: "" });
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

  const handleUpdateStatus = async (id, statusId) => {
    try {
      await bookingAPI.updateStatus(id, statusId);
      toast.success("Cập nhật trạng thái thành công!");
      fetchAll();
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assignForm.doctorId) return toast.error("Vui lòng chọn bác sĩ!");
    try {
      await api.put(`/bookings/${selectedBooking.id}/status`, {
        statusId: "S2",
      });
      toast.success("Đã chỉ định bác sĩ thành công!");
      setShowAssignModal(false);
      fetchAll();
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
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
  };

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

  const tabs = [
    { key: "all", label: "📋 Tất cả", filter: () => true },
    { key: "S1", label: "🆕 Mới đặt", filter: (b) => b.statusId === "S1" },
    { key: "S2", label: "✅ Đã xác nhận", filter: (b) => b.statusId === "S2" },
    { key: "S3", label: "🏥 Đã khám", filter: (b) => b.statusId === "S3" },
    { key: "S4", label: "❌ Đã hủy", filter: (b) => b.statusId === "S4" },
  ];

  const filtered = bookings.filter(
    tabs.find((t) => t.key === activeTab)?.filter || (() => true),
  );

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

        {/* Filter bar */}
        <div
          className="card"
          style={{
            padding: "14px 20px",
            marginBottom: 20,
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`btn btn-sm ${activeTab === t.key ? "btn-primary" : "btn-outline"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
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
                ✕ Xóa
              </button>
            )}
          </div>
        </div>

        {/* Booking list */}
        {loading ? (
          <div className="spinner" />
        ) : filtered.length === 0 ? (
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
                  {filtered.map((b, i) => (
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
                        {b.patientEmail && (
                          <span
                            style={{
                              display: "block",
                              fontSize: "0.75rem",
                              color: "var(--text-light)",
                            }}
                          >
                            {b.patientEmail}
                          </span>
                        )}
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
                          maxWidth: 150,
                        }}
                      >
                        {b.patientReason || "—"}
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: STATUS[b.statusId]?.bg,
                            color: STATUS[b.statusId]?.color,
                          }}
                        >
                          {STATUS[b.statusId]?.label}
                        </span>
                      </td>
                      <td>
                        <div
                          style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                        >
                          {b.statusId === "S1" && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                setSelectedBooking(b);
                                setAssignForm({
                                  doctorId: b.doctorId || "",
                                  note: "",
                                });
                                setShowAssignModal(true);
                              }}
                            >
                              👨‍⚕️ Chỉ định BS
                            </button>
                          )}
                          <select
                            className="form-control"
                            style={{
                              fontSize: "0.78rem",
                              padding: "4px 8px",
                              width: 130,
                            }}
                            value={b.statusId}
                            onChange={(e) =>
                              handleUpdateStatus(b.id, e.target.value)
                            }
                          >
                            {Object.entries(STATUS).map(([k, v]) => (
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
        )}
      </div>

      {/* Assign doctor modal */}
      {showAssignModal && selectedBooking && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget && setShowAssignModal(false)
          }
        >
          <div className="modal-box" style={{ maxWidth: 480 }}>
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
                <label className="form-label">Ghi chú</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={assignForm.note}
                  onChange={(e) =>
                    setAssignForm((f) => ({ ...f, note: e.target.value }))
                  }
                  placeholder="Ghi chú thêm cho bác sĩ..."
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
                <button type="submit" className="btn btn-primary">
                  ✅ Xác nhận chỉ định
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create booking modal */}
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
                  <label className="form-label">Họ và tên bệnh nhân *</label>
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
                <label className="form-label">Lý do khám</label>
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
                <button type="submit" className="btn btn-primary">
                  ✅ Tạo phiếu khám
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
