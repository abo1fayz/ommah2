const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// الاتصال بقاعدة البيانات
connectDB();

// API للطلاب
app.use("/api/students", studentRoutes);

// إضافة endpoint جديد لتحديث الطالب
app.put("/api/students/:id", async (req, res) => {
  try {
    const Student = require("./models/Student");
    const { name, code, overallLevel, image } = req.body;
    
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, code, overallLevel, image },
      { new: true, runValidators: true }
    );
    
    if (!updatedStudent) {
      return res.status(404).json({ message: "الطالب غير موجود" });
    }
    
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// إضافة endpoint جديد لجلب طالب محدد
app.get("/api/students/:id", async (req, res) => {
  try {
    const Student = require("./models/Student");
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: "الطالب غير موجود" });
    }
    
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// خدمة ملفات الواجهة (اختياري)
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.send("🚀 السيرفر يعمل مع قاعدة البيانات!");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ السيرفر شغال على http://localhost:${PORT}`));
