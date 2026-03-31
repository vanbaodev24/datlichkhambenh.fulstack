import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { bookingAPI } from "../../services/api";

const STATUS = {
  S1: { label: "Mới đặt", color: "warning" },
  S2: { label: "Đã xác nhận", color: "primary" },
  S3: { label: "Đã khám", color: "success" },
  S4: { label: "Đã hủy", color: "danger" },
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const fetchBookings = useCallback(() => {
    setLoading(true);
    bookingAPI
      .getAll({ page, limit: 15, status: statusFilter, date: dateFilter })
      .then((r) => {
        setBookings(r.data || []);
        setTotal(r.total || 0);
        setLoading(false);
      });
  }, [page, statusFilter, dateFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id, statusId) => {
    try {
      await bookingAPI.updateStatus(id, statusId);
      toast.success("Cập nhật trạng thái thành công!");
      fetchBookings();
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div>
      <div className="admin-page-header">
        <h2>
          📅 Quản lý lịch hẹn{" "}
          <span
            style={{
              fontSize: "0.85rem",
              color: "var(--text-medium)",
              fontWeight: 400,
            }}
          >
            ({total})
          </span>
        </h2>
      </div>

      <div
        className="card"
        style={{
          padding: 20,
          marginBottom: 20,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <select
          className="form-control"
          style={{ width: 180 }}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Tất cả trạng thái</option>
          {Object.entries(STATUS).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
        <input
          className="form-control"
          type="date"
          style={{ width: 180 }}
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(1);
          }}
        />
        <button
          className="btn btn-outline btn-sm"
          onClick={() => {
            setStatusFilter("");
            setDateFilter("");
            setPage(1);
          }}
        >
          Reset
        </button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Bệnh nhân</th>
                <th>Bác sĩ</th>
                <th>Ngày & Giờ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 40 }}>
                    Đang tải...
                  </td>
                </tr>
              ) : (
                bookings.map((b, i) => (
                  <tr key={b.id}>
                    <td
                      style={{
                        color: "var(--text-light)",
                        fontSize: "0.82rem",
                      }}
                    >
                      {(page - 1) * 15 + i + 1}
                    </td>
                    <td>
                      <strong style={{ display: "block", fontSize: "0.9rem" }}>
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
                    <td style={{ fontSize: "0.88rem" }}>
                      BS. {b.doctorData?.userData?.lastName}{" "}
                      {b.doctorData?.userData?.firstName}
                    </td>
                    <td>
                      <strong style={{ display: "block", fontSize: "0.88rem" }}>
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
                    <td>
                      <span
                        className={`badge badge-${STATUS[b.statusId]?.color || "secondary"}`}
                      >
                        {STATUS[b.statusId]?.label}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{
                          fontSize: "0.82rem",
                          padding: "5px 8px",
                          width: 140,
                        }}
                        value={b.statusId}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                      >
                        {Object.entries(STATUS).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: 16,
              justifyContent: "center",
            }}
          >
            <button
              className="btn btn-outline btn-sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ←
            </button>
            <span style={{ padding: "7px 14px", fontSize: "0.9rem" }}>
              {page} / {totalPages}
            </span>
            <button
              className="btn btn-outline btn-sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
