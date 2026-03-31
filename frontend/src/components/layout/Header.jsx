import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import './Header.css';

const Header = () => {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">🏥</span>
          <span className="logo-text">BookingCare</span>
        </Link>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/doctors" className="nav-link" onClick={() => setMenuOpen(false)}>Bác sĩ</Link>
          <Link to="/specialties" className="nav-link" onClick={() => setMenuOpen(false)}>Chuyên khoa</Link>
          <Link to="/clinics" className="nav-link" onClick={() => setMenuOpen(false)}>Cơ sở y tế</Link>
        </nav>

        <div className="header-actions">
          {user ? (
            <div className="user-menu" onClick={() => setDropOpen(!dropOpen)}>
              <div className="user-avatar">
                {user.avatar ? <img src={`http://localhost:8080${user.avatar}`} alt="" /> : user.firstName?.charAt(0)}
              </div>
              <span className="user-name">{user.firstName} {user.lastName}</span>
              <span className="chevron">▾</span>
              {dropOpen && (
                <div className="dropdown">
                  {user.role === 'admin' && <Link to="/admin" className="drop-item">⚙️ Quản trị</Link>}
                  {user.role === 'doctor' && <Link to="/doctor-dashboard" className="drop-item">🩺 Dashboard</Link>}
                  <Link to="/profile" className="drop-item">👤 Hồ sơ</Link>
                  <Link to="/my-bookings" className="drop-item">📅 Lịch hẹn</Link>
                  <button onClick={handleLogout} className="drop-item drop-logout">🚪 Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-outline btn-sm">Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Đăng ký</Link>
            </div>
          )}
          <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
