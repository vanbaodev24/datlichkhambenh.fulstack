import React, { useState, useEffect } from "react";
import { notificationAPI } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import "./Header.css";

const Header = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      notificationAPI
        .getUnreadCount()
        .then((r) => setUnreadCount(r.data || 0))
        .catch(() => {});
      const interval = setInterval(() => {
        notificationAPI
          .getUnreadCount()
          .then((r) => setUnreadCount(r.data || 0))
          .catch(() => {});
      }, 30000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">🏥</span>
          <span className="logo-text">BookingCare</span>
        </Link>

        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <Link
            to="/doctors"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Bác sĩ
          </Link>
          <Link
            to="/specialties"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Chuyên khoa
          </Link>
          <Link
            to="/clinics"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Cơ sở y tế
          </Link>
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              {/* Bell icon thông báo */}
              <Link
                to="/notifications"
                style={{
                  position: "relative",
                  padding: "6px 8px",
                  display: "flex",
                  alignItems: "center",
                  color: "var(--text-medium)",
                  fontSize: "1.3rem",
                  textDecoration: "none",
                }}
                title="Thông báo"
              >
                🔔
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "#e74c3c",
                      color: "#fff",
                      borderRadius: "50%",
                      width: 18,
                      height: 18,
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* User dropdown */}
              <div className="user-menu" onClick={() => setDropOpen(!dropOpen)}>
                <div className="user-avatar">
                  {user.avatar ? (
                    <img src={`http://localhost:8080${user.avatar}`} alt="" />
                  ) : (
                    user.firstName?.charAt(0)
                  )}
                </div>
                <span className="user-name">
                  {user.firstName} {user.lastName}
                </span>
                <span className="chevron">▾</span>

                {dropOpen && (
                  <div className="dropdown">
                    {user.role === "admin" && (
                      <Link to="/admin" className="drop-item">
                        ⚙️ Quản trị
                      </Link>
                    )}
                    {user.role === "doctor" && (
                      <Link to="/doctor-dashboard" className="drop-item">
                        🩺 Dashboard
                      </Link>
                    )}
                    {user.role === "consultant" && (
                      <Link to="/consultant-dashboard" className="drop-item">
                        💼 Dashboard
                      </Link>
                    )}
                    <Link to="/profile" className="drop-item">
                      👤 Hồ sơ
                    </Link>
                    <Link to="/my-bookings" className="drop-item">
                      📅 Lịch hẹn
                    </Link>
                    {user.role === "patient" && (
                      <Link to="/my-results" className="drop-item">
                        📋 Kết quả khám
                      </Link>
                    )}
                    {user.role === "patient" && (
                      <Link to="/my-prescriptions" className="drop-item">
                        💊 Đơn thuốc
                      </Link>
                    )}
                    <Link to="/notifications" className="drop-item">
                      🔔 Thông báo
                      {unreadCount > 0 && (
                        <span
                          style={{
                            background: "#e74c3c",
                            color: "#fff",
                            borderRadius: 10,
                            padding: "1px 7px",
                            fontSize: "0.72rem",
                            marginLeft: 6,
                            fontWeight: 700,
                          }}
                        >
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="drop-item drop-logout"
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-outline btn-sm">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Đăng ký
              </Link>
            </div>
          )}
          <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
