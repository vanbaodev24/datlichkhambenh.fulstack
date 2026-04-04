import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { medicalResultAPI } from "../services/api";
import "./MedicalResultForm.css";

const TEST_CATEGORIES = [
  {
    category: "Huyết học",
    tests: [
      {
        name: "TFT tế bào máu đếm Laser (XN-1000)",
        unit: "",
        ref: "",
        price: 139000,
      },
      { name: "- Hồng cầu", isHeader: true },
      { name: "Số lượng hồng cầu (RBC)", unit: "T/L", ref: "4.20-5.72" },
      { name: "Số lượng huyết sắc tố (HGB)", unit: "g/dL", ref: "13.5-17.5" },
      { name: "Thể tích khối hồng cầu (HCT)", unit: "%", ref: "42.0-47.0" },
      { name: "Thể tích trung bình HC (MCV)", unit: "fL", ref: "80-95" },
      { name: "Lượng HbTB HC (MCH)", unit: "pg", ref: "28.0-32.0" },
      { name: "Nồng độ HbTB trong HC (MCHC)", unit: "g/dL", ref: "32.0-36.0" },
      { name: "Độ phân bố HC (RDW-CV)", unit: "%", ref: "10.0-16.5" },
      { name: "Độ phân bố HC (RDW-SD)", unit: "fL", ref: "37.6-54.0" },
      { name: "Tỷ lệ hồng cầu nhỏ", unit: "%", ref: "" },
      { name: "Tỷ lệ hồng cầu lớn", unit: "%", ref: "" },
      { name: "Tỷ lệ hồng cầu có nhân (NRBCr)", unit: "%", ref: "0-0.2" },
      { name: "Tỷ lệ hồng cầu có nhân (NRBC)", unit: "G/L", ref: "0-0.012" },
      { name: "- Tiểu cầu", isHeader: true },
      { name: "Số lượng tiểu cầu (PLT)", unit: "G/L", ref: "150-400" },
      { name: "Thể tích trung bình TC (MPV)", unit: "fL", ref: "6.0-11.0" },
      { name: "Thể tích khối tiểu cầu (PCT)", unit: "%", ref: "0.100-1.000" },
      { name: "Độ phân bố TC (PDW)", unit: "fL", ref: "9.8-15.2" },
      { name: "Tỷ lệ tiểu cầu có KT (IPF+LCR)", unit: "%", ref: "" },
      { name: "- Bạch cầu", isHeader: true },
      { name: "Số lượng bạch cầu (WBC)", unit: "G/L", ref: "3.5-10.5" },
      { name: "Tỷ lệ % bạch cầu trung tính", unit: "%", ref: "43.2-76.0" },
      { name: "Tỷ lệ % bạch cầu Lympho", unit: "%", ref: "17.0-48.0" },
      { name: "Tỷ lệ % bạch cầu Mono", unit: "%", ref: "0.0-9.0" },
      { name: "Tỷ lệ % bạch cầu ái toan", unit: "%", ref: "0-7.0" },
      { name: "Tỷ lệ % bạch cầu ái kiềm", unit: "%", ref: "0-2.5" },
      { name: "Tỷ lệ % BC hạt chưa trưởng thành (IG%)", unit: "%", ref: "" },
      { name: "Số lượng bạch cầu trung tính", unit: "G/L", ref: "2.0-6.9" },
      { name: "Số lượng bạch cầu Lympho", unit: "G/L", ref: "0.6-3.4" },
      { name: "Số lượng bạch cầu Mono", unit: "G/L", ref: "0-0.9" },
      { name: "Số lượng bạch cầu ái toan", unit: "G/L", ref: "0-0.7" },
      { name: "Số lượng bạch cầu ái kiềm", unit: "G/L", ref: "0-0.2" },
      { name: "SLBC hạt chưa trưởng thành (IG)", unit: "G/L", ref: "" },
    ],
  },
  {
    category: "Sinh hóa máu",
    tests: [
      { name: "Glucose (đường huyết)", unit: "mmol/L", ref: "3.9-6.4" },
      { name: "Ure máu", unit: "mmol/L", ref: "2.5-7.5" },
      { name: "Creatinine máu", unit: "µmol/L", ref: "62-120" },
      { name: "AST (GOT)", unit: "U/L", ref: "0-40" },
      { name: "ALT (GPT)", unit: "U/L", ref: "0-41" },
      { name: "GGT (Gamma GT)", unit: "U/L", ref: "0-55" },
      { name: "Protein toàn phần", unit: "g/L", ref: "66-87" },
      { name: "Albumin", unit: "g/L", ref: "35-52" },
      { name: "Bilirubin toàn phần", unit: "µmol/L", ref: "0-21" },
      { name: "Bilirubin trực tiếp", unit: "µmol/L", ref: "0-5" },
      { name: "Cholesterol toàn phần", unit: "mmol/L", ref: "0-5.2" },
      { name: "Triglyceride", unit: "mmol/L", ref: "0-1.7" },
      { name: "HDL-Cholesterol", unit: "mmol/L", ref: ">1.04" },
      { name: "LDL-Cholesterol", unit: "mmol/L", ref: "0-3.4" },
      { name: "Acid Uric máu", unit: "µmol/L", ref: "202-416" },
      { name: "CRP (C-Reactive Protein)", unit: "mg/L", ref: "0-5" },
    ],
  },
  {
    category: "Nước tiểu",
    tests: [
      { name: "Màu sắc", unit: "", ref: "Vàng rơm" },
      { name: "Độ trong", unit: "", ref: "Trong" },
      { name: "pH nước tiểu", unit: "", ref: "5.0-8.0" },
      { name: "Tỷ trọng nước tiểu", unit: "", ref: "1.005-1.030" },
      { name: "Glucose niệu", unit: "", ref: "Âm tính" },
      { name: "Protein niệu", unit: "", ref: "Âm tính" },
      { name: "Hồng cầu niệu", unit: "/µL", ref: "0-25" },
      { name: "Bạch cầu niệu", unit: "/µL", ref: "0-30" },
    ],
  },
];

const isAbnormal = (value, ref) => {
  if (!value || !ref) return false;
  if (ref === "Âm tính")
    return value !== "Âm tính" && value !== "-" && value !== "—";
  const parts = ref.replace(">", "").replace("<", "").split("-");
  if (parts.length === 2) {
    const num = parseFloat(value);
    return (
      !isNaN(num) && (num < parseFloat(parts[0]) || num > parseFloat(parts[1]))
    );
  }
  return false;
};

const MedicalResultView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("result");

  useEffect(() => {
    medicalResultAPI
      .getById(id)
      .then((r) => {
        setResult(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (!result)
    return (
      <div
        className="container"
        style={{ padding: "80px 20px", textAlign: "center" }}
      >
        <h2>Không tìm thấy kết quả</h2>
        <button
          className="btn btn-outline"
          onClick={() => navigate(-1)}
          style={{ marginTop: 16 }}
        >
          ← Quay lại
        </button>
      </div>
    );

  const testResults = result.testResults || {};
  const totalAmount = result.totalAmount || 0;
  const discount = result.discount || 0;

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
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className={`btn btn-sm ${activeTab === "result" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setActiveTab("result")}
            >
              📋 Phiếu kết quả
            </button>
            <button
              className={`btn btn-sm ${activeTab === "invoice" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setActiveTab("invoice")}
            >
              🧾 Hóa đơn
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => window.print()}
            >
              🖨️ In phiếu
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "24px 20px" }}>
        {/* PHIẾU KẾT QUẢ */}
        {activeTab === "result" && (
          <div
            className="card"
            style={{ padding: 28, maxWidth: 900, margin: "0 auto" }}
          >
            <h1
              style={{
                textAlign: "center",
                fontSize: "1.4rem",
                fontWeight: 800,
                letterSpacing: 2,
                color: "var(--text-dark)",
                marginBottom: 20,
                borderBottom: "2px solid var(--primary)",
                paddingBottom: 14,
              }}
            >
              PHIẾU KẾT QUẢ
            </h1>

            {/* Thông tin bệnh nhân */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                border: "1px solid var(--border)",
                marginBottom: 20,
                fontSize: "0.88rem",
              }}
            >
              {[
                ["Họ tên:", result.patientName, "Đơn vị:", "Nội trú"],
                [
                  "Giới tính:",
                  result.patientGender,
                  "Bác sĩ chỉ định:",
                  `${result.doctorData?.userData?.lastName || ""} ${result.doctorData?.userData?.firstName || ""}`,
                ],
                [
                  "Năm sinh:",
                  result.patientDob
                    ? moment(result.patientDob).format("DD/MM/YYYY")
                    : "—",
                  "Ngày xét nghiệm:",
                  moment(result.resultDate).format("DD/MM/YYYY"),
                ],
                [
                  "SĐT:",
                  result.patientCode || "—",
                  "Trạng thái:",
                  "Đủ điều kiện",
                ],
                [
                  "Mã vào viện:",
                  result.patientCode || "—",
                  "Chẩn đoán:",
                  result.diagnosis || "—",
                ],
              ].map(([l1, v1, l2, v2], i) => (
                <React.Fragment key={i}>
                  <div
                    style={{
                      padding: "8px 14px",
                      borderRight: "1px solid var(--border)",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <span style={{ color: "var(--text-medium)" }}>{l1} </span>
                    <strong>{v1}</strong>
                  </div>
                  <div
                    style={{
                      padding: "8px 14px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <span style={{ color: "var(--text-medium)" }}>{l2} </span>
                    <strong>{v2}</strong>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Bảng kết quả theo nhóm */}
            {/* Bảng kết quả theo nhóm */}
            {TEST_CATEGORIES.map((cat) => {
              // Lấy tất cả test có trong category này (kể cả không có data)
              const catTests = cat.tests.filter((t) => !t.isHeader);
              // Kiểm tra có ít nhất 1 test có giá trị không
              const hasData = catTests.some((t) => testResults[t.name]?.value);
              if (!hasData) return null;

              return (
                <div key={cat.category} style={{ marginBottom: 20 }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.85rem",
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            background: "var(--primary)",
                            color: "#fff",
                            padding: "9px 12px",
                            textAlign: "left",
                            width: "40%",
                          }}
                        >
                          Danh mục khám
                        </th>
                        <th
                          style={{
                            background: "var(--primary)",
                            color: "#fff",
                            padding: "9px 12px",
                            textAlign: "center",
                            width: "15%",
                          }}
                        >
                          Kết quả
                        </th>
                        <th
                          style={{
                            background: "var(--primary)",
                            color: "#fff",
                            padding: "9px 12px",
                            textAlign: "center",
                            width: "20%",
                          }}
                        >
                          Khoảng tham chiếu
                        </th>
                        <th
                          style={{
                            background: "var(--primary)",
                            color: "#fff",
                            padding: "9px 12px",
                            textAlign: "center",
                            width: "12%",
                          }}
                        >
                          Ghi chú
                        </th>
                        <th
                          style={{
                            background: "var(--primary)",
                            color: "#fff",
                            padding: "9px 12px",
                            textAlign: "right",
                            width: "13%",
                          }}
                        >
                          Đơn giá (VNĐ)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            padding: "6px 12px",
                            background: "#f0f0f0",
                            fontWeight: 700,
                            fontSize: "0.82rem",
                            color: "var(--text-dark)",
                            textAlign: "center",
                          }}
                        >
                          {cat.category}
                        </td>
                      </tr>
                      {cat.tests.map((test, idx) => {
                        if (test.isHeader) {
                          return (
                            <tr key={idx}>
                              <td
                                colSpan={5}
                                style={{
                                  padding: "5px 12px",
                                  fontStyle: "italic",
                                  color: "var(--text-medium)",
                                  fontSize: "0.82rem",
                                  background: "#fafafa",
                                }}
                              >
                                {test.name}
                              </td>
                            </tr>
                          );
                        }
                        const data = testResults[test.name];
                        const val = data?.value || "";
                        const note = data?.note || "";
                        const ref = data?.ref || test.ref || "";
                        const unit = data?.unit || test.unit || "";
                        const abnormal = isAbnormal(val, ref);
                        // Hiển thị tất cả các hàng, kể cả không có giá trị
                        return (
                          <tr
                            key={idx}
                            style={{ borderBottom: "1px solid var(--border)" }}
                          >
                            <td
                              style={{
                                padding: "7px 12px",
                                color: "var(--primary)",
                              }}
                            >
                              {test.name}
                            </td>
                            <td
                              style={{
                                padding: "7px 12px",
                                textAlign: "center",
                                color: abnormal ? "#e74c3c" : "inherit",
                                fontWeight: abnormal ? 700 : 400,
                              }}
                            >
                              {val ? `${val} ${unit}`.trim() : ""}
                            </td>
                            <td
                              style={{
                                padding: "7px 12px",
                                textAlign: "center",
                                color: "var(--text-medium)",
                                fontSize: "0.82rem",
                              }}
                            >
                              {ref}
                            </td>
                            <td
                              style={{
                                padding: "7px 12px",
                                textAlign: "center",
                                fontSize: "0.82rem",
                                color: abnormal
                                  ? "#e74c3c"
                                  : "var(--text-medium)",
                              }}
                            >
                              {note ||
                                (abnormal
                                  ? "Bất thường"
                                  : val
                                    ? "Bình thường"
                                    : "")}
                            </td>
                            <td
                              style={{
                                padding: "7px 12px",
                                textAlign: "right",
                                fontSize: "0.82rem",
                              }}
                            >
                              {test.price
                                ? test.price.toLocaleString("vi-VN")
                                : ""}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}

            {/* Hiển thị các test bác sĩ nhập mà không thuộc category nào */}
            {(() => {
              const allCategoryTests = TEST_CATEGORIES.flatMap((c) =>
                c.tests.map((t) => t.name),
              );
              const extraTests = Object.entries(testResults).filter(
                ([name, data]) =>
                  data?.value && !allCategoryTests.includes(name),
              );
              if (!extraTests.length) return null;
              return (
                <div style={{ marginBottom: 20 }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.85rem",
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            background: "#6c757d",
                            color: "#fff",
                            padding: "9px 12px",
                            textAlign: "left",
                            width: "40%",
                          }}
                        >
                          Danh mục khác
                        </th>
                        <th
                          style={{
                            background: "#6c757d",
                            color: "#fff",
                            padding: "9px 12px",
                            textAlign: "center",
                          }}
                        >
                          Kết quả
                        </th>
                        <th
                          style={{
                            background: "#6c757d",
                            color: "#fff",
                            padding: "9px 12px",
                            textAlign: "center",
                          }}
                        >
                          Khoảng tham chiếu
                        </th>
                        <th
                          style={{
                            background: "#6c757d",
                            color: "#fff",
                            padding: "9px 12px",
                            textAlign: "center",
                          }}
                        >
                          Ghi chú
                        </th>
                        <th
                          style={{
                            background: "#6c757d",
                            color: "#fff",
                            padding: "9px 12px",
                            textAlign: "right",
                          }}
                        >
                          Đơn giá
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {extraTests.map(([name, data]) => {
                        const abnormal = isAbnormal(data.value, data.ref);
                        return (
                          <tr
                            key={name}
                            style={{ borderBottom: "1px solid var(--border)" }}
                          >
                            <td
                              style={{
                                padding: "7px 12px",
                                color: "var(--primary)",
                              }}
                            >
                              {name}
                            </td>
                            <td
                              style={{
                                padding: "7px 12px",
                                textAlign: "center",
                                color: abnormal ? "#e74c3c" : "inherit",
                                fontWeight: abnormal ? 700 : 400,
                              }}
                            >
                              {data.value} {data.unit}
                            </td>
                            <td
                              style={{
                                padding: "7px 12px",
                                textAlign: "center",
                                color: "var(--text-medium)",
                                fontSize: "0.82rem",
                              }}
                            >
                              {data.ref}
                            </td>
                            <td
                              style={{
                                padding: "7px 12px",
                                textAlign: "center",
                                fontSize: "0.82rem",
                              }}
                            >
                              {data.note}
                            </td>
                            <td
                              style={{
                                padding: "7px 12px",
                                textAlign: "right",
                              }}
                            ></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}

            {/* Tổng tiền thanh toán */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: 20,
                fontSize: "0.88rem",
              }}
            >
              <thead>
                <tr style={{ background: "var(--primary)" }}>
                  <th
                    style={{
                      padding: "9px 14px",
                      color: "#fff",
                      textAlign: "center",
                    }}
                  >
                    Tổng tiền dịch vụ
                  </th>
                  <th
                    style={{
                      padding: "9px 14px",
                      color: "#fff",
                      textAlign: "center",
                    }}
                  >
                    Giảm giá
                  </th>
                  <th
                    style={{
                      padding: "9px 14px",
                      color: "#fff",
                      textAlign: "center",
                    }}
                  >
                    Tiền đã giảm
                  </th>
                  <th
                    style={{
                      padding: "9px 14px",
                      color: "#fff",
                      textAlign: "center",
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
                      textAlign: "center",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {totalAmount.toLocaleString("vi-VN")}
                  </td>
                  <td
                    style={{
                      padding: "10px 14px",
                      textAlign: "center",
                      border: "1px solid var(--border)",
                    }}
                  >
                    —
                  </td>
                  <td
                    style={{
                      padding: "10px 14px",
                      textAlign: "center",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {discount.toLocaleString("vi-VN")}
                  </td>
                  <td
                    style={{
                      padding: "10px 14px",
                      textAlign: "center",
                      border: "1px solid var(--border)",
                      fontWeight: 800,
                      color: "var(--primary)",
                      fontSize: "1rem",
                    }}
                  >
                    {(totalAmount - discount).toLocaleString("vi-VN")}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Kết luận & lời dặn */}
            {result.conclusion && (
              <div
                style={{
                  background: "var(--primary-light)",
                  borderRadius: 8,
                  padding: "12px 16px",
                  marginBottom: 12,
                }}
              >
                <strong style={{ color: "var(--primary-dark)" }}>
                  ✅ Kết luận:
                </strong>
                <p style={{ marginTop: 6 }}>{result.conclusion}</p>
              </div>
            )}
            {result.note && (
              <div
                style={{
                  background: "#fff3cd",
                  borderRadius: 8,
                  padding: "12px 16px",
                  marginBottom: 12,
                }}
              >
                <strong style={{ color: "#856404" }}>📝 Lời dặn bác sĩ:</strong>
                <p style={{ marginTop: 6, color: "#533f03" }}>{result.note}</p>
              </div>
            )}

            {/* Ghi chú cuối */}
            <div
              style={{
                marginTop: 16,
                fontSize: "0.78rem",
                color: "var(--text-medium)",
                borderTop: "1px solid var(--border)",
                paddingTop: 12,
                lineHeight: 1.7,
              }}
            >
              <p>
                Người tiêu dùng: Xem kết quả chính xác xin truy cập vào website
                hệ thống hoặc liên hệ bệnh viện để được tư vấn thêm.
              </p>
              <p>
                Kết quả này chỉ có giá trị tham khảo, không thay thế chẩn đoán
                của bác sĩ.
              </p>
            </div>

            {/* Chữ ký */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 32,
                marginTop: 28,
                textAlign: "center",
                fontSize: "0.85rem",
              }}
            >
              <div>
                <p style={{ color: "var(--text-medium)" }}>
                  QUÉT QR ĐỂ ĐĂNG KÝ TÁI KHÁM
                </p>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: "var(--bg-light)",
                    border: "1px solid var(--border)",
                    margin: "8px auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.72rem",
                    color: "var(--text-light)",
                    borderRadius: 6,
                  }}
                >
                  QR Code
                </div>
                <p>Đặt lịch tại BookingCare</p>
              </div>
              <div>
                <p style={{ color: "var(--text-medium)" }}>
                  QUÉT QR ĐỂ XEM KẾT QUẢ
                </p>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: "var(--bg-light)",
                    border: "1px solid var(--border)",
                    margin: "8px auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.72rem",
                    color: "var(--text-light)",
                    borderRadius: 6,
                  }}
                >
                  QR Code
                </div>
                <p>Tra cứu kết quả trực tuyến</p>
              </div>
            </div>

            {/* Nút hành động */}
            <div
              className="no-print"
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <button
                className="btn btn-outline"
                onClick={() => setActiveTab("invoice")}
              >
                🧾 Xem hóa đơn
              </button>
              <button
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                🖨️ In phiếu kết quả
              </button>
            </div>
          </div>
        )}

        {/* HÓA ĐƠN */}
        {activeTab === "invoice" && (
          <div
            className="card"
            style={{ padding: 28, maxWidth: 700, margin: "0 auto" }}
          >
            <h1
              style={{
                textAlign: "center",
                fontSize: "1.4rem",
                fontWeight: 800,
                letterSpacing: 2,
                marginBottom: 6,
              }}
            >
              HÓA ĐƠN THANH TOÁN
            </h1>
            <p
              style={{
                textAlign: "center",
                color: "var(--text-medium)",
                fontSize: "0.82rem",
                marginBottom: 20,
              }}
            >
              Số HĐ: #{result.id} · Ngày:{" "}
              {moment(result.resultDate).format("DD/MM/YYYY")}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  background: "var(--bg-light)",
                  padding: "14px 16px",
                  borderRadius: 8,
                }}
              >
                <p
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "var(--text-medium)",
                    marginBottom: 6,
                    textTransform: "uppercase",
                  }}
                >
                  Bệnh nhân
                </p>
                <strong style={{ display: "block" }}>
                  {result.patientName}
                </strong>
                <span
                  style={{ fontSize: "0.82rem", color: "var(--text-medium)" }}
                >
                  {result.patientGender}
                </span>
                {result.patientDob && (
                  <span
                    style={{ fontSize: "0.82rem", color: "var(--text-medium)" }}
                  >
                    {" "}
                    · {moment(result.patientDob).format("DD/MM/YYYY")}
                  </span>
                )}
              </div>
              <div
                style={{
                  background: "var(--bg-light)",
                  padding: "14px 16px",
                  borderRadius: 8,
                }}
              >
                <p
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "var(--text-medium)",
                    marginBottom: 6,
                    textTransform: "uppercase",
                  }}
                >
                  Bác sĩ phụ trách
                </p>
                <strong style={{ display: "block" }}>
                  {result.doctorData?.userData?.lastName}{" "}
                  {result.doctorData?.userData?.firstName}
                </strong>
                <span
                  style={{ fontSize: "0.82rem", color: "var(--text-medium)" }}
                >
                  Ngày khám: {moment(result.resultDate).format("DD/MM/YYYY")}
                </span>
              </div>
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: 20,
                fontSize: "0.88rem",
              }}
            >
              <thead>
                <tr style={{ background: "var(--primary)" }}>
                  <th
                    style={{
                      padding: "10px 14px",
                      color: "#fff",
                      textAlign: "left",
                    }}
                  >
                    STT
                  </th>
                  <th
                    style={{
                      padding: "10px 14px",
                      color: "#fff",
                      textAlign: "left",
                    }}
                  >
                    Dịch vụ
                  </th>
                  <th
                    style={{
                      padding: "10px 14px",
                      color: "#fff",
                      textAlign: "right",
                    }}
                  >
                    Đơn giá
                  </th>
                  <th
                    style={{
                      padding: "10px 14px",
                      color: "#fff",
                      textAlign: "right",
                    }}
                  >
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px 14px" }}>1</td>
                  <td style={{ padding: "10px 14px" }}>Phí khám và tư vấn</td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>
                    {totalAmount.toLocaleString("vi-VN")} đ
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>
                    {totalAmount.toLocaleString("vi-VN")} đ
                  </td>
                </tr>
                {discount > 0 && (
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px 14px" }}>2</td>
                    <td style={{ padding: "10px 14px", color: "#2ecc71" }}>
                      Giảm giá
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        textAlign: "right",
                        color: "#2ecc71",
                      }}
                    >
                      - {discount.toLocaleString("vi-VN")} đ
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        textAlign: "right",
                        color: "#2ecc71",
                      }}
                    >
                      - {discount.toLocaleString("vi-VN")} đ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div
              style={{
                background: "var(--bg-light)",
                borderRadius: 8,
                padding: "16px 20px",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  fontSize: "0.9rem",
                }}
              >
                <span style={{ color: "var(--text-medium)" }}>
                  Tổng tiền dịch vụ:
                </span>
                <span>{totalAmount.toLocaleString("vi-VN")} đ</span>
              </div>
              {discount > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    fontSize: "0.9rem",
                  }}
                >
                  <span style={{ color: "var(--text-medium)" }}>Giảm giá:</span>
                  <span style={{ color: "#2ecc71" }}>
                    - {discount.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: 12,
                  borderTop: "2px solid var(--border)",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                }}
              >
                <span>Tổng thanh toán:</span>
                <span style={{ color: "var(--primary)", fontSize: "1.3rem" }}>
                  {(totalAmount - discount).toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <span
                style={{
                  background: "#d4edda",
                  color: "#155724",
                  padding: "8px 24px",
                  borderRadius: 20,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                ✅ ĐÃ THANH TOÁN
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 32,
                textAlign: "center",
                fontSize: "0.85rem",
              }}
            >
              <div>
                <p style={{ color: "var(--text-medium)", marginBottom: 8 }}>
                  Thu ngân
                </p>
                <div style={{ height: 56 }} />
                <p style={{ fontWeight: 700 }}>Ký tên</p>
              </div>
              <div>
                <p style={{ color: "var(--text-medium)", marginBottom: 8 }}>
                  Bệnh nhân
                </p>
                <div style={{ height: 56 }} />
                <p style={{ fontWeight: 700 }}>{result.patientName}</p>
              </div>
            </div>

            <div
              className="no-print"
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <button
                className="btn btn-outline"
                onClick={() => setActiveTab("result")}
              >
                📋 Xem phiếu kết quả
              </button>
              <button
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                🖨️ In hóa đơn
              </button>
            </div>
          </div>
        )}
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

export default MedicalResultView;
