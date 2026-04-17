const mongoose = require('mongoose');

const JobPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    requirements: {
      type: [String],
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ['full-time', 'part-time', 'internship'],
      required: true,
    },

    salary: {
      type: Number,
      // op
    },

    // doen auto by ai 
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'AI/ML', 'DevOps', 'Data Engineering', 'Other'],
    },

    totalSlots: {
      type: Number,
    },

    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model('JobPost', JobPostSchema);