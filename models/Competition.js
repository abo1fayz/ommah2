// models/Competition.js
const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  studentName: { type: String, required: true },
  studentCode: { type: String },
  position: { type: String, required: true }, // ✅ أصبح نصياً
  prize: { type: String },
  notes: { type: String },
  score: { type: String } // نتيجة أو درجة الفائز
});

const competitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { 
    type: String, 
    required: true
    // ✅ تم إزالة enum لجعل النوع مفتوحاً
  },
  date: { type: Date, required: true },
  endDate: { type: Date }, // تاريخ انتهاء المسابقة
  location: { type: String },
  status: {
    type: String,
    // ✅ تم إزالة enum لجعل الحالة مفتوحة
  },
  image: { type: String },
  winners: [winnerSchema],
  criteria: { type: String }, // معايير التقييم
  participantsCount: { type: Number }, // عدد المشاركين
  notes: { type: String } // ملاحظات عامة
}, {
  timestamps: true
});

module.exports = mongoose.model("Competition", competitionSchema);
