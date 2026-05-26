const express = require('express');
const router = express.Router();
const { ingestCsvDataset, getCampaignById } = require('../controllers/csvController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.post('/ingest', protectAdmin, ingestCsvDataset);
router.get('/:id', protectAdmin, getCampaignById); // New GET endpoint mapping

module.exports = router;