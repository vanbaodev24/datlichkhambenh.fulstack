import React, { useState, useEffect } from "react";
import {
  Link,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import {
  userAPI,
  doctorAPI,
  bookingAPI,
  specialtyAPI,
  clinicAPI,
} from "../services/api";
import AdminUsers from "./admin/AdminUsers";
import AdminDoctors from "./admin/AdminDoctors";
import AdminBookings from "./admin/AdminBookings";
import AdminSpecialties from "./admin/AdminSpecialties";
import AdminClinics from "./admin/AdminClinics";
import "./Admin.css";

const AdminOverview = () => {
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    bookings: 0,
    specialties: 0,
  });

  useEffect(() => {
    Promise.all([
      userAPI.getAll({ limit: 1 }),
      userAPI.getAll({ role: "doctor", limit: 1 }),
      bookingAPI.getAll({ limit: 1 }),
      specialtyAPI.getAll(),
    ])
      .then(([u, d, b, s]) => {
        setStats({
          users: u.total || 0,
          doctors: d.total || 0,
          bookings: b.total || 0,
          specialties: s.data?.length || 0,
        });
      })
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: "Người dùng",
      value: stats.users,
      icon: "👥",
      color: "#3498db",
      link: "/admin/users",
    },
    {
      label: "Bác sĩ",
      value: stats.doctors,
      icon: "👨‍⚕️",
      color: "#2ecc71",
      link: "/admin/doctors",
    },
    {
      label: "Lịch hẹn",
      value: stats.bookings,
      icon: "📅",
      color: "#e67e22",
      link: "/admin/bookings",
    },
    {
      label: "Chuyên khoa",
      value: stats.specialties,
      icon: "🏥",
      color: "#9b59b6",
      link: "/admin/specialties",
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontSize: "1.4rem", fontWeight: 800 }}>
        Tổng quan hệ thống
      </h2>
      <div className="admin-stats">
        {cards.map((c, i) => (
          <Link
            key={i}
            to={c.link}
            className="admin-stat-card"
            style={{ borderTop: `4px solid ${c.color}` }}
          >
            <div
              className="asc-icon"
              style={{ background: c.color + "18", color: c.color }}
            >
              {c.icon}
            </div>
            <div className="asc-value">{c.value}</div>
            <div className="asc-label">{c.label}</div>
          </Link>
        ))}
      </div>
      <div className="admin-quick-actions">
        <h3>Thao tác nhanh</h3>
        <div
          style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}
        >
          <Link to="/admin/users" className="btn btn-primary btn-sm">
            ➕ Thêm người dùng
          </Link>
          <Link to="/admin/specialties" className="btn btn-outline btn-sm">
            ➕ Thêm chuyên khoa
          </Link>
          <Link to="/admin/clinics" className="btn btn-outline btn-sm">
            ➕ Thêm cơ sở y tế
          </Link>
          <Link to="/admin/bookings" className="btn btn-outline btn-sm">
            📋 Xem lịch hẹn
          </Link>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/");
  }, [user]);

  const navItems = [
    { path: "/admin", label: "📊 Tổng quan", exact: true },
    { path: "/admin/users", label: "👥 Người dùng" },
    { path: "/admin/doctors", label: "👨‍⚕️ Bác sĩ" },
    { path: "/admin/bookings", label: "📅 Lịch hẹn" },
    { path: "/admin/specialties", label: "🩺 Chuyên khoa" },
    { path: "/admin/clinics", label: "🏥 Cơ sở y tế" },
  ];

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">⚙️ Admin Panel</div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${isActive(item.path, item.exact) ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/"
          className="admin-nav-item"
          style={{ marginTop: "auto", color: "var(--text-medium)" }}
        >
          ← Về trang chủ
        </Link>
      </aside>
      <main className="admin-main">
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="specialties" element={<AdminSpecialties />} />
          <Route path="clinics" element={<AdminClinics />} />
        </Routes>
      </main>
    </div>
  );
};

export default Admin;
