// report.model.js

const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accident', // Assuming there's a Patient model
    required: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  reportType: {
    type: String, // e.g., "X-Ray", "Blood Test", etc.
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  prescription: {
    type: String
  },
  reportDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  },
  isCritical: {
    type: Boolean,
    default: false
  }
});

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;
