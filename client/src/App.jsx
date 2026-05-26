import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DispatchProvider, useDispatch } from './context/DispatchContext';
import { AuthProvider } from './context/AuthContext';

// Import Components & Steps
import Navbar from './components/Navbar';
import StepWizard from './components/StepWizard';
import Step1_Upload from './components/Step1_Upload';
import Step2_Review from './components/Step2_Review';
import Step3_Template from './components/Step3_Template';
import Step4_Preview from './components/Step4_Preview';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

const DashboardLayout = () => {
  const { metrics } = useDispatch();
  const location = useLocation();

  // Metric visual badge mappings
  const metricsConfig = [
    { label: 'TOTAL', value: metrics.total, color: 'text-slate-600 bg-slate-50 border-slate-200' },
    { label: 'SELECTED', value: metrics.selected, color: 'text-indigo-600 bg-indigo-50/50 border-indigo-100' },
    { label: 'VALID EMAILS', value: metrics.valid, color: 'text-emerald-600 bg-emerald-50/50 border-emerald-100' },
    { label: 'INVALID', value: metrics.invalid, color: metrics.invalid > 0 ? 'text-rose-600 bg-rose-50 border-rose-200 animate-pulse' : 'text-slate-400 bg-slate-50 border-slate-100' }
  ];

  // Pipeline execution path strings matrix check
  const isPipelineStep = ['/step-1', '/step-2', '/step-3', '/step-4'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 antialiased">
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Render structural processing components strictly within work steps */}
        {isPipelineStep && (
          <>
            {/* Header Branding */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold font-display text-indigo-700 bg-indigo-50 rounded-full mb-3 border border-indigo-100 uppercase tracking-wider">
                Admin Console — Offer Dispatches
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 tracking-tight">
                Offer Letter Dispatcher
              </h1>
              <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
                Upload candidate tables, design programmatic schemas, layout typography templates, and handle throttled deployments safely.
              </p>
            </div>

            {/* Dynamic Route Wizard Tracker */}
            <StepWizard />

            {/* Persistently Visible Dynamic Metric Badges */}
            {location.pathname !== '/step-1' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mt-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                {metricsConfig.map((item, idx) => (
                  <div key={idx} className={`flex flex-col items-center justify-center py-3 px-4 border rounded-xl ${item.color}`}>
                    <span className="text-2xl font-bold font-display tracking-tight">{item.value}</span>
                    <span className="text-[10px] font-bold tracking-wider uppercase mt-1 opacity-80">{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Dynamic Multi-Step Routing Views */}
        <div className={isPipelineStep ? "mt-8" : "mt-0"}>
          <Routes>
            {/* Static Landing Gateway Port */}
            <Route path="/" element={<Home />} />

            {/* Security Allocation Ports */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Secured Private Business Pipeline Steps */}
            <Route path="/step-1" element={<ProtectedRoute><Step1_Upload /></ProtectedRoute>} />
            <Route path="/step-2" element={<ProtectedRoute><Step2_Review /></ProtectedRoute>} />
            <Route path="/step-3" element={<ProtectedRoute><Step3_Template /></ProtectedRoute>} />
            <Route path="/step-4" element={<ProtectedRoute><Step4_Preview /></ProtectedRoute>} />
            
            {/* Global Safe Route Redirection */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DispatchProvider>
          <DashboardLayout />
        </DispatchProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}