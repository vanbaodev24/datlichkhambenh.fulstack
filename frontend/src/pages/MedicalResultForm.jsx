import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { medicalResultAPI, bookingAPI } from "../services/api";
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
      { name: "- Hồng cầu", unit: "", ref: "", price: 0, isHeader: true },
      {
        name: "Số lượng hồng cầu (RBC)",
        unit: "T/L",
        ref: "4.20-5.72",
        price: 0,
      },
      {
        name: "Số lượng huyết sắc tố (HGB)",
        unit: "g/dL",
        ref: "13.5-17.5",
        price: 0,
      },
      {
        name: "Thể tích khối hồng cầu (HCT)",
        unit: "%",
        ref: "42.0-47.0",
        price: 0,
      },
      {
        name: "Thể tích trung bình HC (MCV)",
        unit: "fL",
        ref: "80-95",
        price: 0,
      },
      { name: "Lượng HbTB HC (MCH)", unit: "pg", ref: "28.0-32.0", price: 0 },
      {
        name: "Nồng độ HbTB trong HC (MCHC)",
        unit: "g/dL",
        ref: "32.0-36.0",
        price: 0,
      },
      { name: "Độ phân bố HC (RDW-CV)", unit: "%", ref: "10.0-16.5", price: 0 },
      {
        name: "Độ phân bố HC (RDW-SD)",
        unit: "fL",
        ref: "37.6-54.0",
        price: 0,
      },
      { name: "Tỷ lệ hồng cầu nhỏ", unit: "%", ref: "", price: 0 },
      { name: "Tỷ lệ hồng cầu lớn", unit: "%", ref: "", price: 0 },
      {
        name: "Tỷ lệ hồng cầu có nhân (NRBCr)",
        unit: "%",
        ref: "0-0.2",
        price: 0,
      },
      {
        name: "Tỷ lệ hồng cầu có nhân (NRBC)",
        unit: "G/L",
        ref: "0-0.012",
        price: 0,
      },
      { name: "- Tiểu cầu", unit: "", ref: "", price: 0, isHeader: true },
      {
        name: "Số lượng tiểu cầu (PLT)",
        unit: "G/L",
        ref: "150-400",
        price: 0,
      },
      {
        name: "Thể tích trung bình TC (MPV)",
        unit: "fL",
        ref: "6.0-11.0",
        price: 0,
      },
      {
        name: "Thể tích khối tiểu cầu (PCT)",
        unit: "%",
        ref: "0.100-1.000",
        price: 0,
      },
      { name: "Độ phân bố TC (PDW)", unit: "fL", ref: "9.8-15.2", price: 0 },
      { name: "Tỷ lệ tiểu cầu có KT (IPF+LCR)", unit: "%", ref: "", price: 0 },
      { name: "- Bạch cầu", unit: "", ref: "", price: 0, isHeader: true },
      {
        name: "Số lượng bạch cầu (WBC)",
        unit: "G/L",
        ref: "3.5-10.5",
        price: 0,
      },
      {
        name: "Tỷ lệ % bạch cầu trung tính",
        unit: "%",
        ref: "43.2-76.0",
        price: 0,
      },
      {
        name: "Tỷ lệ % bạch cầu Lympho",
        unit: "%",
        ref: "17.0-48.0",
        price: 0,
      },
      { name: "Tỷ lệ % bạch cầu Mono", unit: "%", ref: "0.0-9.0", price: 0 },
      { name: "Tỷ lệ % bạch cầu ái toan", unit: "%", ref: "0-7.0", price: 0 },
      { name: "Tỷ lệ % bạch cầu ái kiềm", unit: "%", ref: "0-2.5", price: 0 },
      {
        name: "Tỷ lệ % BC hạt chưa trưởng thành (IG%)",
        unit: "%",
        ref: "",
        price: 0,
      },
      {
        name: "Số lượng bạch cầu trung tính",
        unit: "G/L",
        ref: "2.0-6.9",
        price: 0,
      },
      {
        name: "Số lượng bạch cầu Lympho",
        unit: "G/L",
        ref: "0.6-3.4",
        price: 0,
      },
      { name: "Số lượng bạch cầu Mono", unit: "G/L", ref: "0-0.9", price: 0 },
      {
        name: "Số lượng bạch cầu ái toan",
        unit: "G/L",
        ref: "0-0.7",
        price: 0,
      },
      {
        name: "Số lượng bạch cầu ái kiềm",
        unit: "G/L",
        ref: "0-0.2",
        price: 0,
      },
      {
        name: "SLBC hạt chưa trưởng thành (IG)",
        unit: "G/L",
        ref: "",
        price: 0,
      },
    ],
  },
  {
    category: "Sinh hóa máu",
    tests: [
      {
        name: "Glucose (đường huyết)",
        unit: "mmol/L",
        ref: "3.9-6.4",
        price: 0,
      },
      { name: "Ure máu", unit: "mmol/L", ref: "2.5-7.5", price: 0 },
      { name: "Creatinine máu", unit: "µmol/L", ref: "62-120", price: 0 },
      { name: "AST (GOT)", unit: "U/L", ref: "0-40", price: 0 },
      { name: "ALT (GPT)", unit: "U/L", ref: "0-41", price: 0 },
      { name: "GGT (Gamma GT)", unit: "U/L", ref: "0-55", price: 0 },
      { name: "Protein toàn phần", unit: "g/L", ref: "66-87", price: 0 },
      { name: "Albumin", unit: "g/L", ref: "35-52", price: 0 },
      { name: "Bilirubin toàn phần", unit: "µmol/L", ref: "0-21", price: 0 },
      { name: "Bilirubin trực tiếp", unit: "µmol/L", ref: "0-5", price: 0 },
      { name: "Cholesterol toàn phần", unit: "mmol/L", ref: "0-5.2", price: 0 },
      { name: "Triglyceride", unit: "mmol/L", ref: "0-1.7", price: 0 },
      { name: "HDL-Cholesterol", unit: "mmol/L", ref: ">1.04", price: 0 },
      { name: "LDL-Cholesterol", unit: "mmol/L", ref: "0-3.4", price: 0 },
      { name: "Acid Uric máu", unit: "µmol/L", ref: "202-416", price: 0 },
      { name: "CRP (C-Reactive Protein)", unit: "mg/L", ref: "0-5", price: 0 },
    ],
  },
  {
    category: "Nước tiểu",
    tests: [
      {
        name: "Tổng phân tích nước tiểu 10 thông số",
        unit: "",
        ref: "",
        price: 0,
      },
      { name: "Màu sắc", unit: "", ref: "Vàng rơm", price: 0 },
      { name: "Độ trong", unit: "", ref: "Trong", price: 0 },
      { name: "pH nước tiểu", unit: "", ref: "5.0-8.0", price: 0 },
      { name: "Tỷ trọng nước tiểu", unit: "", ref: "1.005-1.030", price: 0 },
      { name: "Glucose niệu", unit: "", ref: "Âm tính", price: 0 },
      { name: "Protein niệu", unit: "", ref: "Âm tính", price: 0 },
      { name: "Hồng cầu niệu", unit: "/µL", ref: "0-25", price: 0 },
      { name: "Bạch cầu niệu", unit: "/µL", ref: "0-30", price: 0 },
    ],
  },
];

const MedicalResultForm = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingResult, setExistingResult] = useState(null);

  const [form, setForm] = useState({
    patientName: "",
    patientGender: "Nam",
    patientDob: "",
    patientAddress: "",
    patientCode: "",
    diagnosis: "",
    conclusion: "",
    note: "",
    resultDate: moment().format("YYYY-MM-DD"),
    totalAmount: 139000,
    discount: 0,
  });

  const [testResults, setTestResults] = useState(() => {
    const initial = {};
    TEST_CATEGORIES.forEach((cat) => {
      cat.tests.forEach((t) => {
        initial[t.name] = { value: "", unit: t.unit, ref: t.ref, note: "" };
      });
    });
    return initial;
  });

  useEffect(() => {
    // Load booking info
    bookingAPI
      .getAll({ limit: 1 })
      .then(() => {})
      .catch(() => {});

    // Load existing result
    medicalResultAPI
      .getByBooking(bookingId)
      .then((r) => {
        if (r.data) {
          setExistingResult(r.data);
          setForm({
            patientName: r.data.patientName || "",
            patientGender: r.data.patientGender || "Nam",
            patientDob: r.data.patientDob || "",
            patientAddress: r.data.patientAddress || "",
            patientCode: r.data.patientCode || "",
            diagnosis: r.data.diagnosis || "",
            conclusion: r.data.conclusion || "",
            note: r.data.note || "",
            resultDate: r.data.resultDate || moment().format("YYYY-MM-DD"),
            totalAmount: r.data.totalAmount || 139000,
            discount: r.data.discount || 0,
          });
          if (r.data.testResults) setTestResults(r.data.testResults);
        }
      })
      .catch(() => {});
  }, [bookingId]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const setTestValue = (testName, field, value) => {
    setTestResults((prev) => ({
      ...prev,
      [testName]: { ...prev[testName], [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await medicalResultAPI.create({
        ...form,
        bookingId: parseInt(bookingId),
        testResults,
      });
      toast.success("Lưu kết quả khám thành công!");
      navigate("/doctor-dashboard");
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra!");
    }
    setLoading(false);
  };

  return (
    <div className="mrf-page">
      <div className="mrf-header">
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1>📋 Phiếu kết quả khám bệnh</h1>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate("/doctor-dashboard")}
          >
            ← Quay lại
          </button>
        </div>
      </div>

      <div className="container" style={{ padding: "28px 20px" }}>
        <form onSubmit={handleSubmit}>
          {/* Thông tin bệnh nhân */}
          <div className="card mrf-section">
            <h2>Thông tin bệnh nhân</h2>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Họ tên bệnh nhân *</label>
                <input
                  className="form-control"
                  value={form.patientName}
                  onChange={set("patientName")}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Giới tính</label>
                <select
                  className="form-control"
                  value={form.patientGender}
                  onChange={set("patientGender")}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Ngày sinh</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.patientDob}
                  onChange={set("patientDob")}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mã bệnh nhân</label>
                <input
                  className="form-control"
                  value={form.patientCode}
                  onChange={set("patientCode")}
                  placeholder="VD: 30/223-1000162562"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Địa chỉ</label>
                <input
                  className="form-control"
                  value={form.patientAddress}
                  onChange={set("patientAddress")}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Ngày kết quả</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.resultDate}
                  onChange={set("resultDate")}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Chẩn đoán</label>
              <textarea
                className="form-control"
                rows={2}
                value={form.diagnosis}
                onChange={set("diagnosis")}
                placeholder="Nhập chẩn đoán..."
              />
            </div>
          </div>

          {/* Kết quả xét nghiệm */}
          {TEST_CATEGORIES.map((cat) => (
            <div key={cat.category} className="card mrf-section">
              <h2>{cat.category}</h2>
              <div className="table-wrapper">
                <table className="mrf-table">
                  <thead>
                    <tr>
                      <th>Danh mục xét nghiệm</th>
                      <th>Kết quả</th>
                      <th>Khoảng tham chiếu</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.tests.map((test) => {
                      const val = testResults[test.name]?.value || "";
                      const ref = test.ref;
                      const isAbnormal =
                        val &&
                        ref &&
                        (() => {
                          const parts = ref.split("-");
                          if (parts.length === 2) {
                            const num = parseFloat(val);
                            return (
                              !isNaN(num) &&
                              (num < parseFloat(parts[0]) ||
                                num > parseFloat(parts[1]))
                            );
                          }
                          return false;
                        })();
                      return (
                        <tr key={test.name}>
                          <td
                            style={{ color: "var(--primary)", fontWeight: 500 }}
                          >
                            {test.name}
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              style={{
                                width: 100,
                                padding: "4px 8px",
                                color: isAbnormal ? "red" : "inherit",
                                fontWeight: isAbnormal ? 700 : 400,
                              }}
                              value={val}
                              onChange={(e) =>
                                setTestValue(test.name, "value", e.target.value)
                              }
                              placeholder="—"
                            />
                            <span
                              style={{
                                fontSize: "0.78rem",
                                color: "var(--text-medium)",
                                marginLeft: 4,
                              }}
                            >
                              {test.unit}
                            </span>
                          </td>
                          <td
                            style={{
                              fontSize: "0.85rem",
                              color: "var(--text-medium)",
                            }}
                          >
                            {ref}
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              style={{ width: 120, padding: "4px 8px" }}
                              value={testResults[test.name]?.note || ""}
                              onChange={(e) =>
                                setTestValue(test.name, "note", e.target.value)
                              }
                              placeholder="Bình thường"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Kết luận và thanh toán */}
          <div className="card mrf-section">
            <h2>Kết luận & Thanh toán</h2>
            <div className="form-group">
              <label className="form-label">Kết luận</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.conclusion}
                onChange={set("conclusion")}
                placeholder="Nhập kết luận khám..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ghi chú thêm</label>
              <textarea
                className="form-control"
                rows={2}
                value={form.note}
                onChange={set("note")}
                placeholder="Lời dặn, thuốc, tái khám..."
              />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Tổng tiền dịch vụ (VNĐ)</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.totalAmount}
                  onChange={set("totalAmount")}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Giảm giá (VNĐ)</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.discount}
                  onChange={set("discount")}
                />
              </div>
            </div>
            <div className="mrf-total">
              <span>Tổng thanh toán:</span>
              <strong>
                {(
                  (form.totalAmount || 0) - (form.discount || 0)
                ).toLocaleString("vi-VN")}{" "}
                đ
              </strong>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "flex-end",
              marginTop: 20,
            }}
          >
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/doctor-dashboard")}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "💾 Lưu kết quả khám"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalResultForm;
