import api from './api';

// GET all jobs posted by the logged-in recruiter
export const getMyJobs = () => api.get('/jobs/my-jobs');

// POST create a new job
export const createJob = (jobData) => api.post('/jobs', jobData);

// GET a single job by id (used to pre-fill EditJobPage)
export const getJobById = (id) => api.get(`/jobs/${id}`);

// PATCH update a job by id
export const updateJob = (id, jobData) => api.patch(`/jobs/${id}`, jobData);

// GET all applicants for a specific job
export const getApplicants = (jobId) => api.get(`/jobs/${jobId}/applicants`);

// PATCH update an applicant's status
export const updateApplicationStatus = (applicationId, status) =>
  api.patch(`/applications/${applicationId}/status`, { status });