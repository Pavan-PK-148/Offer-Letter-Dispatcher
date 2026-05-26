const nodemailer = require('nodemailer');

const executeBulkDispatch = async (req, res) => {
  const { targets, emailSubject, emailBody } = req.body;

  // Basic payload integrity check
  if (!targets || !Array.isArray(targets) || targets.length === 0) {
    return res.status(400).json({ error: 'No recipients provided inside the processing queue.' });
  }

  try {
    // Reconstruct the mailing transporter using your protected .env parameters
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '2525'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const outputLogs = [];

    // Loop cleanly through each selected recipient record
    for (const target of targets) {
      try {
        // Safe contextual template compilation handles raw properties or mapped CSV headers
        let compiledBody = emailBody
          .replace(/{Candidate Name}/g, target.name || target['Candidate Name'] || 'Candidate')
          .replace(/{Role}/g, target.role || target['Role'] || 'Intern')
          .replace(/{Institution}/g, target.institution || target['Institution'] || '')
          .replace(/{Duration}/g, target.duration || target['Duration'] || '')
          .replace(/{Start Date}/g, target.startDate || target['Start Date'] || '')
          .replace(/{Mode}/g, target.mode || target['Mode'] || '');

        const mailOptions = {
          from: process.env.SMTP_FROM || 'system@xyzon.internal',
          to: target.email || target['Contact Email'], 
          subject: emailSubject || 'Offer Letter & Core Track Onboarding',
          html: compiledBody,
        };

        // Fire transaction out onto SMTP network lines
        const logInfo = await transporter.sendMail(mailOptions);
        
        outputLogs.push({
          recipient: mailOptions.to,
          status: 'success',
          messageId: logInfo.messageId
        });
      } catch (individualError) {
        outputLogs.push({
          recipient: target.email || target['Contact Email'] || 'Unknown Target',
          status: 'failed',
          error: individualError.message
        });
      }
    }

    // Send backend status back to your React app
    return res.status(200).json({
      message: 'Batch processing complete',
      summary: outputLogs
    });

  } catch (globalSystemError) {
    return res.status(500).json({ 
      error: 'Failed to initialize system SMTP channel connections.', 
      details: globalSystemError.message 
    });
  }
};

module.exports = {
  executeBulkDispatch
};