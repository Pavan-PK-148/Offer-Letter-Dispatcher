import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle2, XCircle, FileText, Server, Calendar, User } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ExecutionLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/history`);
      setLogs(data);
    } catch (err) {
      toast.error("Failed to sync execution history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="max-w-[1600px] mx-auto p-8"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dispatch Audit Trail</h1>
          <p className="text-slate-500">Historical overview of all automated mail dispatch operations.</p>
        </div>
        <button onClick={fetchLogs} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition">
          <RefreshCw size={16} /> Sync Logs
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Candidate', 'Role/Institution', 'Status', 'SMTP Provider', 'PDF', 'Timestamp'].map(h => (
                <th key={h} className="p-4 font-bold text-slate-600 uppercase tracking-wider text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence>
              {logs.map((log, idx) => (
                <motion.tr 
                  key={log._id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50 transition"
                >
                  <td className="p-4 font-semibold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><User size={14}/></div>
                    {log.candidateName}
                  </td>
                  <td className="p-4 text-slate-600">{log.role} <span className="text-slate-400">@</span> {log.institution}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${log.deliveryStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {log.deliveryStatus === 'success' ? <CheckCircle2 size={12}/> : <XCircle size={12}/>}
                      {log.deliveryStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 font-mono text-xs flex items-center gap-2"><Server size={14}/> {log.smtpProvider}</td>
                  <td className="p-4 text-center">{log.pdfGenerated ? <FileText size={16} className="text-indigo-500"/> : '-'}</td>
                  <td className="p-4 text-slate-400 text-xs font-mono"><Calendar size={12} className="inline mr-1"/>{new Date(log.createdAt).toLocaleString()}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}