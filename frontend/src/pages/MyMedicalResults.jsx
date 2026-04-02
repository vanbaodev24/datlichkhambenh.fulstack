import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import { medicalResultAPI } from "../services/api";

const MyMedicalResults = () => {
  const { user } = useSelector((s) => s.auth);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    medicalResultAPI
      .getMyResults()
      .then((r) => setResults(r.data || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>
          📋 Kết quả khám bệnh
        </h1>
        <p style={{ color: "var(--text-medium)", marginTop: 6 }}>
          Xem lại toàn bộ kết quả khám của bạn
        </p>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : results.length === 0 ? (
        <div
          className="card"
          style={{ padding: "80px 20px", textAlign: "center" }}
        >
          <div style={{ fontSize: "4rem", marginBottom: 16 }}>📭</div>
          <h3 style={{ marginBottom: 8 }}>Chưa có kết quả khám nào</h3>
          <p style={{ color: "var(--text-medium)", marginBottom: 24 }}>
            Kết quả sẽ hiển thị sau khi bác sĩ nhập xong
          </p>
          <Link to="/doctors" className="btn btn-primary">
            Đặt lịch khám ngay
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {results.map((r) => (
            <div
              key={r.id}
              className="card"
              style={{
                padding: 20,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 20,
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "var(--primary-light)",
                      color: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.3rem",
                    }}
                  >
                    📋
                  </div>
                  <div>
                    <strong style={{ fontSize: "1rem" }}>
                      Kết quả khám ngày{" "}
                      {moment(r.resultDate).format("DD/MM/YYYY")}
                    </strong>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--text-medium)",
                        marginTop: 2,
                      }}
                    >
                      Mã phiếu: #{r.id} · Tạo lúc:{" "}
                      {moment(r.createdAt).format("HH:mm DD/MM/YYYY")}
                    </div>
                  </div>
                </div>
                {r.diagnosis && (
                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--text-medium)",
                      background: "var(--bg-light)",
                      padding: "8px 12px",
                      borderRadius: 8,
                    }}
                  >
                    🔍 <strong>Chẩn đoán:</strong> {r.diagnosis}
                  </p>
                )}
                {r.conclusion && (
                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--text-medium)",
                      marginTop: 8,
                      padding: "8px 12px",
                      background: "#e8f9fb",
                      borderRadius: 8,
                    }}
                  >
                    ✅ <strong>Kết luận:</strong> {r.conclusion}
                  </p>
                )}
              </div>
              <Link
                to={`/medical-result-view/${r.id}`}
                className="btn btn-primary btn-sm"
              >
                👁️ Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMedicalResults;
