import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { userAPI } from "../../services/api";

const ROLES = {
  admin: "👑 Admin",
  doctor: "👨‍⚕️ Bác sĩ",
  patient: "👤 Bệnh nhân",
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    gender: "M",
    role: "patient",
  });

  const fetchUsers = useCallback(() => {
    setLoading(true);
    userAPI.getAll({ page, limit: 15, search, role: roleFilter }).then((r) => {
      setUsers(r.data || []);
      setTotal(r.total || 0);
      setLoading(false);
    });
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openCreate = () => {
    setEditUser(null);
    setForm({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      gender: "M",
      role: "patient",
    });
    setShowModal(true);
  };
  const openEdit = (u) => {
    setEditUser(u);
    setForm({
      email: u.email,
      password: "",
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone || "",
      gender: u.gender || "M",
      role: u.role,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v) fd.append(k, v);
      });
      if (editUser) {
        await userAPI.update(editUser.id, fd);
        toast.success("Cập nhật thành công!");
      } else {
        await userAPI.create(fd);
        toast.success("Tạo người dùng thành công!");
      }
      setShowModal(false);
      fetchUsers();
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xóa người dùng này?")) return;
    await userAPI.delete(id);
    toast.success("Đã xóa!");
    fetchUsers();
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const totalPages = Math.ceil(total / 15);

  return (
    <div>
      <div className="admin-page-header">
        <h2>
          👥 Quản lý người dùng{" "}
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
        <button className="btn btn-primary btn-sm" onClick={openCreate}>
          + Thêm người dùng
        </button>
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
        <input
          className="form-control"
          style={{ flex: 1, minWidth: 200 }}
          placeholder="🔍 Tìm kiếm..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="form-control"
          style={{ width: 160 }}
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Tất cả vai trò</option>
          <option value="admin">Admin</option>
          <option value="doctor">Bác sĩ</option>
          <option value="patient">Bệnh nhân</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tên</th>
                <th>Email</th>
                <th>SĐT</th>
                <th>Vai trò</th>
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
                users.map((u, i) => (
                  <tr key={u.id}>
                    <td
                      style={{
                        color: "var(--text-light)",
                        fontSize: "0.82rem",
                      }}
                    >
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
                            fontSize: "0.9rem",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          {u.avatar ? (
                            <img
                              src={`http://localhost:8080${u.avatar}`}
                              alt=""
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            u.firstName?.charAt(0)
                          )}
                        </div>
                        <span style={{ fontWeight: 600 }}>
                          {u.lastName} {u.firstName}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: "0.88rem" }}>{u.email}</td>
                    <td style={{ fontSize: "0.88rem" }}>{u.phone || "—"}</td>
                    <td>
                      <span
                        className={`badge badge-${u.role === "admin" ? "danger" : u.role === "doctor" ? "primary" : "secondary"}`}
                      >
                        {ROLES[u.role]}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => openEdit(u)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(u.id)}
                        >
                          🗑️
                        </button>
                      </div>
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
          <div className="modal-box">
            <div className="modal-header">
              <h3>
                {editUser ? "Cập nhật người dùng" : "Thêm người dùng mới"}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
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
                  <label className="form-label">Email *</label>
                  <input
                    className="form-control"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    required
                    disabled={!!editUser}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Mật khẩu {!editUser && "*"}
                  </label>
                  <input
                    className="form-control"
                    type="password"
                    value={form.password}
                    onChange={set("password")}
                    required={!editUser}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SĐT</label>
                  <input
                    className="form-control"
                    value={form.phone}
                    onChange={set("phone")}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Vai trò</label>
                  <select
                    className="form-control"
                    value={form.role}
                    onChange={set("role")}
                  >
                    <option value="patient">Bệnh nhân</option>
                    <option value="doctor">Bác sĩ</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
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
                  {editUser ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
