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
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const specialtyId = searchParams.get("specialtyId") || "";

  useEffect(() => {
    specialtyAPI.getAll().then((r) => setSpecialties(r.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (search) params.search = search;
    if (specialtyId) params.specialtyId = specialtyId;

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
  }, [page, search, specialtyId]);

  const totalPages = Math.ceil(total / 12);

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
              <label className={`filter-item ${!specialtyId ? "active" : ""}`}>
                <input
                  type="radio"
                  name="specialty"
                  checked={!specialtyId}
                  onChange={() => {
                    setSearchParams(search ? { search } : {});
                    setPage(1);
                  }}
                />
                Tất cả chuyên khoa
              </label>
              {specialties.map((sp) => (
                <label
                  key={sp.id}
                  className={`filter-item ${specialtyId == sp.id ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="specialty"
                    checked={specialtyId == sp.id}
                    onChange={() => {
                      setSearchParams(
                        search
                          ? { search, specialtyId: sp.id }
                          : { specialtyId: sp.id },
                      );
                      setPage(1);
                    }}
                  />
                  {sp.name}
                </label>
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
                  defaultValue={search}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSearchParams(
                        e.target.value
                          ? { search: e.target.value, specialtyId }
                          : { specialtyId },
                      );
                      setPage(1);
                    }
                  }}
                />
              </div>
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
                    to={`/doctors/${doc.userId}`}
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
                        🏥 {doc.specialtyData?.name}
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
