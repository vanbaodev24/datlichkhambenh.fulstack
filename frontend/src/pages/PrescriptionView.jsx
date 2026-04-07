import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import moment from "moment";
import { prescriptionAPI } from "../services/api";

const PrescriptionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    prescriptionAPI
      .getById(id)
      .then((r) => {
        setPrescription(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (!prescription)
    return (
      <div
        className="container"
        style={{ padding: "80px 20px", textAlign: "center" }}
      >
        <h2>Không tìm thấy đơn thuốc</h2>
        <button
          className="btn btn-outline"
          onClick={() => navigate(-1)}
          style={{ marginTop: 16 }}
        >
          ← Quay lại
        </button>
      </div>
    );

  const p = prescription;

  return (
    <div
      style={{ background: "var(--bg-light)", minHeight: "calc(100vh - 68px)" }}
    >
      {/* Toolbar */}
      <div
        className="no-print"
        style={{
          background: "#fff",
          borderBottom: "1px solid var(--border)",
          padding: "12px 0",
          position: "sticky",
          top: 68,
          zIndex: 100,
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => window.print()}
          >
            🖨️ In đơn thuốc
          </button>
        </div>
      </div>

      <div className="container" style={{ padding: "28px 20px" }}>
        <div
          className="card"
          style={{ padding: 32, maxWidth: 800, margin: "0 auto" }}
        >
          {/* Tiêu đề */}
          <div
            style={{
              textAlign: "center",
              marginBottom: 24,
              borderBottom: "2px solid var(--primary)",
              paddingBottom: 16,
            }}
          >
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--primary)",
                letterSpacing: 2,
              }}
            >
              ĐƠN THUỐC
            </h1>
            <p
              style={{
                color: "var(--text-medium)",
                fontSize: "0.85rem",
                marginTop: 4,
              }}
            >
              Số: #{p.id} · Ngày:{" "}
              {moment(p.prescribedDate).format("DD/MM/YYYY")}
            </p>
          </div>

          {/* Thông tin bác sĩ & bệnh nhân */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                background: "var(--primary-light)",
                borderRadius: 10,
                padding: "14px 18px",
              }}
            >
              <p
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--primary-dark)",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Bác sĩ kê đơn
              </p>
              <strong style={{ display: "block", fontSize: "1rem" }}>
                BS. {p.doctorData?.userData?.lastName}{" "}
                {p.doctorData?.userData?.firstName}
              </strong>
            </div>
            <div
              style={{
                background: "var(--bg-light)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "14px 18px",
              }}
            >
              <p
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--text-medium)",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Bệnh nhân
              </p>
              <strong style={{ display: "block", fontSize: "1rem" }}>
                {p.patientName}
              </strong>
              <span
                style={{ fontSize: "0.82rem", color: "var(--text-medium)" }}
              >
                {p.patientGender}
                {p.patientDob &&
                  ` · ${moment(p.patientDob).format("DD/MM/YYYY")}`}
              </span>
              {p.patientAddress && (
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-medium)",
                    marginTop: 4,
                  }}
                >
                  📍 {p.patientAddress}
                </p>
              )}
            </div>
          </div>

          {/* Chẩn đoán */}
          {p.diagnosis && (
            <div
              style={{
                background: "#fff3cd",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 20,
              }}
            >
              <strong style={{ color: "#856404" }}>🔍 Chẩn đoán: </strong>
              <span style={{ color: "#533f03" }}>{p.diagnosis}</span>
            </div>
          )}

          {/* Danh sách thuốc */}
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              marginBottom: 14,
              color: "var(--text-dark)",
            }}
          >
            💊 Danh sách thuốc
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 24,
              fontSize: "0.88rem",
            }}
          >
            <thead>
              <tr style={{ background: "var(--primary)" }}>
                <th
                  style={{
                    padding: "10px 12px",
                    color: "#fff",
                    textAlign: "left",
                    width: 30,
                  }}
                >
                  STT
                </th>
                <th
                  style={{
                    padding: "10px 12px",
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  Tên thuốc
                </th>
                <th
                  style={{
                    padding: "10px 12px",
                    color: "#fff",
                    textAlign: "center",
                    width: 80,
                  }}
                >
                  SL
                </th>
                <th
                  style={{
                    padding: "10px 12px",
                    color: "#fff",
                    textAlign: "center",
                    width: 80,
                  }}
                >
                  Đơn vị
                </th>
                <th
                  style={{
                    padding: "10px 12px",
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  Liều dùng
                </th>
                <th
                  style={{
                    padding: "10px 12px",
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  Cách dùng
                </th>
              </tr>
            </thead>
            <tbody>
              {p.items?.map((item, idx) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: idx % 2 === 0 ? "#fff" : "var(--bg-light)",
                  }}
                >
                  <td
                    style={{
                      padding: "10px 12px",
                      textAlign: "center",
                      color: "var(--text-medium)",
                    }}
                  >
                    {idx + 1}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <strong
                      style={{ display: "block", color: "var(--primary)" }}
                    >
                      {item.medicineName}
                    </strong>
                    {item.medicineCode && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-light)",
                        }}
                      >
                        Mã: {item.medicineCode}
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      textAlign: "center",
                      fontWeight: 700,
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    {item.unit}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ display: "block" }}>{item.dosage}</span>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text-medium)",
                      }}
                    >
                      {item.frequency} · {item.duration}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ display: "block" }}>{item.instruction}</span>
                    {item.note && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-medium)",
                        }}
                      >
                        📝 {item.note}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Lời dặn */}
          {p.note && (
            <div
              style={{
                background: "var(--primary-light)",
                borderRadius: 8,
                padding: "14px 18px",
                marginBottom: 20,
              }}
            >
              <strong style={{ color: "var(--primary-dark)" }}>
                📝 Lời dặn của bác sĩ:
              </strong>
              <p style={{ marginTop: 6, color: "var(--text-dark)" }}>
                {p.note}
              </p>
            </div>
          )}

          {/* Ngày tái khám */}
          {p.revisitDate && (
            <div
              style={{
                background: "#d4edda",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 20,
              }}
            >
              <strong style={{ color: "#155724" }}>📅 Ngày tái khám: </strong>
              <strong style={{ color: "#155724" }}>
                {moment(p.revisitDate).format("DD/MM/YYYY")}
              </strong>
            </div>
          )}

          {/* Chữ ký */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
              marginTop: 32,
              textAlign: "center",
              fontSize: "0.85rem",
            }}
          >
            <div>
              <p style={{ color: "var(--text-medium)" }}>Bệnh nhân ký tên</p>
              <div style={{ height: 56 }} />
              <p style={{ fontWeight: 700 }}>{p.patientName}</p>
            </div>
            <div>
              <p style={{ color: "var(--text-medium)" }}>
                Ngày {moment(p.prescribedDate).format("DD")} tháng{" "}
                {moment(p.prescribedDate).format("MM")} năm{" "}
                {moment(p.prescribedDate).format("YYYY")}
              </p>
              <div style={{ height: 56 }} />
              <p style={{ fontWeight: 700 }}>
                BS. {p.doctorData?.userData?.lastName}{" "}
                {p.doctorData?.userData?.firstName}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          header, footer { display: none !important; }
          body { background: white; }
          .card { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PrescriptionView;
