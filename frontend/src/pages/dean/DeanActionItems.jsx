import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deanPortalService } from '../../services/deanPortalService';
import { DEAN_PERMISSIONS, hasDeanPermission } from '../../config/deanPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

const inputCls = 'px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

export const DeanActionItems = () => {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusFilter = params.get('status') || 'ALL';
  const overdueOnly = params.get('overdue') === '1';

  const set = (k, v) => {
    const next = new URLSearchParams(params);
    if (!v || v === 'ALL' || v === '0') next.delete(k); else next.set(k, v);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    let cancelled = false;
    if (!user) return undefined;
    setLoading(true);
    setError(null);
    deanPortalService.getDeanActionItems(statusFilter !== 'ALL' ? { status: statusFilter } : {}, user)
      .then((res) => { if (!cancelled) setItems(res?.data || []); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load action items.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, statusFilter]);

  const filtered = useMemo(() => {
    if (!overdueOnly) return items || [];
    return (items || []).filter((a) => a.status === 'OVERDUE' || (a.dueDate && new Date(a.dueDate) < new Date() && !['CLOSED', 'COMPLETED'].includes(a.status)));
  }, [items, overdueOnly]);

  if (!hasDeanPermission(user, DEAN_PERMISSIONS.DEAN_ACTION_VIEW)) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">You do not have permission to view action items.</div>;
  if (loading) return <Loader message="Loading action items..." />;
  if (error) return <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Action Items</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Follow-up actions across your assigned scope (monitoring only)</p>
      </div>
      <Card className="p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <select value={statusFilter} onChange={(e) => set('status', e.target.value)} className={inputCls}>
            {['ALL', 'OPEN', 'IN_PROGRESS', 'OVERDUE', 'COMPLETED', 'CLOSED'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
            <input type="checkbox" checked={overdueOnly} onChange={(e) => set('overdue', e.target.checked ? '1' : '0')} className="accent-rose-600" />
            Overdue only
          </label>
        </div>
      </Card>
      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Action Items ({filtered.length})</h3>
        {filtered.length === 0 ? <EmptyState title="No action items" description="No action items match the current filters." /> : (
          <div className="overflow-x-auto rounded-xl border border-slate-200/80">
            <table className="w-full text-left text-xs">
              <thead><tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
                <th className="p-3">Title</th><th className="p-3 text-center">Dept</th><th className="p-3 text-center">Status</th><th className="p-3 text-center">Due Date</th><th className="p-3 text-right">Action</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{a.title || a.id}</td>
                    <td className="p-3 text-center">{a.departmentCode || a.deptCode}</td>
                    <td className="p-3 text-center">{a.status}</td>
                    <td className="p-3 text-center">{a.dueDate || '—'}</td>
                    <td className="p-3 text-right"><Link to={`/dean/action-items/${a.id}`} className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
