import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../context/DispatchContext';
import { 
  ArrowLeft, ArrowRight, Code, Eye, Brackets, CheckCircle, 
  Sparkles, LayoutTemplate, Settings, ShieldCheck, Users
} from 'lucide-react';
import xyzon from "../assets/logo.png";
import aicte from "../assets/aicte.png";
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Step3_Template() {
  const navigate = useNavigate();
  const context = useDispatch() || {};

  // Safe Fallback context bounds assignments 
  const csvData = context.csvData || []; // <-- Pulling live data updated from Step 2 Review!
  const recognizedColumns = context.recognizedColumns || {};
  const emailSubject = context.emailSubject || '';
  const setEmailSubject = context.setEmailSubject || (() => {});
  const emailBody = context.emailBody || '';
  const setEmailBody = context.setEmailBody || (() => {});
  const selectedLogos = context.selectedLogos || [];
  const setSelectedLogos = context.setSelectedLogos || (() => {});
  
  const dispatchSettings = context.dispatchSettings || { delay: 1500, retryOnFailure: true };
  const setDispatchSettings = context.setDispatchSettings || (() => {});

  const [activeTab, setActiveTab] = useState('visual'); 
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(null);
  
  // DYNAMIC RECIPIENT SOURCE: Fallback to mock values ONLY if csvData is completely empty.
  const visualRecipients = csvData.length > 0 ? csvData : [
    { name: 'John Doe', institution: 'Sri Venkateswara College of Engineering', role: 'Full Stack Developer Intern', duration: '8 Weeks', startDate: '15th March 2026', mode: 'Remote' },
    { name: 'Priya Sharma', institution: 'IIT Madras Technology Academy', role: 'Data Science Associate', duration: '12 Weeks', startDate: '01-Apr-2026', mode: 'Hybrid' }
  ];
  
  const [selectedRecipientIndex, setSelectedRecipientIndex] = useState(0);
  
  // Guard clause to make sure index stays safe if rows are modified
  const activePersonIndex = selectedRecipientIndex < visualRecipients.length ? selectedRecipientIndex : 0;
  const activePerson = visualRecipients[activePersonIndex] || {};

  // Find your context dynamic keys matching mapped properties safely
  const getName = () => activePerson[Object.keys(recognizedColumns).find(k => recognizedColumns[k] === 'Candidate Name')] || activePerson.name || '';
  const getRole = () => activePerson[Object.keys(recognizedColumns).find(k => recognizedColumns[k] === 'Role')] || activePerson.role || '';
  const getInstitution = () => activePerson[Object.keys(recognizedColumns).find(k => recognizedColumns[k] === 'Institution')] || activePerson.institution || '';
  const getDuration = () => activePerson[Object.keys(recognizedColumns).find(k => recognizedColumns[k] === 'Duration')] || activePerson.duration || '';
  const getStartDate = () => activePerson[Object.keys(recognizedColumns).find(k => recognizedColumns[k] === 'Start Date')] || activePerson.startDate || '';
  const getMode = () => activePerson[Object.keys(recognizedColumns).find(k => recognizedColumns[k] === 'Mode')] || activePerson.mode || '';

  const [pdfOptions, setPdfOptions] = useState({
    showWatermark: true,
    renderStampBorder: true,
    embedQrCode: false
  });

  const bodyInputRef = useRef(null);
  const logoOptions = ['Xyzon Corp Logo', 'AICTE Approved Stamp'];

  const handlePdfOptionToggle = (key) => {
    setPdfOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 90%+ Accurate Visual Templates Matching Your Uploaded Designs
  const structuralTemplates = [
    {
      name: 'Template 1: Modern Tech Minimalist (Image 3)',
      description: 'Clean minimalist layout with left-aligned corporate header lines.',
      subject: 'Offer Letter & Core Track Onboarding Portfolio',
      body: `<div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #1e293b; max-width: 650px; padding: 32px; background-color: #ffffff; line-height: 1.6; border: 1px solid #e2e8f0; border-radius: 8px;">
  <div style="border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 24px; text-align: left;">
    <h1 style="font-size: 22px; color: #0f172a; margin: 0; font-weight: 800; letter-spacing: -0.5px;">XYZON OPERATIONS PIPELINE</h1>
    <span style="font-size: 11px; text-transform: uppercase; color: #4f46e5; font-weight: 600; letter-spacing: 1px;">Corporate Verification Workspace</span>
  </div>
  
  <p style="font-size: 14px; margin-bottom: 16px; color: #334155;">Dear <strong>{Candidate Name}</strong>,</p>
  <p style="font-size: 14px; color: #334155; margin-bottom: 20px;">We are incredibly delighted to extend you a formal invitation to join our core development track. Your profile matches our technical optimization parameters perfectly.</p>
  
  <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 18px; margin: 24px 0; border-radius: 4px;">
    <p style="margin: 6px 0; font-size: 13.5px; color: #334155;">💼 <strong>Assigned Designation:</strong> {Role}</p>
    <p style="margin: 6px 0; font-size: 13.5px; color: #334155;">🏢 <strong>Affiliation Center:</strong> {Institution}</p>
    <p style="margin: 6px 0; font-size: 13.5px; color: #334155;">⏱️ <strong>Engagement Tenure:</strong> {Duration}</p>
    <p style="margin: 6px 0; font-size: 13.5px; color: #334155;">📅 <strong>Commencement Launch:</strong> {Start Date}</p>
    <p style="margin: 6px 0; font-size: 13.5px; color: #334155;">🌐 <strong>Workspace Protocol:</strong> {Mode}</p>
  </div>
  
  <p style="font-size: 14px; color: #334155; margin-bottom: 30px;">Please inspect the complete electronic terms packet attached to this dispatch. Reply back within 48 business hours to lock in your position slot.</p>
  
  <div style="margin-top: 40px; font-size: 13px; color: #64748b;">
    <p style="margin: 0 0 4px 0;">Warmest regards,</p>
    <strong style="color: #0f172a; font-size: 14px; display: block;">Talent Acquisition Group</strong>
    <span style="font-size: 12px; color: #94a3b8;">Xyzon Global Infrastructure Operations</span>
  </div>
</div>`
    },
    {
      name: 'Template 2: Elite Blue Executive (Image 4)',
      description: 'Polished header block template layout emphasizing enterprise delivery tags.',
      subject: 'Official Notification: Professional Appointment and Alignment Matrix',
      body: `<div style="font-family: 'Segoe UI', Arial, sans-serif; color: #334155; max-width: 650px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; line-height: 1.6; shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
  <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); padding: 28px; color: #ffffff; text-align: left;">
    <h2 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">XYZON FELLOWSHIP TRACK SELECTION RECORD</h2>
    <p style="margin: 6px 0 0 0; opacity: 0.8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Official Human Capital Dispatch</p>
  </div>
  
  <div style="padding: 32px;">
    <p style="font-size: 14px; color: #1e293b; margin-bottom: 16px;">Greetings <strong>{Candidate Name}</strong>,</p>
    <p style="font-size: 14px; color: #475569; margin-bottom: 24px;">We are exceptionally thrilled to inform you that your candidacy has been locked and certified for our upcoming production engineering deployment phase.</p>
    
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 24px 0;">
      <span style="color: #166534; font-weight: 800; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 8px; letter-spacing: 0.5px;">🎯 Appointment Metrics Matrix:</span>
      <h3 style="margin: 0 0 10px 0; color: #166534; font-size: 17px; font-weight: 700;">{Role}</h3>
      <p style="margin: 4px 0; font-size: 13px; color: #1e293b;"><strong>Affiliation Center:</strong> {Institution}</p>
      <p style="margin: 4px 0; font-size: 13px; color: #1e293b;"><strong>Timeline Duration:</strong> {Duration} starting {Start Date}</p>
      <p style="margin: 4px 0; font-size: 13px; color: #1e293b;"><strong>Logistics Mode:</strong> {Mode}</p>
    </div>
    
    <div style="margin-top: 32px; pt: 16px; border-top: 1px solid #f1f5f9;">
      <strong style="color: #1e3a8a; font-size: 13px; display: block; text-transform: uppercase;">Global Recruitment Infrastructure Command</strong>
      <span style="color: #94a3b8; font-size: 11px;">Verification Reference Token Active</span>
    </div>
  </div>
</div>`
    },
    {
      name: 'Template 3: Corporate Traditional Tabular (Image 5)',
      description: 'Formal corporate setup using distinct parametric table rows.',
      subject: 'Offer of Internship Appointment Framework Alignment',
      body: `<div style="font-family: 'Georgia', serif; color: #0f172a; max-width: 650px; padding: 36px; border: 2px solid #cbd5e1; background-color: #ffffff; line-height: 1.7;">
  <h2 style="color: #1e3a8a; font-size: 22px; text-align: center; font-weight: bold; border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 28px; letter-spacing: 0.5px;">LETTER OF FORMAL APPOINTMENT</h2>
  
  <p style="font-size: 14px; margin-bottom: 16px;">Dear <strong>{Candidate Name}</strong>,</p>
  <p style="font-size: 14px; text-indent: 24px; margin-bottom: 20px; color: #334155;">Following a thorough evaluation of your technical background matrix and academic performance files, we take great pride in extending this structured offer of internship alignment.</p>
  
  <table style="width: 100%; border-collapse: collapse; margin: 28px 0; font-size: 13.5px; font-family: sans-serif;">
    <thead>
      <tr style="background-color: #1e3a8a; color: #ffffff;">
        <th style="padding: 12px; text-align: left; font-weight: bold; border: 1px solid #cbd5e1;">Operational Parameter</th>
        <th style="padding: 12px; text-align: left; font-weight: bold; border: 1px solid #cbd5e1;">Assigned Allocation Details</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="padding: 12px; font-weight: 600; border: 1px solid #cbd5e1; background-color: #f8fafc; color: #334155;">Core Assignment Focus</td><td style="padding: 12px; border: 1px solid #cbd5e1; color: #0f172a;">{Role}</td></tr>
      <tr><td style="padding: 12px; font-weight: 600; border: 1px solid #cbd5e1; background-color: #f8fafc; color: #334155;">Sponsoring Organization</td><td style="padding: 12px; border: 1px solid #cbd5e1; color: #0f172a;">{Institution}</td></tr>
      <tr><td style="padding: 12px; font-weight: 600; border: 1px solid #cbd5e1; background-color: #f8fafc; color: #334155;">Activation Lifecycle Line</td><td style="padding: 12px; border: 1px solid #cbd5e1; color: #0f172a;">{Start Date} ({Duration})</td></tr>
      <tr><td style="padding: 12px; font-weight: 600; border: 1px solid #cbd5e1; background-color: #f8fafc; color: #334155;">Workplace Protocol Type</td><td style="padding: 12px; border: 1px solid #cbd5e1; color: #0f172a;">{Mode}</td></tr>
    </tbody>
  </table>
  
  <div style="margin-top: 36px; font-family: sans-serif;">
    <p style="font-size: 13px; color: #475569; margin: 0 0 4px 0;">Sincerely yours,</p>
    <p style="font-size: 14px; font-weight: bold; color: #1e3a8a; margin: 0;">Director of Corporate Human Capital</p>
    <span style="color: #94a3b8; font-size: 11px; display: block; mt: 2px;">Authorized Signature Registry</span>
  </div>
</div>`
    },
    {
      name: 'Template 4: Structured Quad Grid (Image 6)',
      description: 'Elegant template partitioning data blocks into 2x2 grid panels.',
      subject: 'Verification Cleared: Corporate Cohort Appointment Notice',
      body: `<div style="font-family: 'Segoe UI', Arial, sans-serif; color: #334155; max-width: 650px; background-color: #ffffff; padding: 32px; border: 1px solid #e2e8f0; border-radius: 16px; line-height: 1.6; shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
  <div style="margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">
    <span style="font-size: 10px; text-transform: uppercase; color: #4f46e5; font-weight: 800; letter-spacing: 1.5px; display: block; margin-bottom: 6px;">COHORT VALIDATION STATUS</span>
    <h2 style="margin: 0; font-size: 20px; color: #0f172a; font-weight: 800; letter-spacing: -0.5px;">CONGRATULATIONS ENGAGEMENT CONFIRMED</h2>
  </div>

  <p style="font-size: 14px; color: #334155; margin-bottom: 16px;">Dear <strong>{Candidate Name}</strong>,</p>
  <p style="font-size: 14px; color: #475569; margin-bottom: 24px;">We are pleased to verify your structural selection into the core engineering fellowship matrix under the specified parameters:</p>
  
  <div style="margin: 24px 0;">
    <table style="width: 100%; border-spacing: 12px; border-collapse: separate; margin: -12px;">
      <tr>
        <td style="width: 50%; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; vertical-align: top;">
          <span style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 700; display: block; margin-bottom: 4px;">Track Designation</span>
          <strong style="color: #0f172a; font-size: 13.5px; display: block;">{Role}</strong>
        </td>
        <td style="width: 50%; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; vertical-align: top;">
          <span style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 700; display: block; margin-bottom: 4px;">Affiliation Block</span>
          <strong style="color: #0f172a; font-size: 13.5px; display: block;">{Institution}</strong>
        </td>
      </tr>
      <tr>
        <td style="width: 50%; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; vertical-align: top;">
          <span style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 700; display: block; margin-bottom: 4px;">Launch Timeline</span>
          <strong style="color: #0f172a; font-size: 13.5px; display: block;">{Start Date}</strong>
        </td>
        <td style="width: 50%; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; vertical-align: top;">
          <span style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 700; display: block; margin-bottom: 4px;">Work Modality</span>
          <strong style="color: #0f172a; font-size: 13.5px; display: block;">{Mode} ({Duration})</strong>
        </td>
      </tr>
    </table>
  </div>

  <p style="font-size: 13px; color: #64748b; margin-top: 24px;">Please prepare your authentication tokens for immediate integration into our global platform clusters.</p>
</div>`
    }
  ];

  const applyTemplate = (index) => {
    setSelectedTemplateIndex(index);
    setEmailSubject(structuralTemplates[index].subject);
    setEmailBody(structuralTemplates[index].body);
    toast.success(`Loaded configuration for template ${index + 1}`);
  };

  const handleLogoToggle = (brand) => {
    if (selectedLogos.includes(brand)) {
      setSelectedLogos(selectedLogos.filter(l => l !== brand));
      toast.success(`Removed asset layer: ${brand}`);
    } else {
      setSelectedLogos([...selectedLogos, brand]);
      toast.success(`Appended ${brand} to bottom footer view`);
    }
  };

  const injectToken = (tokenName) => {
    if (activeTab === 'visual') {
      toast.error('Switch to "Source HTML Editor" tab to inject token tags.');
      return;
    }
    const textarea = bodyInputRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const placeholder = `{${tokenName}}`;

    const freshText = emailBody.substring(0, startPos) + placeholder + emailBody.substring(endPos, emailBody.length);
    setEmailBody(freshText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(startPos + placeholder.length, startPos + placeholder.length);
    }, 50);

    toast.success(`Injected tag: ${placeholder}`);
  };

  const renderCompiledPreview = (htmlTemplate) => {
    if (!htmlTemplate) return '';
    return htmlTemplate
      .replace(/{Candidate Name}/g, getName())
      .replace(/{Role}/g, getRole())
      .replace(/{Institution}/g, getInstitution())
      .replace(/{Duration}/g, getDuration())
      .replace(/{Start Date}/g, getStartDate())
      .replace(/{Mode}/g, getMode());
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4 px-4 pb-12"
    >
      
      {/* LEFT COLUMN PANEL: Controls & Configuration Framework (4 Columns) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Template Layout Presets Selector */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <LayoutTemplate size={16} className="text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Select Structural Template
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {structuralTemplates.map((tmpl, idx) => (
              <div
                key={tmpl.name}
                onClick={() => applyTemplate(idx)}
                className={`p-3.5 border rounded-xl cursor-pointer transition-all duration-200 text-left relative overflow-hidden group
                  ${selectedTemplateIndex === idx 
                    ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/10 shadow-xs' 
                    : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300'
                  }
                `}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold ${selectedTemplateIndex === idx ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {tmpl.name}
                  </span>
                  {selectedTemplateIndex === idx && <CheckCircle size={14} className="text-indigo-600" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">{tmpl.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Tag Mappings Container */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-3">
            <Brackets size={16} className="text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Token Value Injections
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-normal mb-3">
            Switch to Source Mode to append CSV mappings into your document layouts:
          </p>
          <div className="flex flex-wrap gap-2">
            {['Candidate Name', 'Role', 'Institution', 'Duration', 'Start Date', 'Mode'].map(token => (
              <button
                key={token}
                onClick={() => injectToken(token)}
                className="text-[11px] font-bold px-2.5 py-1.5 bg-slate-50 hover:bg-indigo-50 text-indigo-700 border border-slate-200 rounded-xl transition-all"
              >
                +{token}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Toggle Controllers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-3">
            <Sparkles size={16} className="text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Footer Canvas Branding Logs
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal mb-3">
            Toggle canvas components to verify additional overlay branding metrics:
          </p>
          <div className="space-y-2">
            {logoOptions.map(logo => {
              const isChecked = selectedLogos.includes(logo);
              return (
                <div 
                  key={logo}
                  onClick={() => handleLogoToggle(logo)}
                  className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all duration-200
                    ${isChecked ? 'border-indigo-600 bg-indigo-50/40 font-semibold text-indigo-900' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100/50'}
                  `}
                >
                  <span className="text-xs font-medium">{logo}</span>
                  {isChecked && <CheckCircle size={15} className="text-indigo-600 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* System PDF Formatting Adjustments */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-3">
            <Settings size={16} className="text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              PDF Document Configurations
            </h3>
          </div>
          <div className="space-y-2">
            {['showWatermark', 'renderStampBorder'].map(key => (
              <div 
                key={key}
                onClick={() => handlePdfOptionToggle(key)}
                className="flex items-center justify-between p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-all"
              >
                <span className="text-xs font-bold text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <input type="checkbox" checked={pdfOptions[key]} readOnly className="h-3.5 w-3.5 text-indigo-600 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Safety Interval Throttle */}
        <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck size={14} /> Pipeline Safety Throttle
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Mailing Interval Delay (ms)</label>
            <input 
              type="number"
              value={dispatchSettings.delay}
              onChange={(e) => setDispatchSettings({ ...dispatchSettings, delay: Math.max(0, parseInt(e.target.value) || 0) })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN PANEL: Live Working Layout Template Canvas Workspace (8 Columns) */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col space-y-5 h-fit">
        
        {/* Recipient Context Dynamic Row Identity Matrix Selector */}
        <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-slate-600" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active Recipient Context Switcher</h4>
              <p className="text-[11px] text-slate-400">Select mapping records below to dynamically evaluate lookups instantly</p>
            </div>
          </div>
          <select
            value={activePersonIndex}
            onChange={(e) => setSelectedRecipientIndex(parseInt(e.target.value))}
            className="text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 shadow-3xs cursor-pointer"
          >
            {visualRecipients.map((rec, i) => (
              <option key={i} value={i}>👤 {rec[Object.keys(recognizedColumns).find(k => recognizedColumns[k] === 'Candidate Name')] || rec.name || `Record #${i+1}`}</option>
            ))}
          </select>
        </div>

        {/* Subject Field Element */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Email Subject Heading Configuration
          </label>
          <input
            type="text"
            value={emailSubject}
            onChange={(e) => { if(context.setEmailSubject) setEmailSubject(e.target.value); }}
            placeholder="Type document dispatch configuration parameters..."
            className="w-full text-sm font-semibold px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
          />
        </div>

        {/* Work Area Frame Content Wrapper */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Template Canvas Workspace Area
            </label>
            <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs font-bold shadow-3xs">
              <button
                onClick={() => setActiveTab('visual')}
                className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'visual' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <Eye size={13} /> Live Document View
              </button>
              <button
                onClick={() => setActiveTab('source')}
                className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'source' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <Code size={13} /> Source HTML Editor
              </button>
            </div>
          </div>

          {/* Core Interactive Presentation Display Screens */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs min-h-[500px] flex flex-col bg-slate-50/20">
            <AnimatePresence mode="wait">
              {activeTab === 'source' ? (
                <motion.div key="html-source-editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                  <div className="bg-slate-950 px-4 py-2 text-[10px] font-mono text-indigo-400 border-b border-slate-800 select-none">
                    ⚡ REALTIME HTML DOCUMENT LAYOUT SPECIFICATIONS MARGINS
                  </div>
                  <textarea
                    ref={bodyInputRef}
                    value={emailBody}
                    onChange={(e) => { if(context.setEmailBody) setEmailBody(e.target.value); }}
                    className="w-full flex-1 font-mono text-xs leading-relaxed p-5 bg-slate-900 text-slate-200 focus:outline-none min-h-[460px]"
                    placeholder="Load layout templates to modify inner properties or variables code..."
                  />
                </motion.div>
              ) : (
                <motion.div key="live-document-canvas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 flex justify-center items-start flex-1 overflow-y-auto">
                  <div className="w-full max-w-[650px] bg-white border border-slate-200 rounded-2xl p-8 relative min-h-[440px] shadow-sm flex flex-col justify-between">
                    
                    {/* Visual Security Overlay Bounds */}
                    {pdfOptions.renderStampBorder && <div className="absolute inset-3 border border-slate-100 rounded-xl pointer-events-none select-none" />}
                    {pdfOptions.showWatermark && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.015] rotate-[-25deg] font-mono text-4xl font-black text-slate-900 tracking-widest">
                        OFFICIAL VERIFIED DISPATCH
                      </div>
                    )}

                    {/* Raw HTML Content Output Area */}
                    <div className="flex-1">
                      {emailBody.trim() ? (
                        <div 
                          className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-700"
                          dangerouslySetInnerHTML={{ __html: renderCompiledPreview(emailBody) }}
                        />
                      ) : (
                        <div className="text-center py-24 text-slate-300 italic text-xs">
                          Select one of your pre-styled template presets on the left sidebar to populate this canvas area.
                        </div>
                      )}
                    </div>

                    {/* FIXED: DYNAMIC COMPONENT SIDE-BY-SIDE LOCAL IMAGE RENDERS */}
                    {selectedLogos.length > 0 && (
                      <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-start gap-6 select-none z-10">
                        {selectedLogos.includes('Xyzon Corp Logo') && (
                          <div className="flex flex-col items-start">
                            <img 
                              src={xyzon} 
                              alt="Xyzon Asset Seal" 
                              className="h-11 object-contain block"
                            />
                            <span style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px', fontFamily: 'sans-serif', fontWeight: 600 }}>Authorized Xyzon Corp</span>
                          </div>
                        )}
                        {selectedLogos.includes('AICTE Approved Stamp') && (
                          <div className="flex flex-col items-start">
                            <img 
                              src={aicte} 
                              alt="AICTE Asset Seal" 
                              className="h-11 object-contain block"
                            />
                            <span style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px', fontFamily: 'sans-serif', fontWeight: 600 }}>AICTE Academic Framework</span>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Global Page Traversal Navigation Bar Array */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => navigate('/step-2')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Recipient Grid
          </button>
          
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/step-4')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm rounded-xl shadow-md hover:opacity-95 cursor-pointer"
          >
            Proceed to Split Preview & Dispatch <ArrowRight size={16} />
          </motion.button>
        </div>

      </div>

    </motion.div>
  );
}