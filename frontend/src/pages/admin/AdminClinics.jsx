import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { clinicAPI } from "../../services/api";

const AdminClinics = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    descriptionHTML: "",
  });

  const fetch = useCallback(() => {
    setLoading(true);
    clinicAPI.getAll().then((r) => {
      setClinics(r.data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: "", address: "", descriptionHTML: "" });
    setShowModal(true);
  };
  const openEdit = (c) => {
    setEditItem(c);
    setForm({
      name: c.name,
      address: c.address || "",
      descriptionHTML: c.descriptionHTML || "",
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
        await clinicAPI.update(editItem.id, fd);
        toast.success("Cập nhật thành công!");
      } else {
        await clinicAPI.create(fd);
        toast.success("Thêm cơ sở y tế thành công!");
      }
      setShowModal(false);
      fetch();
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa cơ sở y tế này?")) return;
    await clinicAPI.delete(id);
    toast.success("Đã xóa!");
    fetch();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h2>🏥 Quản lý cơ sở y tế</h2>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>
          + Thêm cơ sở
        </button>
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tên cơ sở</th>
                <th>Địa chỉ</th>
                <th>Ảnh</th>
                <th>Thao tác</th>
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
                clinics.map((c, i) => (
                  <tr key={c.id}>
                    <td style={{ color: "var(--text-light)" }}>{i + 1}</td>
                    <td>
                      <strong>{c.name}</strong>
                    </td>
                    <td
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-medium)",
                      }}
                    >
                      📍 {c.address}
                    </td>
                    <td>
                      {c.image ? (
                        <img
                          src={`http://localhost:8080${c.image}`}
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
                          onClick={() => openEdit(c)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(c.id)}
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
              <h3>{editItem ? "Sửa cơ sở y tế" : "Thêm cơ sở y tế"}</h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tên cơ sở *</label>
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
                <label className="form-label">Địa chỉ</label>
                <input
                  className="form-control"
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea
                  className="form-control"
                  rows={3}
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

export default AdminClinics;
