import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { managementPortalService } from '../../services/managementPortalService';
import { MANAGEMENT_PERMISSIONS, hasManagementPermission } from '../../config/managementPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';

const Alert = ({ message }) => (
  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{message}</div>
);

export const ManagementAQAR = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) { setLoading(false); return undefined; }
    setLoading(true);
    setError(null);
    managementPortalService.getAQARStatus(user)
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load AQAR status.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, user?.role]);

  if (loading) return <Loader message="Loading AQAR status..." />;
  if (error) return <Alert message={error} />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_AQAR_VIEW)) return <Alert message="You do not have permission to view AQAR status." />;
  if (!data) return <EmptyState title="No AQAR data" description="AQAR status unavailable." />;

  const reports = Array.isArray(data.reports) ? data.reports : [];
  const criteria = data.criteria && typeof data.criteria === 'object' ? Object.entries(data.criteria) : [];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">AQAR Status</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Monitoring view — AQAR finalization stays with the authorized AQAR workflow roles; this portal cannot bypass it.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="p-6 text-center space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Institutional Readiness</p>
          <p className="text-4xl font-black">{data.institutionalReadiness ?? '—'}{data.institutionalReadiness != null ? '%' : ''}</p>
        </Card>
        <Card className="p-6 text-center space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Reports Tracked</p>
          <p className="text-4xl font-black">{reports.length}</p>
        </Card>
      </div>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Criteria Readiness</h3>
        {criteria.length === 0 ? <EmptyState title="No criteria data" description="Criteria readiness unavailable." /> : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {criteria.map(([k, v]) => (
              <div key={k} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-center">
                <p className="text-[11px] font-semibold text-slate-500">C{k}</p>
                <p className="text-lg font-black">{v ?? '—'}{v != null ? '%' : ''}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3">AQAR Reports ({reports.length})</h3>
        {reports.length === 0 ? <EmptyState title="No AQAR reports" description="No AQAR reports found." /> : (
          <div className="overflow-x-auto"><table className="min-w-full text-xs">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-3">Report</th><th className="py-2 pr-3">Year</th><th className="py-2 pr-3">Status</th>
            </tr></thead>
            <tbody>{reports.map((r, i) => (
              <tr key={r.id || i} className="border-b border-slate-100">
                <td className="py-2 pr-3 font-bold text-slate-800">{r.title || r.id}</td>
                <td className="py-2 pr-3">{r.academicYear || '—'}</td>
                <td className="py-2 pr-3">{r.status || '—'}</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </Card>
    </div>
  );
};
