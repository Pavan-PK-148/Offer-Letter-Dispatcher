const mongoose = require('mongoose');

const executionLogSchema = new mongoose.Schema({

  candidateName: String,

  email: String,

  role: String,

  institution: String,

  templateUsed: String,

  smtpProvider: String,

  deliveryStatus: String,

  pdfGenerated: Boolean,

  errorMessage: String,

  originalPayload: Object,

}, {
  timestamps: true
});

module.exports =
  mongoose.model(
    'ExecutionLog',
    executionLogSchema
  );