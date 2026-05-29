import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../context/DispatchContext';

import {
  ArrowLeft,
  Send,
  Settings,
  Mail,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sliders,
  Paperclip
} from 'lucide-react';

import xyzon from "../assets/logo.png";
import aicte from "../assets/aicte.png";

import toast from 'react-hot-toast';

export default function Step4_Preview() {

  const navigate = useNavigate();
  const context = useDispatch() || {};

  const csvData = context.csvData || [];
  const recognizedColumns = context.recognizedColumns || {};

  const emailSubject = context.emailSubject || '';
  const emailBody = context.emailBody || '';

  const selectedLogos = context.selectedLogos || [];

  const pdfOptions = context.pdfOptions || {};

  const dispatchSettings =
    context.dispatchSettings || {
      delay: 2500,
      retryOnFailure: true
    };

  const setDispatchSettings =
    context.setDispatchSettings || (() => {});

  const [activeIndex, setActiveIndex] = useState(0);

  const [showSettingsModal, setShowSettingsModal] =
    useState(false);

  const [isDispatching, setIsDispatching] =
    useState(false);

  const [deliveryStatus, setDeliveryStatus] =
    useState({});

  const targets =
    csvData.filter(row => row.isSelected !== false);

  const currentRecord =
    targets[activeIndex] || null;

  // ==========================================
  // FIELD MAPPING
  // ==========================================

  const getMappedValue = (row, field) => {

    const key = Object.keys(recognizedColumns)
      .find(k => recognizedColumns[k] === field);

    return key ? row[key] : '';
  };

  // ==========================================
  // TEMPLATE COMPILATION
  // ==========================================

  const compileTemplate = (templateString) => {

    if (!currentRecord) return '';

    let compiled = templateString;

    const replacements = {
      'Candidate Name':
        getMappedValue(currentRecord, 'Candidate Name'),

      'Role':
        getMappedValue(currentRecord, 'Role'),

      'Institution':
        getMappedValue(currentRecord, 'Institution'),

      'Duration':
        getMappedValue(currentRecord, 'Duration'),

      'Start Date':
        getMappedValue(currentRecord, 'Start Date'),

      'Mode':
        getMappedValue(currentRecord, 'Mode'),
    };

    Object.entries(replacements)
      .forEach(([key, value]) => {

        compiled = compiled.replace(
          new RegExp(`{${key}}`, 'g'),
          value || ''
        );
      });

    return compiled;
  };

  // ==========================================
  // DISPATCH ENGINE
  // ==========================================

  const executeBulkDispatch = async () => {

    if (targets.length === 0) {

      toast.error('No recipients found');

      return;
    }

    setIsDispatching(true);

    const loadingToast = toast.loading(
      'Connecting to Xyzon Dispatch Pipeline...'
    );

    try {

      const formattedTargets = targets.map(row => ({

        name:
          getMappedValue(row, 'Candidate Name'),

        email:
          getMappedValue(row, 'Contact Email'),

        institution:
          getMappedValue(row, 'Institution'),

        role:
          getMappedValue(row, 'Role'),

        duration:
          getMappedValue(row, 'Duration'),

        startDate:
          getMappedValue(row, 'Start Date'),

        mode:
          getMappedValue(row, 'Mode')

      }));

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/mail/send-offers`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({

            targets: formattedTargets,

            emailSubject,

            emailBody,

            dispatchSettings,

            selectedLogos,

            pdfOptions
          })
        }
      );

      let data;

const contentType =
  response.headers.get('content-type');

if (
  contentType &&
  contentType.includes('application/json')
) {

  data = await response.json();

} else {

  const text = await response.text();

  console.error('Invalid response:', text);

  throw new Error(
    'Backend returned HTML instead of JSON.'
  );
}

      if (!response.ok) {
        throw new Error(data.error);
      }

      const statuses = {};

      formattedTargets.forEach((target, idx) => {

        const matched =
          data.summary.find(
            log => log.recipient === target.email
          );

        statuses[idx] =
          matched?.status === 'success'
            ? 'sent'
            : 'failed';
      });

      setDeliveryStatus(statuses);

      toast.success(
        `Successfully dispatched ${formattedTargets.length} offers`,
        { id: loadingToast }
      );

    } catch (err) {

      console.error(err);

      toast.error(
        err.message,
        { id: loadingToast }
      );

    } finally {

      setIsDispatching(false);
    }
  };

  return (

    <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 pb-12 mt-4">

      {/* LEFT PANEL */}

      <div className="lg:col-span-5 space-y-4">

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          {/* HEADER */}

          <div className="flex justify-between items-center border-b border-slate-100 pb-4">

            <div>

              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Mailing Queue Batch Matrix
              </h3>

              <p className="text-[11px] text-slate-400 mt-1">
                Review recipient transmission pipeline
              </p>

            </div>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50"
            >

              <Settings size={15} />

            </button>

          </div>

          {/* LIST */}

          <div className="space-y-2 mt-5 max-h-[500px] overflow-y-auto pr-1">

            {targets.map((row, idx) => {

              const name =
                getMappedValue(row, 'Candidate Name');

              const email =
                getMappedValue(row, 'Contact Email');

              const status =
                deliveryStatus[idx] || 'idle';

              return (

                <div
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center
                  ${
                    activeIndex === idx
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-slate-100'
                  }`}
                >

                  <div>

                    <div className="text-sm font-bold text-slate-800">
                      {name}
                    </div>

                    <div className="text-xs text-slate-400 mt-1">
                      {email}
                    </div>

                  </div>

                  <div className="flex items-center gap-2">

                    {status === 'sent' && (
                      <CheckCircle2
                        size={15}
                        className="text-emerald-500"
                      />
                    )}

                    {status === 'failed' && (
                      <span className="text-[10px] text-red-500 font-bold">
                        FAIL
                      </span>
                    )}

                    {status === 'idle' && (
                      <Clock
                        size={15}
                        className="text-slate-300"
                      />
                    )}

                    <ChevronRight
                      size={15}
                      className="text-slate-300"
                    />

                  </div>

                </div>
              );
            })}

          </div>

          {/* ACTIONS */}

          <div className="pt-5 border-t border-slate-100 mt-5 flex gap-3">

            <button
              onClick={() => navigate('/step-3')}
              className="px-5 py-3 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50"
            >

              <ArrowLeft size={15} />

            </button>

            <button
              disabled={isDispatching}
              onClick={executeBulkDispatch}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-bold"
            >

              {isDispatching ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                  Processing Queue...
                </>
              ) : (
                <>
                  <Send size={15} />
                  Transmit Offer Letters
                </>
              )}

            </button>

          </div>

        </div>

        {/* STATUS */}

        <div className="bg-slate-900 text-slate-300 rounded-xl p-4 flex justify-between items-center text-xs">

          <span className="flex items-center gap-2 text-indigo-400">

            <ShieldCheck size={14} />

            SMTP Failover Protection Active

          </span>

          <span>
            Multi Transport Ready
          </span>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="lg:col-span-7">

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

          {/* TOP */}

          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">

              <Mail size={14} />

              Email + PDF Attachment

            </div>

            <div className="flex items-center gap-2 text-xs text-indigo-600 font-bold bg-indigo-50 px-3 py-2 rounded-xl">

              <Paperclip size={13} />

              Offer_Letter.pdf Attached

            </div>

          </div>

          {/* PREVIEW */}

          <div className="p-8 bg-slate-50 min-h-[750px] overflow-y-auto">

            {currentRecord ? (

              <div className="max-w-[700px] mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* MAIL HEADER */}

                <div className="p-6 border-b border-slate-100">

                  <div className="text-sm">

                    <strong>Subject:</strong>
                    {' '}
                    {emailSubject}

                  </div>

                  <div className="text-sm mt-2 text-slate-500">

                    <strong>Recipient:</strong>
                    {' '}
                    {getMappedValue(
                      currentRecord,
                      'Contact Email'
                    )}

                  </div>

                </div>

                {/* MAIL BODY */}

                <div className="p-8">

                  <div
                    className="prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: compileTemplate(emailBody)
                    }}
                  />

                  {/* ATTACHMENT */}

                  <div className="mt-10 border border-slate-200 rounded-2xl p-5 bg-slate-50 flex items-center justify-between">

                    <div className="flex items-center gap-4">

                      <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">

                        <Paperclip
                          size={18}
                          className="text-red-600"
                        />

                      </div>

                      <div>

                        <div className="text-sm font-bold text-slate-800">
                          Offer_Letter.pdf
                        </div>

                        <div className="text-xs text-slate-400 mt-1">
                          Official PDF Offer Letter Attachment
                        </div>

                      </div>

                    </div>

                    <div className="text-xs font-bold text-emerald-600">
                      Ready
                    </div>

                  </div>

                </div>

              </div>

            ) : (

              <div className="text-center text-slate-400 py-32">
                No Preview Available
              </div>

            )}

          </div>

        </div>

      </div>

      {/* SETTINGS MODAL */}

      {showSettingsModal && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl p-6 max-w-md w-full">

            <div className="flex items-center gap-2 mb-5">

              <Sliders size={16} className="text-indigo-600" />

              <h3 className="text-sm font-bold uppercase tracking-wider">
                SMTP Dispatch Settings
              </h3>

            </div>

            <div>

              <label className="block text-xs font-bold text-slate-500 mb-2">
                Dispatch Delay (ms)
              </label>

              <input
                type="number"
                value={dispatchSettings.delay}
                onChange={(e) =>
                  setDispatchSettings({
                    ...dispatchSettings,
                    delay: parseInt(e.target.value)
                  })
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-3"
              />

            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold"
            >

              Save Settings

            </button>

          </div>

        </div>

      )}

    </div>
  );
}