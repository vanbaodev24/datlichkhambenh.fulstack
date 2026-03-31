require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    // Thêm dòng này để đảm bảo Sequelize sử dụng đúng trình điều khiển
    dialectOptions: {
      decimalNumbers: true,
    },
  },
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // Đồng bộ database
    await sequelize.sync({ alter: true, force: false });
    console.log("✅ Database synced");

    return sequelize; // QUAN TRỌNG: Trả về instance để .then() ở server.js hoạt động
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    throw error; // Ném lỗi để server.js bắt được
  }
};

module.exports = { sequelize, connectDB };
