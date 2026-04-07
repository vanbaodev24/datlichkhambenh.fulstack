import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { prescriptionAPI } from "../services/api";

const UNITS = ["viên", "chai", "ống", "gói", "tuýp", "lọ", "ml", "mg"];
const FREQUENCIES = [
  "1 lần/ngày",
  "2 lần/ngày",
  "3 lần/ngày",
  "4 lần/ngày",
  "Khi cần",
];
const DURATIONS = [
  "3 ngày",
  "5 ngày",
  "7 ngày",
  "10 ngày",
  "14 ngày",
  "1 tháng",
];
const INSTRUCTIONS = [
  "Uống sau ăn",
  "Uống trước ăn",
  "Uống khi đói",
  "Uống khi đau",
  "Bôi ngoài da",
  "Nhỏ mắt",
  "Nhỏ tai",
];

const defaultItem = {
  medicineName: "",
  medicineCode: "",
  unit: "viên",
  quantity: 1,
  dosage: "1 viên/lần",
  frequency: "2 lần/ngày",
  duration: "7 ngày",
  instruction: "Uống sau ăn",
  note: "",
};

const PrescriptionForm = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    patientName: "",
    patientDob: "",
    patientGender: "Nam",
    patientAddress: "",
    diagnosis: "",
    prescribedDate: moment().format("YYYY-MM-DD"),
    revisitDate: "",
    note: "",
  });
  const [items, setItems] = useState([{ ...defaultItem }]);

  useEffect(() => {
    prescriptionAPI
      .getByBooking(bookingId)
      .then((r) => {
        if (r.data) {
          const p = r.data;
          setForm({
            patientName: p.patientName || "",
            patientDob: p.patientDob || "",
            patientGender: p.patientGender || "Nam",
            patientAddress: p.patientAddress || "",
            diagnosis: p.diagnosis || "",
            prescribedDate: p.prescribedDate || moment().format("YYYY-MM-DD"),
            revisitDate: p.revisitDate || "",
            note: p.note || "",
          });
          if (p.items && p.items.length > 0) {
            setItems(
              p.items.map((item) => ({
                medicineName: item.medicineName || "",
                medicineCode: item.medicineCode || "",
                unit: item.unit || "viên",
                quantity: item.quantity || 1,
                dosage: item.dosage || "1 viên/lần",
                frequency: item.frequency || "2 lần/ngày",
                duration: item.duration || "7 ngày",
                instruction: item.instruction || "Uống sau ăn",
                note: item.note || "",
              })),
            );
          }
        } else {
          // Chưa có đơn — load thông tin bệnh nhân từ booking
          import("../services/api").then(({ bookingAPI }) => {
            bookingAPI
              .getAll({ limit: 100 })
              .then((r) => {
                const booking = r.data?.find(
                  (b) => b.id === parseInt(bookingId),
                );
                if (booking) {
                  setForm((f) => ({
                    ...f,
                    patientName: booking.patientName || "",
                    patientGender:
                      booking.patientGender === "M"
                        ? "Nam"
                        : booking.patientGender === "F"
                          ? "Nữ"
                          : "Khác",
                    patientAddress: booking.patientAddress || "",
                  }));
                }
              })
              .catch(() => {});
          });
        }
      })
      .catch(() => {});
  }, [bookingId]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const addItem = () => setItems((prev) => [...prev, { ...defaultItem }]);

  const removeItem = (idx) => {
    if (items.length === 1)
      return toast.error("Đơn thuốc phải có ít nhất 1 thuốc!");
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const setItem = (idx, key, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [key]: value } : item)),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emptyItem = items.find((i) => !i.medicineName.trim());
    if (emptyItem)
      return toast.error("Vui lòng nhập tên thuốc cho tất cả các dòng!");
    setLoading(true);
    try {
      await prescriptionAPI.upsert({
        bookingId: parseInt(bookingId),
        ...form,
        items,
      });
      toast.success("Lưu đơn thuốc thành công!");
      navigate("/doctor-dashboard");
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra!");
    }
    setLoading(false);
  };

  return (
    <div
      style={{ background: "var(--bg-light)", minHeight: "calc(100vh - 68px)" }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0d2137, #1a3a52)",
          padding: "24px 0",
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
          <h1 style={{ color: "#fff", fontSize: "1.4rem", fontWeight: 800 }}>
            💊 Kê đơn thuốc
          </h1>
          <button
            className="btn btn-outline btn-sm"
            style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}
            onClick={() => navigate("/doctor-dashboard")}
          >
            ← Quay lại
          </button>
        </div>
      </div>

      <div className="container" style={{ padding: "28px 20px" }}>
        <form onSubmit={handleSubmit}>
          {/* Thông tin bệnh nhân */}
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--primary)",
                marginBottom: 18,
                paddingBottom: 10,
                borderBottom: "2px solid var(--primary-light)",
              }}
            >
              👤 Thông tin bệnh nhân
            </h2>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Họ và tên *</label>
                <input
                  className="form-control"
                  value={form.patientName}
                  onChange={set("patientName")}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Giới tính</label>
                <select
                  className="form-control"
                  value={form.patientGender}
                  onChange={set("patientGender")}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Ngày sinh</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.patientDob}
                  onChange={set("patientDob")}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Ngày kê đơn</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.prescribedDate}
                  onChange={set("prescribedDate")}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Địa chỉ</label>
              <input
                className="form-control"
                value={form.patientAddress}
                onChange={set("patientAddress")}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Chẩn đoán *</label>
              <textarea
                className="form-control"
                rows={2}
                value={form.diagnosis}
                onChange={set("diagnosis")}
                placeholder="Nhập chẩn đoán bệnh..."
                required
              />
            </div>
          </div>

          {/* Danh sách thuốc */}
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
                paddingBottom: 10,
                borderBottom: "2px solid var(--primary-light)",
              }}
            >
              <h2
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                }}
              >
                💊 Danh sách thuốc
              </h2>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={addItem}
              >
                + Thêm thuốc
              </button>
            </div>

            {items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--bg-light)",
                  borderRadius: 10,
                  padding: 18,
                  marginBottom: 14,
                  border: "1px solid var(--border)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <strong
                    style={{ color: "var(--primary)", fontSize: "0.9rem" }}
                  >
                    Thuốc #{idx + 1}
                  </strong>
                  {items.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeItem(idx)}
                    >
                      🗑️ Xóa
                    </button>
                  )}
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Tên thuốc *</label>
                    <input
                      className="form-control"
                      value={item.medicineName}
                      onChange={(e) =>
                        setItem(idx, "medicineName", e.target.value)
                      }
                      placeholder="VD: Paracetamol 500mg"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mã thuốc</label>
                    <input
                      className="form-control"
                      value={item.medicineCode}
                      onChange={(e) =>
                        setItem(idx, "medicineCode", e.target.value)
                      }
                      placeholder="VD: PC500"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Đơn vị</label>
                    <select
                      className="form-control"
                      value={item.unit}
                      onChange={(e) => setItem(idx, "unit", e.target.value)}
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số lượng</label>
                    <input
                      type="number"
                      min={1}
                      className="form-control"
                      value={item.quantity}
                      onChange={(e) =>
                        setItem(idx, "quantity", parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Liều dùng</label>
                    <input
                      className="form-control"
                      value={item.dosage}
                      onChange={(e) => setItem(idx, "dosage", e.target.value)}
                      placeholder="VD: 1 viên/lần"
                      list={`dosage-list-${idx}`}
                    />
                    <datalist id={`dosage-list-${idx}`}>
                      {["1 viên/lần", "2 viên/lần", "1/2 viên/lần"].map((d) => (
                        <option key={d} value={d} />
                      ))}
                    </datalist>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tần suất</label>
                    <select
                      className="form-control"
                      value={item.frequency}
                      onChange={(e) =>
                        setItem(idx, "frequency", e.target.value)
                      }
                    >
                      {FREQUENCIES.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Thời gian dùng</label>
                    <select
                      className="form-control"
                      value={item.duration}
                      onChange={(e) => setItem(idx, "duration", e.target.value)}
                    >
                      {DURATIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cách dùng</label>
                    <select
                      className="form-control"
                      value={item.instruction}
                      onChange={(e) =>
                        setItem(idx, "instruction", e.target.value)
                      }
                    >
                      {INSTRUCTIONS.map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Ghi chú</label>
                  <input
                    className="form-control"
                    value={item.note}
                    onChange={(e) => setItem(idx, "note", e.target.value)}
                    placeholder="Ghi chú thêm về thuốc này..."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Lời dặn & tái khám */}
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--primary)",
                marginBottom: 18,
                paddingBottom: 10,
                borderBottom: "2px solid var(--primary-light)",
              }}
            >
              📝 Lời dặn & Tái khám
            </h2>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Ngày tái khám</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.revisitDate}
                  onChange={set("revisitDate")}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Lời dặn của bác sĩ</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.note}
                onChange={set("note")}
                placeholder="Nghỉ ngơi, chế độ ăn uống, vận động..."
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/doctor-dashboard")}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "💾 Lưu đơn thuốc"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionForm;
