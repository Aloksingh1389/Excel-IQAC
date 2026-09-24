import React from 'react';
import { Card } from '../common/Card';
import { AQARStatusBadge } from './AQARStatusBadge';
import { Award, Calendar, Eye, Edit3, Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AQARReportCard = ({ report, onOpenExport }) => {
  return (
    <Card className="p-5 space-y-4 hover:border-indigo-300 transition-all duration-200 shadow-2xs group bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-black text-indigo-900 text-xs">{report.reportId}</span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-indigo-100 text-indigo-900">
              v{report.version}
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition leading-snug">
            {report.title}
          </h3>
        </div>

        <AQARStatusBadge status={report.status} />
      </div>

      <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
        {report.executiveSummary}
      </p>

      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-center">
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase">Academic Year</p>
          <p className="font-black text-indigo-950">{report.academicYear}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase">Readiness Score</p>
          <p className="font-bold text-emerald-800">{report.readinessScore}%</p>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 text-xs">
        <Link
          to={`/aqar/${report.id}/preview`}
          className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 transition"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </Link>

        <div className="flex items-center gap-2">
          {report.status !== 'FINALIZED' && (
            <Link
              to={`/aqar/${report.id}/edit`}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition flex items-center gap-1 text-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => onOpenExport(report)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center gap-1 text-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </Card>
  );
};
