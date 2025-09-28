
// models/Competition.js
const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  studentName: { type: String, required: true },
  studentCode: { type: String, required: true },
  position: { type: Number, required: true }, // 1, 2, 3
  prize: { type: String }, // الجائزة
  notes: { type: String } // ملاحظات إضافية
});

const competitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { 
    type: String, 
    required: true,
    enum: ['تلاوة', 'حفظ', 'تجويد', 'أنشطة', 'أخرى']
  },
  date: { type: Date, required: true },
  location: { type: String },
  status: {
    type: String,
    enum: ['قادمة', 'جارية', 'منتهية'],
    default: 'قادمة'
  },
  image: { type: String }, // صورة المسابقة
  winners: [winnerSchema],
  criteria: { type: String } // معايير التقييم
}, {
  timestamps: true
});

module.exports = mongoose.model("Competition", competitionSchema);
