const express = require('express');
const router = express.Router();
const { sendBulkOffers } = require('../controllers/mailController');

// Route for handling bulk internship offer dispatches
router.post('/send-offers', sendBulkOffers);

module.exports = router;