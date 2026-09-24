import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDeanPortal } from '../../hooks/useDeanPortal';
import { deanPortalService } from '../../services/deanPortalService';
import { DEAN_PERMISSIONS } from '../../config/deanPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';
import { DepartmentScopeSelector, DeanDepartmentTable } from '../../components/dean';

export const DeanDepartments = () => {
  const navigate = useNavigate();
  const { user, academicYear } = useAuth();
  const { assignedDepartments, selectedDepartments, setSelectedDepartments, can } = useDeanPortal(user, academicYear || '2026-27');
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    if (!user) return undefined;
    setLoading(true);
    setError(null);
    deanPortalService.getDepartmentSummary(user, selectedDepartments)
      .then((res) => { if (!cancelled) setSummaries(res?.data || []); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load departments.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, JSON.stringify(selectedDepartments)]);

  if (!can(DEAN_PERMISSIONS.DEAN_DEPARTMENT_VIEW)) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">You do not have permission to view departments.</div>;
  if (loading) return <Loader message="Loading assigned departments..." />;
  if (error) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{error}</div>;

  const q = search.trim().toLowerCase();
  const filtered = (summaries || []).filter((s) => !q
    || (s.department?.name || '').toLowerCase().includes(q)
    || (s.department?.code || '').toLowerCase().includes(q));

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Departments</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Monitoring view over your assigned departments only</p>
      </div>
      <Card className="p-4 sm:p-6 space-y-3">
        <DepartmentScopeSelector assigned={assignedDepartments} selected={selectedDepartments} onChange={setSelectedDepartments} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by department name or code..."
          className="w-full sm:max-w-sm px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </Card>
      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Assigned Departments ({filtered.length})</h3>
        {filtered.length === 0 ? <EmptyState title="No departments" description="No departments match the current scope and search." /> : <DeanDepartmentTable summaries={filtered} onSelect={(id) => navigate(`/dean/departments/${id}`)} />}
      </Card>
    </div>
  );
};
