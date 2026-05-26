import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from '../context/DispatchContext';
import { Check, UploadCloud, Users, FileCode, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StepWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { csvData } = useDispatch();

  const steps = [
    { id: 1, name: 'Upload CSV', path: '/step-1', icon: UploadCloud },
    { id: 2, name: 'Data Review', path: '/step-2', icon: Users },
    { id: 3, name: 'Edit Template', path: '/step-3', icon: FileCode },
    { id: 4, name: 'Preview & Send', path: '/step-4', icon: Eye },
  ];

  // Derive current active index based on route path
  const currentStepIdx = steps.findIndex(s => s.path === location.pathname);
  const currentStepId = currentStepIdx !== -1 ? steps[currentStepIdx].id : 1;

  const handleStepClick = (step) => {
    if (step.id > 1 && csvData.length === 0) return;
    navigate(step.path);
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-4xl mx-auto">
      <div className="relative flex items-center justify-between w-full">
        
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full -z-0" />
        
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full -z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStepId - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />

        {steps.map((step) => {
          const StepIcon = step.icon;
          const isCompleted = currentStepId > step.id;
          const isActive = currentStepId === step.id;
          const isDisabled = step.id > 1 && csvData.length === 0;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <button
                disabled={isDisabled}
                onClick={() => handleStepClick(step)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : isActive 
                      ? 'bg-white border-violet-700 text-violet-700 scale-110 shadow-md ring-4 ring-violet-50' 
                      : 'bg-white border-slate-200 text-slate-400 cursor-not-allowed'
                  } ${!isDisabled && !isActive && !isCompleted ? 'hover:border-slate-400 hover:text-slate-600 cursor-pointer' : ''}
                `}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : <StepIcon size={16} />}
              </button>
              
              <span className={`mt-2 text-xs font-medium tracking-tight whitespace-nowrap transition-colors duration-200 hidden sm:block
                ${isActive ? 'text-violet-700 font-bold font-display' : isCompleted ? 'text-slate-700' : 'text-slate-400'}
              `}>
                {step.name}
              </span>
            </div>
          );
        })}

      </div>
    </div>
  );
}