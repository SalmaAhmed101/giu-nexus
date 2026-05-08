const JobPost = require('../models/JobPost');
const User = require('../models/User');
const hf = require('../services/hfService');

// These are the only categories allowed by JobPost.js
const ALLOWED_CATEGORIES = [
  'Frontend',
  'Backend',
  'AI/ML',
  'DevOps',
  'Data Engineering',
  'Other'
];

// Simple backup classifier.
// We use this if Hugging Face fails or returns something unexpected.
const fallbackCategory = (text) => {
  const lowerText = text.toLowerCase();

  if (
    lowerText.includes('react') ||
    lowerText.includes('frontend') ||
    lowerText.includes('html') ||
    lowerText.includes('css') ||
    /\bui\b/.test(lowerText)
  ) {
    return 'Frontend';
  }

  if (
    lowerText.includes('node') ||
    lowerText.includes('express') ||
    lowerText.includes('api') ||
    lowerText.includes('backend') ||
    lowerText.includes('mongodb')
  ) {
    return 'Backend';
  }

  if (
    lowerText.includes('machine learning') ||
    lowerText.includes('ai') ||
    lowerText.includes('python') ||
    lowerText.includes('model') ||
    lowerText.includes('data science')
  ) {
    return 'AI/ML';
  }

  if (
    lowerText.includes('devops') ||
    lowerText.includes('docker') ||
    lowerText.includes('kubernetes') ||
    lowerText.includes('aws') ||
    lowerText.includes('ci/cd')
  ) {
    return 'DevOps';
  }

  if (
    lowerText.includes('data engineering') ||
    lowerText.includes('etl') ||
    lowerText.includes('pipeline') ||
    lowerText.includes('spark') ||
    lowerText.includes('warehouse')
  ) {
    return 'Data Engineering';
  }

  return 'Other';
};

// Hugging Face category classifier.
// First uses keyword rules for obvious cases.
// If rules cannot decide, then it uses Hugging Face.
const classifyJobCategory = async (jobText) => {
  const ruleBasedCategory = fallbackCategory(jobText);

  // If our keyword rules clearly identify the category, use it.
  // This prevents obvious Backend jobs from being misclassified as Frontend.
  if (ruleBasedCategory !== 'Other') {
    return ruleBasedCategory;
  }

  try {
    const result = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: [jobText],
      parameters: {
        candidate_labels: ALLOWED_CATEGORIES
      }
    });

    // Some versions return an array when inputs is an array.
    // Some may return an object. This handles both safely.
    const firstResult = Array.isArray(result) ? result[0] : result;
    const category = firstResult.labels && firstResult.labels[0];

    if (ALLOWED_CATEGORIES.includes(category)) {
      return category;
    }

    return 'Other';
  } catch (error) {
    console.log('Hugging Face category classification failed. Using fallback.');
    return 'Other';
  }
};

// GET /api/v1/jobs
// Public route: anyone can see jobs.
// Supports filters + pagination.
exports.getJobs = async (req, res, next) => {
  try {
    const { keyword, location, type, status } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { requirements: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    const total = await JobPost.countDocuments(query);

    const jobs = await JobPost.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/jobs
// Protected route: only approved recruiters can create jobs.
exports.createJob = async (req, res, next) => {
  try {
    if (req.user.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval. Wait for admin approval before posting jobs.'
      });
    }

    const {
      title,
      company,
      description,
      requirements,
      location,
      type,
      salary,
      totalSlots
    } = req.body;

    const jobText = `
      Title: ${title}
      Company: ${company}
      Description: ${description}
      Requirements: ${Array.isArray(requirements) ? requirements.join(', ') : requirements}
    `;

    const category = await classifyJobCategory(jobText);

    const job = await JobPost.create({
      title,
      company,
      description,
      requirements,
      location,
      type,
      salary,
      totalSlots,
      category,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/jobs/:id
// Public route: anyone can see one job.
exports.getJobById = async (req, res, next) => {
  try {
    const job = await JobPost.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/jobs/:id
// Protected route: only the recruiter who created the job can update it.
exports.updateJob = async (req, res, next) => {
  try {
    const job = await JobPost.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    const allowedFields = [
      'title',
      'company',
      'description',
      'requirements',
      'location',
      'type',
      'salary',
      'totalSlots',
      'status'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    if (
      req.body.title ||
      req.body.company ||
      req.body.description ||
      req.body.requirements
    ) {
      const jobText = `
        Title: ${job.title}
        Company: ${job.company}
        Description: ${job.description}
        Requirements: ${Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements}
      `;

      job.category = await classifyJobCategory(jobText);
    }

    const updatedJob = await job.save();

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/jobs/:id
// Protected route: recruiter owner or admin can delete.
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await JobPost.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const isOwner = job.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/jobs/:id/save
// Protected route: job seeker can save or unsave a job.
// Business rule: only open jobs can be saved.
exports.toggleSaveJob = async (req, res, next) => {
  try {
    const job = await JobPost.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Cannot save a closed job'
      });
    }

    const user = await User.findById(req.user._id);

    const alreadySaved = user.savedJobs.some(
      (savedJobId) => savedJobId.toString() === job._id.toString()
    );

    if (alreadySaved) {
      user.savedJobs = user.savedJobs.filter(
        (savedJobId) => savedJobId.toString() !== job._id.toString()
      );

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Job removed from saved jobs',
        saved: false
      });
    }

    user.savedJobs.push(job._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Job saved successfully',
      saved: true
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/jobs/saved
// Protected route: job seeker sees saved jobs.
exports.getSavedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedJobs');

    res.status(200).json({
      success: true,
      jobs: user.savedJobs || []
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/jobs/my-jobs
// Protected route: recruiter sees their own posted jobs.
exports.getMyJobs = async (req, res, next) => {
  try {
    const jobs = await JobPost.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    next(error);
  }
};