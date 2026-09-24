import React from 'react';
import { Card } from '../../components/common/Card';
import { StaffMonitoringTable } from '../../components/iqac/StaffMonitoringTable';
import { useIQAC } from '../../hooks/useIQAC';
import { Loader } from '../../components/common/Loader';
import { Link } from 'react-router-dom';

export const IQACMonitoring = () => {
  const { staffMonitoring, loading } = useIQAC();

  if (loading) {
    return <Loader message="Loading IQAC Monitoring Module..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            IQAC Staff & Evidence Monitoring
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Real-time tracking of staff updates, profile completeness & evidence verification status
          </p>
        </div>
        <Link to="/iqac/dashboard">
          <button type="button" className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer">
            &larr; Back to IQAC Dashboard
          </button>
        </Link>
      </div>

      {/* Staff Monitoring Table */}
      <StaffMonitoringTable staffList={staffMonitoring} />
    </div>
  );
};
