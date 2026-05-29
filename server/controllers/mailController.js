const nodemailer = require('nodemailer');
const { generatePdfBuffer } = require('../utils/pdfGenerator');
const ExecutionLog = require('../models/ExecutionLog');

// ==========================================
// PRIMARY SMTP TRANSPORT
// ==========================================
const PRIMARY_TRANSPORT = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ==========================================
// SECONDARY SMTP TRANSPORT (FAILOVER)
// ==========================================
const SECONDARY_TRANSPORT = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.BACKUP_SMTP_USER,
    pass: process.env.BACKUP_SMTP_PASS,
  },
});

// ==========================================
// SMTP FAILOVER ENGINE
// ==========================================
const sendWithFailover = async (mailOptions) => {
  try {
    console.log('Attempting PRIMARY SMTP route...');
    const result = await PRIMARY_TRANSPORT.sendMail(mailOptions);
    return { provider: 'PRIMARY', result };
  } catch (primaryError) {
    console.error('PRIMARY SMTP FAILED:', primaryError.message);

    const shouldFailover = ['535', '550', 'rate', 'Invalid login'].some(code => 
      primaryError.message.includes(code)
    );

    if (!shouldFailover) throw primaryError;

    console.log('Switching to SECONDARY SMTP provider...');
    const result = await SECONDARY_TRANSPORT.sendMail(mailOptions);
    return { provider: 'SECONDARY', result };
  }
};

// ==========================================
// MAIN DISPATCH CONTROLLER
// ==========================================
const sendBulkOffers = async (req, res) => {
  const { 
    targets, 
    emailSubject, 
    emailBody, 
    dispatchSettings, 
    selectedLogos = [], 
    pdfOptions = {} 
  } = req.body;

  if (!targets || !Array.isArray(targets)) {
    return res.status(400).json({ error: 'Invalid targets' });
  }

  const outputLogs = [];
  const throttleDelay = dispatchSettings?.delay || 2500;

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    const recipientEmail = target.email || target['Contact Email'];

    try {
      // 1. Compile HTML Body
      let compiledBody = emailBody
        .replace(/{Candidate Name}/g, target.name || 'Candidate')
        .replace(/{Role}/g, target.role || 'Software Intern')
        .replace(/{Institution}/g, target.institution || 'Xyzon')
        .replace(/{Duration}/g, target.duration || '3 Months')
        .replace(/{Start Date}/g, target.startDate || 'Immediate')
        .replace(/{Mode}/g, target.mode || 'Remote');

      // 2. Build Footer Logo HTML
      let footerLogos = '';
      if (selectedLogos.includes('Xyzon Corp Logo')) {
        footerLogos += `<div style="display:flex; flex-direction:column; align-items:center;"><img src="https://yourdomain.com/logo.png" style="height:55px; object-fit:contain;"/><span style="font-size:10px; color:#64748b;">Authorized Xyzon Corp</span></div>`;
      }
      if (selectedLogos.includes('AICTE Approved Stamp')) {
        footerLogos += `<div style="display:flex; flex-direction:column; align-items:center;"><img src="https://yourdomain.com/aicte.png" style="height:55px; object-fit:contain;"/><span style="font-size:10px; color:#64748b;">AICTE Approved Framework</span></div>`;
      }

      // 3. Prepare PDF Content
      const fullPdfHtml = `<!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif; background:#ffffff; padding:40px; margin:0; color:#0f172a;} .pdf-wrapper{max-width:800px; margin:auto;} .watermark{position:fixed; top:40%; left:18%; font-size:70px; opacity:0.03; transform:rotate(-25deg); font-weight:900; z-index:0;} .content{position:relative; z-index:2;} .footer{margin-top:60px; border-top:1px solid #e2e8f0; padding-top:20px; display:flex; gap:40px;}</style></head><body>${pdfOptions.showWatermark ? '<div class="watermark">XYZON VERIFIED</div>' : ''}<div class="pdf-wrapper"><div class="content">${compiledBody}</div><div class="footer">${footerLogos}</div></div></body></html>`;

      console.log(`[${i + 1}] Generating PDF for ${recipientEmail}`);
      const pdfBuffer = await generatePdfBuffer(fullPdfHtml);

      // 4. Send Email
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: recipientEmail,
        subject: emailSubject || 'Official Offer Letter',
        html: `<div style="font-family:Arial,sans-serif; padding:20px; line-height:1.8; color:#334155;"><h2 style="color:#1e3a8a;">Xyzon Innovations</h2><p>Dear <strong>${target.name}</strong>,</p><p>Your official offer letter is attached.</p><p>Please review and confirm acceptance.</p></div>`,
        attachments: [{ filename: 'Offer_Letter.pdf', content: pdfBuffer, contentType: 'application/pdf' }]
      };

      const dispatchResult = await sendWithFailover(mailOptions);

      // 5. Success Logging
      await ExecutionLog.create({
        candidateName: target.name,
        email: recipientEmail,
        role: target.role,
        institution: target.institution,
        templateUsed: dispatchSettings?.templateName || 'Default Template',
        smtpProvider: dispatchResult.provider,
        deliveryStatus: 'success',
        pdfGenerated: true,
        originalPayload: target
      });

      outputLogs.push({ recipient: recipientEmail, status: 'success', provider: dispatchResult.provider });
      console.log(`SUCCESS: ${recipientEmail} via ${dispatchResult.provider}`);

    } catch (err) {
      // 6. Failure Logging
      console.error(`FAILED: ${recipientEmail}`, err.message);
      await ExecutionLog.create({
        candidateName: target.name,
        email: recipientEmail,
        role: target.role,
        institution: target.institution,
        templateUsed: dispatchSettings?.templateName || 'Default Template',
        smtpProvider: 'PRIMARY',
        deliveryStatus: 'failed',
        pdfGenerated: false,
        errorMessage: err.message,
        originalPayload: target
      });

      outputLogs.push({ recipient: recipientEmail, status: 'failed', error: err.message });
    }

    // Pacing Delay
    if (i < targets.length - 1) {
      await new Promise(resolve => setTimeout(resolve, throttleDelay));
    }
  }

  return res.status(200).json({ message: 'Dispatch batch complete', summary: outputLogs });
};

module.exports = { sendBulkOffers };