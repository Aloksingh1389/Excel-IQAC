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

export const ManagementActionItems = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('ALL');
  const [overdueOnly, setOverdueOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!user) { setLoading(false); return undefined; }
    setLoading(true);
    setError(null);
    managementPortalService.getActionItemsOverview({}, user)
      .then((res) => { if (!cancelled) setRows(Array.isArray(res.data) ? res.data : []); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load action items.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, user?.role]);

  const statuses = useMemo(() => [...new Set(rows.map((r) => r.status).filter(Boolean))], [rows]);
  const filtered = rows.filter((r) =>
    (status === 'ALL' || r.status === status) && (!overdueOnly || r.status === 'OVERDUE'));
  const critical = filtered.filter((r) => r.status === 'OVERDUE' || (r.priority || '').toUpperCase() === 'CRITICAL');

  if (loading) return <Loader message="Loading action items..." />;
  if (error) return <Alert message={error} />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_ACTION_VIEW)) return <Alert message="You do not have permission to view action items." />;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Action Item Oversight ({filtered.length})</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{critical.length} critical / overdue items need attention</p>
      </div>
      <Card className="p-4 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-2">
          <option value="ALL">All statuses</option>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <label className="text-xs font-semibold text-slate-600 flex items-center gap-2">
          <input type="checkbox" checked={overdueOnly} onChange={(e) => setOverdueOnly(e.target.checked)} /> Overdue only
        </label>
      </Card>
      {critical.length > 0 && (
        <Card className="p-4 sm:p-6 space-y-2 border-rose-200 bg-rose-50/50">
          <h3 className="text-sm font-bold text-rose-800">Critical / Overdue ({critical.length})</h3>
          <ul className="space-y-1">{critical.slice(0, 10).map((r, i) => (
            <li key={r.id || i} className="text-xs text-rose-900"><span className="font-bold">{r.title || r.id}</span> — {r.departmentCode || r.deptCode || ''} • {r.status}</li>
          ))}</ul>
        </Card>
      )}
      <Card className="p-4 sm:p-6">
        {filtered.length === 0 ? <EmptyState title="No action items" description="No action items match the current filters." /> : (
          <div className="overflow-x-auto"><table className="min-w-full text-xs">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-3">Item</th><th className="py-2 pr-3">Dept</th><th className="py-2 pr-3">Status</th><th className="py-2 pr-3">Due</th>
            </tr></thead>
            <tbody>{filtered.slice(0, 60).map((r, i) => (
              <tr key={r.id || i} className={`border-b border-slate-100 ${r.status === 'OVERDUE' ? 'bg-rose-50/60' : ''}`}>
                <td className="py-2 pr-3 font-bold text-slate-800">{r.title || r.id}</td>
                <td className="py-2 pr-3">{r.departmentCode || r.deptCode || '—'}</td>
                <td className="py-2 pr-3 font-bold">{r.status || '—'}</td>
                <td className="py-2 pr-3">{r.dueDate || r.deadline || '—'}</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </Card>
    </div>
  );
};
