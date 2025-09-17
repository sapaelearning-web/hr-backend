const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  fromDate: { type: String, required: true },
  toDate: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, required: true }, // Pending / Approved / Rejected
  createdAt: { type: Date, default: Date.now }, // New: Timestamp for creation
});

module.exports = mongoose.model('Leave', leaveSchema);
