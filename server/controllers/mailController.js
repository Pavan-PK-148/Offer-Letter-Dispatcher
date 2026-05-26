const nodemailer = require('nodemailer');

const sendBulkOffers = async (req, res) => {
  console.log("\n[MAIL ENGINE] Received bulk dispatch request for", req.body.targets?.length, "targets.");
  
  const { targets, emailSubject, emailBody, dispatchSettings } = req.body;
  const throttleDelay = dispatchSettings?.delay || 2500; // Increased default to 2.5s for safety

  if (!targets || !Array.isArray(targets)) {
    return res.status(400).json({ error: 'Invalid targets' });
  }

  const outputLogs = [];

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    const recipientEmail = target.email || target['Contact Email'];

    if (!recipientEmail) continue;

    try {
      // FIX: Re-create the transporter inside the loop to avoid session-based rate limiting
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
        port: parseInt(process.env.SMTP_PORT || '2525'),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      console.log(`[${i + 1}/${targets.length}] Dispatching to: ${recipientEmail}`);

      let compiledBody = emailBody
        .replace(/{Candidate Name}/g, target.name || 'Candidate')
        .replace(/{Role}/g, target.role || 'Intern')
        .replace(/{Institution}/g, target.institution || '')
        .replace(/{Duration}/g, target.duration || '')
        .replace(/{Start Date}/g, target.startDate || '')
        .replace(/{Mode}/g, target.mode || '');

      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'system@xyzon.internal',
        to: recipientEmail,
        subject: emailSubject || 'Offer Letter',
        html: compiledBody,
      });

      outputLogs.push({ recipient: recipientEmail, status: 'success' });
      console.log(`✅ Success.`);

    } catch (err) {
      console.error(`❌ Failed ${recipientEmail}:`, err.message);
      outputLogs.push({ recipient: recipientEmail, status: 'failed', error: err.message });
      
      // If we hit a hard limit, we should stop the loop to prevent further errors
      if (err.message.includes('535') || err.message.includes('550')) {
        console.log("🚨 Hard SMTP limit reached. Aborting batch.");
        break; 
      }
    }

    // Pacing delay
    if (i < targets.length - 1) {
      await new Promise(resolve => setTimeout(resolve, throttleDelay));
    }
  }

  return res.status(200).json({ message: 'Batch complete', summary: outputLogs });
};

module.exports = { sendBulkOffers };