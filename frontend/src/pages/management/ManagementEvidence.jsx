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

export const ManagementEvidence = () => {
  const { user, academicYear } = useAuth();
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({});
  const [missing, setMissing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) { setLoading(false); return undefined; }
    setLoading(true);
    setError(null);
    managementPortalService.getEvidenceOverview({ academicYear: academicYear || '2026-27' }, user)
      .then((res) => {
        if (!cancelled) {
          setRecords(Array.isArray(res.data) ? res.data : []);
          setStats(res.stats || {});
          setMissing(Array.isArray(res.missing) ? res.missing : []);
        }
      })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load evidence overview.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, user?.role, academicYear]);

  if (loading) return <Loader message="Loading evidence overview..." />;
  if (error) return <Alert message={error} />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_EVIDENCE_VIEW)) return <Alert message="You do not have permission to view evidence." />;

  const byDept = {};
  records.forEach((r) => {
    const code = r.departmentCode || '—';
    byDept[code] = byDept[code] || { code, total: 0, verified: 0 };
    byDept[code].total += 1;
    if (r.status === 'VERIFIED') byDept[code].verified += 1;
  });
  const deptHealth = Object.values(byDept);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Evidence Monitoring</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Institution-wide evidence completeness • {academicYear || '2026-27'}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[['Total', stats.total ?? records.length], ['Verified', stats.verified ?? '—'], ['Pending', stats.pending ?? '—'], ['Missing', missing.length]].map(([k, v]) => (
          <Card key={k} className="p-4 space-y-1"><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{k}</p><p className="text-xl font-black">{v}</p></Card>
        ))}
      </div>

      <Card className="p-4 sm:p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Department Evidence Health</h3>
        {deptHealth.length === 0 ? <EmptyState title="No data" description="No evidence records to summarize." /> : (
          <div className="overflow-x-auto"><table className="min-w-full text-xs">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-3">Dept</th><th className="py-2 pr-3">Total</th><th className="py-2 pr-3">Verified</th><th className="py-2 pr-3">Completeness</th>
            </tr></thead>
            <tbody>{deptHealth.map((d) => (
              <tr key={d.code} className="border-b border-slate-100">
                <td className="py-2 pr-3 font-bold">{d.code}</td><td className="py-2 pr-3">{d.total}</td>
                <td className="py-2 pr-3">{d.verified}</td>
                <td className="py-2 pr-3 font-bold">{d.total > 0 ? Math.round((d.verified / d.total) * 100) : 100}%</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </Card>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Missing Evidence ({missing.length})</h3>
        {missing.length === 0 ? <EmptyState title="Nothing missing" description="No missing evidence items." /> : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">{missing.slice(0, 20).map((m, i) => (
            <li key={m.id || i} className="text-xs rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
              <span className="font-bold">{m.title || m.requirement || m.id}</span>
              <span className="block text-[11px] text-slate-500">{m.departmentCode || ''}</span>
            </li>
          ))}</ul>
        )}
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Evidence Records ({records.length})</h3>
        {records.length === 0 ? <EmptyState title="No records" description="No evidence records found." /> : (
          <div className="overflow-x-auto"><table className="min-w-full text-xs">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-3">Title</th><th className="py-2 pr-3">Dept</th><th className="py-2 pr-3">Status</th>
            </tr></thead>
            <tbody>{records.slice(0, 50).map((r) => (
              <tr key={r.id} className="border-b border-slate-100">
                <td className="py-2 pr-3 font-bold text-slate-800">{r.title || r.id}</td>
                <td className="py-2 pr-3">{r.departmentCode || '—'}</td>
                <td className="py-2 pr-3">{r.status || '—'}</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </Card>
    </div>
  );
};
