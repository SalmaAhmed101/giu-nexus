const Application = require('../models/Application');
const JobPost = require('../models/JobPost');
const hf = require('../services/hfService');

// POST /jobs/:jobId/apply — Job Seeker only
exports.applyToJob = async (req, res, next) => {
  try {
    const job = await JobPost.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const application = await Application.create({
      user: req.user._id,
      job: req.params.jobId,
      coverLetter: req.body.coverLetter || ''
    });

    res.status(201).json({ success: true, application });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already applied to this job' });
    }
    next(err);
  }
};

// GET /jobs/:jobId/applicants — Recruiter (owner) only
exports.getApplicants = async (req, res, next) => {
  try {
    const job = await JobPost.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised to view applicants for this job' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('user', 'name email skills');

    res.status(200).json({ success: true, applications });
  } catch (err) { next(err); }
};

// GET /applications/my — Job Seeker only
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('job', 'title company type status');

    res.status(200).json({ success: true, applications });
  } catch (err) { next(err); }
};

// PATCH /applications/:id/status — Recruiter (owner of the job) only
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    if (application.job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised to update this application' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ success: true, application });
  } catch (err) { next(err); }
};

// GET /applications — Admin only
exports.getAllApplications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Application.countDocuments();
    const applications = await Application.find()
      .populate('user', 'name email')
      .populate('job', 'title company')
      .skip(skip)
      .limit(limit);

    res.status(200).json({ success: true, total, page, applications });
  } catch (err) { next(err); }
};

// GET /jobs/recommended — Job Seeker only
exports.getRecommendedJobs = async (req, res, next) => {
  try {
    const user = req.user;
    const openJobs = await JobPost.find({ status: 'open' });

    if (!user.skills || user.skills.length === 0) {
      return res.status(200).json({ success: true, jobs: openJobs });
    }

    const studentText = user.skills.join(', ');
    const jobTexts = openJobs.map(j => `${j.title} ${j.requirements.join(' ')}`);

    try {
      const embeddings = await hf.featureExtraction({
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        inputs: [studentText, ...jobTexts]
      });

      function cosineSimilarity(vecA, vecB) {
        const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
        const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
        return dot / (magA * magB);
      }

      const studentVec = embeddings[0];
      const scoredJobs = openJobs.map((job, i) => ({
        ...job.toObject(),
        score: cosineSimilarity(studentVec, embeddings[i + 1])
      }));

      scoredJobs.sort((a, b) => b.score - a.score);
      return res.status(200).json({ success: true, jobs: scoredJobs });

    } catch (aiErr) {
      console.error('HuggingFace embedding error:', aiErr.message);
      return res.status(200).json({ success: true, jobs: openJobs });
    }
  } catch (err) { next(err); }
};