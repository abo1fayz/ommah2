const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const competitionRoutes = require("./routes/competitionRoutes");

// الاتصال بقاعدة البيانات
connectDB();

// إنشاء السيرفر
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/students", studentRoutes);
app.use("/api/competitions", competitionRoutes);

// ✅ خدمة ملفات الواجهة من مجلد frontend
app.use(express.static(path.join(__dirname, "frontend")));

// ✅ أي رابط غير API يرجع index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
