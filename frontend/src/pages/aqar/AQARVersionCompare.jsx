import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAQARReports } from '../../hooks/useAQARReports';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, GitCompare, Award } from 'lucide-react';

export const AQARVersionCompare = () => {
  const { reportId } = useParams();
  const { user } = useAuth();
  const { reports, loading } = useAQARReports();

  if (loading) {
    return <Loader message="Loading AQAR Version Comparison..." />;
  }

  const currentReport = reports.find((r) => r.id === reportId) || reports[0];
  const previousReport = reports.find((r) => r.academicYear === '2024-25') || reports[1] || currentReport;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/aqar"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              AQAR Version & Academic Year Comparative Matrix
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Side-by-side comparison of AQAR reports across academic years
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <Card className="p-5 space-y-3 bg-slate-50 border-slate-200">
          <h2 className="font-bold text-slate-900 text-sm">{previousReport.academicYear} Report (Previous)</h2>
          <p className="text-slate-600">Readiness Score: <strong className="text-indigo-950">{previousReport.readinessScore}%</strong></p>
          <p className="text-slate-600">Status: <strong>{previousReport.status}</strong></p>
        </Card>

        <Card className="p-5 space-y-3 bg-indigo-50/50 border-indigo-200">
          <h2 className="font-bold text-slate-900 text-sm">{currentReport.academicYear} Report (Current)</h2>
          <p className="text-slate-600">Readiness Score: <strong className="text-indigo-950">{currentReport.readinessScore}%</strong></p>
          <p className="text-slate-600">Status: <strong>{currentReport.status}</strong></p>
        </Card>
      </div>
    </div>
  );
};
