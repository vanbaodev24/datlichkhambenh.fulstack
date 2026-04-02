import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { medicalResultAPI } from "../services/api";
import "./MedicalResultForm.css";

const MedicalResultView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy result theo id — cần thêm API endpoint
    medicalResultAPI
      .getById(id)
      .then((r) => {
        setResult(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (!result)
    return (
      <div
        className="container"
        style={{ padding: "80px 20px", textAlign: "center" }}
      >
        <h2>Không tìm thấy kết quả</h2>
      </div>
    );

  const testResults = result.testResults || {};

  return (
    <div
      style={{ background: "var(--bg-light)", minHeight: "calc(100vh - 68px)" }}
    >
      {/* Action bar */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid var(--border)",
          padding: "14px 0",
          position: "sticky",
          top: 68,
          zIndex: 100,
        }}
        className="no-print"
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
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-outline btn-sm" onClick={handlePrint}>
              🖨️ In phiếu
            </button>
          </div>
        </div>
      </div>

      {/* Phiếu kết quả */}
      <div className="container" style={{ padding: "28px 20px" }}>
        <div
          ref={printRef}
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
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "var(--primary)",
                letterSpacing: 2,
              }}
            >
              PHIẾU KẾT QUẢ
            </h1>
          </div>

          {/* Thông tin bệnh nhân */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0,
              marginBottom: 20,
              border: "1px solid var(--border)",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "10px 16px",
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                style={{ color: "var(--text-medium)", fontSize: "0.82rem" }}
              >
                Họ tên:{" "}
              </span>
              <strong>{result.patientName}</strong>
            </div>
            <div
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                style={{ color: "var(--text-medium)", fontSize: "0.82rem" }}
              >
                Đơn vị:{" "}
              </span>
              <strong>Nội trú</strong>
            </div>
            <div
              style={{
                padding: "10px 16px",
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                style={{ color: "var(--text-medium)", fontSize: "0.82rem" }}
              >
                Giới tính:{" "}
              </span>
              <strong>{result.patientGender}</strong>
            </div>
            <div
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                style={{ color: "var(--text-medium)", fontSize: "0.82rem" }}
              >
                Bác sĩ chỉ định:{" "}
              </span>
              <strong>
                {result.doctorData?.userData?.lastName}{" "}
                {result.doctorData?.userData?.firstName}
              </strong>
            </div>
            <div
              style={{
                padding: "10px 16px",
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                style={{ color: "var(--text-medium)", fontSize: "0.82rem" }}
              >
                Năm sinh:{" "}
              </span>
              <strong>
                {result.patientDob
                  ? moment(result.patientDob).format("DD/MM/YYYY")
                  : "—"}
              </strong>
            </div>
            <div
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                style={{ color: "var(--text-medium)", fontSize: "0.82rem" }}
              >
                Ngày xét nghiệm:{" "}
              </span>
              <strong>{moment(result.resultDate).format("DD/MM/YYYY")}</strong>
            </div>
            <div
              style={{
                padding: "10px 16px",
                borderRight: "1px solid var(--border)",
              }}
            >
              <span
                style={{ color: "var(--text-medium)", fontSize: "0.82rem" }}
              >
                SĐT:{" "}
              </span>
              <strong>{result.patientCode || "—"}</strong>
            </div>
            <div style={{ padding: "10px 16px" }}>
              <span
                style={{ color: "var(--text-medium)", fontSize: "0.82rem" }}
              >
                Chẩn đoán:{" "}
              </span>
              <strong>{result.diagnosis || "—"}</strong>
            </div>
          </div>

          {/* Kết quả xét nghiệm */}
          {Object.keys(testResults).length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <table className="mrf-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Danh mục xét nghiệm</th>
                    <th>Kết quả</th>
                    <th>Khoảng tham chiếu</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(testResults).map(([name, data]) => {
                    if (!data.value) return null;
                    const isAbnormal =
                      data.value &&
                      data.ref &&
                      (() => {
                        const parts = data.ref.split("-");
                        if (parts.length === 2) {
                          const num = parseFloat(data.value);
                          return (
                            !isNaN(num) &&
                            (num < parseFloat(parts[0]) ||
                              num > parseFloat(parts[1]))
                          );
                        }
                        return false;
                      })();
                    return (
                      <tr key={name}>
                        <td
                          style={{ color: "var(--primary)", fontWeight: 500 }}
                        >
                          {name}
                        </td>
                        <td
                          style={{
                            color: isAbnormal ? "red" : "inherit",
                            fontWeight: isAbnormal ? 700 : 400,
                          }}
                        >
                          {data.value} {data.unit}
                        </td>
                        <td
                          style={{
                            color: "var(--text-medium)",
                            fontSize: "0.85rem",
                          }}
                        >
                          {data.ref}
                        </td>
                        <td style={{ fontSize: "0.85rem" }}>
                          {data.note || ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Kết luận */}
          {result.conclusion && (
            <div
              style={{
                background: "var(--primary-light)",
                borderRadius: 8,
                padding: "14px 18px",
                marginBottom: 16,
              }}
            >
              <strong style={{ color: "var(--primary-dark)" }}>
                ✅ Kết luận:
              </strong>
              <p style={{ marginTop: 6, color: "var(--text-dark)" }}>
                {result.conclusion}
              </p>
            </div>
          )}
          {result.note && (
            <div
              style={{
                background: "#fff3cd",
                borderRadius: 8,
                padding: "14px 18px",
                marginBottom: 16,
              }}
            >
              <strong style={{ color: "#856404" }}>📝 Lời dặn:</strong>
              <p style={{ marginTop: 6, color: "#533f03" }}>{result.note}</p>
            </div>
          )}

          {/* Thanh toán */}
          <div
            style={{
              borderTop: "2px solid var(--border)",
              paddingTop: 16,
              marginTop: 8,
            }}
          >
            <table style={{ width: "100%", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ background: "var(--primary)" }}>
                  <th
                    style={{
                      padding: "10px 14px",
                      color: "#fff",
                      textAlign: "left",
                    }}
                  >
                    Tổng tiền dịch vụ
                  </th>
                  <th
                    style={{
                      padding: "10px 14px",
                      color: "#fff",
                      textAlign: "left",
                    }}
                  >
                    Giảm giá
                  </th>
                  <th
                    style={{
                      padding: "10px 14px",
                      color: "#fff",
                      textAlign: "left",
                    }}
                  >
                    Tiền đã giảm
                  </th>
                  <th
                    style={{
                      padding: "10px 14px",
                      color: "#fff",
                      textAlign: "left",
                    }}
                  >
                    Tổng tiền thanh toán
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "10px 14px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {(result.totalAmount || 0).toLocaleString("vi-VN")} đ
                  </td>
                  <td
                    style={{
                      padding: "10px 14px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    —
                  </td>
                  <td
                    style={{
                      padding: "10px 14px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {(result.discount || 0).toLocaleString("vi-VN")} đ
                  </td>
                  <td
                    style={{
                      padding: "10px 14px",
                      borderBottom: "1px solid var(--border)",
                      fontWeight: 800,
                      color: "var(--primary)",
                      fontSize: "1rem",
                    }}
                  >
                    {(
                      (result.totalAmount || 0) - (result.discount || 0)
                    ).toLocaleString("vi-VN")}{" "}
                    đ
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          header, footer { display: none !important; }
          body { background: white; }
        }
      `}</style>
    </div>
  );
};

export default MedicalResultView;
