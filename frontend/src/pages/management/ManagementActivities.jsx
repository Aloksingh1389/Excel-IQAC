import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { managementPortalService } from '../../services/managementPortalService';
import { MANAGEMENT_PERMISSIONS, hasManagementPermission } from '../../config/managementPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

const Alert = ({ message }) => (
  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{message}</div>
);

export const ManagementActivities = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dept, setDept] = useState('ALL');
  const [status, setStatus] = useState('ALL');

  useEffect(() => {
    let cancelled = false;
    if (!user) { setLoading(false); return undefined; }
    setLoading(true);
    setError(null);
    managementPortalService.getActivitiesOverview({}, user)
      .then((res) => { if (!cancelled) setRows(Array.isArray(res.data) ? res.data : []); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load activities.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, user?.role]);

  const depts = useMemo(() => [...new Set(rows.map((r) => r.departmentCode || r.deptCode).filter(Boolean))], [rows]);
  const statuses = useMemo(() => [...new Set(rows.map((r) => r.status).filter(Boolean))], [rows]);
  const filtered = rows.filter((r) =>
    (dept === 'ALL' || (r.departmentCode || r.deptCode) === dept) && (status === 'ALL' || r.status === status));

  if (loading) return <Loader message="Loading activities..." />;
  if (error) return <Alert message={error} />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_ACTIVITY_VIEW)) return <Alert message="You do not have permission to view activities." />;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Activity Monitoring ({filtered.length})</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Institution-wide activity oversight</p>
      </div>
      <Card className="p-4 flex flex-col sm:flex-row gap-2">
        <select value={dept} onChange={(e) => setDept(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-2">
          <option value="ALL">All departments</option>{depts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-2">
          <option value="ALL">All statuses</option>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Card>
      <Card className="p-4 sm:p-6">
        {filtered.length === 0 ? <EmptyState title="No activities" description="No activities match the current filters." /> : (
          <div className="overflow-x-auto"><table className="min-w-full text-xs">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-3">Activity</th><th className="py-2 pr-3">Dept</th><th className="py-2 pr-3">Status</th><th className="py-2 pr-3">Date</th>
            </tr></thead>
            <tbody>{filtered.slice(0, 60).map((r, i) => (
              <tr key={r.id || i} className="border-b border-slate-100">
                <td className="py-2 pr-3 font-bold text-slate-800">{r.title || r.name || r.id}</td>
                <td className="py-2 pr-3">{r.departmentCode || r.deptCode || '—'}</td>
                <td className="py-2 pr-3">{r.status || '—'}</td>
                <td className="py-2 pr-3">{r.date || r.createdAt || '—'}</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </Card>
    </div>
  );
};
