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
const atRisk = (p) => ['AT_RISK', 'OVERDUE'].includes(p.status);

export const ManagementImprovementPlans = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('ALL');

  useEffect(() => {
    let cancelled = false;
    if (!user) { setLoading(false); return undefined; }
    setLoading(true);
    setError(null);
    managementPortalService.getImprovementPlans({}, user)
      .then((res) => { if (!cancelled) setRows(Array.isArray(res.data) ? res.data : []); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load improvement plans.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, user?.role]);

  const statuses = useMemo(() => [...new Set(rows.map((r) => r.status).filter(Boolean))], [rows]);
  const filtered = rows.filter((r) => status === 'ALL' || r.status === status);
  const riskCount = filtered.filter(atRisk).length;

  if (loading) return <Loader message="Loading improvement plans..." />;
  if (error) return <Alert message={error} />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_IMPROVEMENT_VIEW)) return <Alert message="You do not have permission to view improvement plans." />;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Improvement Plans ({filtered.length})</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{riskCount} plan(s) at risk</p>
      </div>
      <Card className="p-4 flex gap-2">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-2">
          <option value="ALL">All statuses</option>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Card>
      <Card className="p-4 sm:p-6">
        {filtered.length === 0 ? <EmptyState title="No plans" description="No improvement plans match the current filter." /> : (
          <div className="space-y-3">{filtered.slice(0, 40).map((p, i) => {
            const pct = typeof p.progress === 'number' ? p.progress : (p.progressPercentage ?? null);
            return (
              <div key={p.id || i} className={`rounded-lg border px-3 py-2 ${atRisk(p) ? 'border-rose-200 bg-rose-50/50' : 'border-slate-100 bg-slate-50'}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-slate-800">{p.title || p.id} {atRisk(p) && <span className="ml-1 text-[10px] font-bold uppercase text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">At risk</span>}</p>
                  <span className="text-[11px] font-semibold text-slate-500">{p.status || ''}</span>
                </div>
                <p className="text-[11px] text-slate-500">{p.departmentCode || p.deptCode || ''}</p>
                {pct != null && (
                  <div className="mt-1.5 h-2 rounded-full bg-slate-200/70 overflow-hidden">
                    <div className={`h-full ${atRisk(p) ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${Math.max(0, Math.min(100, Number(pct)))}%` }} />
                  </div>
                )}
              </div>
            );
          })}</div>
        )}
      </Card>
    </div>
  );
};
