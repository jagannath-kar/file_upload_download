const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  empId: { type: mongoose.Schema.Types.ObjectId, required: true },
  clockInTime: { type: Date },
  clockOutTime: { type: Date },
  workHours: { type: Number },
  isManager: { type: Boolean, default: false },
  managerName: { type: String },
  totalSickLeaveTaken: { type: Number, default: 0 },
  totalCasualLeaveTaken: { type: Number, default: 0 }
});

module.exports = mongoose.model('employee', employeeSchema, 'employee');