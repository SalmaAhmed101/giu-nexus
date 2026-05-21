const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many requests, please try again later." }
});

router.post('/register', limiter, (req, res, next) => register(req, res, next));
router.post('/login', limiter, (req, res, next) => login(req, res, next));
router.post('/logout', protect, (req, res, next) => logout(req, res, next));
router.post('/forgot-password', limiter, (req, res, next) => forgotPassword(req, res, next));
router.patch('/reset-password/:token', (req, res, next) => resetPassword(req, res, next));

module.exports = router;