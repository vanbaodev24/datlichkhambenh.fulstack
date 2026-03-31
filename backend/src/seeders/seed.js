require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB } = require("../config/database"); // Thêm dấu ..
const { Allcode, User, Specialty, Clinic } = require("../models"); // Thêm dấu ..

const seedData = async () => {
  await connectDB();

  // Allcodes
  const allcodes = [
    // Time slots
    {
      keyMap: "T1",
      type: "TIME",
      valueVi: "8:00 - 8:30",
      valueEn: "8:00 - 8:30 AM",
    },
    {
      keyMap: "T2",
      type: "TIME",
      valueVi: "8:30 - 9:00",
      valueEn: "8:30 - 9:00 AM",
    },
    {
      keyMap: "T3",
      type: "TIME",
      valueVi: "9:00 - 9:30",
      valueEn: "9:00 - 9:30 AM",
    },
    {
      keyMap: "T4",
      type: "TIME",
      valueVi: "9:30 - 10:00",
      valueEn: "9:30 - 10:00 AM",
    },
    {
      keyMap: "T5",
      type: "TIME",
      valueVi: "10:00 - 10:30",
      valueEn: "10:00 - 10:30 AM",
    },
    {
      keyMap: "T6",
      type: "TIME",
      valueVi: "10:30 - 11:00",
      valueEn: "10:30 - 11:00 AM",
    },
    {
      keyMap: "T7",
      type: "TIME",
      valueVi: "14:00 - 14:30",
      valueEn: "2:00 - 2:30 PM",
    },
    {
      keyMap: "T8",
      type: "TIME",
      valueVi: "14:30 - 15:00",
      valueEn: "2:30 - 3:00 PM",
    },
    // Status
    { keyMap: "S1", type: "STATUS", valueVi: "Mới đặt", valueEn: "New" },
    {
      keyMap: "S2",
      type: "STATUS",
      valueVi: "Đã xác nhận",
      valueEn: "Confirmed",
    },
    { keyMap: "S3", type: "STATUS", valueVi: "Đã khám", valueEn: "Done" },
    { keyMap: "S4", type: "STATUS", valueVi: "Đã hủy", valueEn: "Cancelled" },
    // Prices
    {
      keyMap: "PRICE_100",
      type: "PRICE",
      valueVi: "100.000 đ",
      valueEn: "100.000 VND",
    },
    {
      keyMap: "PRICE_200",
      type: "PRICE",
      valueVi: "200.000 đ",
      valueEn: "200.000 VND",
    },
    {
      keyMap: "PRICE_300",
      type: "PRICE",
      valueVi: "300.000 đ",
      valueEn: "300.000 VND",
    },
    {
      keyMap: "PRICE_500",
      type: "PRICE",
      valueVi: "500.000 đ",
      valueEn: "500.000 VND",
    },
    // Payment
    {
      keyMap: "PAYMENT_CASH",
      type: "PAYMENT",
      valueVi: "Tiền mặt",
      valueEn: "Cash",
    },
    {
      keyMap: "PAYMENT_BANK",
      type: "PAYMENT",
      valueVi: "Chuyển khoản",
      valueEn: "Bank Transfer",
    },
    // Province
    { keyMap: "HN", type: "PROVINCE", valueVi: "Hà Nội", valueEn: "Ha Noi" },
    {
      keyMap: "HCM",
      type: "PROVINCE",
      valueVi: "Hồ Chí Minh",
      valueEn: "Ho Chi Minh",
    },
    { keyMap: "DN", type: "PROVINCE", valueVi: "Đà Nẵng", valueEn: "Da Nang" },
    {
      keyMap: "HP",
      type: "PROVINCE",
      valueVi: "Hải Phòng",
      valueEn: "Hai Phong",
    },
    // Position
    { keyMap: "P_BS", type: "POSITION", valueVi: "Bác sĩ", valueEn: "Doctor" },
    {
      keyMap: "P_ThS",
      type: "POSITION",
      valueVi: "Thạc sĩ",
      valueEn: "Master",
    },
    {
      keyMap: "P_PGS",
      type: "POSITION",
      valueVi: "Phó giáo sư",
      valueEn: "Assoc. Professor",
    },
    {
      keyMap: "P_GS",
      type: "POSITION",
      valueVi: "Giáo sư",
      valueEn: "Professor",
    },
    // Gender
    { keyMap: "M", type: "GENDER", valueVi: "Nam", valueEn: "Male" },
    { keyMap: "F", type: "GENDER", valueVi: "Nữ", valueEn: "Female" },
    { keyMap: "OTHER", type: "GENDER", valueVi: "Khác", valueEn: "Other" },
    // Role
    { keyMap: "ROLE_ADMIN", type: "ROLE", valueVi: "Admin", valueEn: "Admin" },
    {
      keyMap: "ROLE_DOCTOR",
      type: "ROLE",
      valueVi: "Bác sĩ",
      valueEn: "Doctor",
    },
    {
      keyMap: "ROLE_PATIENT",
      type: "ROLE",
      valueVi: "Bệnh nhân",
      valueEn: "Patient",
    },
  ];

  for (const code of allcodes) {
    await Allcode.findOrCreate({
      where: { keyMap: code.keyMap, type: code.type },
      defaults: code,
    });
  }
  console.log("✅ Allcodes seeded");

  // Admin user
  const hash = await bcrypt.hash("admin123", 10);
  await User.findOrCreate({
    where: { email: "admin@bookingcare.vn" },
    defaults: {
      password: hash,
      firstName: "Admin",
      lastName: "BookingCare",
      role: "admin",
      phone: "0900000000",
      gender: "M",
      isActive: true,
    },
  });
  console.log(
    "✅ Admin user seeded (email: admin@bookingcare.vn, password: admin123)",
  );

  // Sample specialties
  const specialties = [
    {
      name: "Tim mạch",
      image: null,
      descriptionHTML: "<p>Chuyên khoa tim mạch</p>",
      descriptionMarkdown: "Chuyên khoa tim mạch",
    },
    {
      name: "Thần kinh",
      image: null,
      descriptionHTML: "<p>Chuyên khoa thần kinh</p>",
      descriptionMarkdown: "Chuyên khoa thần kinh",
    },
    {
      name: "Nhi khoa",
      image: null,
      descriptionHTML: "<p>Chuyên khoa nhi</p>",
      descriptionMarkdown: "Chuyên khoa nhi",
    },
    {
      name: "Da liễu",
      image: null,
      descriptionHTML: "<p>Chuyên khoa da liễu</p>",
      descriptionMarkdown: "Chuyên khoa da liễu",
    },
    {
      name: "Mắt",
      image: null,
      descriptionHTML: "<p>Chuyên khoa mắt</p>",
      descriptionMarkdown: "Chuyên khoa mắt",
    },
    {
      name: "Tai mũi họng",
      image: null,
      descriptionHTML: "<p>Chuyên khoa tai mũi họng</p>",
      descriptionMarkdown: "Chuyên khoa tai mũi họng",
    },
    {
      name: "Cơ xương khớp",
      image: null,
      descriptionHTML: "<p>Chuyên khoa cơ xương khớp</p>",
      descriptionMarkdown: "Chuyên khoa cơ xương khớp",
    },
    {
      name: "Sản phụ khoa",
      image: null,
      descriptionHTML: "<p>Chuyên khoa sản phụ khoa</p>",
      descriptionMarkdown: "Chuyên khoa sản phụ khoa",
    },
  ];
  for (const s of specialties) {
    await Specialty.findOrCreate({ where: { name: s.name }, defaults: s });
  }
  console.log("✅ Specialties seeded");

  // Sample clinics
  const clinics = [
    {
      name: "Bệnh viện Bạch Mai",
      address: "78 Giải Phóng, Đống Đa, Hà Nội",
      image: null,
    },
    {
      name: "Bệnh viện Chợ Rẫy",
      address: "201B Nguyễn Chí Thanh, Quận 5, TP.HCM",
      image: null,
    },
    {
      name: "Bệnh viện Đà Nẵng",
      address: "124 Hải Phòng, Hải Châu, Đà Nẵng",
      image: null,
    },
    {
      name: "Bệnh viện Việt Đức",
      address: "40 Tràng Thi, Hoàn Kiếm, Hà Nội",
      image: null,
    },
  ];
  for (const c of clinics) {
    await Clinic.findOrCreate({ where: { name: c.name }, defaults: c });
  }
  console.log("✅ Clinics seeded");

  console.log("\n🎉 Database seeded successfully!");
  process.exit(0);
};

seedData().catch((err) => {
  console.error(err);
  process.exit(1);
});
