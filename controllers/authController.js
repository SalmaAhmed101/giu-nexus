const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../services/emailService');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!['jobSeeker', 'recruiter'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    // FIX 1: password min-length check
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    const status = role === 'recruiter' ? 'pending' : 'approved';
    const user = await User.create({ name, email, password, role, status });
    const token = signToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name, email, role, status },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = signToken(user._id);
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email,
        role: user.role,
        status: user.status,
        profilePicture: user.profilePicture,
        skills: user.skills,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).json({ success: true, message: 'Password reset email sent' });
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // FIX 2: use env var instead of hardcoded localhost
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5000'}/api/v1/auth/reset-password/${resetToken}`;
    // FIX 3: inner try/catch to rollback token if email fails
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset',
        text: `Reset your password here: ${resetUrl}`,
      });
      res.status(200).json({ success: true, message: 'Password reset email sent' });
    } catch (emailErr) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(emailErr);
    }
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // FIX 4: password min-length check
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Token is invalid or has expired' });
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    const token = signToken(user._id);
    res.status(200).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};