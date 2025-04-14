const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');

// Since we're just adding minimal functionality to get the messaging working
// We'll implement only the necessary routes
router.get('/', auth.protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: []
  });
});

module.exports = router; 