-- ============================================
-- BookingCare Database Setup
-- Chạy file này trong phpMyAdmin (XAMPP)
-- ============================================

CREATE DATABASE IF NOT EXISTS `bookingcare`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `bookingcare`;

-- Nếu đã từng chạy và bị lỗi FK, hãy xóa tất cả bảng cũ trước:
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP TABLE IF EXISTS bookings, schedules, doctors, users, specialties, clinics, allcodes;
-- SET FOREIGN_KEY_CHECKS = 1;

-- Tất cả bảng sẽ được tạo tự động bởi Sequelize khi chạy backend
-- Đã fix lỗi "errno: 150 Foreign key constraint" bằng foreignKeyConstraint: false

-- Sau khi chạy backend lần đầu, chạy seeder để thêm dữ liệu mẫu:
-- cd backend && node src/seeders/seed.js

-- Tài khoản admin mặc định (sau khi seed):
-- Email: admin@bookingcare.vn
-- Password: admin123
