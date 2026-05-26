const express = require('express');
const router = express.Router();
const { executeBulkDispatch } = require('../controllers/dispatchController');

// POST route linking directly to frontend executeBulkDispatch action
router.post('/send-offers', executeBulkDispatch);

module.exports = router;