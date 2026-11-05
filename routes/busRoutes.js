const express = require('express');
const router = express.Router();
const {
  createBus,
  getBuses,
  getBusById
} = require('../controllers/busController');

// C1. POST [pathPendukung] & GET [pathPendukung]
router.post('/', createBus);
router.get('/', getBuses);
router.get('/:id', getBusById);

module.exports = router;
