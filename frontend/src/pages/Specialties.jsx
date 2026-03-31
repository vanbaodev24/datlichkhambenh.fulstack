import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { specialtyAPI } from "../services/api";
import "./Specialties.css";

const icons = [
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
  "🩺",
  "🧪",
];

const Specialties = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    specialtyAPI.getAll().then((r) => {
      setSpecialties(r.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>Khám theo chuyên khoa</h1>
          <p>Tìm bác sĩ theo chuyên khoa phù hợp với nhu cầu của bạn</p>
        </div>
      </div>
      <div className="container section">
        {loading ? (
          <div className="spinner" />
        ) : (
          <div className="sp-grid">
            {specialties.map((sp, i) => (
              <Link
                key={sp.id}
                to={`/specialties/${sp.id}`}
                className="sp-card card"
              >
                <div className="sp-img">
                  {sp.image ? (
                    <img
                      src={`http://localhost:8080${sp.image}`}
                      alt={sp.name}
                    />
                  ) : (
                    <span className="sp-icon">{icons[i % icons.length]}</span>
                  )}
                </div>
                <div className="sp-body">
                  <h3>{sp.name}</h3>
                  <span className="sp-link">Xem bác sĩ →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Specialties;
