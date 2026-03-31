import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { clinicAPI } from "../services/api";

const Clinics = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clinicAPI.getAll().then((r) => {
      setClinics(r.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>Cơ sở y tế</h1>
          <p>Các bệnh viện và phòng khám uy tín trên toàn quốc</p>
        </div>
      </div>
      <div className="container section">
        {loading ? (
          <div className="spinner" />
        ) : (
          <div className="grid-4">
            {clinics.map((clinic) => (
              <Link
                key={clinic.id}
                to={`/clinics/${clinic.id}`}
                className="card"
                style={{ display: "block" }}
              >
                <div
                  style={{
                    height: 160,
                    background: "var(--primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {clinic.image ? (
                    <img
                      src={`http://localhost:8080${clinic.image}`}
                      alt={clinic.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "4rem" }}>🏥</span>
                  )}
                </div>
                <div style={{ padding: "16px" }}>
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      marginBottom: 6,
                    }}
                  >
                    {clinic.name}
                  </h3>
                  <p
                    style={{ fontSize: "0.82rem", color: "var(--text-medium)" }}
                  >
                    📍 {clinic.address}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clinics;
