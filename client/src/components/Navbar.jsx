import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, Activity, ShieldCheck, LogOut, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from "../assets/logo.png";
import toast from 'react-hot-toast';

export default function Navbar() {
  const authContext = useAuth();
  const navigate = useNavigate();

  const user = authContext?.user || null;
  const logout = authContext?.logout;

  const handleLogout = () => {
    if (logout) {
      logout();
      toast.success('Administrative session destroyed safely.');
      navigate('/login');
    }
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200/90 shadow-sm"
    >
      <div className="max-w-[1536px] mx-auto px-6 lg:px-10">
        {/* Scaled container h-24 (96px) for an expanded, premium operational posture */}
        <div className="flex items-center justify-between h-24">
          
          {/* Logo & System Brand Segment */}
          <div className="flex items-center gap-5">
            <Link to="/" className="flex items-center gap-4 group cursor-pointer no-underline">
              {/* Scaled Logo Bracket: Expanded from h-11/w-11 to h-14/w-14 (56px) */}
              <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200/80 p-1.5 flex items-center justify-center shadow-sm overflow-hidden relative group-hover:border-indigo-400 group-hover:shadow-md transition-all duration-300">
                <img 
                  src={logo}
                  alt="Xyzon Logo" 
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden h-full w-full bg-indigo-600 text-white rounded-xl items-center justify-center font-black text-base">
                  XYZ
                </div>
              </div>
              
              {/* Scaled Text Typography Hierarchy */}
              <div className="flex flex-col justify-center">
                <span className="font-black font-display text-lg tracking-tight text-slate-900 flex items-center gap-2.5">
                  XYZON 
                  <span className="text-[10px] font-black font-sans text-indigo-700 px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 rounded-md tracking-widest uppercase">
                    V2.0
                  </span>
                </span>
                <span className="text-xs text-slate-400 font-bold tracking-wide mt-0.5">
                  Automated Dispatch System
                </span>
              </div>
            </Link>
          </div>

          {/* Core App Navigation Workspace Links */}
          {user && (
            <div className="hidden md:flex items-center gap-12 text-xs font-black uppercase tracking-widest text-slate-400">
              <Link to="/step-1" className="text-slate-900 border-b-2 border-indigo-600 py-9 transition-all flex items-center gap-2 no-underline">
                <Layers size={15} className="text-indigo-600" /> Pipeline Workspace
              </Link>
              <a href="/history" className="hover:text-slate-900 transition-colors py-9 flex items-center gap-2 no-underline">
                <Activity size={15} /> Execution Logs
              </a>
            </div>
          )}

          {/* Right Metrics & Session Status Badge */}
          <div className="flex items-center gap-5">
            <div className="hidden lg:flex items-center gap-2 text-xs font-black tracking-widest text-emerald-700 bg-emerald-50/80 border border-emerald-100/80 px-3.5 py-1.5 rounded-full">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              SMTP CHANNEL: READY
            </div>

            {/* Dynamic Admin profile display or Login action button */}
            <div className="flex items-center gap-4 pl-5 border-l-2 border-slate-200">
              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    {/* Scaled Profile Avatar node from h-9 to h-11 */}
                    <div className="h-11 w-11 bg-gradient-to-tr from-slate-800 to-slate-950 text-white rounded-2xl flex items-center justify-center font-black font-display text-sm shadow-md shadow-slate-300 uppercase tracking-wider">
                      {user.name ? user.name.substring(0, 2) : 'AD'}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-sm font-extrabold text-slate-800 leading-tight flex items-center gap-1">
                        {user.name || 'Root Admin'} <ShieldCheck size={14} className="text-indigo-600" />
                      </span>
                      <span className="text-xs text-slate-400 font-bold tracking-wide truncate max-w-[140px] mt-0.5">
                        {user.email || 'xyzon.internal'}
                      </span>
                    </div>
                  </div>

                  {/* Secure Log Out Control Action */}
                  <button
                    onClick={handleLogout}
                    className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 rounded-xl transition-all cursor-pointer ml-1"
                    title="Terminate Administrative Session"
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                /* Session Off-line Status Actions - Scaled to line up cleanly */
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100/80 px-5 py-3 rounded-xl hover:bg-indigo-100/50 transition-all no-underline"
                >
                  <Lock size={14} /> Admin Portal
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </motion.nav>
  );
}