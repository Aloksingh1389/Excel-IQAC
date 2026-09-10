import React from 'react';
import { GraduationCap, ShieldCheck, Award, Building2 } from 'lucide-react';
import { MOCK_COLLEGE_LETTERHEAD } from '../../data/mockReports';

export const ReportHeader = ({
  title,
  academicYear,
  reportId,
  scope = 'INSTITUTION',
  department = 'ALL',
  generatedDate,
  generatedBy,
  category,
}) => {
  const letterhead = MOCK_COLLEGE_LETTERHEAD;

  return (
    <div className="border-b-2 border-slate-900 pb-5 space-y-4 font-sans print:border-black">
      {/* College Institutional Letterhead Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-900 text-white flex items-center justify-center shadow-sm shrink-0 print:bg-slate-900">
            <GraduationCap className="w-8 h-8 text-amber-400" />
          </div>

          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase leading-tight print:text-black">
              {letterhead.institutionName}
            </h1>
            <p className="text-xs font-bold text-slate-700 leading-tight print:text-slate-800">
              {letterhead.tagline}
            </p>
            <p className="text-[11px] font-semibold text-indigo-700 print:text-slate-700">
              {letterhead.accreditation}
            </p>
          </div>
        </div>

        {/* IQAC Official Stamp Seal */}
        <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl text-center shrink-0 print:bg-white print:border-slate-400">
          <div className="flex items-center justify-center gap-1 text-indigo-900 font-black text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>IQAC DOCUMENT</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">Internal Quality Cell</span>
        </div>
      </div>

      {/* Campus Location Bar */}
      <div className="text-[10px] text-slate-500 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200 print:border-slate-300">
        <span>{letterhead.campusAddress}</span>
        <span>Email: {letterhead.contactEmail} &bull; Web: {letterhead.portalUrl}</span>
      </div>

      {/* Report Title & Metadata Strip */}
      <div className="bg-slate-900 text-white p-4 rounded-xl print:bg-slate-100 print:text-black print:border print:border-slate-300 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 print:text-indigo-800 block">
              Official Institutional Quality Dossier &bull; {category}
            </span>
            <h2 className="text-lg sm:text-xl font-black tracking-tight print:text-slate-950">
              {title}
            </h2>
          </div>

          <div className="text-right shrink-0">
            <span className="px-2.5 py-1 rounded bg-indigo-800 text-amber-300 font-mono text-xs font-bold block print:bg-slate-200 print:text-black">
              AY: {academicYear}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-slate-800 print:border-slate-300 text-slate-300 print:text-slate-700">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Report ID</span>
            <strong className="font-mono text-white print:text-black">{reportId}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Scope</span>
            <strong className="text-white print:text-black">
              {scope === 'INSTITUTION' ? 'Entire College' : `Dept: ${department}`}
            </strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Generated Date</span>
            <strong className="text-white print:text-black">{generatedDate || 'Current Session'}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Generated Authority</span>
            <strong className="text-white print:text-black">{generatedBy || 'Technical Director'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
