const mongoose = require('mongoose');

const CandidateRecordSchema = new mongoose.Schema({
  id: Number,
  isSelected: { type: Boolean, default: true },
  isValid: { type: Boolean, default: true },
  // Flexible storage to hold any additional unmapped or mapped raw CSV string keys
  rawData: { type: Map, of: String }
});

const CampaignSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  recognizedColumns: {
    type: Map,
    of: String, // e.g., { "name": "Candidate Name", "email": "Contact Email" }
    required: true
  },
  candidates: [CandidateRecordSchema],
  metrics: {
    total: { type: Number, default: 0 },
    selected: { type: Number, default: 0 },
    validEmails: { type: Number, default: 0 },
    invalid: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['PENDING_REVIEW', 'TEMPLATE_READY', 'DISPATCHED'],
    default: 'PENDING_REVIEW'
  }
}, { timestamps: true });

module.exports = mongoose.model('Campaign', CampaignSchema);