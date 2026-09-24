import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAQAR } from '../../hooks/useAQAR';
import { AQARCoverPage } from '../../components/aqar/AQARCoverPage';
import { AQARExportModal } from '../../components/aqar/AQARExportModal';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, Printer, Download, Award, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AQARPreview = () => {
  const { reportId } = useParams();
  const { user } = useAuth();
  const { report, loading } = useAQAR(reportId);

  const [isExportOpen, setIsExportOpen] = useState(false);

  if (loading || !report) {
    return <Loader message="Rendering High-Fidelity Printable AQAR Document Preview..." />;
  }

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            to="/aqar"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              AQAR Report Document Preview
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {report.reportId} &bull; Academic Year: {report.academicYear} &bull; Version {report.version}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF / Word</span>
          </button>
        </div>
      </div>

      {/* Printable Document Container */}
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xl print:shadow-none print:border-none print:p-0">
        {/* Cover Page */}
        <AQARCoverPage report={report} />

        {/* Executive Summary */}
        <div className="space-y-3 pt-6 border-t border-slate-200 text-xs">
          <h2 className="text-base font-black text-indigo-950 uppercase tracking-wide">
            Executive Summary
          </h2>
          <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {report.executiveSummary}
          </p>
        </div>

        {/* Part A Profile */}
        <div className="space-y-3 pt-6 border-t border-slate-200 text-xs">
          <h2 className="text-base font-black text-indigo-950 uppercase tracking-wide">
            Part A — Institutional Profile & Key Statistics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 border rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Faculty</p>
              <p className="text-lg font-black text-indigo-950">{report.partA?.totalFaculty || 185}</p>
            </div>
            <div className="p-3 bg-slate-50 border rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Ph.D. Qualified</p>
              <p className="text-lg font-black text-indigo-950">{report.partA?.phdFaculty || 152}</p>
            </div>
            <div className="p-3 bg-slate-50 border rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Students</p>
              <p className="text-lg font-black text-indigo-950">{report.partA?.totalStudents || 3200}</p>
            </div>
            <div className="p-3 bg-slate-50 border rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">IQAC Meetings</p>
              <p className="text-lg font-black text-indigo-950">{report.partA?.iqacMeetingsCount || 4}</p>
            </div>
          </div>
        </div>

        {/* Part B Criteria 1-7 */}
        <div className="space-y-4 pt-6 border-t border-slate-200 text-xs">
          <h2 className="text-base font-black text-indigo-950 uppercase tracking-wide">
            Part B — NAAC Criteria 1 to 7 Performance Summary
          </h2>

          <div className="overflow-x-auto rounded-xl border border-slate-200 custom-scroll">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b font-bold uppercase tracking-wider">
                  <th className="p-3">Criterion Code & Name</th>
                  <th className="p-3 text-center">Readiness %</th>
                  <th className="p-3 text-center">Ready Metrics</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(report.partB?.criteria || []).map((c) => (
                  <tr key={c.code} className="hover:bg-slate-50">
                    <td className="p-3 font-extrabold text-slate-900">{c.code}: {c.name}</td>
                    <td className="p-3 text-center font-black text-indigo-950">{c.readinessScore}%</td>
                    <td className="p-3 text-center font-bold text-emerald-800">{c.readyMetricsCount} / {c.metricsCount}</td>
                    <td className="p-3 text-center font-bold text-slate-700">{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <AQARExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        report={report}
      />
    </div>
  );
};
