const express = require('express');

const {
  getJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob,
  toggleSaveJob,
  getSavedJobs,
  getMyJobs
} = require('../controllers/jobController');

const {
  applyToJob,
  getApplicants,
  getRecommendedJobs
} = require('../controllers/applicationController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getJobs);

// These must come before /:id
router.get('/recommended', protect, authorize('jobSeeker'), getRecommendedJobs);
router.get('/saved', protect, authorize('jobSeeker'), getSavedJobs);
router.get('/my-jobs', protect, authorize('recruiter'), getMyJobs);

// Recruiter creates a job
router.post('/', protect, authorize('recruiter'), createJob);

// Member 5 application routes
router.post('/:jobId/apply', protect, authorize('jobSeeker'), applyToJob);
router.get('/:jobId/applicants', protect, authorize('recruiter'), getApplicants);

// Public single job route
router.get('/:id', getJobById);

// Recruiter updates their own job
router.patch('/:id', protect, authorize('recruiter'), updateJob);

// Recruiter owner or admin deletes job
router.delete('/:id', protect, deleteJob);

// Job seeker saves/unsaves a job
router.post('/:id/save', protect, authorize('jobSeeker'), toggleSaveJob);

module.exports = router;