import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doctorAPI, specialtyAPI, clinicAPI } from "../services/api";
import "./Home.css";

const specialtyIcons = [
  "🫀",
  "🧠",
  "👶",
  "🌿",
  "👁️",
  "👂",
  "🦴",
  "🤰",
  "🦷",
  "💊",
];

const Home = () => {
  const [topDoctors, setTopDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [d, s, c] = await Promise.all([
          doctorAPI.getTop(),
          specialtyAPI.getAll(),
          clinicAPI.getAll(),
        ]);
        setTopDoctors(d.data || []);
        setSpecialties(s.data || []);
        setClinics(c.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim())
      navigate(`/doctors?search=${encodeURIComponent(searchTerm)}`);
  };

  const stats = [
    { label: "Bác sĩ chuyên khoa", value: "500+", icon: "🩺" },
    { label: "Bệnh viện & Phòng khám", value: "100+", icon: "🏥" },
    { label: "Lượt đặt lịch", value: "1M+", icon: "📅" },
    { label: "Người dùng tin tưởng", value: "200K+", icon: "❤️" },
  ];

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-badge">🌟 Nền tảng y tế tin cậy #1</div>
            <h1>
              Đặt lịch khám
              <br />
              <span>nhanh – dễ – tiện</span>
            </h1>
            <p>
              Kết nối với hơn 500 bác sĩ chuyên khoa hàng đầu. Đặt lịch chỉ
              trong 30 giây, không cần chờ đợi.
            </p>
            <form className="search-bar" onSubmit={handleSearch}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm bác sĩ, chuyên khoa, bệnh viện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Tìm kiếm
              </button>
            </form>
            <div className="hero-tags">
              {["Tim mạch", "Nhi khoa", "Da liễu", "Thần kinh"].map((t) => (
                <Link
                  key={t}
                  to={`/doctors?specialty=${t}`}
                  className="hero-tag"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-card-float hero-card-1">
              <span>✅</span>
              <div>
                <strong>Đặt lịch thành công!</strong>
                <p>Bác sĩ Nguyễn Văn A - 9:00 sáng</p>
              </div>
            </div>
            <div className="hero-illustration">
              <div className="hero-circle-1" />
              <div className="hero-circle-2" />
              <div className="hero-emoji">🩺</div>
            </div>
            <div className="hero-card-float hero-card-2">
              <span>⭐</span>
              <div>
                <strong>4.9/5</strong>
                <p>Đánh giá từ bệnh nhân</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Khám theo chuyên khoa</h2>
              <p className="section-subtitle">
                Chọn chuyên khoa phù hợp với nhu cầu của bạn
              </p>
            </div>
            <Link to="/specialties" className="btn btn-outline">
              Xem tất cả →
            </Link>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : (
            <div className="specialty-grid">
              {specialties.slice(0, 8).map((sp, i) => (
                <Link
                  key={sp.id}
                  to={`/specialties/${sp.id}`}
                  className="specialty-card"
                >
                  <div className="specialty-icon">
                    {specialtyIcons[i % specialtyIcons.length]}
                  </div>
                  <span>{sp.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top Doctors */}
      <section className="section section-tinted">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Bác sĩ nổi bật</h2>
              <p className="section-subtitle">
                Những bác sĩ được bệnh nhân tin tưởng nhất
              </p>
            </div>
            <Link to="/doctors" className="btn btn-outline">
              Xem tất cả →
            </Link>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : (
            <div className="doctor-grid">
              {topDoctors.map((doc) => (
                <Link
                  key={doc.id}
                  to={`/doctors/${doc.userId}`}
                  className="doctor-card card"
                >
                  <div className="doctor-card-top">
                    <div className="doctor-avatar-wrap">
                      {doc.userData?.avatar ? (
                        <img
                          src={`http://localhost:8080${doc.userData.avatar}`}
                          alt=""
                          className="doctor-avatar-img"
                        />
                      ) : (
                        <div className="doctor-avatar-placeholder">
                          {doc.userData?.firstName?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="doctor-rating">⭐ 4.9</div>
                  </div>
                  <div className="doctor-card-body">
                    <div className="doctor-position">
                      {doc.userData?.positionData?.valueVi || "Bác sĩ"}
                    </div>
                    <h3>
                      {doc.userData?.lastName} {doc.userData?.firstName}
                    </h3>
                    <p className="doctor-specialty">
                      {doc.specialtyData?.name}
                    </p>
                    <div className="doctor-price">
                      {doc.priceData?.valueVi || "Liên hệ"}
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        marginTop: 12,
                      }}
                    >
                      Đặt lịch ngay
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Clinics */}
      {clinics.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Cơ sở y tế nổi bật</h2>
                <p className="section-subtitle">
                  Các bệnh viện và phòng khám uy tín
                </p>
              </div>
              <Link to="/clinics" className="btn btn-outline">
                Xem tất cả →
              </Link>
            </div>
            <div className="clinic-grid">
              {clinics.slice(0, 4).map((clinic) => (
                <Link
                  key={clinic.id}
                  to={`/clinics/${clinic.id}`}
                  className="clinic-card card"
                >
                  <div className="clinic-img">
                    {clinic.image ? (
                      <img
                        src={`http://localhost:8080${clinic.image}`}
                        alt={clinic.name}
                      />
                    ) : (
                      <div className="clinic-img-placeholder">🏥</div>
                    )}
                  </div>
                  <div className="clinic-info">
                    <h3>{clinic.name}</h3>
                    <p>📍 {clinic.address}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why us */}
      <section className="section section-tinted">
        <div className="container">
          <h2
            className="section-title"
            style={{ textAlign: "center", marginBottom: 8 }}
          >
            Tại sao chọn BookingCare?
          </h2>
          <p
            className="section-subtitle"
            style={{ textAlign: "center", marginBottom: 40 }}
          >
            Chúng tôi cam kết mang lại trải nghiệm tốt nhất
          </p>
          <div className="features-grid">
            {[
              {
                icon: "⚡",
                title: "Đặt lịch nhanh chóng",
                desc: "Chỉ cần 3 bước đơn giản, lịch hẹn được xác nhận ngay lập tức",
              },
              {
                icon: "🔒",
                title: "Bảo mật thông tin",
                desc: "Dữ liệu cá nhân được mã hóa và bảo vệ tuyệt đối",
              },
              {
                icon: "👨‍⚕️",
                title: "Bác sĩ được xét duyệt",
                desc: "100% bác sĩ có chứng chỉ hành nghề được kiểm duyệt kỹ lưỡng",
              },
              {
                icon: "💬",
                title: "Hỗ trợ 24/7",
                desc: "Đội ngũ hỗ trợ sẵn sàng giải đáp mọi thắc mắc của bạn",
              },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <h2>Bạn là bác sĩ?</h2>
            <p>
              Tham gia cùng hàng trăm bác sĩ đang sử dụng BookingCare để quản lý
              lịch hẹn hiệu quả
            </p>
          </div>
          <Link to="/register" className="btn btn-primary btn-lg">
            Đăng ký ngay →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
