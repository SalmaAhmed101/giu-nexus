const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', (req, res, next) => register(req, res, next));
router.post('/login', (req, res, next) => login(req, res, next));
router.post('/logout', protect, (req, res, next) => logout(req, res, next));
router.post('/forgot-password', (req, res, next) => forgotPassword(req, res, next));
router.patch('/reset-password/:token', (req, res, next) => resetPassword(req, res, next));

module.exports = router;