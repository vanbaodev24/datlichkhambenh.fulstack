import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { userAPI } from "../services/api";
import { login } from "../redux/slices/authSlice";

const Profile = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    address: user?.address || "",
    gender: user?.gender || "M",
    dob: user?.dob || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setPass = (k) => (e) =>
    setPasswordForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v) fd.append(k, v);
      });
      await userAPI.update(user.id, fd);
      toast.success("Cập nhật thông tin thành công!");
      // Update local user
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      const updated = { ...stored, ...form };
      localStorage.setItem("user", JSON.stringify(updated));
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
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
    setLoading(false);
  };

  const tabs = [
    { key: "info", label: "👤 Thông tin cá nhân" },
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
