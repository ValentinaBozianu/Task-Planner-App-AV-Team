const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  status: { type: String, enum: ['OPEN', 'PENDING', 'COMPLETED', 'CLOSED'], default: 'OPEN' },
  assigned_to: { type: String },
  created_by: { type: String }
});

module.exports = mongoose.model('Task', taskSchema);
