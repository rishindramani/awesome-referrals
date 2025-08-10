const express = require('express');
const router = express.Router();
const { getPublicKey } = require('../utils/encryption');

router.get('/public-key', (req, res) => {
  const key = getPublicKey();
  if (!key) {
    return res.status(204).send();
  }
  res.type('text/plain').send(key);
});

module.exports = router;
