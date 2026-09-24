import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { managementPortalService } from '../../services/managementPortalService';
import { MANAGEMENT_PERMISSIONS, hasManagementPermission } from '../../config/managementPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

const Alert = ({ message }) => (
  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{message}</div>
);

export const ManagementAccreditation = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) { setLoading(false); return undefined; }
    setLoading(true);
    setError(null);
    managementPortalService.getAccreditationOverview(user)
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load accreditation overview.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, user?.role]);

  if (loading) return <Loader message="Loading accreditation overview..." />;
  if (error) return <Alert message={error} />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_ACCREDITATION_VIEW)) return <Alert message="You do not have permission to view accreditation." />;
  if (!data) return <EmptyState title="No accreditation data" description="Accreditation overview unavailable." />;

  const criteria = data.criteria && typeof data.criteria === 'object' ? Object.entries(data.criteria) : [];
  const departments = Array.isArray(data.departments) ? data.departments : [];
  const gaps = Array.isArray(data.gaps) ? data.gaps : [];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Accreditation Overview</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Institution-wide accreditation readiness monitoring</p>
      </div>

      <Card className="p-6 text-center space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Institutional Readiness</p>
        <p className="text-4xl font-black text-slate-900">{data.institutionalReadiness ?? '—'}{data.institutionalReadiness != null ? '%' : ''}</p>
      </Card>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Criteria Readiness (1–7)</h3>
        {criteria.length === 0 ? <EmptyState title="No criteria data" description="Criteria readiness unavailable." /> : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {criteria.map(([k, v]) => (
              <div key={k} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-center">
                <p className="text-[11px] font-semibold text-slate-500">Criterion {k}</p>
                <p className="text-lg font-black text-slate-900">{v ?? '—'}{v != null ? '%' : ''}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Department Readiness</h3>
        {departments.length === 0 ? <EmptyState title="No departments" description="No department readiness data." /> : (
          <div className="overflow-x-auto"><table className="min-w-full text-xs">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-3">Dept</th><th className="py-2 pr-3">Readiness</th><th className="py-2 pr-3">Open Gaps</th>
            </tr></thead>
            <tbody>{departments.map((d) => (
              <tr key={d.id || d.code} className="border-b border-slate-100">
                <td className="py-2 pr-3 font-bold">{d.code} <span className="font-medium text-slate-500">{d.name}</span></td>
                <td className="py-2 pr-3 font-bold">{d.readiness ?? '—'}{d.readiness != null ? '%' : ''}</td>
                <td className="py-2 pr-3">{Array.isArray(d.gaps) ? d.gaps.length : 0}</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </Card>

      <Card className="p-4 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Accreditation Gaps ({gaps.length})</h3>
          <Link to="/accreditation/gaps" className="text-xs font-bold text-indigo-600 hover:underline">Framework detail →</Link>
        </div>
        {gaps.length === 0 ? <EmptyState title="No gaps" description="No accreditation gaps recorded." /> : (
          <ul className="space-y-2 max-h-72 overflow-y-auto">{gaps.slice(0, 20).map((g, i) => (
            <li key={g.id || i} className="text-xs rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <span className="font-bold text-slate-800">{g.title || g.criterion || g.id}</span>
              <span className="block text-[11px] text-slate-500">{g.status || ''} {g.departmentCode ? `• ${g.departmentCode}` : ''}</span>
            </li>
          ))}</ul>
        )}
      </Card>
    </div>
  );
};
