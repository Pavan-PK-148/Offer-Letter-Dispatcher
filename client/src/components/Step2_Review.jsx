import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../context/DispatchContext';
import { ArrowLeft, ArrowRight, Search, Plus, Trash2, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Step2_Review() {
  const navigate = useNavigate();
  const context = useDispatch() || {};
  
  // Safe Fallback assignments to shield against uninitialized context snapshots
  const csvData = context.csvData || [];
  const setCsvData = context.setCsvData || (() => {});
  const recognizedColumns = context.recognizedColumns || {};
  const updateMetrics = context.updateMetrics || (() => {});

  const [searchTerm, setSearchTerm] = useState('');
  const [editingCell, setEditingCell] = useState(null); // format: { rowId, columnKey }
  const [editValue, setEditValue] = useState('');

  // Find which CSV header was mapped to email
  const emailHeaderKey = Object.keys(recognizedColumns).find(k => recognizedColumns[k] === 'Contact Email') || 'Contact Email';

  // Strict email syntax evaluator validation check
  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase().trim());
  };

  // Checkbox triggers
  const toggleRowSelection = (id) => {
    const updated = csvData.map(row => row.id === id ? { ...row, isSelected: !row.isSelected } : row);
    setCsvData(updated);
    updateMetrics(updated);
  };

  const toggleSelectAll = (e) => {
    const checked = e.target.checked;
    const updated = csvData.map(row => ({ ...row, isSelected: checked }));
    setCsvData(updated);
    updateMetrics(updated);
  };

  // Cell CRUD Actions
  const startEditing = (rowId, key, currentVal) => {
    setEditingCell({ rowId, key });
    setEditValue(currentVal || '');
  };

  const saveCellContent = (rowId, key) => {
    const updated = csvData.map(row => row.id === rowId ? { ...row, [key]: editValue } : row);
    setCsvData(updated);
    updateMetrics(updated);
    setEditingCell(null);
    toast.success('Cell synchronized successfully');
  };

  const deleteRow = (rowId) => {
    const updated = csvData.filter(row => row.id !== rowId);
    setCsvData(updated);
    updateMetrics(updated);
    toast.success('Recipient record popped out');
  };

  const insertBlankRow = () => {
    const newId = csvData.length > 0 ? Math.max(...csvData.map(r => r.id)) + 1 : 1;
    const templateRow = { id: newId, isSelected: true };
    // Explicitly populate columns with an empty string so they are tracked safely
    Object.keys(recognizedColumns).forEach(header => {
      templateRow[header] = '';
    });
    const updated = [...csvData, templateRow];
    setCsvData(updated);
    updateMetrics(updated);
    toast.success('Appended empty recipient row. Double-click any empty slot to add data.');
  };

  // Filter query data matching
  const filteredData = csvData.filter(row => {
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-[1400px] mx-auto space-y-6 mt-4 px-6"
    >
      
      {/* Upper Context Branding Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50 border border-slate-200 p-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-3xs">
            <Users size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 tracking-tight">Data Grid Validation</h2>
            <p className="text-sm text-slate-400 mt-0.5">Review, filter, and double-click individual cells to edit or add live candidate parameters.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm font-semibold">
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-xl">
            Total Loaded: {csvData.length} records
          </div>
          <div className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-xl">
            Selected: {csvData.filter(r => r.isSelected).length} active
          </div>
        </div>
      </div>

      {/* Table Control Interactive Tools Panel */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search matching row strings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700 transition-all shadow-3xs"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={insertBlankRow}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-100/80 transition-all cursor-pointer shadow-3xs"
        >
          <Plus size={16} /> Add Candidate Row
        </motion.button>
      </div>

      {/* Main Structural Matrix Scroll Wrapper */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[500px] overflow-y-auto shadow-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-xs font-bold tracking-wider text-slate-500 sticky top-0 z-10 backdrop-blur-md">
              <th className="py-4 px-4 w-14 text-center border-r border-slate-200/60">
                <input 
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={csvData.length > 0 && csvData.every(r => r.isSelected)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>
              {Object.keys(recognizedColumns).map((header) => (
                <th key={header} className="py-4 px-5 font-bold text-slate-700 border-r border-slate-100 whitespace-nowrap">
                  <span className="text-slate-800">{header}</span>
                  <span className="block text-[10px] text-indigo-500 font-bold mt-0.5 uppercase tracking-wide">
                    ↳ {recognizedColumns[header] || 'Ignored'}
                  </span>
                </th>
              ))}
              <th className="py-4 px-4 text-center w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700 font-sans">
            <AnimatePresence>
              {filteredData.map((row) => {
                const emailVal = row[emailHeaderKey] || '';
                const emailValid = isEmailValid(emailVal);

                return (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={row.id} 
                    className={`hover:bg-slate-50/80 transition-colors group relative
                      ${!row.isSelected ? 'opacity-40 bg-slate-50/40' : ''} 
                      ${!emailValid && row.isSelected ? 'bg-rose-50/50 hover:bg-rose-50/70 text-rose-900' : ''}
                    `}
                  >
                    {/* Checkbox Cell */}
                    <td className="py-3.5 px-4 text-center border-r border-slate-150 bg-slate-50/30">
                      <input
                        type="checkbox"
                        checked={row.isSelected !== false}
                        onChange={() => toggleRowSelection(row.id)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>

                    {/* Core Attribute Dynamic Fields */}
                    {Object.keys(recognizedColumns).map((header) => {
                      const isEditing = editingCell?.rowId === row.id && editingCell?.key === header;
                      const cellValue = row[header];
                      const isEmailField = header === emailHeaderKey;

                      return (
                        <td key={header} className="py-2 px-3 max-w-[240px] truncate border-r border-slate-50 font-medium">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={() => saveCellContent(row.id, header)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveCellContent(row.id, header);
                                if (e.key === 'Escape') setEditingCell(null);
                              }}
                              autoFocus
                              className="w-full text-sm p-1.5 border-2 border-indigo-500 rounded-lg bg-white focus:outline-none shadow-sm"
                            />
                          ) : (
                            <div 
                              onDoubleClick={() => startEditing(row.id, header, cellValue)}
                              title="Double click to edit string cell"
                              className="cursor-text hover:bg-slate-100 px-2.5 py-3 rounded-lg -ml-1 transition-all flex items-center justify-between min-h-[40px] w-full"
                            >
                              <span className="truncate">
                                {cellValue !== undefined && cellValue !== '' ? (
                                  cellValue
                                ) : (
                                  <span className="text-slate-300 font-normal italic select-none">Double-click to write...</span>
                                )}
                              </span>
                              
                              {/* Advanced context structural warning indicators */}
                              {isEmailField && cellValue && (
                                <span className="ml-2 shrink-0">
                                  {emailValid ? (
                                    <CheckCircle size={15} className="text-emerald-500" />
                                  ) : (
                                    <div className="flex items-center gap-1 bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-rose-200">
                                      <AlertTriangle size={11} /> Format Error
                                    </div>
                                  )}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Operational Row Eraser Column */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => deleteRow(row.id)}
                        className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-100 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        title="Delete Candidate Record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Footer System Back/Next Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100">
        <button
          onClick={() => navigate('/step-1')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Re-align Column Headers
        </button>
        
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate('/step-3')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-100 hover:opacity-95 transition-opacity cursor-pointer"
        >
          Proceed to Template Editor <ArrowRight size={16} />
        </motion.button>
      </div>

    </motion.div>
  );
}