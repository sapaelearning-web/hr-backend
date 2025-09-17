const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  date: { type: String, required: true }, // yyyy-mm-dd
  checkIn: { type: String }, // ISO string
  checkOut: { type: String }, // ISO string
});

module.exports = mongoose.model('Attendance', attendanceSchema);
