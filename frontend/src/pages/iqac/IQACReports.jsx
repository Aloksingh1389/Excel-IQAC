import React from 'react';
import { Card } from '../../components/common/Card';
import { FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const IQACReports = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            IQAC Annual & Quarterly Compliance Reports
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Generate and export NAAC, NIRF, and internal IQAC compliance documentation
          </p>
        </div>
        <Link to="/iqac/dashboard">
          <button type="button" className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer">
            &larr; Back to IQAC Dashboard
          </button>
        </Link>
      </div>

      <Card className="p-8 text-center space-y-4 max-w-2xl mx-auto border-indigo-100 bg-gradient-to-b from-indigo-50/30 to-white">
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
          <FileText className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800">
            Stage 5B Roadmap
          </span>
          <h2 className="text-lg font-black text-slate-900">
            IQAC Compliance Reports Module
          </h2>
          <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
            This IQAC module is under development. AQAR report generator, criterion-wise NAAC data synthesis, and pdf export features will be integrated in upcoming stages.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/director/reports">
            <button type="button" className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer">
              Go to Report Center
            </button>
          </Link>
          <Link to="/iqac/dashboard">
            <button type="button" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer inline-flex items-center gap-2">
              <span>View IQAC Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
