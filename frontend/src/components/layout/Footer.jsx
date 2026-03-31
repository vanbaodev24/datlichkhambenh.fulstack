import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-grid">
      <div className="footer-brand">
        <div className="footer-logo">🏥 BookingCare</div>
        <p>Nền tảng đặt lịch khám bệnh trực tuyến hàng đầu Việt Nam. Kết nối bệnh nhân với bác sĩ nhanh chóng, tiện lợi.</p>
        <div className="social-links">
          <a href="#!" className="social-btn">f</a>
          <a href="#!" className="social-btn">in</a>
          <a href="#!" className="social-btn">yt</a>
        </div>
      </div>
      <div className="footer-col">
        <h4>Dịch vụ</h4>
        <Link to="/doctors">Đặt lịch bác sĩ</Link>
        <Link to="/specialties">Chuyên khoa</Link>
        <Link to="/clinics">Cơ sở y tế</Link>
      </div>
      <div className="footer-col">
        <h4>Hỗ trợ</h4>
        <Link to="/about">Về chúng tôi</Link>
        <Link to="/contact">Liên hệ</Link>
        <Link to="/faq">Câu hỏi thường gặp</Link>
        <Link to="/terms">Điều khoản sử dụng</Link>
      </div>
      <div className="footer-col">
        <h4>Liên hệ</h4>
        <p>📍 Số 1 Nguyễn Lương Bằng, Hà Nội</p>
        <p>📞 1900 1234</p>
        <p>✉️ contact@bookingcare.vn</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2024 BookingCare. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
