const express = require('express');
const router = express.Router();

const ExecutionLog =
  require('../models/ExecutionLog');

router.get('/', async (req, res) => {

  try {

    const logs =
      await ExecutionLog
        .find()
        .sort({ createdAt: -1 });

    res.json(logs);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;