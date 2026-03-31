import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { bookingAPI } from "../services/api";

const statusColors = {
  S1: "warning",
  S2: "primary",
  S3: "success",
  S4: "danger",
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingAPI
      .getPatient()
      .then((r) => {
        setBookings(r.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>
            Lịch hẹn của tôi
          </h1>
          <p style={{ color: "var(--text-medium)" }}>
            Quản lý các cuộc hẹn khám bệnh của bạn
          </p>
        </div>
        <Link to="/doctors" className="btn btn-primary">
          + Đặt lịch mới
        </Link>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: "4rem", marginBottom: 16 }}>📅</div>
          <h3 style={{ marginBottom: 10 }}>Chưa có lịch hẹn nào</h3>
          <p style={{ color: "var(--text-medium)", marginBottom: 24 }}>
            Đặt lịch khám với bác sĩ ngay hôm nay!
          </p>
          <Link to="/doctors" className="btn btn-primary">
            Đặt lịch ngay
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {bookings.map((b) => (
            <div
              key={b.id}
              className="card"
              style={{
                padding: 20,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 20,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "64px 1fr",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    overflow: "hidden",
                  }}
                >
                  {b.doctorData?.userData?.avatar ? (
                    <img
                      src={`http://localhost:8080${b.doctorData.userData.avatar}`}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    b.doctorData?.userData?.firstName?.charAt(0)
                  )}
                </div>
                <div>
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      marginBottom: 4,
                    }}
                  >
                    BS. {b.doctorData?.userData?.lastName}{" "}
                    {b.doctorData?.userData?.firstName}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      fontSize: "0.85rem",
                      color: "var(--text-medium)",
                      flexWrap: "wrap",
                    }}
                  >
                    <span>📅 {moment(b.date).format("DD/MM/YYYY")}</span>
                    <span>⏰ {b.timeTypeData?.valueVi}</span>
                    <span
                      className={`badge badge-${statusColors[b.statusId] || "secondary"}`}
                    >
                      {b.statusData?.valueVi}
                    </span>
                  </div>
                  {b.patientReason && (
                    <p
                      style={{
                        marginTop: 6,
                        fontSize: "0.82rem",
                        color: "var(--text-medium)",
                      }}
                    >
                      📋 {b.patientReason}
                    </p>
                  )}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Link
                  to={`/doctors/${b.doctorData?.userId}`}
                  className="btn btn-outline btn-sm"
                >
                  Xem bác sĩ
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
