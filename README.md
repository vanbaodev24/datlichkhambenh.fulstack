# 🏥 BookingCare - Hệ thống đặt lịch khám bệnh trực tuyến

Ứng dụng web fullstack tương tự BookingCare.vn, xây dựng với React.js + Node.js + Express + MySQL (XAMPP).

---

## 🛠️ Công nghệ sử dụng

### Frontend

- **React.js 18** - UI framework
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Moment.js** - Date handling

### Backend

- **Node.js + Express** - Server & API
- **Sequelize ORM** - Database abstraction
- **MySQL2** - Database driver (XAMPP)
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Multer** - File upload

---

## 📁 Cấu trúc thư mục

```
bookingcare/
├── backend/
│   ├── src/
│   │   ├── config/       # Database config
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth middleware
│   │   ├── models/       # Sequelize models
│   │   ├── routes/       # API routes
│   │   ├── seeders/      # Data seeders
│   │   └── server.js     # Entry point
│   ├── uploads/          # Uploaded files
│   └── .env
└── frontend/
    ├── public/
    └── src/
        ├── components/   # Reusable components
        ├── pages/        # Page components
        │   └── admin/    # Admin pages
        ├── redux/        # State management
        ├── services/     # API services
        └── styles/       # Global CSS
```

---

## ⚙️ Cài đặt và chạy

### Bước 1: Cài đặt XAMPP

1. Tải XAMPP tại https://www.apachefriends.org/
2. Khởi động **Apache** và **MySQL**
3. Mở **phpMyAdmin** (http://localhost/phpmyadmin)
4. Tạo database mới tên: `bookingcare`

### Bước 2: Cài đặt Backend

```bash
cd backend
npm install

# Cấu hình .env nếu cần (mặc định dùng root không password)
# DB_HOST=localhost, DB_NAME=bookingcare, DB_USER=root, DB_PASS=

# Khởi động server
npm run dev

# Sau khi server chạy, seed dữ liệu mẫu
node src/seeders/seed.js
```

### Bước 3: Cài đặt Frontend

```bash
cd frontend
npm install
npm start
```

### Bước 4: Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **phpMyAdmin**: http://localhost/phpmyadmin

---

## 🔑 Tài khoản mặc định (sau khi seed)

| Vai trò | Email                | Mật khẩu |
| ------- | -------------------- | -------- |
| Admin   | admin@bookingcare.vn | admin123 |

---

## 📋 Tính năng chính

### Người dùng (Bệnh nhân)

- ✅ Đăng ký / Đăng nhập
- ✅ Tìm kiếm bác sĩ theo tên, chuyên khoa
- ✅ Xem thông tin chi tiết bác sĩ
- ✅ Xem lịch trống theo ngày
- ✅ Đặt lịch hẹn
- ✅ Xem lịch sử lịch hẹn

### Bác sĩ

- ✅ Dashboard quản lý lịch hẹn
- ✅ Xem danh sách bệnh nhân
- ✅ Cập nhật trạng thái lịch hẹn

### Admin

- ✅ Dashboard tổng quan
- ✅ Quản lý người dùng (CRUD)
- ✅ Quản lý hồ sơ bác sĩ
- ✅ Quản lý chuyên khoa (CRUD)
- ✅ Quản lý cơ sở y tế (CRUD)
- ✅ Quản lý lịch hẹn

---

## 🗄️ API Endpoints

### Auth

```
POST /api/v1/auth/register    - Đăng ký
POST /api/v1/auth/login       - Đăng nhập
GET  /api/v1/auth/profile     - Xem hồ sơ
```

### Doctors

```
GET  /api/v1/doctors          - Danh sách bác sĩ
GET  /api/v1/doctors/top      - Top bác sĩ
GET  /api/v1/doctors/:id      - Chi tiết bác sĩ
GET  /api/v1/doctors/schedule - Lịch khám
POST /api/v1/doctors/schedule - Tạo lịch (Doctor)
POST /api/v1/doctors/info     - Cập nhật hồ sơ (Admin)
```

### Bookings

```
POST /api/v1/bookings              - Tạo lịch hẹn
GET  /api/v1/bookings/patient      - Lịch hẹn của bệnh nhân
GET  /api/v1/bookings/doctor       - Lịch hẹn của bác sĩ
GET  /api/v1/bookings              - Tất cả (Admin)
PUT  /api/v1/bookings/:id/status   - Cập nhật trạng thái
```

### Specialties & Clinics

```
GET/POST/PUT/DELETE /api/v1/specialties/:id
GET/POST/PUT/DELETE /api/v1/clinics/:id
```

---

## 🐛 Lưu ý khi cài đặt

1. **XAMPP MySQL password**: Nếu MySQL có password, cập nhật `DB_PASS` trong `backend/.env`
2. **Port conflict**: Đảm bảo port 3000 và 8080 không bị chiếm
3. **CORS**: Backend đã cấu hình CORS cho `localhost:3000`
4. **Uploads folder**: Thư mục `backend/uploads/` được tạo tự động

Nếu gặp lỗi, kiểm tra:

- XAMPP MySQL đang chạy
- Database `bookingcare` đã được tạo
- Đã chạy `npm install` ở cả backend và frontend
- File `.env` có thông tin đúng
