import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { doctorAPI, specialtyAPI } from "../services/api";
import "./Doctors.css";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const specialtyId = searchParams.get("specialtyId") || "";
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    specialtyAPI
      .getAll()
      .then((r) => setSpecialties(r.data || []))
      .catch(() => setSpecialties([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (searchQuery) params.search = searchQuery;
    if (specialtyId) params.specialtyId = specialtyId;

    console.log("=== FETCH DOCTORS ===", params);

    doctorAPI
      .getAll(params)
      .then((r) => {
        setDoctors(r.data || []);
        setTotal(r.total || 0);
      })
      .catch((err) => {
        console.error("Doctors error:", err);
        setDoctors([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [page, searchQuery, specialtyId]);

  const totalPages = Math.ceil(total / 12);

  const handleSearch = () => {
    const val = searchInput.trim();
    // Khi search theo tên: xóa specialtyId
    setSearchParams(val ? { search: val } : {});
    setPage(1);
  };

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>Đội ngũ bác sĩ</h1>
          <p>Tìm và đặt lịch với bác sĩ phù hợp nhất cho bạn</p>
        </div>
      </div>

      <div className="container" style={{ padding: "36px 20px" }}>
        <div className="doctors-layout">
          {/* Filters sidebar */}
          <aside className="filters-sidebar">
            <h3>Lọc theo chuyên khoa</h3>
            <div className="filter-list">
              <div
                className={`filter-item ${!specialtyId ? "active" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSearchInput("");
                  setSearchParams({});
                  setPage(1);
                }}
              >
                Tất cả chuyên khoa
              </div>
              {specialties.map((sp) => (
                <div
                  key={sp.id}
                  className={`filter-item ${String(specialtyId) === String(sp.id) ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSearchInput("");
                    setSearchParams({ specialtyId: String(sp.id) });
                    setPage(1);
                  }}
                >
                  {sp.name}
                </div>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <div className="doctors-main">
            <div className="doctors-toolbar">
              <div className="search-input-wrap">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Tìm theo tên bác sĩ..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput("");
                      setSearchParams(specialtyId ? { specialtyId } : {});
                      setPage(1);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1rem",
                      color: "var(--text-light)",
                      padding: "0 4px",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleSearch}>
                Tìm
              </button>
              <span className="result-count">{total} bác sĩ</span>
            </div>

            {loading ? (
              <div className="spinner" />
            ) : doctors.length === 0 ? (
              <div className="empty-state">
                <div>👨‍⚕️</div>
                <h3>Không tìm thấy bác sĩ</h3>
                <p>Thử thay đổi từ khóa hoặc chuyên khoa</p>
              </div>
            ) : (
              <div className="doctors-grid">
                {doctors.map((doc) => (
                  <Link
                    key={doc.id}
                    to={`/doctors/${doc.userData?.id}`}
                    className="doctor-list-card card"
                  >
                    <div className="dlc-avatar">
                      {doc.userData?.avatar ? (
                        <img
                          src={`http://localhost:8080${doc.userData.avatar}`}
                          alt=""
                        />
                      ) : (
                        <span>{doc.userData?.firstName?.charAt(0)}</span>
                      )}
                    </div>
                    <div className="dlc-info">
                      <div className="dlc-position">
                        {doc.userData?.positionData?.valueVi || "Bác sĩ"}
                      </div>
                      <h3>
                        {doc.userData?.lastName} {doc.userData?.firstName}
                      </h3>
                      <p className="dlc-specialty">
                        🏥 {doc.specialtyData?.name || "Đa khoa"}
                      </p>
                      <p className="dlc-clinic">
                        📍 {doc.nameClinic || "Đang cập nhật"}
                      </p>
                      <div className="dlc-footer">
                        <span className="dlc-price">
                          {doc.priceData?.valueVi || "Liên hệ"}
                        </span>
                        <button className="btn btn-primary btn-sm">
                          Đặt lịch
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      className={`btn btn-sm ${p === page ? "btn-primary" : "btn-outline"}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Sau →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
