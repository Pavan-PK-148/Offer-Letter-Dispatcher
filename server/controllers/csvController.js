const Campaign = require('../models/Campaign');

// @desc    Process client-side parsed rows and initialize a campaign profile
// @route   POST /api/campaign/ingest
exports.ingestCsvDataset = async (req, res) => {
  try {
    const { fileName, recognizedColumns, csvData } = req.body;

    if (!csvData || csvData.length === 0) {
      return res.status(400).json({ success: false, message: 'Empty dataset vector grid arrays provided.' });
    }

    // Build sub-candidate documents while identifying tracking parameters
    let validEmailsCount = 0;
    let invalidEmailsCount = 0;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const formattedCandidates = csvData.map(row => {
      // Find what column is mapped to Contact Email
      const emailHeaderKey = Object.keys(recognizedColumns).find(key => recognizedColumns[key] === 'Contact Email');
      const emailValue = emailHeaderKey ? row[emailHeaderKey]?.trim() : '';
      
      const isValidEmail = emailRegex.test(emailValue);
      if (isValidEmail) validEmailsCount++; else invalidEmailsCount++;

      // package variable structural map attributes separately
      const rawRowMap = new Map();
      Object.keys(row).forEach(k => {
        if (k !== 'id' && k !== 'isSelected') {
          rawRowMap.set(k, String(row[k]));
        }
      });

      return {
        id: row.id,
        isSelected: row.isSelected ?? true,
        isValid: isValidEmail,
        rawData: rawRowMap
      };
    });

    // Create the master Campaign document
    const campaign = await Campaign.create({
      adminId: req.user._id,
      fileName,
      recognizedColumns,
      candidates: formattedCandidates,
      metrics: {
        total: csvData.length,
        selected: csvData.filter(r => r.isSelected !== false).length,
        validEmails: validEmailsCount,
        invalid: invalidEmailsCount
      }
    });

    res.status(201).json({
      success: true,
      message: 'Workspace snapshot deployed to server.',
      campaignId: campaign._id,
      metrics: campaign.metrics
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Retrieve active campaign properties by unique Object ID reference
// @route   GET /api/campaign/:id
exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      adminId: req.user._id // Ensures administrators can only view their own campaigns
    });

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Requested campaign architecture not found.' });
    }

    res.status(200).json({
      success: true,
      campaign
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};