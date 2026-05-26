import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../context/DispatchContext';
import { 
  ArrowLeft, Send, Settings, Mail, FileText, ChevronRight, 
  Sliders, CheckCircle2, Clock, Loader2, ShieldCheck, MailCheck 
} from 'lucide-react';
import xyzon from "../assets/logo.png";
import aicte from "../assets/aicte.png";
import toast from 'react-hot-toast';

export default function Step4_Preview() {
  const navigate = useNavigate();
  const context = useDispatch() || {};

  // Safe fallback bindings to prevent layout failures
  const csvData = context.csvData || [];
  const recognizedColumns = context.recognizedColumns || {};
  const emailSubject = context.emailSubject || '';
  const emailBody = context.emailBody || '';
  const selectedLogos = context.selectedLogos || [];
  const dispatchSettings = context.dispatchSettings || { delay: 1500, retryOnFailure: true };
  const setDispatchSettings = context.setDispatchSettings || (() => {});

  const [activeIndex, setActiveIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState('email'); 
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [deliveryStatus, setDeliveryStatus] = useState({}); 

  // UI TEST FALLBACK DATA MATRIX (Used ONLY if the user hasn't uploaded a CSV)
  const mockFallbackTargets = [
    { id: 1, name: 'John Doe', email: 'john.doe@svce.edu', institution: 'Sri Venkateswara College of Engineering', role: 'Full Stack Developer Intern', duration: '8 Weeks', startDate: '15th March 2026', mode: 'Remote' },
    { id: 2, name: 'Priya Sharma', email: 'priya@iitm.ac.in', institution: 'IIT Madras Technology Academy', role: 'Data Science Associate', duration: '12 Weeks', startDate: '01-Apr-2026', mode: 'Hybrid' }
  ];

  // Look only at the data columns/rows selected or modified in step 2 review
  const realTargets = csvData.filter(row => row.isSelected !== false);
  const isUsingFallback = realTargets.length === 0;
  const targets = isUsingFallback ? mockFallbackTargets : realTargets;
  
  const currentRecord = targets[activeIndex] || null;

  // Central utility to read data cleanly whether using dynamic user rows or the fallback matrix
  const getValueBySystemField = (fieldName) => {
    if (!currentRecord) return '';
    
    if (isUsingFallback) {
      if (fieldName === 'Candidate Name') return currentRecord.name;
      if (fieldName === 'Contact Email') return currentRecord.email;
      if (fieldName === 'Institution') return currentRecord.institution;
      if (fieldName === 'Role') return currentRecord.role;
      if (fieldName === 'Duration') return currentRecord.duration;
      if (fieldName === 'Start Date') return currentRecord.startDate;
      if (fieldName === 'Mode') return currentRecord.mode;
      return '';
    }

    const csvKey = Object.keys(recognizedColumns).find(k => recognizedColumns[k] === fieldName);
    return csvKey ? currentRecord[csvKey] || '' : '';
  };

  const compileTemplate = (templateString) => {
    let baseTemplate = templateString;

    if (!baseTemplate) {
      baseTemplate = `<div style="font-family: sans-serif; color: #334155; line-height: 1.6;">
        <p>Dear <strong>{Candidate Name}</strong>,</p>
        <p>We are exceptionally thrilled to inform you that your candidacy has been locked and certified for our upcoming engineering deployment phase as a <strong>{Role}</strong> at <strong>{Institution}</strong>.</p>
        <p>Your program runs for a fixed timeline of <strong>{Duration}</strong> starting <strong>{Start Date}</strong> under <strong>{Mode}</strong> arrangements.</p>
      </div>`;
    }
    
    let compiled = baseTemplate;
    const fieldsToMap = ['Candidate Name', 'Contact Email', 'Phone Number', 'Institution', 'Role', 'Duration', 'Start Date', 'Mode'];
    
    fieldsToMap.forEach(field => {
      const value = getValueBySystemField(field);
      const fallbackTag = field === 'Candidate Name' ? 'name' : field;
      
      compiled = compiled.replace(new RegExp(`{${field}}`, 'g'), value);
      compiled = compiled.replace(new RegExp(`{${fallbackTag}}`, 'g'), value);
    });

    // Dynamic brand injection logic reflecting choices made in Step 3
    if (selectedLogos.length > 0) {
      let imgFooterHtml = `<div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; align-items: center; gap: 24px;">`;
      if (selectedLogos.includes('Xyzon Corp Logo')) {
        imgFooterHtml += `<div style="display: inline-block; text-align: left;"><img src="${xyzon}" alt="Xyzon Asset" style="height: 38px; object-fit: contain; display: block;" /><span style="font-size: 9px; color: #94a3b8; font-family: sans-serif;">Xyzon Operations</span></div>`;
      }
      if (selectedLogos.includes('AICTE Approved Stamp')) {
        imgFooterHtml += `<div style="display: inline-block; text-align: left;"><img src="${aicte}" alt="AICTE Asset" style="height: 38px; object-fit: contain; display: block;" /><span style="font-size: 9px; color: #94a3b8; font-family: sans-serif;">AICTE Verified</span></div>`;
      }
      imgFooterHtml += `</div>`;
      return compiled + imgFooterHtml;
    }

    return compiled;
  };

  // Live Backend Request Handler connecting directly to your mailController
  // Find the executeBulkDispatch function inside your Step4_Preview.jsx and replace it with this:
const executeBulkDispatch = async () => {
  if (targets.length === 0) {
    toast.error('No selected recipients found inside the processing queue.');
    return;
  }

  setIsDispatching(true);
  setProgress({ current: 0, total: targets.length });
  
  const initialStatuses = {};
  targets.forEach((_, idx) => { initialStatuses[idx] = 'pending'; });
  setDeliveryStatus(initialStatuses);
  
  const loadingToastId = toast.loading('Connecting to Xyzon Core Mail Engine...', { id: 'dispatch' });

  const formattedTargets = targets.map((row) => {
    if (isUsingFallback) {
      return {
        name: row.name,
        email: row.email,
        institution: row.institution,
        role: row.role,
        duration: row.duration,
        startDate: row.startDate,
        mode: row.mode
      };
    }
    
    const getMappedValue = (field) => {
      const key = Object.keys(recognizedColumns).find(k => recognizedColumns[k] === field);
      return key ? row[key] : '';
    };

    return {
      name: getMappedValue('Candidate Name'),
      email: getMappedValue('Contact Email'),
      institution: getMappedValue('Institution'),
      role: getMappedValue('Role'),
      duration: getMappedValue('Duration'),
      startDate: getMappedValue('Start Date'),
      mode: getMappedValue('Mode')
    };
  });

  try {
    const response = await fetch('http://localhost:3000/api/mail/send-offers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targets: formattedTargets,
        emailSubject: emailSubject || "Offer Letter & Core Track Onboarding",
        emailBody: emailBody,
        // CRITICAL FIX: Explicitly send your throttle configurations to the server
        dispatchSettings: dispatchSettings 
      })
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Server rejected batch operation pipeline.');
    }

    const updateStatuses = {};
    let totalSuccessCount = 0;

    formattedTargets.forEach((target, idx) => {
      const matchedLog = responseData.summary?.find(log => log.recipient === target.email);
      if (matchedLog && matchedLog.status === 'success') {
        updateStatuses[idx] = 'sent';
        totalSuccessCount++;
      } else {
        updateStatuses[idx] = 'failed';
      }
    });

    setDeliveryStatus(updateStatuses);
    setProgress({ current: totalSuccessCount, total: targets.length });
    
    toast.success(`Dispatched ${totalSuccessCount}/${targets.length} offers successfully!`, { id: loadingToastId });

  } catch (networkError) {
    console.error("Mailing pipeline transmission collapse:", networkError);
    toast.error(`Dispatch failure: ${networkError.message}`, { id: loadingToastId });
    
    const failedStatuses = {};
    targets.forEach((_, idx) => { failedStatuses[idx] = 'failed'; });
    setDeliveryStatus(failedStatuses);
  } finally {
    setIsDispatching(false); 
  }
};

  return (
    <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4 px-4 pb-12">
      
      {/* LEFT PANEL: Recipient Queue Navigation (5 Columns) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold font-display text-slate-800 uppercase tracking-wider">
                Mailing Queue Batch Matrix {isUsingFallback && <span className="text-[10px] text-indigo-600 font-extrabold lowercase bg-indigo-50 px-2 py-0.5 rounded-md ml-1.5">demo data active</span>}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Review individual tokens across ({targets.length}) rows.</p>
            </div>
            
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-xl transition-all cursor-pointer"
              title="Throttling Engine Settings"
            >
              <Settings size={15} />
            </button>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {targets.map((row, idx) => {
              const nameValue = isUsingFallback ? row.name : row[Object.keys(recognizedColumns).find(k => recognizedColumns[k] === 'Candidate Name')];
              const emailValue = isUsingFallback ? row.email : row[Object.keys(recognizedColumns).find(k => recognizedColumns[k] === 'Contact Email')];
              const status = deliveryStatus[idx] || 'idle';
              
              return (
                <div
                  key={row.id || idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer
                    ${activeIndex === idx 
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-2 ring-indigo-500/10' 
                      : 'border-slate-100 hover:border-slate-200 bg-slate-50/40'
                    }
                  `}
                >
                  <div className="truncate pr-3 flex-1">
                    <div className="text-xs font-bold text-slate-800 truncate">{nameValue || 'Unnamed Participant'}</div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">{emailValue}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {status === 'pending' && <Clock size={13} className="text-amber-500" />}
                    {status === 'sending' && <Loader2 size={13} className="text-indigo-500 animate-spin" />}
                    {status === 'sent' && <CheckCircle2 size={13} className="text-emerald-500" />}
                    {status === 'failed' && <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded">Fail</span>}
                    <ChevronRight size={14} className={activeIndex === idx ? 'text-indigo-600' : 'text-slate-300'} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
            <button
              onClick={() => navigate('/step-3')}
              className="px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Back
            </button>
            
            <button
              disabled={isDispatching || targets.length === 0}
              onClick={executeBulkDispatch}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm rounded-xl shadow-md hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isDispatching ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Processing System Queue...</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Transmit {targets.length} Live Offers</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-slate-900 text-slate-300 border border-slate-800 rounded-xl p-4 flex items-center justify-between text-[11px] font-medium">
          <span className="flex items-center gap-1.5 text-indigo-400"><ShieldCheck size={14} /> Pipeline Network Status: Secure</span>
          <span className="text-slate-400">Port 3000 Node Pipeline</span>
        </div>
      </div>

      {/* RIGHT PANEL: Live Media Layout Preview (7 Columns) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[580px]">
          
          {/* Header Switcher Tabs */}
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-1.5">
              <MailCheck size={12} className="text-slate-400" /> Production Render Engine
            </span>
            
            <div className="flex bg-slate-200/70 border border-slate-200 rounded-xl p-1 text-xs font-bold shadow-3xs">
              <button
                onClick={() => setPreviewMode('email')}
                className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${previewMode === 'email' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <Mail size={13} /> Email Layout
              </button>
              <button
                onClick={() => setPreviewMode('pdf')}
                className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${previewMode === 'pdf' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <FileText size={13} /> PDF Attachment
              </button>
            </div>
          </div>

          {/* Active Layout Preview Window Body Frame */}
          <div className="p-6 flex-1 bg-slate-50/20 flex flex-col justify-start overflow-y-auto">
            {currentRecord ? (
              previewMode === 'email' ? (
                /* EMAIL OUTPUT DISK CARD */
                <div className="w-full max-w-[650px] mx-auto bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4 font-sans">
                  <div className="text-xs text-slate-500 border-b border-slate-100 pb-3 space-y-1 leading-normal">
                    <div><span className="font-bold text-slate-700">Subject:</span> {emailSubject || "Offer Letter & Engagement Onboarding Update Portfolio"}</div>
                    <div><span className="font-bold text-slate-700">Recipient Target:</span> {getValueBySystemField('Contact Email')}</div>
                  </div>
                  <div 
                    className="prose prose-slate max-w-none text-xs leading-relaxed pt-1"
                    dangerouslySetInnerHTML={{ __html: compileTemplate(emailBody) }}
                  />
                </div>
              ) : (
                /* FORMAL CORPORATE PDF PREVIEW WRAPPER CARD */
                <div className="bg-white border-t-4 border-t-indigo-600 border border-slate-300 rounded-2xl shadow-md p-8 w-full max-w-[600px] mx-auto space-y-6 relative text-slate-800 font-sans min-h-[500px] flex flex-col justify-between">
                  
                  <div className="absolute inset-3 border border-slate-100 rounded-xl pointer-events-none select-none" />

                  <div className="space-y-5 flex-1">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4 z-10 relative">
                      <div>
                        <div className="text-sm font-black tracking-tight text-slate-900 uppercase">XYZON OPERATIONS INTERNSHIP</div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Corporate Verification Pipeline</div>
                      </div>
                      <div className="text-[11px] space-y-0.5 text-right text-slate-500 font-medium">
                        <div><strong>Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        <div><strong>Ref ID:</strong> XZ/OFFER/2026/0{currentRecord.id || activeIndex + 101}</div>
                      </div>
                    </div>

                    <div className="text-xs space-y-0.5 text-slate-900 pt-2 z-10 relative">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Document Issued To:</div>
                      <div className="font-extrabold text-slate-800 text-sm">{getValueBySystemField('Candidate Name')}</div>
                      <div className="text-slate-500 font-medium">{getValueBySystemField('Institution')}</div>
                    </div>

                    <div className="text-center font-bold text-xs tracking-wider text-indigo-900 my-4 uppercase bg-indigo-50/50 py-2 rounded-xl border border-indigo-100/30 z-10 relative">
                      Subject: Formal Letter of Internship Offer & Program Trajectory
                    </div>

                    <div className="text-xs leading-relaxed space-y-3.5 text-slate-600 font-medium z-10 relative">
                      <p>Dear <strong>{getValueBySystemField('Candidate Name')}</strong>,</p>
                      <p>Following your technical reviews and parameter mapping diagnostics, we are incredibly delighted to extend you a formal invitation to join our core track as an assigned <strong>{getValueBySystemField('Role')}</strong>.</p>
                      <p>Your collaborative engagement with our production cluster is allocated for a fixed duration framework of <strong>{getValueBySystemField('Duration')}</strong>, officially scheduled to commence on <strong>{getValueBySystemField('Start Date')}</strong>. This operational deployment lifecycle line is established under <strong>{getValueBySystemField('Mode')}</strong> logistics.</p>
                      <p>Please review your system configurations and secure validation tokens to lock in this appointment position within 48 business hours.</p>
                    </div>
                  </div>

                  {/* DOCUMENT LOWER TRACK FOOTER: SIDE-BY-SIDE LOGO IMAGE LAYOUTS */}
                  <div className="pt-6 border-t border-slate-100 flex items-end justify-between z-10 relative">
                    <div className="text-left">
                      <div className="h-6 border-b border-slate-300 w-24 mb-1" />
                      <div className="text-[10px] font-bold text-slate-800">Authorized Human Capital Lead</div>
                      <div className="text-[9px] text-slate-400 font-medium">Global Infrastructure Registry</div>
                    </div>

                    <div className="flex items-center gap-4 select-none">
                      {selectedLogos.includes('Xyzon Corp Logo') && (
                        <div className="flex flex-col items-center">
                          <img src={xyzon} alt="Xyzon Stamp" className="h-9 object-contain block" />
                          <span className="text-[8px] text-slate-400 font-bold mt-1">Xyzon Seal</span>
                        </div>
                      )}
                      {selectedLogos.includes('AICTE Approved Stamp') && (
                        <div className="flex flex-col items-center">
                          <img src={aicte} alt="AICTE Stamp" className="h-9 object-contain block" />
                          <span className="text-[8px] text-slate-400 font-bold mt-1">AICTE Approved</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )
            ) : (
              <div className="text-center text-xs text-slate-400 py-24 italic">No recipient rows available in the data limits.</div>
            )}
          </div>
        </div>
      </div>

      {/* THROTTLING DELAY CONFIGURATION MODAL DIALOG OVERLAY */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl max-w-sm w-full space-y-4">
            <div className="flex items-center gap-2 text-slate-900 pb-1 border-b border-slate-100">
              <Sliders size={16} className="text-indigo-600" />
              <h4 className="text-xs font-bold font-display uppercase tracking-wider">Mailing Throttle Profiles</h4>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">INTER-MAIL INTERVAL DELAY (MS)</label>
                <input
                  type="number"
                  value={dispatchSettings?.delay || 1500}
                  onChange={(e) => setDispatchSettings({ ...dispatchSettings, delay: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-semibold"
                  placeholder="e.g. 1500"
                />
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">Throttling delay protects SMTP relay profiles from structural IP blocking traps.</p>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-[11px] font-bold text-slate-600">RETRY ON DELIVERY FAILS</span>
                <input
                  type="checkbox"
                  checked={dispatchSettings?.retryOnFailure || false}
                  onChange={(e) => setDispatchSettings({ ...dispatchSettings, retryOnFailure: e.target.checked })}
                  className="rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer h-3.5 w-3.5"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Apply Profiles
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}