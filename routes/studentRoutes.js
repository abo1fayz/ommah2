const express = require("express");
const Student = require("../models/Student");
const router = express.Router();

/* تسجيل الدخول بكود الطالب */
router.post("/login", async (req, res) => {
  const { code } = req.body;
  try {
    const student = await Student.findOne({ code });
    if (!student) return res.status(404).json({ message: "كود الدخول غير صحيح" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
});

/* جلب جميع الطلاب */
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "خطأ في جلب الطلاب" });
  }
});

/* إضافة طالب جديد */
router.post("/", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* تعديل بيانات طالب */
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!student) return res.status(404).json({ message: "الطالب غير موجود" });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* حذف طالب */
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "الطالب غير موجود" });
    res.json({ message: "تم حذف الطالب" });
  } catch (err) {
    res.status(500).json({ message: "خطأ أثناء الحذف" });
  }
});

/* إضافة اختبار لطالب */
router.post("/:id/tests", async (req, res) => {
  const { testType, testName, result, date } = req.body;
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "الطالب غير موجود" });

    const newTest = { testName, lessonName: testName, result, date };

    if (testType === "lessonTests") student.lessonTests.push(newTest);
    else if (testType === "tajweedTests") student.tajweedTests.push(newTest);
    else if (testType === "memorizationTests") student.memorizationTests.push(newTest);
    else return res.status(400).json({ message: "نوع الاختبار غير صحيح" });

    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* إضافة أو تعديل الصفحات الشهرية - الإصدار المصحح */
router.post("/:id/monthly-pages", async (req, res) => {
  const { month, year, pages, goal } = req.body;
  
  console.log("📝 Received monthly pages data:", req.body);
  console.log("🎯 Student ID:", req.params.id);
  
  // التحقق من البيانات المدخلة
  if (!month || !year || pages === undefined) {
    return res.status(400).json({ 
      message: "البيانات ناقصة. يرجى إدخال الشهر والسنة وعدد الصفحات" 
    });
  }

  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "الطالب غير موجود" });

    // البحث عن بيانات الشهر إن كانت موجودة
    const existingIndex = student.monthlyPages.findIndex(
      m => m.month === parseInt(month) && m.year === parseInt(year)
    );

    if (existingIndex !== -1) {
      // تحديث البيانات الموجودة
      student.monthlyPages[existingIndex].pages = parseInt(pages);
      student.monthlyPages[existingIndex].goal = goal ? parseInt(goal) : 20;
      student.monthlyPages[existingIndex].lastUpdate = new Date();
    } else {
      // إضافة بيانات جديدة
      student.monthlyPages.push({
        month: parseInt(month),
        year: parseInt(year),
        pages: parseInt(pages),
        goal: goal ? parseInt(goal) : 20,
        lastUpdate: new Date()
      });
    }

    await student.save();
    console.log("✅ Monthly pages saved successfully");
    
    res.json({ 
      message: "تم حفظ بيانات الصفحات بنجاح",
      student 
    });
  } catch (err) {
    console.error("❌ Error saving monthly pages:", err);
    res.status(500).json({ 
      message: "حدث خطأ أثناء حفظ البيانات: " + err.message 
    });
  }
});

module.exports = router;
