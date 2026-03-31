import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  userAPI,
  doctorAPI,
  specialtyAPI,
  clinicAPI,
  allcodeAPI,
} from "../../services/api";
import moment from "moment";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [prices, setPrices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [positions, setPositions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [form, setForm] = useState({
    userId: "",
    specialtyId: "",
    clinicId: "",
    priceId: "",
    paymentId: "",
    provinceId: "",
    positionId: "",
    nameClinic: "",
    addressClinic: "",
    description: "",
    contentHTML: "",
    note: "",
  });

  const fetchDoctors = useCallback(() => {
    setLoading(true);
    doctorAPI.getAll({ page, limit: 15 }).then((r) => {
      setDoctors(r.data || []);
      setTotal(r.total || 0);
      setLoading(false);
    });
  }, [page]);

  useEffect(() => {
    fetchDoctors();
    Promise.all([
      specialtyAPI.getAll(),
      clinicAPI.getAll(),
      allcodeAPI.getByType("PRICE"),
      allcodeAPI.getByType("PAYMENT"),
      allcodeAPI.getByType("PROVINCE"),
      allcodeAPI.getByType("POSITION"),
      userAPI.getAll({ role: "doctor", limit: 100 }),
    ]).then(([sp, cl, pr, pay, prov, pos, users]) => {
      setSpecialties(sp.data || []);
      setClinics(cl.data || []);
      setPrices(pr.data || []);
      setPayments(pay.data || []);
      setProvinces(prov.data || []);
      setPositions(pos.data || []);
      setAllUsers(users.data || []);
    });
  }, [fetchDoctors]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.userId) return toast.error("Vui lòng chọn người dùng");
    try {
      await doctorAPI.upsertInfo(form);
      toast.success("Lưu thông tin bác sĩ thành công!");
      setShowModal(false);
      fetchDoctors();
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const totalPages = Math.ceil(total / 15);

  const TIME_SLOTS = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8"];
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

  const handleCreateSchedule = async () => {
    if (!selectedDates.length || !selectedTimes.length) {
      toast.error("Chọn ít nhất 1 ngày và 1 khung giờ!");
      return;
    }
    const arrSchedule = [];
    selectedDates.forEach((date) => {
      selectedTimes.forEach((timeType) => {
        arrSchedule.push({ date, timeType, maxNumber: 10 });
      });
    });
    try {
      await doctorAPI.createSchedule({
        doctorId: selectedDoctor.id,
        arrSchedule,
      });
      toast.success("Tạo lịch khám thành công!");
      setShowScheduleModal(false);
      setSelectedDates([]);
      setSelectedTimes([]);
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const toggleDate = (date) =>
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date],
    );
  const toggleTime = (time) =>
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    );

  return (
    <div>
      <div className="admin-page-header">
        <h2>
          👨‍⚕️ Quản lý bác sĩ{" "}
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
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setForm({
              userId: "",
              specialtyId: "",
              clinicId: "",
              priceId: "",
              paymentId: "",
              provinceId: "",
              positionId: "",
              nameClinic: "",
              addressClinic: "",
              description: "",
              contentHTML: "",
              note: "",
            });
            setShowModal(true);
          }}
        >
          + Thêm hồ sơ bác sĩ
        </button>
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Bác sĩ</th>
                <th>Chuyên khoa</th>
                <th>Cơ sở</th>
                <th>Giá khám</th>
                <th>Lịch khám</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 40 }}>
                    Đang tải...
                  </td>
                </tr>
              ) : (
                doctors.map((d, i) => (
                  <tr key={d.id}>
                    <td style={{ color: "var(--text-light)" }}>
                      {(page - 1) * 15 + i + 1}
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: "var(--primary)",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            overflow: "hidden",
                          }}
                        >
                          {d.userData?.avatar ? (
                            <img
                              src={`http://localhost:8080${d.userData.avatar}`}
                              alt=""
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            d.userData?.firstName?.charAt(0)
                          )}
                        </div>
                        <div>
                          <strong style={{ fontSize: "0.9rem" }}>
                            {d.userData?.lastName} {d.userData?.firstName}
                          </strong>
                          <div
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--text-medium)",
                            }}
                          >
                            {d.userData?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: "0.88rem" }}>
                      {d.specialtyData?.name || "—"}
                    </td>
                    <td style={{ fontSize: "0.88rem" }}>
                      {d.nameClinic || "—"}
                    </td>
                    <td>
                      <span className="badge badge-primary">
                        {d.priceData?.valueVi || "—"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setSelectedDoctor(d);
                          setShowScheduleModal(true);
                          setSelectedDates([]);
                          setSelectedTimes([]);
                        }}
                      >
                        📅 Tạo lịch
                      </button>
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

      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="modal-box" style={{ maxWidth: 680 }}>
            <div className="modal-header">
              <h3>Hồ sơ bác sĩ</h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              style={{
                maxHeight: "70vh",
                overflowY: "auto",
                padding: "20px 24px",
              }}
            >
              <div className="form-group">
                <label className="form-label">Chọn người dùng (Bác sĩ) *</label>
                <select
                  className="form-control"
                  value={form.userId}
                  onChange={set("userId")}
                  required
                >
                  <option value="">-- Chọn người dùng --</option>
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.lastName} {u.firstName} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Học vị</label>
                  <select
                    className="form-control"
                    value={form.positionId}
                    onChange={set("positionId")}
                  >
                    <option value="">-- Chọn --</option>
                    {positions.map((p) => (
                      <option key={p.keyMap} value={p.keyMap}>
                        {p.valueVi}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Chuyên khoa</label>
                  <select
                    className="form-control"
                    value={form.specialtyId}
                    onChange={set("specialtyId")}
                  >
                    <option value="">-- Chọn --</option>
                    {specialties.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Cơ sở y tế</label>
                  <select
                    className="form-control"
                    value={form.clinicId}
                    onChange={set("clinicId")}
                  >
                    <option value="">-- Chọn --</option>
                    {clinics.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Phí khám</label>
                  <select
                    className="form-control"
                    value={form.priceId}
                    onChange={set("priceId")}
                  >
                    <option value="">-- Chọn --</option>
                    {prices.map((p) => (
                      <option key={p.keyMap} value={p.keyMap}>
                        {p.valueVi}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Hình thức thanh toán</label>
                  <select
                    className="form-control"
                    value={form.paymentId}
                    onChange={set("paymentId")}
                  >
                    <option value="">-- Chọn --</option>
                    {payments.map((p) => (
                      <option key={p.keyMap} value={p.keyMap}>
                        {p.valueVi}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tỉnh/Thành phố</label>
                  <select
                    className="form-control"
                    value={form.provinceId}
                    onChange={set("provinceId")}
                  >
                    <option value="">-- Chọn --</option>
                    {provinces.map((p) => (
                      <option key={p.keyMap} value={p.keyMap}>
                        {p.valueVi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tên phòng khám</label>
                <input
                  className="form-control"
                  value={form.nameClinic}
                  onChange={set("nameClinic")}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Địa chỉ khám</label>
                <input
                  className="form-control"
                  value={form.addressClinic}
                  onChange={set("addressClinic")}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả ngắn</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={form.description}
                  onChange={set("description")}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nội dung chi tiết (HTML)</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={form.contentHTML}
                  onChange={set("contentHTML")}
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
                <button type="submit" className="btn btn-primary">
                  Lưu hồ sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showScheduleModal && selectedDoctor && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget && setShowScheduleModal(false)
          }
        >
          <div className="modal-box" style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <h3>
                📅 Tạo lịch — BS. {selectedDoctor.userData?.lastName}{" "}
                {selectedDoctor.userData?.firstName}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowScheduleModal(false)}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <p style={{ fontWeight: 700, marginBottom: 10 }}>Chọn ngày:</p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                {Array.from({ length: 7 }, (_, i) =>
                  moment().add(i, "days"),
                ).map((d) => {
                  const val = d.format("YYYY-MM-DD");
                  const active = selectedDates.includes(val);
                  return (
                    <button
                      key={val}
                      onClick={() => toggleDate(val)}
                      className={`btn btn-sm ${active ? "btn-primary" : "btn-outline"}`}
                    >
                      {d.format("ddd DD/MM")}
                    </button>
                  );
                })}
              </div>
              <p style={{ fontWeight: 700, marginBottom: 10 }}>
                Chọn khung giờ:
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleTime(t)}
                    className={`btn btn-sm ${selectedTimes.includes(t) ? "btn-primary" : "btn-outline"}`}
                  >
                    {TIME_LABELS[t]}
                  </button>
                ))}
              </div>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "var(--text-medium)",
                  marginBottom: 16,
                }}
              >
                Mỗi khung giờ tối đa <strong>10 bệnh nhân</strong>
              </p>
              <div className="modal-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCreateSchedule}
                >
                  ✅ Tạo lịch ({selectedDates.length} ngày ×{" "}
                  {selectedTimes.length} giờ)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;
