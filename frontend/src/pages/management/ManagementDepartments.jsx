import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { managementPortalService } from '../../services/managementPortalService';
import { MANAGEMENT_PERMISSIONS, hasManagementPermission } from '../../config/managementPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';
import { DepartmentPerformanceTable } from '../../components/management';

const Alert = ({ message }) => (
  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{message}</div>
);

export const ManagementDepartments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [sortKey, setSortKey] = useState('code');
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    let cancelled = false;
    if (!user) { setLoading(false); return undefined; }
    setLoading(true);
    setError(null);
    managementPortalService.getDepartmentOverview(user)
      .then((res) => { if (!cancelled) setRows(Array.isArray(res.data) ? res.data : []); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load departments.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, user?.role]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = rows.filter((d) => {
      const matchQ = !q || [d.code, d.name, d.hodName, d.deanName].filter(Boolean).join(' ').toLowerCase().includes(q);
      const matchS = status === 'ALL' || d.status === status;
      return matchQ && matchS;
    });
    list = [...list].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [rows, search, status, sortKey, sortDir]);

  if (loading) return <Loader message="Loading departments..." />;
  if (error) return <Alert message={error} />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_DEPARTMENT_VIEW)) return <Alert message="You do not have permission to view departments." />;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Departments ({filtered.length})</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Institution-wide department monitoring</p>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search code, name, HOD, dean..."
          className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-2">
          <option value="ALL">All statuses</option><option value="Good">Good</option><option value="Attention">Attention</option><option value="Critical">Critical</option>
        </select>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-2">
          <option value="code">Sort: Code</option><option value="name">Sort: Name</option>
          <option value="qualityScore">Sort: Quality</option><option value="complianceRate">Sort: Compliance</option>
          <option value="accreditationReadiness">Sort: Readiness</option><option value="pendingReviews">Sort: Pending</option>
        </select>
        <button onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))} className="text-xs font-bold px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200">
          {sortDir === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>
      </Card>

      <Card className="p-4 sm:p-6">
        {filtered.length === 0
          ? <EmptyState title="No departments match" description="Adjust search or status filter." />
          : <DepartmentPerformanceTable departments={filtered} onSelect={(id) => navigate(`/management/departments/${id}`)} />}
      </Card>
    </div>
  );
};
