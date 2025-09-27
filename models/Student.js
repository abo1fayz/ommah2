const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  testName: String,
  lessonName: String,
  result: Number,
  date: String
});

const monthlyPagesSchema = new mongoose.Schema({
  month: Number,
  year: Number,
  pages: Number,
  goal: Number,
  lastUpdate: { type: Date, default: Date.now }
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  overallLevel: { type: String, default: "غير محدد" },
  image: { type: String },
  lessonTests: [testSchema],
  tajweedTests: [testSchema],
  memorizationTests: [testSchema],
  monthlyPages: [monthlyPagesSchema]
}, {
  timestamps: true // إضافة timestamps تلقائية
});

// Middleware للتحقق من عدم تكرار الكود عند التحديث
studentSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  if (update.code) {
    const Student = mongoose.model('Student');
    const existingStudent = await Student.findOne({ code: update.code });
    if (existingStudent && existingStudent._id.toString() !== this.getQuery()._id.toString()) {
      return next(new Error('كود الدخول هذا مستخدم بالفعل'));
    }
  }
  next();
});

module.exports = mongoose.model("Student", studentSchema);
