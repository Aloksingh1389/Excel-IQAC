import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { departmentPortalService } from '../../services/departmentPortalService';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
export const DepartmentImprovementPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) return undefined;
    setLoading(true);
    setError(null);
    departmentPortalService.getDepartmentImprovementPlans({}, user)
      .then((res) => { if (!cancelled) setPlans(Array.isArray(res.data) ? res.data : []); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load improvement plans.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, user?.role, user?.departmentCode]);

  if (loading) return <Loader message="Loading improvement plans..." />;
  if (error) return <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700" role="alert">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Department Improvement Plans</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Improvement plans in your department scope</p>
      </div>
      {plans.length === 0 ? (
        <EmptyState title="No improvement plans" description="No improvement plans found for your department." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {plans.map((p) => (
            <Card key={p.id} hover className="p-4 space-y-2">
              <Link to={`/iqac/improvement-plans/${p.id}`} className="block space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 hover:text-indigo-700">{p.title || p.id}</h3>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">{p.status || '—'}</span>
                  <span>Progress: {p.progress ?? 0}%</span>
                  {(p.owner || p.ownerName) && <span>Owner: {p.owner || p.ownerName}</span>}
                </div>
                {typeof p.progress === 'number' && (
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${Math.min(100, Math.max(0, p.progress))}%` }} />
                  </div>
                )}
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
