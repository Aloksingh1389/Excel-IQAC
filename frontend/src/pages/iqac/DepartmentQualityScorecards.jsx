import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQualityMonitoring } from '../../hooks/useQualityMonitoring';
import { DepartmentQualityTable } from '../../components/quality/DepartmentQualityTable';
import { Loader } from '../../components/common/Loader';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DepartmentQualityScorecards = () => {
  const { user } = useAuth();
  const { summary, loading } = useQualityMonitoring();

  if (loading || !summary) {
    return <Loader message="Loading Department Quality Scorecards..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/iqac/quality-monitoring"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Department Quality Scorecards Directory
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Comprehensive performance matrix, compliance rates, evidence completeness & resolution rates across departments
            </p>
          </div>
        </div>
      </div>

      <DepartmentQualityTable scorecards={summary.departmentScorecards} />
    </div>
  );
};
