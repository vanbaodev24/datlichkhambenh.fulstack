const { Notification } = require("../models");

// Lấy thông báo của user hiện tại
const getMyNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const where = { userId: req.user.id };
    if (unreadOnly === "true") where.isRead = false;

    const { count, rows } = await Notification.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    const unreadCount = await Notification.count({
      where: { userId: req.user.id, isRead: false },
    });

    return res.json({ errCode: 0, data: rows, total: count, unreadCount });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// Đánh dấu đã đọc 1 thông báo
const markAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { id: req.params.id, userId: req.user.id } },
    );
    return res.json({ errCode: 0, message: "Marked as read" });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// Đánh dấu tất cả đã đọc
const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } },
    );
    return res.json({ errCode: 0, message: "All marked as read" });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// Xóa thông báo
const deleteNotification = async (req, res) => {
  try {
    await Notification.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });
    return res.json({ errCode: 0, message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

// Đếm số chưa đọc
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: { userId: req.user.id, isRead: false },
    });
    return res.json({ errCode: 0, data: count });
  } catch (err) {
    return res.status(500).json({ errCode: -1, message: err.message });
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
