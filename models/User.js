const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  leaveQuota: { type: Number, default: 0 },
  role: { type: String, default: 'User' }, // New role field
});

module.exports = mongoose.model('User', userSchema);
