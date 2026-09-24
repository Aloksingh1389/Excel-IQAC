import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDeanPortal } from '../../hooks/useDeanPortal';
import { DEAN_PERMISSIONS } from '../../config/deanPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  DepartmentScopeSelector, DeanKpiGrid, DeanAttentionList,
  DepartmentHealthCard, DeanQuickActions,
} from '../../components/dean';

const LINE_COLORS = ['#4f46e5', '#0d9488', '#e11d48', '#d97706', '#0284c7', '#7c3aed', '#059669'];

export const DeanDashboard = () => {
  const navigate = useNavigate();
  const { user, academicYear } = useAuth();
  const {
    assignedDepartments, selectedDepartments, setSelectedDepartments,
    dashboardData, loading, error, refresh, can,
  } = useDeanPortal(user, academicYear || '2026-27');

  if (loading || !dashboardData) return <Loader message="Loading Dean dashboard..." />;
  if (error) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{error}</div>;
  if (!can(DEAN_PERMISSIONS.DEAN_DASHBOARD_VIEW)) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">You do not have permission to view the Dean dashboard.</div>;

  const kpis = dashboardData.kpis || {};
  const summaries = dashboardData.summaries || [];
  const attention = dashboardData.attention || [];
  const trend = dashboardData.qualityTrend || [];
  const recent = dashboardData.recentActivity || [];
  const deptCodes = (dashboardData.departments || []).map((d) => d.code);

  const handleScopeChange = (codes) => {
    setSelectedDepartments(codes);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Dean Dashboard</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Multi-department monitoring across your assigned scope • {academicYear || '2026-27'}</p>
      </div>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Department Scope ({selectedDepartments.length}/{assignedDepartments.length} selected)</h3>
        <DepartmentScopeSelector assigned={assignedDepartments} selected={selectedDepartments} onChange={handleScopeChange} />
      </Card>

      <DeanKpiGrid kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Attention Required ({attention.length})</h3>
          <DeanAttentionList items={attention} />
        </Card>
        <Card className="p-4 sm:p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
          <DeanQuickActions />
          <h3 className="text-sm font-bold text-slate-900 pt-2">Recent Activity</h3>
          {recent.length === 0 ? <EmptyState title="No recent activity" description="No activity recorded in your assigned departments." /> : (
            <ul className="space-y-2 max-h-56 overflow-y-auto">
              {recent.map((a, i) => (
                <li key={a.id || i} className="text-xs text-slate-600 border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-800">{a.departmentCode}</span> — {a.title || a.action || a.description}
                  <span className="block text-[10px] text-slate-400">{a.createdAt || a.timestamp}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Quality Trend</h3>
        {trend.length === 0 ? <EmptyState title="No trend data" description="Quality trend is unavailable for the current selection." /> : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="average" stroke="#111827" strokeWidth={2.5} dot={false} name="Average" />
                {deptCodes.map((code, i) => (
                  <Line key={code} type="monotone" dataKey={code} stroke={LINE_COLORS[i % LINE_COLORS.length]} dot={false} name={code} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">Department Health ({summaries.length})</h3>
        {summaries.length === 0 ? <EmptyState title="No departments" description="No department summaries for the current selection." /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {summaries.map((s) => <DepartmentHealthCard key={s.department?.code} summary={s} onView={(id) => navigate(`/dean/departments/${id}`)} />)}
          </div>
        )}
      </div>
    </div>
  );
};
