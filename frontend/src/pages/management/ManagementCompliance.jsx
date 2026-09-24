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

export const ManagementCompliance = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) { setLoading(false); return undefined; }
    setLoading(true);
    setError(null);
    managementPortalService.getComplianceOverview(user)
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load compliance overview.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, user?.role]);

  if (loading) return <Loader message="Loading compliance overview..." />;
  if (error) return <Alert message={error} />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_COMPLIANCE_VIEW)) return <Alert message="You do not have permission to view compliance." />;
  if (!data) return <EmptyState title="No compliance data" description="Compliance overview unavailable." />;

  const byStatus = data.byStatus || {};
  const departments = Array.isArray(data.departments) ? data.departments : [];
  const overdueDepts = departments.filter((d) => (d.overdue ?? 0) > 0);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Compliance Overview</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Institution-wide compliance monitoring</p>
      </div>

      <Card className="p-6 text-center space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Institutional Compliance Rate</p>
        <p className="text-4xl font-black text-slate-900">{data.institutionalRate ?? '—'}{data.institutionalRate != null ? '%' : ''}</p>
      </Card>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Records by Status</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.entries(byStatus).map(([k, v]) => (
            <div key={k} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <p className="text-[11px] font-semibold text-slate-500 capitalize">{k}</p>
              <p className="text-xl font-black text-slate-900">{v ?? 0}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Department Compliance</h3>
        {departments.length === 0 ? <EmptyState title="No departments" description="No department compliance data." /> : (
          <div className="overflow-x-auto"><table className="min-w-full text-xs">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-3">Dept</th><th className="py-2 pr-3">Rate</th><th className="py-2 pr-3">Pending</th><th className="py-2 pr-3">Overdue</th>
            </tr></thead>
            <tbody>{departments.map((d) => (
              <tr key={d.id || d.code} className="border-b border-slate-100">
                <td className="py-2 pr-3 font-bold">{d.code} <span className="font-medium text-slate-500">{d.name}</span></td>
                <td className="py-2 pr-3 font-bold">{d.complianceRate ?? '—'}{d.complianceRate != null ? '%' : ''}</td>
                <td className="py-2 pr-3">{d.pending ?? 0}</td>
                <td className="py-2 pr-3 font-bold text-rose-700">{d.overdue ?? 0}</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </Card>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Overdue by Department ({overdueDepts.length})</h3>
        {overdueDepts.length === 0 ? <EmptyState title="Nothing overdue" description="No department has overdue compliance items." /> : (
          <ul className="space-y-2">{overdueDepts.map((d) => (
            <li key={d.id || d.code} className="text-xs rounded-lg border border-rose-200 bg-rose-50 px-3 py-2">
              <span className="font-bold">{d.code}</span> — {d.overdue} overdue item(s)
            </li>
          ))}</ul>
        )}
      </Card>
    </div>
  );
};
