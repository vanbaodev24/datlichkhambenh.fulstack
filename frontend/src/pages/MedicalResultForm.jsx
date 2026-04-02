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
      { name: "Số lượng hồng cầu (RBC)", unit: "T/L", ref: "4.20-5.72" },
      { name: "Số lượng huyết sắc tố (HGB)", unit: "g/dL", ref: "13.5-17.5" },
      { name: "Thể tích khối hồng cầu (HCT)", unit: "%", ref: "42.0-47.0" },
      { name: "Thể tích trung bình HC (MCV)", unit: "fL", ref: "80-95" },
      { name: "Lượng HbTB HC (MCH)", unit: "pg", ref: "28.0-32.0" },
      { name: "Nồng độ HbTB (MCHC)", unit: "g/dL", ref: "32.0-36.0" },
      { name: "Số lượng tiểu cầu (PLT)", unit: "G/L", ref: "150-400" },
      { name: "Số lượng bạch cầu (WBC)", unit: "G/L", ref: "3.5-10.5" },
      { name: "Tỷ lệ % bạch cầu Lympho", unit: "%", ref: "17.0-48.0" },
      { name: "Tỷ lệ % bạch cầu Mono", unit: "%", ref: "0.0-9.0" },
    ],
  },
  {
    category: "Sinh hóa",
    tests: [
      { name: "Glucose", unit: "mmol/L", ref: "3.9-6.4" },
      { name: "Ure", unit: "mmol/L", ref: "2.5-7.5" },
      { name: "Creatinine", unit: "µmol/L", ref: "62-120" },
      { name: "AST (GOT)", unit: "U/L", ref: "0-40" },
      { name: "ALT (GPT)", unit: "U/L", ref: "0-41" },
      { name: "Cholesterol toàn phần", unit: "mmol/L", ref: "0-5.2" },
      { name: "Triglyceride", unit: "mmol/L", ref: "0-1.7" },
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
