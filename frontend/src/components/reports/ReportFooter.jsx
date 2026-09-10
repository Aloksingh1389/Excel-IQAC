import React from 'react';
import { ShieldCheck, CheckCircle } from 'lucide-react';

export const ReportFooter = ({ reportId, generatedDate, generatedBy }) => {
  return (
    <div className="pt-8 mt-10 border-t-2 border-slate-900 font-sans space-y-6 print:border-black print:mt-6">
      {/* Verification Statement */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2.5 print:bg-white print:border-slate-300">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 block">
            Official IQAC Quality Attestation & Data Integrity Certification
          </span>
          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
            This document represents certified institutional records consolidated from departmental submissions, autonomous examination audits, extramural grant repositories, and corporate placement registers for statutory compliance and quality assessment.
          </p>
        </div>
      </div>

      {/* 3 Executive Signatures Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-center">
        {/* IQAC Coordinator */}
        <div className="space-y-1.5 border-t border-slate-400 pt-3">
          <div className="h-8 flex items-center justify-center">
            <span className="font-serif italic text-sm text-indigo-900 font-bold">M. S. Swaminathan</span>
          </div>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Dr. M. S. Swaminathan</h4>
          <p className="text-[10px] font-bold text-slate-500 uppercase">IQAC Coordinator / Head</p>
        </div>

        {/* Executive Director & Principal */}
        <div className="space-y-1.5 border-t border-slate-400 pt-3">
          <div className="h-8 flex items-center justify-center">
            <span className="font-serif italic text-sm text-emerald-900 font-bold">H. J. Bhabha</span>
          </div>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Dr. H. J. Bhabha</h4>
          <p className="text-[10px] font-bold text-slate-500 uppercase">Executive Director & Principal</p>
        </div>

        {/* Technical Director */}
        <div className="space-y-1.5 border-t border-slate-400 pt-3">
          <div className="h-8 flex items-center justify-center">
            <span className="font-serif italic text-sm text-indigo-950 font-bold">Vikram Seth</span>
          </div>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Dr. Vikram Seth</h4>
          <p className="text-[10px] font-bold text-slate-500 uppercase">Technical Director (Apex)</p>
        </div>
      </div>

      {/* Confidentiality & Timestamp Bottom Bar */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-4 border-t border-slate-100 print:border-slate-200">
        <span>Confidential &bull; For Institutional Governance & Statutory Submission Only</span>
        <span className="font-mono">{reportId} &bull; Page 1 of 1</span>
      </div>
    </div>
  );
};
