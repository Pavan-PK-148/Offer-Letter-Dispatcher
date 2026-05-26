import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await login(email, password); // Natively handling server async results

    setIsSubmitting(false);
    if (result.success) {
      toast.success('Administrative session established successfully!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-xl shadow-slate-100/50 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
            <Lock size={22} />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Access Control Center</h2>
          <p className="text-xs text-slate-400 font-medium">Verify structural keys to interact with your pipeline.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Admin Email ID</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                placeholder="admin@xyzon.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Security Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Quick Info Box for testing ease */}
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2 text-[10px] text-slate-500 leading-normal">
            <ShieldAlert size={14} className="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-700">Demo Access Keys:</span> admin@xyzon.com / admin123
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <>Establish Session <ArrowRight size={14} /></>}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-400 font-medium">
            New infrastructure environment? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Register Root Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}