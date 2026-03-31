import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { specialtyAPI } from "../../services/api";

const AdminSpecialties = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    name: "",
    descriptionHTML: "",
    descriptionMarkdown: "",
  });

  const fetch = useCallback(() => {
    setLoading(true);
    specialtyAPI.getAll().then((r) => {
      setSpecialties(r.data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: "", descriptionHTML: "", descriptionMarkdown: "" });
    setShowModal(true);
  };
  const openEdit = (s) => {
    setEditItem(s);
    setForm({
      name: s.name,
      descriptionHTML: s.descriptionHTML || "",
      descriptionMarkdown: s.descriptionMarkdown || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v) fd.append(k, v);
    });
    try {
      if (editItem) {
        await specialtyAPI.update(editItem.id, fd);
        toast.success("Cập nhật thành công!");
      } else {
        await specialtyAPI.create(fd);
        toast.success("Thêm chuyên khoa thành công!");
      }
      setShowModal(false);
      fetch();
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa chuyên khoa này?")) return;
    await specialtyAPI.delete(id);
    toast.success("Đã xóa!");
    fetch();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h2>🩺 Quản lý chuyên khoa</h2>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>
          + Thêm chuyên khoa
        </button>
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tên chuyên khoa</th>
                <th>Hình ảnh</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: 40 }}>
                    Đang tải...
                  </td>
                </tr>
              ) : (
                specialties.map((s, i) => (
                  <tr key={s.id}>
                    <td style={{ color: "var(--text-light)" }}>{i + 1}</td>
                    <td>
                      <strong>{s.name}</strong>
                    </td>
                    <td>
                      {s.image ? (
                        <img
                          src={`http://localhost:8080${s.image}`}
                          alt=""
                          style={{
                            width: 60,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => openEdit(s)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(s.id)}
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
      </div>
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="modal-box">
            <div className="modal-header">
              <h3>{editItem ? "Sửa chuyên khoa" : "Thêm chuyên khoa"}</h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tên chuyên khoa *</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả HTML</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={form.descriptionHTML}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, descriptionHTML: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hình ảnh</label>
                <input
                  className="form-control"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, image: e.target.files[0] }))
                  }
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
                  {editItem ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSpecialties;
