import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { userAPI, patientAPI } from "../services/api";

const Profile = () => {
  const { user } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    address: user?.address || "",
    gender: user?.gender || "M",
    dob: user?.dob || "",
    bhytCode: user?.bhytCode || "",
    occupation: user?.occupation || "",
    ethnicity: user?.ethnicity || "",
    nationality: user?.nationality || "Việt Nam",
  });

  const [histories, setHistories] = useState([]);
  const [historyForm, setHistoryForm] = useState({
    disease: "",
    symptoms: "",
    since: "",
    treatment: "",
    allergies: "",
    note: "",
  });
  const [showHistoryForm, setShowHistoryForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  // Load tiền sử bệnh khi chuyển sang tab medical
  useEffect(() => {
    if (activeTab === "medical") {
      patientAPI
        .getMedicalHistory()
        .then((r) => setHistories(r.data || []))
        .catch(() => setHistories([]));
    }
  }, [activeTab]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setPass = (k) => (e) =>
    setPasswordForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await patientAPI.updateProfile(form);
      toast.success("Cập nhật thông tin thành công!");
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, ...form }));
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Mật khẩu phải ít nhất 6 ký tự!");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("password", passwordForm.newPassword);
      await userAPI.update(user.id, fd);
      toast.success("Đổi mật khẩu thành công!");
      setPasswordForm({ newPassword: "", confirmPassword: "" });
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
    setLoading(false);
  };

  const handleAddHistory = async () => {
    if (!historyForm.disease) return toast.error("Vui lòng nhập tên bệnh!");
    try {
      await patientAPI.addMedicalHistory(historyForm);
      toast.success("Thêm tiền sử bệnh thành công!");
      setHistoryForm({
        disease: "",
        symptoms: "",
        since: "",
        treatment: "",
        allergies: "",
        note: "",
      });
      setShowHistoryForm(false);
      patientAPI.getMedicalHistory().then((r) => setHistories(r.data || []));
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const handleDeleteHistory = async (id) => {
    if (!window.confirm("Xóa tiền sử này?")) return;
    try {
      await patientAPI.deleteMedicalHistory(id);
      toast.success("Đã xóa!");
      setHistories((prev) => prev.filter((x) => x.id !== id));
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const tabs = [
    { key: "info", label: "👤 Thông tin cá nhân" },
    { key: "medical", label: "🏥 Tiền sử bệnh" },
    { key: "password", label: "🔒 Đổi mật khẩu" },
  ];

  return (
    <div
      style={{ minHeight: "calc(100vh - 68px)", background: "var(--bg-light)" }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0d2137, #1a3a52)",
          padding: "40px 0",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", alignItems: "center", gap: 24 }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "var(--primary)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: 700,
              border: "3px solid rgba(255,255,255,0.3)",
              overflow: "hidden",
            }}
          >
            {user?.avatar ? (
              <img
                src={`http://localhost:8080${user.avatar}`}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              user?.firstName?.charAt(0)
            )}
          </div>
          <div style={{ color: "#fff" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
              {user?.lastName} {user?.firstName}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
              {user?.email}
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: 8,
                padding: "3px 12px",
                background: "rgba(69,195,210,0.2)",
                border: "1px solid rgba(69,195,210,0.4)",
                borderRadius: 20,
                fontSize: "0.78rem",
                color: "var(--primary)",
                fontWeight: 600,
              }}
            >
              {user?.role === "admin"
                ? "👑 Admin"
                : user?.role === "doctor"
                  ? "🩺 Bác sĩ"
                  : user?.role === "consultant"
                    ? "💼 Tư vấn viên"
                    : "👤 Bệnh nhân"}
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "32px 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Sidebar tabs */}
          <div className="card" style={{ padding: 12 }}>
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px 16px",
                  textAlign: "left",
                  background:
                    activeTab === t.key ? "var(--primary-light)" : "none",
                  color:
                    activeTab === t.key
                      ? "var(--primary)"
                      : "var(--text-medium)",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: activeTab === t.key ? 700 : 500,
                  fontSize: "0.88rem",
                  marginBottom: 4,
                  fontFamily: "inherit",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="card" style={{ padding: 28 }}>
            {/* TAB: THÔNG TIN CÁ NHÂN */}
            {activeTab === "info" && (
              <>
                <h2
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    marginBottom: 24,
                    paddingBottom: 14,
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  Thông tin cá nhân
                </h2>
                <form onSubmit={handleSaveInfo}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Họ *</label>
                      <input
                        className="form-control"
                        value={form.lastName}
                        onChange={set("lastName")}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tên *</label>
                      <input
                        className="form-control"
                        value={form.firstName}
                        onChange={set("firstName")}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Số điện thoại</label>
                      <input
                        className="form-control"
                        value={form.phone}
                        onChange={set("phone")}
                        placeholder="0901234567"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Giới tính</label>
                      <select
                        className="form-control"
                        value={form.gender}
                        onChange={set("gender")}
                      >
                        <option value="M">Nam</option>
                        <option value="F">Nữ</option>
                        <option value="Other">Khác</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Ngày sinh</label>
                      <input
                        className="form-control"
                        type="date"
                        value={form.dob}
                        onChange={set("dob")}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nghề nghiệp</label>
                      <input
                        className="form-control"
                        value={form.occupation}
                        onChange={set("occupation")}
                        placeholder="VD: Kỹ sư, Giáo viên..."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mã thẻ BHYT</label>
                      <input
                        className="form-control"
                        value={form.bhytCode}
                        onChange={set("bhytCode")}
                        placeholder="VD: HS4030085xxxxxxxx"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Dân tộc</label>
                      <input
                        className="form-control"
                        value={form.ethnicity}
                        onChange={set("ethnicity")}
                        placeholder="VD: Kinh"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Quốc tịch</label>
                      <input
                        className="form-control"
                        value={form.nationality}
                        onChange={set("nationality")}
                        placeholder="Việt Nam"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Địa chỉ</label>
                    <input
                      className="form-control"
                      value={form.address}
                      onChange={set("address")}
                      placeholder="Số nhà, đường, quận, thành phố"
                    />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Đang lưu..." : "💾 Lưu thay đổi"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* TAB: TIỀN SỬ BỆNH */}
            {activeTab === "medical" && (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                    paddingBottom: 14,
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                    🏥 Tiền sử bệnh
                  </h2>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowHistoryForm(!showHistoryForm)}
                  >
                    {showHistoryForm ? "✕ Đóng" : "+ Thêm tiền sử"}
                  </button>
                </div>

                {showHistoryForm && (
                  <div
                    style={{
                      background: "var(--bg-light)",
                      borderRadius: 10,
                      padding: 20,
                      marginBottom: 20,
                      border: "1px solid var(--border)",
                    }}
                  >
                    <h4
                      style={{
                        marginBottom: 16,
                        fontSize: "0.95rem",
                        fontWeight: 700,
                      }}
                    >
                      Thêm tiền sử bệnh mới
                    </h4>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Tên bệnh *</label>
                        <input
                          className="form-control"
                          value={historyForm.disease}
                          onChange={(e) =>
                            setHistoryForm((f) => ({
                              ...f,
                              disease: e.target.value,
                            }))
                          }
                          placeholder="VD: Tiểu đường, Huyết áp..."
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Từ ngày</label>
                        <input
                          type="date"
                          className="form-control"
                          value={historyForm.since}
                          onChange={(e) =>
                            setHistoryForm((f) => ({
                              ...f,
                              since: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Triệu chứng</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={historyForm.symptoms}
                        onChange={(e) =>
                          setHistoryForm((f) => ({
                            ...f,
                            symptoms: e.target.value,
                          }))
                        }
                        placeholder="Mô tả triệu chứng..."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Đang điều trị bằng</label>
                      <input
                        className="form-control"
                        value={historyForm.treatment}
                        onChange={(e) =>
                          setHistoryForm((f) => ({
                            ...f,
                            treatment: e.target.value,
                          }))
                        }
                        placeholder="Thuốc, phương pháp điều trị..."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Dị ứng</label>
                      <input
                        className="form-control"
                        value={historyForm.allergies}
                        onChange={(e) =>
                          setHistoryForm((f) => ({
                            ...f,
                            allergies: e.target.value,
                          }))
                        }
                        placeholder="Dị ứng thuốc, thức ăn..."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Ghi chú</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={historyForm.note}
                        onChange={(e) =>
                          setHistoryForm((f) => ({
                            ...f,
                            note: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        className="btn btn-primary"
                        onClick={handleAddHistory}
                      >
                        💾 Lưu
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => setShowHistoryForm(false)}
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}

                {histories.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "var(--text-medium)",
                    }}
                  >
                    <div style={{ fontSize: "3rem", marginBottom: 12 }}>🏥</div>
                    <p>Chưa có tiền sử bệnh nào được ghi nhận</p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {histories.map((h) => (
                      <div
                        key={h.id}
                        style={{
                          background: "var(--bg-light)",
                          borderRadius: 10,
                          padding: "16px 18px",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 8,
                          }}
                        >
                          <strong
                            style={{
                              color: "var(--primary)",
                              fontSize: "0.95rem",
                            }}
                          >
                            🦠 {h.disease}
                          </strong>
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            {h.since && (
                              <span
                                style={{
                                  fontSize: "0.78rem",
                                  color: "var(--text-medium)",
                                }}
                              >
                                Từ: {h.since}
                              </span>
                            )}
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteHistory(h.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        {h.symptoms && (
                          <p
                            style={{
                              fontSize: "0.85rem",
                              color: "var(--text-medium)",
                              marginBottom: 4,
                            }}
                          >
                            📋 Triệu chứng: {h.symptoms}
                          </p>
                        )}
                        {h.treatment && (
                          <p
                            style={{
                              fontSize: "0.85rem",
                              color: "var(--text-medium)",
                              marginBottom: 4,
                            }}
                          >
                            💊 Điều trị: {h.treatment}
                          </p>
                        )}
                        {h.allergies && (
                          <p
                            style={{
                              fontSize: "0.85rem",
                              color: "#e74c3c",
                              marginBottom: 4,
                            }}
                          >
                            ⚠️ Dị ứng: {h.allergies}
                          </p>
                        )}
                        {h.note && (
                          <p
                            style={{
                              fontSize: "0.82rem",
                              color: "var(--text-light)",
                            }}
                          >
                            📝 {h.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* TAB: ĐỔI MẬT KHẨU */}
            {activeTab === "password" && (
              <>
                <h2
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    marginBottom: 24,
                    paddingBottom: 14,
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  Đổi mật khẩu
                </h2>
                <form onSubmit={handleChangePassword} style={{ maxWidth: 400 }}>
                  <div className="form-group">
                    <label className="form-label">Mật khẩu mới *</label>
                    <input
                      className="form-control"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={setPass("newPassword")}
                      placeholder="Ít nhất 6 ký tự"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Xác nhận mật khẩu *</label>
                    <input
                      className="form-control"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={setPass("confirmPassword")}
                      placeholder="Nhập lại mật khẩu mới"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Đang xử lý..." : "🔒 Đổi mật khẩu"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
