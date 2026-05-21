const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUserStatus, deleteUser, getAdminStats } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('admin'), getAdminStats);
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUser);
router.patch('/:id/status', protect, authorize('admin'), updateUserStatus);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;