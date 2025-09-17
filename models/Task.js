const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: String, required: true }, // userId
  status: { type: String, required: true }, // Pending / In Progress / Completed
});

module.exports = mongoose.model('Task', taskSchema);
