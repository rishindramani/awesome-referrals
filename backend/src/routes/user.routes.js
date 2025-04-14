const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');

// Since we're just adding minimal functionality to get the messaging working
// We'll implement only the necessary routes
router.get('/profile', auth.protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      profilePicture: req.user.profile_picture_url,
      userType: req.user.user_type
    }
  });
});

module.exports = router; 