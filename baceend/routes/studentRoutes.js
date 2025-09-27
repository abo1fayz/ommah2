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

/* إضافة أو تعديل الصفحات الشهرية */
router.post("/:id/monthly-pages", async (req, res) => {
  const { month, year, pages, goal } = req.body;
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "الطالب غير موجود" });

    const existingIndex = student.monthlyPages.findIndex(
      m => m.month === month && m.year === year
    );

    if (existingIndex !== -1) {
      student.monthlyPages[existingIndex].pages = pages;
      student.monthlyPages[existingIndex].goal = goal;
      student.monthlyPages[existingIndex].lastUpdate = new Date().toLocaleDateString("ar-EG");
    } else {
      student.monthlyPages.push({
        month,
        year,
        pages,
        goal,
        lastUpdate: new Date().toLocaleDateString("ar-EG")
      });
    }

    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
