import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

import {
  FileSpreadsheet,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  Mail,
  Globe,
  BarChart3,
  Users,
  Layers3,
  Cpu,
  Clock3,
  QrCode,
  FileText
} from 'lucide-react';

export default function Home() {
  const authContext = useAuth();
  const user = authContext?.user || null;

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7
      }
    }
  };

  const features = [
    {
      icon: <FileSpreadsheet className="h-7 w-7 text-indigo-600" />,
      title: "CSV & Excel Automation",
      desc: "Upload spreadsheets instantly and automate large-scale candidate workflows with smart schema mapping."
    },
    {
      icon: <Sparkles className="h-7 w-7 text-violet-600" />,
      title: "Beautiful Template Builder",
      desc: "Design premium offer letters and professional email templates with live rendering support."
    },
    {
      icon: <Zap className="h-7 w-7 text-amber-500" />,
      title: "High-Speed Email Delivery",
      desc: "Bulk email delivery engine with optimized SMTP throttling and intelligent queue handling."
    },
    {
      icon: <ShieldCheck className="h-7 w-7 text-emerald-600" />,
      title: "Secure Verification Layer",
      desc: "Validate candidate email structures and prevent delivery failures before execution."
    },
    {
      icon: <Cpu className="h-7 w-7 text-cyan-600" />,
      title: "AI Assisted Processing",
      desc: "Intelligent automation pipelines reduce manual HR workload and improve efficiency."
    },
    {
      icon: <Layers3 className="h-7 w-7 text-pink-600" />,
      title: "Multi-Stage Workflows",
      desc: "Manage onboarding operations, offers, approvals, and bulk distributions seamlessly."
    }
  ];

  const stats = [
    { number: "99.9%", label: "Delivery Accuracy" },
    { number: "50K+", label: "Emails Processed" },
    { number: "120+", label: "Organizations" },
    { number: "24/7", label: "Cloud Availability" }
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-800">

      {/* HERO SECTION */}
      <section className="relative py-24 lg:py-20">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[450px] bg-gradient-to-r from-indigo-500/10 to-violet-500/10 blur-3xl rounded-full pointer-events-none" />

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-6 relative z-10"
        >

          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 font-bold text-sm mb-8"
          >
            <RadioPulse />
            Enterprise Automation Platform
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* HERO TEXT CONTROLS */}
            <div className="lg:col-span-7 space-y-8">
              <motion.h1
                variants={item}
                className="text-5xl md:text-7xl font-black leading-tight tracking-tight text-slate-900"
              >
                Automate Hiring & Offer Distribution at
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  {" "}Massive Scale
                </span>
              </motion.h1>

              <motion.p
                variants={item}
                className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl"
              >
                Build, manage, and distribute offer letters, onboarding emails,
                candidate documents, and enterprise communication workflows from
                one modern automation dashboard.
              </motion.p>

              <motion.div
                variants={item}
                className="flex flex-wrap gap-5"
              >
                {user ? (
                  <Link
                    to="/step-1"
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-lg font-bold shadow-2xl shadow-indigo-200 hover:scale-105 transition-all duration-300 decoration-none"
                  >
                    Enter Dashboard
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl border border-slate-300 bg-white text-slate-800 text-lg font-semibold hover:bg-slate-50 transition-all decoration-none"
                    >
                      <Lock size={18} />
                      Login
                    </Link>

                    <Link
                      to="/signup"
                      className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-indigo-600 text-white text-lg font-semibold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 decoration-none"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </motion.div>
            </div>

            {/* HERO VISUAL: PREMIUM LIVE RENDERING OFFER LETTER PREVIEW */}
            <div className="lg:col-span-5 relative">
              <motion.div
                variants={item}
                className="w-full bg-white border border-slate-300 shadow-2xl rounded-3xl p-6 space-y-6 relative border-t-4 border-t-indigo-600 max-w-md mx-auto"
                whileHover={{ rotateY: -5, rotateX: 5, perspective: 1000 }}
              >
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="text-xs font-black tracking-wider text-slate-900 uppercase">XYZON CORPORATION</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Ref: XZ-OFFER-2026</span>
                  </div>
                  <div className="h-8 w-8 bg-slate-50 border rounded-lg p-1 flex items-center justify-center">
                    <QrCode size={20} className="text-slate-400" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-3 w-1/3 bg-indigo-50 rounded animate-pulse" />
                  <div className="h-5 w-1/2 bg-slate-100 rounded" />
                  <div className="h-3 w-1/4 bg-slate-100 rounded" />
                </div>

                <div className="space-y-2 pt-2 text-xs text-slate-500 leading-relaxed font-medium">
                  <p>Dear <strong className="text-slate-800">Candidate Name</strong>,</p>
                  <p>We are exceptionally thrilled to extend this formal offer of engagement for the position of <strong className="text-indigo-600">Engineering Associate</strong>.</p>
                  <p>Your program runs for a baseline duration framework of 12 Weeks under Hybrid arrangements.</p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="h-4 w-16 bg-slate-100 rounded" />
                    <div className="text-[9px] text-slate-400 font-bold">Authorized Registry</div>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-5 w-12 bg-slate-100 rounded-md border text-[9px] font-black flex items-center justify-center text-slate-400">XYZON</div>
                    <div className="h-5 w-12 bg-indigo-50 rounded-md border border-indigo-100 text-[9px] font-black flex items-center justify-center text-indigo-500">AICTE</div>
                  </div>
                </div>
              </motion.div>

              {/* FLOATING DECORATIVE DISPATCH BADGE */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-emerald-500 text-white rounded-2xl p-3 shadow-xl flex items-center gap-3 border border-emerald-400"
              >
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-emerald-100 leading-none">SMTP PIPELINE</div>
                  <div className="text-xs font-black mt-0.5">Sent Success</div>
                </div>
              </motion.div>
            </div>

          </div>

          {/* HERO STATS */}
          <motion.div
            variants={item}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="backdrop-blur-xl bg-white/70 border border-slate-200 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all"
              >
                <h2 className="text-4xl font-black text-slate-900">
                  {stat.number}
                </h2>
                <p className="mt-2 text-slate-500 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES SECTION WITH EMBEDDED DYNAMIC CHARTS */}
      <section className="py-28 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-slate-900">
              Powerful Infrastructure
            </h2>

            <p className="mt-5 text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
              Built for enterprise-grade onboarding operations, email
              automation, candidate communication, and high-performance HR workflows.
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -10 }}
                className="group rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-8 shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center border border-slate-100 mb-6">
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-4">
                  {feature.title}
                </h3>

                <p className="text-slate-500 leading-relaxed text-lg mb-6">
                  {feature.desc}
                </p>

                {/* DYNAMIC METRIC GRAPH ACCENT ADDED TO EMBED CHANCE CARD INSIGHTS */}
                {index === 2 && (
                  <div className="pt-2 flex items-end gap-1.5 h-12 w-full bg-slate-50 rounded-xl p-2 border border-dashed">
                    <motion.div animate={{ height: ["30%", "85%", "30%"] }} transition={{ duration: 2.2, repeat: Infinity }} className="w-full bg-amber-400 rounded-sm" />
                    <motion.div animate={{ height: ["50%", "40%", "50%"] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-full bg-amber-500 rounded-sm" />
                    <motion.div animate={{ height: ["20%", "95%", "20%"] }} transition={{ duration: 2.5, repeat: Infinity }} className="w-full bg-indigo-600 rounded-sm" />
                    <motion.div animate={{ height: ["40%", "60%", "40%"] }} transition={{ duration: 2.0, repeat: Infinity }} className="w-full bg-indigo-500 rounded-sm" />
                  </div>
                )}

                {index === 3 && (
                  <div className="flex items-center justify-between bg-emerald-50/50 border border-emerald-100 rounded-xl p-2.5 text-xs font-bold text-emerald-700">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>Syntax Verification Engine</span>
                    </div>
                    <span>100% Clean</span>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STREAMLINED STEPPED WORKFLOW VISUALS */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-slate-900">
              Streamlined Workflow
            </h2>

            <p className="mt-5 text-xl text-slate-500">
              Simple process. Powerful execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {[
              {
                icon: <FileSpreadsheet className="h-8 w-8" />,
                title: "Upload Candidate Data",
                desc: "Import CSV and spreadsheet files instantly."
              },
              {
                icon: <Mail className="h-8 w-8" />,
                title: "Generate Offers",
                desc: "Create beautiful offer letters and emails."
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Send at Scale",
                desc: "Distribute globally with secure delivery pipelines."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="relative rounded-3xl bg-white border border-slate-200 p-10 shadow-lg group overflow-hidden"
              >
                {/* Visual Connector Progress Accents */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 group-hover:bg-indigo-600 transition-colors" />

                <div className="mb-6 text-indigo-600">
                  {step.icon}
                </div>

                <h3 className="text-3xl font-black text-slate-900 mb-4">
                  {step.title}
                </h3>

                <p className="text-lg text-slate-500 leading-relaxed">
                  {step.desc}
                </p>

                <div className="absolute top-8 right-8 text-6xl font-black text-slate-100/70 select-none">
                  0{index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE MODERN ANALYTICS INTERACTIVE CONTROL ACCENT */}
      <section className="py-28 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-20 items-center">

            <div>
              <h2 className="text-5xl font-black leading-tight">
                Built For Modern Hiring Teams
              </h2>

              <p className="mt-8 text-xl text-slate-300 leading-relaxed">
                Reduce manual operations, eliminate repetitive onboarding tasks,
                and automate enterprise communication workflows with a modern,
                scalable infrastructure.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  "Bulk offer distribution",
                  "Email validation & security",
                  "Real-time document rendering",
                  "Advanced workflow management",
                  "Cloud-based execution engine"
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4"
                  >
                    <CheckCircle2 className="text-emerald-400 shrink-0" />
                    <span className="text-lg text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ANALYTICS SIMULATOR GRAPH NODE CHIP CARD */}
            <motion.div
              animate={{
                y: [0, -12, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="rounded-[40px] bg-gradient-to-br from-indigo-600 to-violet-600 p-10 shadow-2xl space-y-8"
            >
              <div className="bg-slate-950/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="text-indigo-400 h-5 w-5" />
                    <h4 className="text-sm font-bold tracking-wide">Live Propagation Metrics</h4>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
                </div>

                {/* MOCK VISUAL GRAPH BARS GRAPHIC */}
                <div className="flex items-end justify-between h-32 pt-4 px-2 bg-slate-950/20 border border-white/5 rounded-xl gap-2">
                  <div className="w-full bg-white/10 rounded-t h-1/3" />
                  <div className="w-full bg-white/20 rounded-t h-1/2" />
                  <div className="w-full bg-white/10 rounded-t h-1/4" />
                  <div className="w-full bg-indigo-400 rounded-t h-4/5 relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-indigo-500 px-1 rounded">99%</div>
                  </div>
                  <div className="w-full bg-white/20 rounded-t h-2/3" />
                  <div className="w-full bg-violet-400 rounded-t h-[92%]" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-xl"><Users className="h-6 w-6" /></div>
                  <div>
                    <h3 className="text-2xl font-bold">Candidate Management</h3>
                    <p className="text-slate-200">
                      Manage thousands of candidates effortlessly.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-xl"><Clock3 className="h-6 w-6" /></div>
                  <div>
                    <h3 className="text-2xl font-bold">Real-Time Automation</h3>
                    <p className="text-slate-200">
                      Execute workflows instantly with optimized processing.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <div>
            <h3 className="text-2xl font-black text-slate-900">
              Enterprise Automation Hub
            </h3>
            <p className="text-slate-500 mt-2">
              Scalable onboarding & offer distribution platform.
            </p>
          </div>

          <div className="text-slate-400 text-sm">
            © 2026 All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}

function RadioPulse() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
    </span>
  );
}