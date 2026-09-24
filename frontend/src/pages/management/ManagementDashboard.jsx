import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useManagementPortal } from '../../hooks/useManagementPortal';
import { MANAGEMENT_PERMISSIONS } from '../../config/managementPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';
import {
  ManagementKpiGrid, ExecutiveSummaryCard, InstitutionHealthOverview,
  ManagementAttentionList, QualityTrendChart, DepartmentPerformanceTable,
  ManagementQuickActions,
} from '../../components/management';

export const ManagementDashboard = () => {
  const navigate = useNavigate();
  const { user, academicYear } = useAuth();
  const {
    institutionOverview: overview, departments, loading, error, can,
  } = useManagementPortal(user, academicYear || '2026-27');

  if (loading || !overview) return <Loader message="Loading Management dashboard..." />;
  if (error) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{error}</div>;
  if (!can(MANAGEMENT_PERMISSIONS.MANAGEMENT_DASHBOARD_VIEW)) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">You do not have permission to view the Management dashboard.</div>;

  const kpis = overview.kpis || {};
  const summary = overview.executiveSummary || {};
  const attention = Array.isArray(overview.attention) ? overview.attention : [];
  const trend = Array.isArray(overview.qualityTrend) ? overview.qualityTrend : [];
  const perfRows = (Array.isArray(departments) ? departments : []).slice(0, 6);

  const healthStatus = (value, good, warn) => (value >= good ? 'Good' : value >= warn ? 'Attention' : 'Critical');
  const healthCategories = [
    { name: 'Quality', score: kpis.qualityScore ?? 0, status: healthStatus(kpis.qualityScore ?? 0, 85, 70), trend: 'stable' },
    { name: 'Compliance', score: kpis.complianceRate ?? 0, status: healthStatus(kpis.complianceRate ?? 0, 90, 75), trend: 'stable' },
    { name: 'Accreditation', score: kpis.accreditationReadiness ?? 0, status: healthStatus(kpis.accreditationReadiness ?? 0, 80, 65), trend: 'stable' },
    { name: 'Evidence', score: kpis.evidenceCompleteness ?? 0, status: healthStatus(kpis.evidenceCompleteness ?? 0, 85, 70), trend: 'stable' },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Management Dashboard</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Institution-wide executive monitoring • {academicYear || '2026-27'}</p>
      </div>

      <ManagementKpiGrid kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExecutiveSummaryCard summary={summary} />
        <InstitutionHealthOverview categories={healthCategories} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Department Performance</h3>
            <Link to="/management/departments" className="text-xs font-bold text-indigo-600 hover:underline">View all →</Link>
          </div>
          <DepartmentPerformanceTable departments={perfRows} onSelect={(id) => navigate(`/management/departments/${id}`)} />
        </Card>
        <Card className="p-4 sm:p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Attention Required ({attention.length})</h3>
          <ManagementAttentionList items={attention.slice(0, 8)} />
        </Card>
      </div>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Institution Quality Trend</h3>
        <QualityTrendChart data={trend} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
          <ManagementQuickActions />
        </Card>
        <Card className="p-4 sm:p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Compare Departments</h3>
          <p className="text-xs text-slate-500">Benchmark every department across quality, compliance and readiness.</p>
          <Link to="/management/comparison" className="inline-block text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Open comparison →</Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-6 space-y-2">
          <h3 className="text-sm font-bold text-slate-900">AQAR Readiness</h3>
          <p className="text-xs text-slate-500">Track AQAR preparation status and accreditation readiness.</p>
          <Link to="/management/aqar" className="text-xs font-bold text-indigo-600 hover:underline">Open AQAR status →</Link>
        </Card>
        <Card className="p-4 sm:p-6 space-y-2">
          <h3 className="text-sm font-bold text-slate-900">Audit Trail</h3>
          <p className="text-xs text-slate-500">Read-only view of institutional audit activity.</p>
          <Link to="/management/audit" className="text-xs font-bold text-indigo-600 hover:underline">Open audit center →</Link>
        </Card>
      </div>

      {perfRows.length === 0 && <EmptyState title="No department data" description="Department overview is unavailable." />}
    </div>
  );
};
