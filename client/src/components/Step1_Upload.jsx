import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../context/DispatchContext';
import { UploadCloud, FileSpreadsheet, ArrowRight, RefreshCw, Layers, Mail, FileText, Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../api/axios';

export default function Step1_Upload() {
  const navigate = useNavigate();
  const context = useDispatch() || {};
  
  // Safe Fallback assignments: Use Context if available, otherwise fall back to local states safely
  const csvData = context.csvData || [];
  const setCsvData = context.setCsvData || (() => {});
  const recognizedColumns = context.recognizedColumns || {};
  const setRecognizedColumns = context.setRecognizedColumns || (() => {});
  const updateMetrics = context.updateMetrics || (() => {});

  // For variables missing in context value layer, we use internal state fallback mechanics
  const [localHeaders, localSetHeaders] = useState([]);
  const headers = context.headers !== undefined ? context.headers : localHeaders;
  const setHeaders = context.setHeaders || localSetHeaders;

  const [localSample, localSetSample] = useState(null);
  const firstRowSample = context.firstRowSample !== undefined ? context.firstRowSample : localSample;
  const setFirstRowSample = context.setFirstRowSample || localSetSample;

  const [localFileName, localSetFileName] = useState('');
  const fileName = context.fileName !== undefined ? context.fileName : localFileName;
  const setFileName = context.setFileName || localSetFileName;
  
  const [dragActive, setDragActive] = useState(false);
  const [previewMode, setPreviewMode] = useState('email');
  const [isIngesting, setIsIngesting] = useState(false);

  const systemFields = ['Candidate Name', 'Contact Email', 'Phone Number', 'Institution', 'Role', 'Duration', 'Start Date', 'Mode'];

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) {
      toast.error('The uploaded CSV file contains insufficient record rows.');
      return;
    }

    const rawHeaders = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim());
    setHeaders(rawHeaders);

    const parsedRows = [];
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      if (currentLine.length === rawHeaders.length) {
        const rowObject = { id: i, isSelected: true };
        rawHeaders.forEach((header, index) => {
          rowObject[header] = currentLine[index] ? currentLine[index].replace(/^["']|["']$/g, '').trim() : '';
        });
        parsedRows.push(rowObject);
      }
    }

    if (parsedRows.length === 0) {
      toast.error('No valid rows found in the CSV file.');
      return;
    }

    // Capture the first valid data row inside global context to anchor our live validation previews
    setFirstRowSample(parsedRows[0]);

    // Programmatic auto-mapping keyword alignment dictionary
    const initialMapping = {};
    rawHeaders.forEach(header => {
      const lower = header.toLowerCase();
      if (lower === 'name' || lower.includes('candidate')) initialMapping[header] = 'Candidate Name';
      else if (lower === 'email' || lower.includes('mail')) initialMapping[header] = 'Contact Email';
      else if (lower.includes('phone') || lower.includes('contact')) initialMapping[header] = 'Phone Number';
      else if (lower.includes('org') || lower.includes('college') || lower.includes('inst') || lower.includes('university')) initialMapping[header] = 'Institution';
      else if (lower.includes('role') || lower.includes('designation')) initialMapping[header] = 'Role';
      else if (lower.includes('dur') || lower.includes('period')) initialMapping[header] = 'Duration';
      else if (lower.includes('date') || lower.includes('start')) initialMapping[header] = 'Start Date';
      else if (lower.includes('mode') || lower.includes('type')) initialMapping[header] = 'Mode';
      else initialMapping[header] = '';
    });

    setRecognizedColumns(initialMapping);
    setCsvData(parsedRows);
    updateMetrics(parsedRows);
    toast.success(`Loaded ${parsedRows.length} source candidates successfully.`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.csv')) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => parseCSV(event.target.result);
      reader.readAsText(file);
    } else {
      toast.error('Formatting mismatch. Please use a clean .csv data file.');
    }
  };

  const handleProceedToReview = async () => {
    setIsIngesting(true);
    try {
      // Securely forward our configuration layer state straight into our database
      const response = await API.post('/campaign/ingest', {
        fileName: fileName || 'unnamed_batch.csv',
        recognizedColumns,
        csvData: csvData 
      });

      if (response.data.success) {
        toast.success('Workspace snapshot pinned to remote db.');
        navigate('/step-2');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Database ingestion pipeline interrupted.';
      toast.error(errMsg);
    } finally {
      setIsIngesting(false);
    }
  };

  const updateMapping = (csvHeader, targetSystemField) => {
    setRecognizedColumns(prev => ({ ...prev, [csvHeader]: targetSystemField }));
    toast.success(`Linked "${csvHeader}" → ${targetSystemField || 'Ignored'}`);
  };

  // Helper function to extract a value from our active sample row based on mapped fields
  const getSampleValue = (systemFieldName) => {
    if (!firstRowSample) return `{${systemFieldName}}`;
    const targetHeader = Object.keys(recognizedColumns).find(key => recognizedColumns[key] === systemFieldName);
    return targetHeader ? firstRowSample[targetHeader] || `[${systemFieldName} Empty]` : `{${systemFieldName}}`;
  };

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => parseCSV(event.target.result);
      reader.readAsText(file);
    }
  };

  const downloadSampleCSV = () => {
    const sample = "name,email,Phone,Organization,Role,Duration,Start Date,Mode\nJOHN DOE,john@gmail.com,1234567890,Sri Venkateswara Engineering,Full Stack Developer Intern,8 Weeks,15th March 2026,Remote";
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "offer_letter_candidates.csv";
    link.click();
    toast.success('Downloaded reference matrix sample.');
  };

  const isMappingComplete = Object.values(recognizedColumns).includes('Candidate Name') && 
                             Object.values(recognizedColumns).includes('Contact Email');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`grid grid-cols-1 ${(headers && headers.length > 0) ? 'lg:grid-cols-12' : 'max-w-3xl'} gap-8 mx-auto mt-6 px-4`}
    >
      
      {/* LEFT PANEL: Upload Controls & Field Mapping Matrix */}
      <div className={`${(headers && headers.length > 0) ? 'lg:col-span-5' : 'w-full'} space-y-6`}>
        
        {/* Dataset Upload Target Component */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 tracking-tight">Source Dataset Upload</h2>
              <p className="text-sm text-slate-400 mt-0.5">Drop candidate lists to parse layout variables.</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadSampleCSV}
              className="text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Get Sample CSV
            </motion.button>
          </div>

          <div 
            onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-all duration-300 relative
              ${dragActive ? 'border-indigo-500 bg-indigo-50/40 scale-[0.99]' : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'}
            `}
          >
            <motion.div className="p-4 bg-white shadow-xs border border-slate-100 rounded-xl text-indigo-600 mb-3">
              <UploadCloud size={26} />
            </motion.div>

            {fileName ? (
              <div className="text-sm font-semibold text-slate-800 bg-white border border-slate-200 py-2 px-4 rounded-xl shadow-xs flex items-center gap-2">
                <FileSpreadsheet size={16} className="text-emerald-600" />
                <span className="truncate max-w-[180px]">{fileName}</span>
                <label className="ml-2 cursor-pointer text-xs font-bold text-indigo-600 hover:underline flex items-center gap-0.5">
                  <RefreshCw size={11} /> Swap
                  <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-600">
                  Drag candidate file here or{' '}
                  <label className="text-indigo-600 font-bold cursor-pointer hover:underline">
                    browse local files
                    <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                  </label>
                </p>
                <p className="text-xs text-slate-400 mt-1">Supports standard clean comma-separated .csv data sheets</p>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Mapping Matrix Card */}
        <AnimatePresence>
          {headers && headers.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 overflow-hidden"
            >
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Layers size={16} className="text-indigo-600" />
                <h3 className="text-sm font-bold font-display text-slate-900 uppercase tracking-wider">Dynamic Schema Alignment</h3>
                <div className="group relative cursor-help text-slate-400 hover:text-slate-600 ml-auto">
                  <HelpCircle size={15} />
                  <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-slate-900 text-white text-[11px] p-2.5 rounded-lg shadow-xl w-52 leading-normal z-50 font-sans">
                    Align your raw CSV headers with target tags to instantly seed the media preview panels.
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {headers.map((csvHeader) => (
                  <div key={csvHeader} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-all duration-200">
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]" title={csvHeader}>
                      {csvHeader}
                    </span>
                    <select
                      value={recognizedColumns[csvHeader] || ''}
                      onChange={(e) => updateMapping(csvHeader, e.target.value)}
                      className="text-xs font-bold bg-white border border-slate-200 rounded-xl p-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 max-w-[150px] shadow-xs cursor-pointer"
                    >
                      <option value="">-- Ignore --</option>
                      {systemFields.map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Action Trigger Block */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <motion.button
                  whileHover={isMappingComplete && !isIngesting ? { scale: 1.02 } : {}}
                  whileTap={isMappingComplete && !isIngesting ? { scale: 0.98 } : {}}
                  disabled={!isMappingComplete || isIngesting}
                  onClick={handleProceedToReview}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300
                    ${isMappingComplete && !isIngesting
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-100 cursor-pointer hover:opacity-95' 
                      : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200/50'
                    }
                  `}
                >
                  {isIngesting ? 'Analyzing Structure...' : 'Analyze Row Data Grid'} <ArrowRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT PANEL: Live Media Layout Preview Canvas (Email Look & PDF Attachment Dual Toggle) */}
      {headers && headers.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-fit"
        >
          {/* Header Switcher Toolbar */}
          <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-indigo-600 animate-pulse" />
              <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Live Generation Engine</span>
            </div>
            
            <div className="flex bg-slate-200/70 border border-slate-200 rounded-xl p-1 text-xs font-bold">
              <button
                onClick={() => setPreviewMode('email')}
                className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${previewMode === 'email' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <Mail size={14} /> Email Preview
              </button>
              <button
                onClick={() => setPreviewMode('pdf')}
                className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${previewMode === 'pdf' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <FileText size={14} /> PDF Overview
              </button>
            </div>
          </div>

          {/* Core Interactive Layout Frame Container */}
          <div className="p-6 bg-slate-50/40 min-h-[460px] flex flex-col justify-start">
            {previewMode === 'email' ? (
              
              /* EMAIL PREVIEW COMPONENT CANVAS */
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4 font-sans text-sm"
              >
                <div className="text-xs text-slate-500 border-b border-slate-100 pb-3 space-y-1.5">
                  <div><span className="font-bold text-slate-700 text-sm">Subject:</span> Appointment & Onboarding Offer Letter Confirmation</div>
                  <div><span className="font-bold text-slate-700 text-sm">To:</span> <span className="font-mono bg-slate-50 text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200">{getSampleValue('Contact Email')}</span></div>
                </div>
                
                <div className="text-slate-700 space-y-3 leading-relaxed font-normal">
                  <p>Dear <strong>{getSampleValue('Candidate Name')}</strong>,</p>
                  <p>We are very pleased to confirm our offer for your upcoming internship position at our technology wing. Below are your core verified operational terms:</p>
                  <ul className="list-disc pl-5 space-y-1 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    <li>Designation Assignment: <strong>{getSampleValue('Role')}</strong></li>
                    <li>Program Tenure: <strong>{getSampleValue('Duration')}</strong></li>
                    <li>Commencement Timeline: <strong>{getSampleValue('Start Date')}</strong></li>
                    <li>Work Arrangement Mode: <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded text-xs border border-indigo-100">{getSampleValue('Mode')}</span></li>
                  </ul>
                  <p>Please review the official physical attachment artifact enclosed with this record and reply back via this channel within 48 business hours.</p>
                  <p className="text-sm font-semibold text-slate-500 pt-2">Best Regards,<br />Xyzon Onboarding Desk</p>
                </div>
              </motion.div>
            ) : (
              
              /* PDF COMPONENT RENDER CANVAS */
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-t-8 border-t-indigo-600 border-x border-b border-slate-300 rounded-md shadow-md p-8 max-w-[540px] mx-auto space-y-6 text-slate-800 font-sans text-xs relative"
              >
                {/* PDF Identity Frame */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div>
                    <h1 className="text-base font-extrabold tracking-tight text-slate-900">XYZON INNOVATIONS PRIVATE LTD</h1>
                    <p className="text-[10px] text-slate-400 font-medium">Bangalore HQ Corporate Sector, India</p>
                  </div>
                  <span className="text-[10px] font-mono tracking-widest font-bold px-2 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded uppercase">
                    OFFICIAL REF
                  </span>
                </div>

                {/* PDF Recipient Meta Details */}
                <div className="space-y-1 text-slate-600 text-xs">
                  <div><strong>Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div><strong>Candidate Name:</strong> <span className="text-slate-900 font-bold">{getSampleValue('Candidate Name')}</span></div>
                  <div><strong>Affiliated Institution:</strong> {getSampleValue('Institution')}</div>
                  <div><strong>Contact Primary Field:</strong> {getSampleValue('Phone Number')}</div>
                </div>

                <div className="text-center font-bold text-sm tracking-wide text-slate-900 uppercase py-2 bg-slate-50 rounded-md border border-slate-100">
                  Letter of Internship Appointment
                </div>

                {/* Main PDF Content Paragraphs */}
                <div className="space-y-3 text-slate-700 leading-relaxed text-xs">
                  <p>Dear <strong>{getSampleValue('Candidate Name')}</strong>,</p>
                  <p>Following evaluation of your corporate profile, we are pleased to confirm your appointment as a <strong>{getSampleValue('Role')}</strong> at Xyzon Innovations.</p>
                  <p>This engagement is designated to endure for a standard duration of <strong>{getSampleValue('Duration')}</strong>, with onboarding events beginning explicitly on <strong>{getSampleValue('Start Date')}</strong>. You will be operating under a <strong>{getSampleValue('Mode')}</strong> logistics configuration framework.</p>
                  <p>This document acts as our formal verification statement. We look forward to seeing your contributions to our technology systems deployment pipeline.</p>
                </div>

                {/* Sign-off Layout Section */}
                <div className="pt-6 flex justify-between items-end">
                  <div className="text-left">
                    <div className="h-8 border-b border-slate-300 w-28 mb-1" />
                    <p className="text-[10px] font-bold text-slate-900">Authorized Human Lead</p>
                    <p className="text-[9px] text-slate-400">Operations & Logistics Desk</p>
                  </div>
                  <div className="text-[9px] text-slate-300 font-mono select-none tracking-wider uppercase">
                    SYSTEM-VERIFIED-SECURE
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}