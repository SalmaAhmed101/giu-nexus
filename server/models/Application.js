const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // the job seeker/applicant
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPost',
      required: true,
    },
    coverLetter: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'rejected'],
      default: 'pending',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// Prevents a student from applying to the same job twice
ApplicationSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);