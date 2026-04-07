import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import { notificationAPI } from "../services/api";

const TYPE_ICONS = {
  booking_new: "📅",
  booking_confirmed: "✅",
  booking_cancelled: "❌",
  booking_reminder: "⏰",
  result_ready: "📋",
  prescription_new: "💊",
  doctor_assigned: "👨‍⚕️",
  system: "🔔",
};

const Notifications = () => {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchNotifications();
  }, [user, unreadOnly]);

  const fetchNotifications = () => {
    setLoading(true);
    notificationAPI
      .getAll({ unreadOnly })
      .then((r) => setNotifications(r.data || []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  };

  const handleRead = async (n) => {
    if (!n.isRead) {
      await notificationAPI.markAsRead(n.id);
      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)),
      );
    }
    if (n.link) navigate(n.link);
  };

  const handleMarkAllRead = async () => {
    await notificationAPI.markAllAsRead();
    setNotifications((prev) => prev.map((x) => ({ ...x, isRead: true })));
    toast.success("Đã đánh dấu tất cả đã đọc!");
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await notificationAPI.delete(id);
    setNotifications((prev) => prev.filter((x) => x.id !== id));
    toast.success("Đã xóa thông báo!");
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      style={{ minHeight: "calc(100vh - 68px)", background: "var(--bg-light)" }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0d2137, #1a3a52)",
          padding: "32px 0",
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
          <div>
            <h1 style={{ color: "#fff", fontSize: "1.6rem", fontWeight: 800 }}>
              🔔 Thông báo
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>
              {unreadCount > 0
                ? `Bạn có ${unreadCount} thông báo chưa đọc`
                : "Tất cả đã được đọc"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              className="btn btn-outline btn-sm"
              style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}
              onClick={handleMarkAllRead}
            >
              ✅ Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: "28px 20px" }}>
        {/* Filter */}
        <div
          className="card"
          style={{
            padding: "14px 20px",
            marginBottom: 20,
            display: "flex",
            gap: 10,
          }}
        >
          <button
            className={`btn btn-sm ${!unreadOnly ? "btn-primary" : "btn-outline"}`}
            onClick={() => setUnreadOnly(false)}
          >
            Tất cả ({notifications.length})
          </button>
          <button
            className={`btn btn-sm ${unreadOnly ? "btn-primary" : "btn-outline"}`}
            onClick={() => setUnreadOnly(true)}
          >
            Chưa đọc ({unreadCount})
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="spinner" />
        ) : notifications.length === 0 ? (
          <div
            className="card"
            style={{ padding: "80px 20px", textAlign: "center" }}
          >
            <div style={{ fontSize: "4rem", marginBottom: 16 }}>🔔</div>
            <h3 style={{ marginBottom: 8 }}>Không có thông báo nào</h3>
            <p style={{ color: "var(--text-medium)" }}>
              Các thông báo mới sẽ xuất hiện tại đây
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleRead(n)}
                className="card"
                style={{
                  padding: "16px 20px",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 16,
                  alignItems: "center",
                  cursor: n.link ? "pointer" : "default",
                  background: n.isRead ? "#fff" : "var(--primary-light)",
                  borderLeft: n.isRead
                    ? "4px solid transparent"
                    : "4px solid var(--primary)",
                  transition: "var(--transition)",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: n.isRead ? "var(--bg-light)" : "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                    flexShrink: 0,
                  }}
                >
                  {TYPE_ICONS[n.type] || "🔔"}
                </div>

                {/* Content */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <strong
                      style={{
                        fontSize: "0.95rem",
                        color: n.isRead
                          ? "var(--text-dark)"
                          : "var(--primary-dark)",
                      }}
                    >
                      {n.title}
                    </strong>
                    {!n.isRead && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "var(--primary)",
                          display: "inline-block",
                        }}
                      />
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-medium)",
                      marginBottom: 4,
                    }}
                  >
                    {n.message}
                  </p>
                  <span
                    style={{ fontSize: "0.75rem", color: "var(--text-light)" }}
                  >
                    🕐 {moment(n.createdAt).fromNow()}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  {!n.isRead && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRead(n);
                      }}
                      title="Đánh dấu đã đọc"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => handleDelete(e, n.id)}
                    title="Xóa thông báo"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
