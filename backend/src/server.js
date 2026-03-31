require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./config/database");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/v1", routes);

// Health check
app.get("/", (req, res) =>
  res.json({ message: "BookingCare API is running!", version: "1.0.0" }),
);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ errCode: -1, message: "Internal server error" });
});

// Start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
