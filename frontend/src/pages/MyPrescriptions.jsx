import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { prescriptionAPI } from "../services/api";

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    prescriptionAPI
      .getPatient()
      .then((r) => {
        setPrescriptions(r.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>
          💊 Đơn thuốc của tôi
        </h1>
        <p style={{ color: "var(--text-medium)", marginTop: 6 }}>
          Xem lại tất cả đơn thuốc đã được kê
        </p>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : prescriptions.length === 0 ? (
        <div
          className="card"
          style={{ padding: "80px 20px", textAlign: "center" }}
        >
          <div style={{ fontSize: "4rem", marginBottom: 16 }}>💊</div>
          <h3 style={{ marginBottom: 8 }}>Chưa có đơn thuốc nào</h3>
          <p style={{ color: "var(--text-medium)" }}>
            Đơn thuốc sẽ hiển thị sau khi bác sĩ kê đơn
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {prescriptions.map((p) => (
            <div
              key={p.id}
              className="card"
              style={{
                padding: 20,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 20,
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    flexShrink: 0,
                  }}
                >
                  💊
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 4,
                    }}
                  >
                    <strong style={{ fontSize: "1rem" }}>
                      Đơn thuốc #{p.id}
                    </strong>
                    <span
                      className={`badge badge-${p.status === "active" ? "primary" : p.status === "completed" ? "success" : "danger"}`}
                    >
                      {p.status === "active"
                        ? "✅ Đang dùng"
                        : p.status === "completed"
                          ? "🏁 Hoàn thành"
                          : "❌ Đã hủy"}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-medium)",
                      display: "flex",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <span>
                      📅 Ngày kê:{" "}
                      {moment(p.prescribedDate).format("DD/MM/YYYY")}
                    </span>
                    <span>
                      👨‍⚕️ BS. {p.doctorData?.userData?.lastName}{" "}
                      {p.doctorData?.userData?.firstName}
                    </span>
                    <span>💊 {p.items?.length} loại thuốc</span>
                    {p.revisitDate && (
                      <span>
                        🔄 Tái khám:{" "}
                        {moment(p.revisitDate).format("DD/MM/YYYY")}
                      </span>
                    )}
                  </div>
                  {p.diagnosis && (
                    <p
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--text-medium)",
                        marginTop: 6,
                        background: "var(--bg-light)",
                        padding: "4px 10px",
                        borderRadius: 6,
                      }}
                    >
                      🔍 {p.diagnosis}
                    </p>
                  )}
                </div>
              </div>
              <Link
                to={`/prescription-view/${p.id}`}
                className="btn btn-primary btn-sm"
              >
                👁️ Xem đơn
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPrescriptions;
