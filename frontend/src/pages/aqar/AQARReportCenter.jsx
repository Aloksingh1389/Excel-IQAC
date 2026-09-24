import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAQARReports } from '../../hooks/useAQARReports';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { IQACStatCard } from '../../components/iqac/IQACStatCard';
import { AQARReportCard } from '../../components/aqar/AQARReportCard';
import { AQARExportModal } from '../../components/aqar/AQARExportModal';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { Award, FileText, CheckCircle2, Clock, Plus, History, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AQARReportCenter = () => {
  const { user } = useAuth();
  const { reports, statistics, loading } = useAQARReports();

  const [selectedExportReport, setSelectedExportReport] = useState(null);

  if (loading || !statistics) {
    return <Loader message="Loading AQAR Auto-Generation Engine & Report Directory..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              NAAC Auto-AQAR Generation & Export Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
              {getDesignationDisplay(user?.designation, user?.role)}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Automated compilation of NAAC Part A & Part B Criteria 1–7 reports, evidence appendices & multi-format document exports
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Link
            to="/aqar/history"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <History className="w-4 h-4" />
            <span>Report History</span>
          </Link>

          {user?.role !== ROLES.STAFF && (
            <Link
              to="/aqar/create"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Generate AQAR Report</span>
            </Link>
          )}
        </div>
      </div>

      {/* Top KPI Cards (Section 11 requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <IQACStatCard
          title="Total Reports"
          value={statistics.total}
          subtitle="Report History"
          icon={FileText}
          color="indigo"
        />
        <IQACStatCard
          title="Draft Reports"
          value={statistics.drafts}
          subtitle="In Progress"
          icon={Clock}
          color="amber"
        />
        <IQACStatCard
          title="Under Review"
          value={statistics.underReview}
          subtitle="IQAC Board Review"
          icon={Award}
          color="violet"
        />
        <IQACStatCard
          title="Finalized Reports"
          value={statistics.finalized}
          subtitle="Approved & Snapshot Locked"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Reports Catalog Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Institutional AQAR Reports Directory
          </h2>
          <span className="text-xs font-semibold text-slate-500">{reports.length} Reports</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((r) => (
            <AQARReportCard
              key={r.id}
              report={r}
              onOpenExport={(rep) => setSelectedExportReport(rep)}
            />
          ))}
        </div>
      </div>

      {/* Export Modal */}
      <AQARExportModal
        isOpen={Boolean(selectedExportReport)}
        onClose={() => setSelectedExportReport(null)}
        report={selectedExportReport}
      />
    </div>
  );
};
