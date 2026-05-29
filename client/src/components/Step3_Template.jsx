import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../context/DispatchContext';
import {
  ArrowLeft,
  ArrowRight,
  Code,
  Eye,
  Brackets,
  CheckCircle,
  Sparkles,
  LayoutTemplate,
  Settings,
  ShieldCheck,
  Users,
  FileText
} from 'lucide-react';

import xyzon from "../assets/logo.png";
import aicte from "../assets/aicte.png";

import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Step3_Template() {

  const navigate = useNavigate();
  const context = useDispatch() || {};

  // =========================
  // CONTEXT VALUES
  // =========================

  const csvData = context.csvData || [];
  const recognizedColumns = context.recognizedColumns || {};

  const emailSubject = context.emailSubject || '';
  const setEmailSubject = context.setEmailSubject || (() => {});

  const emailBody = context.emailBody || '';
  const setEmailBody = context.setEmailBody || (() => {});

  const selectedLogos = context.selectedLogos || [];
  const setSelectedLogos = context.setSelectedLogos || (() => {});

  const dispatchSettings = context.dispatchSettings || {
    delay: 2500,
    retryOnFailure: true
  };

  const setDispatchSettings =
    context.setDispatchSettings || (() => {});

  // =========================
  // PDF OPTIONS
  // =========================

  const [pdfOptions, setPdfOptions] = useState({
    showWatermark: true,
    renderStampBorder: true,
    embedQrCode: false
  });

  // =========================
  // UI STATES
  // =========================

  const [activeTab, setActiveTab] = useState('visual');

  const [selectedTemplateIndex, setSelectedTemplateIndex] =
    useState(null);

  const bodyInputRef = useRef(null);

  // =========================
  // RECIPIENT DATA
  // =========================

  const visualRecipients =
    csvData.length > 0
      ? csvData
      : [
          {
            name: 'John Doe',
            institution: 'XYZON Technologies',
            role: 'Frontend Developer Intern',
            duration: '3 Months',
            startDate: '15 March 2026',
            mode: 'Remote',
          },
        ];

  const [selectedRecipientIndex, setSelectedRecipientIndex] =
    useState(0);

  const activePerson =
    visualRecipients[selectedRecipientIndex] || {};

  // =========================
  // DYNAMIC MAPPING
  // =========================

  const getMappedValue = (field, fallback) => {
    const key = Object.keys(recognizedColumns).find(
      k => recognizedColumns[k] === field
    );

    return activePerson[key] || activePerson[fallback] || '';
  };

  const getName = () =>
    getMappedValue('Candidate Name', 'name');

  const getRole = () =>
    getMappedValue('Role', 'role');

  const getInstitution = () =>
    getMappedValue('Institution', 'institution');

  const getDuration = () =>
    getMappedValue('Duration', 'duration');

  const getStartDate = () =>
    getMappedValue('Start Date', 'startDate');

  const getMode = () =>
    getMappedValue('Mode', 'mode');

  // =========================
  // LOGO OPTIONS
  // =========================

  const logoOptions = [
    'Xyzon Corp Logo',
    'AICTE Approved Stamp'
  ];

  // =========================
  // PDF TEMPLATES
  // =========================

  const pdfTemplates = [

  // =========================================================
  // TEMPLATE 1 — OFFICIAL XYZON INTERNSHIP LETTER
  // =========================================================

  {
    name: 'Xyzon Official Internship Letter',

    description:
      'Real corporate internship offer letter inspired by official Xyzon format',

    subject:
      'Official Internship Offer Letter - Xyzon Innovations',

    body: `
    <div style="
      font-family: Arial, sans-serif;
      background: #ffffff;
      color: #1e293b;
      line-height: 1.8;
      position: relative;
      overflow: hidden;
      border: 1px solid #dbeafe;
    ">

      <!-- HEADER -->
      <div style="
        background: linear-gradient(135deg,#1e3a8a,#312e81);
        padding: 30px;
        color: white;
      ">

        <h1 style="
          margin: 0;
          font-size: 34px;
          font-weight: 800;
          letter-spacing: 1px;
        ">
          XYZON
        </h1>

        <p style="
          margin-top: 8px;
          font-size: 13px;
          opacity: 0.9;
          letter-spacing: 1px;
        ">
          XYZON INNOVATIONS PRIVATE LIMITED
        </p>

        <div style="
          margin-top: 18px;
          font-size: 13px;
          line-height: 1.7;
        ">
          Campus-1A, MGR Main Rd, Kodandarama Nagar,
          Perungudi, Chennai - 600096
          <br/>
          CIN: U85500TN2025PTC182250
          <br/>
          GSTIN: 33AAACX5763A1ZM
        </div>

      </div>

      <!-- BODY -->
      <div style="padding: 45px;">

        <div style="
          display:flex;
          justify-content:space-between;
          margin-bottom:35px;
          font-size:14px;
        ">
          <div>
            <strong>Date:</strong> {Start Date}
          </div>

          <div>
            <strong>Internship ID:</strong>
            INTERNSHIP_{Candidate Name}
          </div>
        </div>

        <h2 style="
          font-size: 16px;
          color:#0f172a;
          margin-bottom: 24px;
        ">
          [TO WHOM IT MAY CONCERN]
        </h2>

        <p style="font-size:16px;">
          Dear <strong>{Candidate Name}</strong>,
        </p>

        <p style="font-size:15px;">
          We are pleased to extend to you an internship opportunity at
          <strong>Xyzon Innovations Private Limited</strong>
          as a
          <strong>{Role}</strong>.
          This program is designed to strengthen your technical skills,
          provide practical exposure and prepare you for future career opportunities.
        </p>

        <!-- DETAILS BOX -->
        <div style="
          margin: 35px 0;
          background:#f8fafc;
          border-left:6px solid #2563eb;
          padding:28px;
          border-radius:12px;
        ">

          <p style="margin:10px 0;">
            <strong>Position:</strong> {Role}
          </p>

          <p style="margin:10px 0;">
            <strong>Duration:</strong> {Duration}
          </p>

          <p style="margin:10px 0;">
            <strong>Start Date:</strong> {Start Date}
          </p>

          <p style="margin:10px 0;">
            <strong>Location:</strong> {Mode}
          </p>

          <p style="margin:10px 0;">
            <strong>Organization:</strong> {Institution}
          </p>

        </div>

        <!-- BENEFITS -->
        <div style="margin-top:35px;">

          <h3 style="
            color:#1d4ed8;
            font-size:18px;
            margin-bottom:14px;
          ">
            Internship Benefits
          </h3>

          <ul style="
            padding-left:20px;
            font-size:15px;
            line-height:2;
          ">
            <li>Completion Certificate upon successful completion</li>
            <li>Letter of Recommendation (LOR)</li>
            <li>Real-time project exposure</li>
            <li>Hands-on industrial workflow experience</li>
            <li>Opportunity for full-time employment based on performance</li>
          </ul>

        </div>

        <!-- EXPECTATIONS -->
        <div style="margin-top:40px;">

          <h3 style="
            color:#1d4ed8;
            font-size:18px;
            margin-bottom:14px;
          ">
            Internship Expectations
          </h3>

          <p style="font-size:15px;">
            During the course of your internship, you will work on
            real-world development tasks, collaborative engineering workflows,
            project implementation and structured mentorship activities.
            We expect professionalism, coding discipline, communication skills,
            problem-solving ability and a strong willingness to learn.
          </p>

        </div>

        <!-- CONFIRMATION -->
        <div style="margin-top:40px;">

          <p style="font-size:15px;">
            To confirm your acceptance of this offer, kindly send your
            confirmation to
            <strong>apply@xyzon.in</strong>.
          </p>

          <p style="font-size:15px;">
            Please note that certificates and official recognition
            will be issued only upon successful completion of the internship requirements.
          </p>

        </div>

        <!-- FOOTER -->
        <div style="
          margin-top:70px;
          display:flex;
          justify-content:space-between;
          align-items:flex-end;
        ">

          <div>

            <p style="
              margin:0;
              font-size:15px;
              font-weight:bold;
            ">
              Best Regards,
            </p>

            <p style="
              margin-top:14px;
              font-size:15px;
              font-weight:700;
            ">
              Sahibul Migfar M
            </p>

            <p style="
              margin-top:5px;
              color:#64748b;
              font-size:13px;
            ">
              Director
              <br/>
              Xyzon Innovations
            </p>

          </div>

          <div style="
            text-align:center;
          ">

            <div style="
              width:180px;
              border-top:1px solid #0f172a;
              margin-bottom:8px;
            "></div>

            <span style="font-size:13px;">
              Candidate Signature
            </span>

          </div>

        </div>

      </div>

    </div>
    `
  },

  // =========================================================
  // TEMPLATE 2 — ENTERPRISE EXECUTIVE
  // =========================================================

  {
    name: 'Enterprise Executive Offer Letter',

    description:
      'Modern executive enterprise appointment design',

    subject:
      'Executive Appointment Confirmation - Xyzon Enterprise',

    body: `
    <div style="
      font-family: 'Segoe UI', sans-serif;
      background:#ffffff;
      padding:0;
      color:#111827;
      border-radius:18px;
      overflow:hidden;
      border:1px solid #e5e7eb;
    ">

      <!-- HERO -->
      <div style="
        background:linear-gradient(135deg,#111827,#1e3a8a,#312e81);
        padding:50px;
        color:white;
      ">

        <div style="
          font-size:13px;
          letter-spacing:2px;
          text-transform:uppercase;
          opacity:0.8;
        ">
          XYZON ENTERPRISE AUTOMATION PLATFORM
        </div>

        <h1 style="
          margin-top:16px;
          font-size:42px;
          line-height:1.2;
          font-weight:800;
        ">
          OFFICIAL
          <br/>
          OFFER LETTER
        </h1>

        <p style="
          margin-top:18px;
          font-size:15px;
          max-width:600px;
          opacity:0.92;
          line-height:1.8;
        ">
          Enterprise-grade internship and recruitment automation workflow.
        </p>

      </div>

      <!-- CONTENT -->
      <div style="padding:50px;">

        <p style="font-size:16px;">
          Dear <strong>{Candidate Name}</strong>,
        </p>

        <p style="
          margin-top:18px;
          font-size:15px;
          line-height:1.9;
        ">
          Following the successful evaluation of your technical profile,
          academic performance and assessment metrics,
          we are delighted to offer you the role of
          <strong>{Role}</strong>
          within our innovation ecosystem.
        </p>

        <!-- GRID -->
        <div style="
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:20px;
          margin-top:40px;
        ">

          <div style="
            padding:24px;
            background:#f8fafc;
            border-radius:14px;
          ">
            <div style="
              font-size:12px;
              text-transform:uppercase;
              color:#64748b;
              font-weight:700;
            ">
              Institution
            </div>

            <div style="
              margin-top:10px;
              font-size:17px;
              font-weight:700;
            ">
              {Institution}
            </div>
          </div>

          <div style="
            padding:24px;
            background:#f8fafc;
            border-radius:14px;
          ">
            <div style="
              font-size:12px;
              text-transform:uppercase;
              color:#64748b;
              font-weight:700;
            ">
              Duration
            </div>

            <div style="
              margin-top:10px;
              font-size:17px;
              font-weight:700;
            ">
              {Duration}
            </div>
          </div>

          <div style="
            padding:24px;
            background:#f8fafc;
            border-radius:14px;
          ">
            <div style="
              font-size:12px;
              text-transform:uppercase;
              color:#64748b;
              font-weight:700;
            ">
              Start Date
            </div>

            <div style="
              margin-top:10px;
              font-size:17px;
              font-weight:700;
            ">
              {Start Date}
            </div>
          </div>

          <div style="
            padding:24px;
            background:#f8fafc;
            border-radius:14px;
          ">
            <div style="
              font-size:12px;
              text-transform:uppercase;
              color:#64748b;
              font-weight:700;
            ">
              Work Mode
            </div>

            <div style="
              margin-top:10px;
              font-size:17px;
              font-weight:700;
            ">
              {Mode}
            </div>
          </div>

        </div>

        <!-- TERMS -->
        <div style="
          margin-top:50px;
          background:#eff6ff;
          border:1px solid #bfdbfe;
          padding:28px;
          border-radius:14px;
        ">

          <h3 style="
            margin-top:0;
            color:#1d4ed8;
          ">
            Terms & Expectations
          </h3>

          <ul style="
            line-height:2;
            font-size:15px;
            padding-left:20px;
          ">
            <li>Maintain professional conduct throughout the internship</li>
            <li>Participate actively in meetings and engineering reviews</li>
            <li>Follow project timelines and submission schedules</li>
            <li>Ensure confidentiality of organizational information</li>
            <li>Collaborate effectively with development teams</li>
          </ul>

        </div>

      </div>

    </div>
    `
  },
  // =========================================================
// TEMPLATE 3 — LUXURY GOLD CORPORATE CERTIFICATE
// =========================================================

{
  name: 'Luxury Gold Corporate Certificate',

  description:
    'Premium golden certificate inspired executive appointment layout',

  subject:
    'Premium Corporate Appointment Certification',

  body: `
  <div style="
    font-family:'Times New Roman',serif;
    background:#fffdf7;
    border:12px solid #d4af37;
    padding:60px;
    color:#111827;
    position:relative;
    overflow:hidden;
  ">

    <!-- WATERMARK -->
    <div style="
      position:absolute;
      top:35%;
      left:10%;
      font-size:90px;
      opacity:0.03;
      transform:rotate(-30deg);
      font-weight:900;
      color:#92400e;
      pointer-events:none;
    ">
      XYZON
    </div>

    <!-- HEADER -->
    <div style="text-align:center;">

      <div style="
        width:120px;
        height:4px;
        background:#d4af37;
        margin:0 auto 20px;
      "></div>

      <h1 style="
        font-size:42px;
        color:#92400e;
        margin:0;
        letter-spacing:2px;
      ">
        CERTIFICATE OF APPOINTMENT
      </h1>

      <p style="
        margin-top:14px;
        color:#a16207;
        font-size:15px;
        letter-spacing:3px;
      ">
        XYZON INNOVATIONS PRIVATE LIMITED
      </p>

    </div>

    <!-- BODY -->
    <div style="
      margin-top:60px;
      text-align:center;
    ">

      <p style="
        font-size:22px;
        color:#475569;
      ">
        This is to formally certify that
      </p>

      <h2 style="
        font-size:44px;
        margin:25px 0;
        color:#111827;
      ">
        {Candidate Name}
      </h2>

      <p style="
        font-size:22px;
        line-height:1.9;
      ">
        has been officially appointed as
      </p>

      <h3 style="
        font-size:34px;
        color:#92400e;
        margin-top:25px;
      ">
        {Role}
      </h3>

      <p style="
        margin-top:40px;
        font-size:17px;
        line-height:2;
        color:#334155;
      ">
        at <strong>{Institution}</strong> under the
        structured internship and enterprise innovation framework.
      </p>

    </div>

    <!-- DETAILS -->
    <div style="
      margin-top:60px;
      display:grid;
      grid-template-columns:1fr 1fr 1fr;
      gap:18px;
    ">

      <div style="
        border:1px solid #fde68a;
        padding:20px;
        border-radius:14px;
        text-align:center;
      ">
        <div style="
          font-size:12px;
          color:#a16207;
          text-transform:uppercase;
          font-weight:700;
        ">
          Duration
        </div>

        <div style="
          margin-top:10px;
          font-size:18px;
          font-weight:700;
        ">
          {Duration}
        </div>
      </div>

      <div style="
        border:1px solid #fde68a;
        padding:20px;
        border-radius:14px;
        text-align:center;
      ">
        <div style="
          font-size:12px;
          color:#a16207;
          text-transform:uppercase;
          font-weight:700;
        ">
          Start Date
        </div>

        <div style="
          margin-top:10px;
          font-size:18px;
          font-weight:700;
        ">
          {Start Date}
        </div>
      </div>

      <div style="
        border:1px solid #fde68a;
        padding:20px;
        border-radius:14px;
        text-align:center;
      ">
        <div style="
          font-size:12px;
          color:#a16207;
          text-transform:uppercase;
          font-weight:700;
        ">
          Work Mode
        </div>

        <div style="
          margin-top:10px;
          font-size:18px;
          font-weight:700;
        ">
          {Mode}
        </div>
      </div>

    </div>

    <!-- SIGNATURE -->
    <div style="
      margin-top:80px;
      display:flex;
      justify-content:space-between;
      align-items:flex-end;
    ">

      <div>
        <div style="
          width:180px;
          border-top:1px solid #111827;
          margin-bottom:10px;
        "></div>

        <span style="font-size:14px;">
          Director Signature
        </span>
      </div>

      <div>
        <div style="
          width:180px;
          border-top:1px solid #111827;
          margin-bottom:10px;
        "></div>

        <span style="font-size:14px;">
          Candidate Signature
        </span>
      </div>

    </div>

  </div>
  `
},

// =========================================================
// TEMPLATE 4 — FUTURISTIC SAAS OFFER LETTER
// =========================================================

{
  name: 'Futuristic SaaS Offer Letter',

  description:
    'Dark modern SaaS automation themed PDF template',

  subject:
    'Xyzon SaaS Internship Appointment',

  body: `
  <div style="
    font-family:'Segoe UI',sans-serif;
    background:#0f172a;
    color:white;
    overflow:hidden;
    position:relative;
  ">

    <!-- TOP BAR -->
    <div style="
      background:linear-gradient(135deg,#4f46e5,#7c3aed,#2563eb);
      padding:50px;
    ">

      <div style="
        font-size:14px;
        letter-spacing:2px;
        opacity:0.8;
      ">
        XYZON ENTERPRISE AUTOMATION PLATFORM
      </div>

      <h1 style="
        font-size:48px;
        margin-top:20px;
        line-height:1.1;
        font-weight:900;
      ">
        OFFER
        <br/>
        LETTER
      </h1>

      <p style="
        margin-top:20px;
        max-width:620px;
        line-height:1.9;
        font-size:15px;
        opacity:0.9;
      ">
        Intelligent enterprise recruitment workflow powered by
        automation, real-time dispatch pipelines and scalable onboarding systems.
      </p>

    </div>

    <!-- MAIN -->
    <div style="padding:50px;">

      <p style="font-size:16px;">
        Dear <strong>{Candidate Name}</strong>,
      </p>

      <p style="
        margin-top:20px;
        line-height:2;
        font-size:15px;
        color:#cbd5e1;
      ">
        Your profile has successfully passed our evaluation framework.
        We are excited to onboard you as
        <strong style="color:white;"> {Role} </strong>
        at
        <strong style="color:white;"> {Institution} </strong>.
      </p>

      <!-- CARDS -->
      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:20px;
        margin-top:45px;
      ">

        <div style="
          background:#111827;
          border:1px solid #1e293b;
          padding:24px;
          border-radius:16px;
        ">
          <div style="
            color:#818cf8;
            font-size:12px;
            text-transform:uppercase;
            font-weight:700;
          ">
            Internship Duration
          </div>

          <div style="
            margin-top:14px;
            font-size:24px;
            font-weight:800;
          ">
            {Duration}
          </div>
        </div>

        <div style="
          background:#111827;
          border:1px solid #1e293b;
          padding:24px;
          border-radius:16px;
        ">
          <div style="
            color:#818cf8;
            font-size:12px;
            text-transform:uppercase;
            font-weight:700;
          ">
            Work Mode
          </div>

          <div style="
            margin-top:14px;
            font-size:24px;
            font-weight:800;
          ">
            {Mode}
          </div>
        </div>

      </div>

      <!-- EXPECTATIONS -->
      <div style="
        margin-top:55px;
        background:#111827;
        border-radius:18px;
        padding:35px;
      ">

        <h3 style="
          margin-top:0;
          color:#818cf8;
          font-size:22px;
        ">
          Engineering Expectations
        </h3>

        <ul style="
          margin-top:20px;
          line-height:2.1;
          color:#cbd5e1;
          font-size:15px;
          padding-left:22px;
        ">
          <li>Participate in real-time development workflows</li>
          <li>Collaborate with cross-functional engineering teams</li>
          <li>Maintain clean coding practices and documentation</li>
          <li>Submit assignments within sprint timelines</li>
          <li>Attend technical review meetings and standups</li>
        </ul>

      </div>

      <!-- FOOTER -->
      <div style="
        margin-top:70px;
        display:flex;
        justify-content:space-between;
        align-items:flex-end;
      ">

        <div>

          <div style="
            font-size:14px;
            color:#818cf8;
            text-transform:uppercase;
            letter-spacing:1px;
          ">
            Authorized By
          </div>

          <h3 style="
            margin-top:10px;
            margin-bottom:0;
          ">
            Xyzon Human Resources
          </h3>

          <p style="
            margin-top:8px;
            color:#94a3b8;
            font-size:13px;
          ">
            Chennai • India
          </p>

        </div>

        <div style="
          text-align:right;
        ">

          <div style="
            width:180px;
            border-top:1px solid #94a3b8;
            margin-bottom:8px;
          "></div>

          <span style="
            font-size:13px;
            color:#cbd5e1;
          ">
            Candidate Signature
          </span>

        </div>

      </div>

    </div>

  </div>
  `
},

// =========================================================
// TEMPLATE 5 — AICTE GOVERNMENT STYLE
// =========================================================

{
  name: 'AICTE Government Internship Format',

  description:
    'Government and academic style internship approval template',

  subject:
    'AICTE Internship Approval & Appointment',

  body: `
  <div style="
    font-family:Georgia,serif;
    background:#ffffff;
    border:2px solid #1e3a8a;
    padding:50px;
    color:#111827;
    position:relative;
  ">

    <!-- SIDE LABEL -->
    <div style="
      position:absolute;
      left:-65px;
      top:220px;
      transform:rotate(-90deg);
      font-size:38px;
      font-weight:900;
      color:#dbeafe;
      letter-spacing:4px;
    ">
      INTERNSHIP LETTER
    </div>

    <!-- HEADER -->
    <div style="
      text-align:center;
      border-bottom:3px solid #1e3a8a;
      padding-bottom:25px;
    ">

      <h1 style="
        margin:0;
        color:#1e3a8a;
        font-size:34px;
      ">
        XYZON INNOVATIONS
      </h1>

      <p style="
        margin-top:12px;
        font-size:14px;
        color:#475569;
        line-height:1.8;
      ">
        AICTE Approved Internship Program
        <br/>
        Ministry Recognized Technical Training Initiative
      </p>

    </div>

    <!-- BODY -->
    <div style="margin-top:45px;">

      <p style="font-size:16px;">
        Dear <strong>{Candidate Name}</strong>,
      </p>

      <p style="
        margin-top:20px;
        font-size:15px;
        line-height:2;
      ">
        We are pleased to inform you that you have been selected for the
        internship position of
        <strong>{Role}</strong>
        at
        <strong>{Institution}</strong>.
        This internship program is intended to provide industry exposure,
        project implementation experience and professional development opportunities.
      </p>

      <!-- TABLE -->
      <table style="
        width:100%;
        border-collapse:collapse;
        margin-top:40px;
        font-size:15px;
      ">

        <tr>
          <td style="
            border:1px solid #cbd5e1;
            padding:18px;
            background:#eff6ff;
            font-weight:700;
            width:35%;
          ">
            Position
          </td>

          <td style="
            border:1px solid #cbd5e1;
            padding:18px;
          ">
            {Role}
          </td>
        </tr>

        <tr>
          <td style="
            border:1px solid #cbd5e1;
            padding:18px;
            background:#eff6ff;
            font-weight:700;
          ">
            Duration
          </td>

          <td style="
            border:1px solid #cbd5e1;
            padding:18px;
          ">
            {Duration}
          </td>
        </tr>

        <tr>
          <td style="
            border:1px solid #cbd5e1;
            padding:18px;
            background:#eff6ff;
            font-weight:700;
          ">
            Start Date
          </td>

          <td style="
            border:1px solid #cbd5e1;
            padding:18px;
          ">
            {Start Date}
          </td>
        </tr>

        <tr>
          <td style="
            border:1px solid #cbd5e1;
            padding:18px;
            background:#eff6ff;
            font-weight:700;
          ">
            Internship Mode
          </td>

          <td style="
            border:1px solid #cbd5e1;
            padding:18px;
          ">
            {Mode}
          </td>
        </tr>

      </table>

      <!-- TERMS -->
      <div style="margin-top:45px;">

        <h3 style="
          color:#1e3a8a;
          font-size:22px;
        ">
          Terms & Conditions
        </h3>

        <ol style="
          margin-top:18px;
          line-height:2;
          font-size:15px;
          padding-left:22px;
        ">
          <li>Candidate must maintain professional conduct</li>
          <li>All assignments must be submitted within timelines</li>
          <li>Attendance in meetings and reviews is mandatory</li>
          <li>Confidential organizational information must be protected</li>
          <li>Completion certificate will be issued after successful evaluation</li>
        </ol>

      </div>

      <!-- SIGNATURE -->
      <div style="
        margin-top:70px;
        display:flex;
        justify-content:space-between;
      ">

        <div>

          <strong style="font-size:16px;">
            Human Resources Department
          </strong>

          <p style="
            margin-top:10px;
            color:#64748b;
            line-height:1.8;
          ">
            Xyzon Innovations Pvt Ltd
            <br/>
            Chennai - 600096
          </p>

        </div>

        <div style="
          text-align:center;
        ">

          <div style="
            width:190px;
            border-top:1px solid #111827;
            margin-bottom:8px;
          "></div>

          <span style="font-size:13px;">
            Candidate Signature
          </span>

        </div>

      </div>

    </div>

  </div>
  `
}

];

  // =========================
  // APPLY TEMPLATE
  // =========================

  const applyTemplate = (index) => {

    setSelectedTemplateIndex(index);

    setEmailSubject(pdfTemplates[index].subject);

    setEmailBody(pdfTemplates[index].body);

    toast.success(
      `${pdfTemplates[index].name} loaded`
    );
  };

  // =========================
  // LOGO TOGGLE
  // =========================

  const handleLogoToggle = (logo) => {

    if (selectedLogos.includes(logo)) {

      setSelectedLogos(
        selectedLogos.filter(l => l !== logo)
      );

      toast.success(`${logo} removed`);

    } else {

      setSelectedLogos([
        ...selectedLogos,
        logo
      ]);

      toast.success(`${logo} added`);
    }
  };

  // =========================
  // PDF OPTION TOGGLE
  // =========================

  const handlePdfOptionToggle = (key) => {
    setPdfOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // =========================
  // TOKEN INSERTION
  // =========================

  const injectToken = (token) => {

    if (activeTab === 'visual') {

      toast.error(
        'Switch to source editor to insert tokens'
      );

      return;
    }

    const textarea = bodyInputRef.current;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const placeholder = `{${token}}`;

    const newText =
      emailBody.substring(0, start) +
      placeholder +
      emailBody.substring(end);

    setEmailBody(newText);

    setTimeout(() => {

      textarea.focus();

      textarea.setSelectionRange(
        start + placeholder.length,
        start + placeholder.length
      );

    }, 50);
  };

  // =========================
  // PREVIEW COMPILATION
  // =========================

  const renderCompiledPreview = (html) => {

    if (!html) return '';

    return html
      .replace(/{Candidate Name}/g, getName())
      .replace(/{Role}/g, getRole())
      .replace(/{Institution}/g, getInstitution())
      .replace(/{Duration}/g, getDuration())
      .replace(/{Start Date}/g, getStartDate())
      .replace(/{Mode}/g, getMode());
  };

  // =========================
  // JSX
  // =========================

  return (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 pb-12 mt-4"
    >

      {/* LEFT PANEL */}

      <div className="lg:col-span-4 space-y-6">

        {/* TEMPLATE SELECTOR */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <div className="flex items-center gap-2 mb-4">

            <FileText size={18} className="text-indigo-600" />

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Official PDF Offer Letter Templates
            </h3>

          </div>

          <div className="space-y-3">

            {pdfTemplates.map((template, idx) => (

              <div
                key={idx}
                onClick={() => applyTemplate(idx)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200
                ${
                  selectedTemplateIndex === idx
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >

                <div className="flex items-center justify-between">

                  <h4 className="text-xs font-bold text-slate-800">
                    {template.name}
                  </h4>

                  {selectedTemplateIndex === idx && (
                    <CheckCircle
                      size={15}
                      className="text-indigo-600"
                    />
                  )}

                </div>

                <p className="text-[11px] text-slate-400 mt-1">
                  {template.description}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* TOKENS */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5">

          <div className="flex items-center gap-2 mb-4">

            <Brackets size={16} className="text-indigo-600" />

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Dynamic PDF Tokens
            </h3>

          </div>

          <div className="flex flex-wrap gap-2">

            {[
              'Candidate Name',
              'Role',
              'Institution',
              'Duration',
              'Start Date',
              'Mode'
            ].map(token => (

              <button
                key={token}
                onClick={() => injectToken(token)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 text-indigo-700 font-semibold"
              >
                + {token}
              </button>

            ))}

          </div>

        </div>

        {/* FOOTER LOGOS */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5">

          <div className="flex items-center gap-2 mb-4">

            <Sparkles size={16} className="text-indigo-600" />

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Footer Branding Assets
            </h3>

          </div>

          <div className="space-y-3">

            {logoOptions.map(logo => {

              const active = selectedLogos.includes(logo);

              return (

                <div
                  key={logo}
                  onClick={() => handleLogoToggle(logo)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center
                  ${
                    active
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-slate-200'
                  }`}
                >

                  <span className="text-xs font-semibold">
                    {logo}
                  </span>

                  {active && (
                    <CheckCircle
                      size={15}
                      className="text-indigo-600"
                    />
                  )}

                </div>
              );
            })}

          </div>

        </div>

        {/* PDF OPTIONS */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5">

          <div className="flex items-center gap-2 mb-4">

            <Settings size={16} className="text-indigo-600" />

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              PDF Configurations
            </h3>

          </div>

          <div className="space-y-3">

            {Object.keys(pdfOptions).map(key => (

              <div
                key={key}
                onClick={() => handlePdfOptionToggle(key)}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer"
              >

                <span className="text-xs font-semibold capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>

                <input
                  type="checkbox"
                  checked={pdfOptions[key]}
                  readOnly
                />

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

        {/* RECIPIENT SWITCHER */}

        <div className="flex justify-between items-center mb-5">

          <div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Active Preview Recipient
            </h3>

            <p className="text-xs text-slate-400">
              Switch records to preview dynamic PDF rendering
            </p>

          </div>

          <select
            value={selectedRecipientIndex}
            onChange={(e) =>
              setSelectedRecipientIndex(
                parseInt(e.target.value)
              )
            }
            className="text-xs border border-slate-200 rounded-xl px-3 py-2"
          >

            {visualRecipients.map((rec, idx) => (

              <option key={idx} value={idx}>
                {rec.name || `Recipient ${idx + 1}`}
              </option>

            ))}

          </select>

        </div>

        {/* SUBJECT */}

        <div className="mb-5">

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Offer Letter Email Subject
          </label>

          <input
            type="text"
            value={emailSubject}
            onChange={(e) =>
              setEmailSubject(e.target.value)
            }
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
          />

        </div>

        {/* TABS */}

        <div className="flex justify-between items-center mb-4">

          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Official PDF Document Preview
          </label>

          <div className="flex bg-slate-100 rounded-xl p-1">

            <button
              onClick={() => setActiveTab('visual')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2
              ${
                activeTab === 'visual'
                  ? 'bg-white shadow-sm'
                  : ''
              }`}
            >
              <Eye size={14} />
              Live Preview
            </button>

            <button
              onClick={() => setActiveTab('source')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2
              ${
                activeTab === 'source'
                  ? 'bg-white shadow-sm'
                  : ''
              }`}
            >
              <Code size={14} />
              Source Editor
            </button>

          </div>

        </div>

        {/* PREVIEW */}

        <div className="border border-slate-200 rounded-2xl overflow-hidden min-h-[700px]">

          <AnimatePresence mode="wait">

            {activeTab === 'source' ? (

              <motion.div
                key="source"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >

                <textarea
                  ref={bodyInputRef}
                  value={emailBody}
                  onChange={(e) =>
                    setEmailBody(e.target.value)
                  }
                  className="w-full min-h-[700px] bg-slate-900 text-slate-100 p-6 font-mono text-xs outline-none"
                />

              </motion.div>

            ) : (

              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-100 p-8 flex justify-center"
              >

                <div className="w-full max-w-[800px] bg-white shadow-xl rounded-md min-h-[1050px] relative p-10 overflow-hidden">

                  {/* WATERMARK */}

                  {pdfOptions.showWatermark && (

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">

                      <div className="rotate-[-30deg] text-6xl font-black tracking-widest">
                        XYZON VERIFIED
                      </div>

                    </div>

                  )}

                  {/* BORDER */}

                  {pdfOptions.renderStampBorder && (

                    <div className="absolute inset-4 border border-slate-200 rounded-lg pointer-events-none" />

                  )}

                  {/* CONTENT */}

                  <div
                    className="relative z-10"
                    dangerouslySetInnerHTML={{
                      __html: renderCompiledPreview(emailBody)
                    }}
                  />

                  {/* FOOTER LOGOS */}

                  {selectedLogos.length > 0 && (

                    <div className="relative z-10 mt-16 pt-8 border-t border-slate-200 flex gap-8 items-center">

                      {selectedLogos.includes(
                        'Xyzon Corp Logo'
                      ) && (

                        <div className="flex flex-col items-center">

                          <img
                            src={xyzon}
                            alt="xyzon"
                            className="h-14 object-contain"
                          />

                          <span className="text-[10px] text-slate-400 mt-2">
                            Authorized Xyzon Corp
                          </span>

                        </div>

                      )}

                      {selectedLogos.includes(
                        'AICTE Approved Stamp'
                      ) && (

                        <div className="flex flex-col items-center">

                          <img
                            src={aicte}
                            alt="aicte"
                            className="h-14 object-contain"
                          />

                          <span className="text-[10px] text-slate-400 mt-2">
                            AICTE Approved Framework
                          </span>

                        </div>

                      )}

                    </div>

                  )}

                </div>

              </motion.div>

            )}

          </AnimatePresence>

        </div>

        {/* NAVIGATION */}

        <div className="flex justify-between items-center mt-6">

          <button
            onClick={() => navigate('/step-2')}
            className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50"
          >

            <ArrowLeft size={16} />

            Back

          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/step-4')}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg"
          >

            Proceed to Dispatch

            <ArrowRight size={16} />

          </motion.button>

        </div>

      </div>

    </motion.div>
  );
}