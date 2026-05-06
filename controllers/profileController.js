const User = require('../models/User');
const hf = require('../services/hfService');

// GET /api/v1/profile
exports.getProfile = async (req, res, next) => {
  try {
    // protect middleware already put the user on req.user
    // we just return it
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/profile
exports.updateProfile = async (req, res, next) => {
  try {
    // Only allow these fields to be updated
    //user cannot update role, status, or password here
    const { name, bio, profilePicture } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,          // which user to update
      { name, bio, profilePicture }, // what to update
      { new: true, runValidators: true } // return updated doc + run schema validators
    );

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/profile/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    //validate the presence of both fields
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Please provide both passwords' });
    }
    // We need the password field which is hidden by default (select: false)
    // So we re-query the user and explicitly ask for it
    const user = await User.findById(req.user._id).select('+password');


    // Check if the current password they typed matches what's in the DB
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Assign new password — the User model's pre('save') hook
    // will automatically hash it before saving
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/profile/extract-skills
exports.extractSkills = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Can't extract skills from an empty bio
    if (!user.bio) {
      return res.status(400).json({
        success: false,
        message: 'Bio is empty. Update your profile first.',
      });
    }

    let skills = user.skills; // fallback: keep existing skills if AI fails

    try {
      // Send the bio to HuggingFace NER model
      const result = await hf.tokenClassification({
        model: 'dslim/bert-base-NER',
        inputs: user.bio,
      });

      // result is an array like:
      // [{ word: 'React', entity_group: 'MISC', score: 0.99 }, ...]
      // We only want B-MISC, I-MISC, B-ORG (technologies and organisations)
      const extracted = result
        .filter(entity =>
          ['B-MISC', 'I-MISC', 'B-ORG'].includes(entity.entity_group)
        )
        .map(entity => entity.word);

      // Remove duplicates using Set
      skills = [...new Set(extracted)];

      // Save back to the user's profile
      user.skills = skills;
      await user.save();
    } catch (aiError) {
      // If HuggingFace is down or fails, don't crash —
      // just return the existing skills silently
      console.error('HuggingFace error:', aiError.message);
    }

    res.status(200).json({
      success: true,
      skills,
      extracted: skills,
    });
  } catch (err) {
    next(err);
  }
};
