const User = require('../models/User');
const JobPost = require('../models/JobPost');
const Application = require('../models/Application');

exports.getUsers = async (req, res, next) => {
  try {
    const { role, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const users = await User.find(filter).select('-password').skip(skip).limit(Number(limit));
    const total = await User.countDocuments(filter);
    res.status(200).json({ success: true, total, page: Number(page), users });
  } catch (err) { next(err); }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (err) { next(err); }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) { next(err); }
};

exports.getAdminStats = async (req, res, next) => {
  try {
    const usersByRoleRaw = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);
    const usersByRole = {};
    usersByRoleRaw.forEach(r => usersByRole[r._id] = r.count);

    const jobsByStatusRaw = await JobPost.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const jobsByStatus = {};
    jobsByStatusRaw.forEach(r => jobsByStatus[r._id] = r.count);

    const appsByStatusRaw = await Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const appsByStatus = {};
    appsByStatusRaw.forEach(r => appsByStatus[r._id] = r.count);

    const topJobs = await Application.aggregate([
      { $group: { _id: '$job', applicationCount: { $sum: 1 } } },
      { $sort: { applicationCount: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'jobposts', localField: '_id', foreignField: '_id', as: 'jobDetails' } },
      { $unwind: '$jobDetails' },
      { $project: { _id: '$jobDetails._id', title: '$jobDetails.title', company: '$jobDetails.company', applicationCount: 1 } }
    ]);

    res.status(200).json({ success: true, stats: { usersByRole, jobsByStatus, appsByStatus, topJobs } });
  } catch (err) { next(err); }
};