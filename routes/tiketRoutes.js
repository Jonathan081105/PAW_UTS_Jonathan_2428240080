const express = require('express');
const router = express.Router();
const {
  createTiket,
  getTikets,
  getTiketById
} = require('../controllers/tiketController');

// C1, C2, C3. POST [path] & GET [path]
router.post('/', createTiket);
router.get('/', getTikets);

// C4. GET [path]/:id dengan populate
router.get('/:id', getTiketById);

module.exports = router;
