import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { departmentPortalService } from '../../services/departmentPortalService';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { DepartmentAccreditationSummary } from '../../components/department';

export const DepartmentAccreditation = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) return undefined;
    setLoading(true);
    setError(null);
    departmentPortalService.getDepartmentAccreditation({}, user)
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load accreditation data.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, user?.role, user?.departmentCode]);

  if (loading) return <Loader message="Loading accreditation readiness..." />;
  if (error) return <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700" role="alert">{error}</div>;

  const gaps = Array.isArray(data?.gaps) ? data.gaps : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Department Accreditation</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">NAAC readiness for your department</p>
      </div>
      <DepartmentAccreditationSummary accreditation={data} />
      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-base font-bold text-slate-900">Readiness Gaps ({gaps.length})</h3>
        {gaps.length === 0 ? (
          <EmptyState title="No gaps found" description="No accreditation gaps recorded for your department." />
        ) : (
          <ul className="space-y-1.5 text-xs">
            {gaps.map((g, i) => (
              <li key={g.id || i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-800">{g.title || g.criterion || g.id}</span>
                <Link to="/accreditation/gaps" className="font-bold text-indigo-700 hover:underline shrink-0">View Gap</Link>
              </li>
            ))}
          </ul>
        )}
        <p className="text-[11px] text-slate-500 font-medium">Note: framework editing is restricted — gaps are addressed through action items and improvement plans.</p>
      </Card>
    </div>
  );
};
