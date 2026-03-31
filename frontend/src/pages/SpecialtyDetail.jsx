import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { specialtyAPI } from "../services/api";

const SpecialtyDetail = () => {
  const { id } = useParams();
  const [specialty, setSpecialty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    specialtyAPI.getById(id).then((r) => {
      setSpecialty(r.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (!specialty)
    return (
      <div
        className="container"
        style={{ padding: "80px 20px", textAlign: "center" }}
      >
        <h2>Không tìm thấy chuyên khoa</h2>
      </div>
    );

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>{specialty.name}</h1>
        </div>
      </div>
      <div className="container" style={{ padding: "40px 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 32,
            alignItems: "start",
          }}
        >
          <div>
            {specialty.descriptionHTML && (
              <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                <h2
                  style={{
                    marginBottom: 16,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                  }}
                >
                  Thông tin chuyên khoa
                </h2>
                <div
                  style={{ color: "var(--text-medium)", lineHeight: 1.7 }}
                  dangerouslySetInnerHTML={{
                    __html: specialty.descriptionHTML,
                  }}
                />
              </div>
            )}

            {specialty.doctors?.length > 0 && (
              <div>
                <h2
                  style={{
                    marginBottom: 20,
                    fontSize: "1.2rem",
                    fontWeight: 700,
                  }}
                >
                  Bác sĩ chuyên khoa {specialty.name}
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2,1fr)",
                    gap: 16,
                  }}
                >
                  {specialty.doctors.map((doc) => (
                    <Link
                      key={doc.id}
                      to={`/doctors/${doc.userId}`}
                      className="card"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "80px 1fr",
                        gap: 14,
                        padding: 16,
                      }}
                    >
                      <div
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: "50%",
                          overflow: "hidden",
                          background: "var(--primary)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.6rem",
                          fontWeight: 700,
                        }}
                      >
                        {doc.userData?.avatar ? (
                          <img
                            src={`http://localhost:8080${doc.userData.avatar}`}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          doc.userData?.firstName?.charAt(0)
                        )}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--primary)",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Bác sĩ
                        </div>
                        <strong
                          style={{
                            display: "block",
                            margin: "3px 0",
                            fontSize: "0.95rem",
                          }}
                        >
                          {doc.userData?.lastName} {doc.userData?.firstName}
                        </strong>
                        {doc.priceData && (
                          <span
                            style={{
                              fontSize: "0.82rem",
                              color: "var(--secondary)",
                              fontWeight: 600,
                            }}
                          >
                            {doc.priceData.valueVi}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className="card"
            style={{ padding: 22, position: "sticky", top: 90 }}
          >
            <h3 style={{ marginBottom: 14, fontSize: "1rem", fontWeight: 700 }}>
              Đặt lịch nhanh
            </h3>
            <p
              style={{
                fontSize: "0.88rem",
                color: "var(--text-medium)",
                marginBottom: 16,
              }}
            >
              Chọn bác sĩ và đặt lịch khám chuyên khoa {specialty.name}
            </p>
            <Link
              to={`/doctors?specialtyId=${id}`}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Xem tất cả bác sĩ →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialtyDetail;
