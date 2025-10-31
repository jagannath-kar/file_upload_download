const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },

  clock_in: { type: Date, required: true },
  clock_out: { type: Date, required: true },

  total_work_hours: { type: Number, required: true, min: 0 },

  ref_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  }
});

module.exports = mongoose.model('attendance', attendanceSchema, 'attendance');
