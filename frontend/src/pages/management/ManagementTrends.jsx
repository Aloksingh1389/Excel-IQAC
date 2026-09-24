import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { managementPortalService } from '../../services/managementPortalService';
import { MANAGEMENT_PERMISSIONS, hasManagementPermission } from '../../config/managementPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const Alert = ({ message }) => (
  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{message}</div>
);
const COLORS = ['#4f46e5', '#0d9488', '#e11d48', '#d97706', '#0284c7', '#7c3aed', '#059669'];

export const ManagementTrends = () => {
  const { user, academicYear } = useAuth();
  const [trend, setTrend] = useState([]);
  const [comparison, setComparison] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) { setLoading(false); return undefined; }
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const [over, comp] = await Promise.all([
          managementPortalService.getInstitutionOverview(user, academicYear || '2026-27'),
          managementPortalService.getDepartmentComparison(user),
        ]);
        if (!cancelled) {
          setTrend(Array.isArray(over.data?.qualityTrend) ? over.data.qualityTrend : []);
          setComparison(Array.isArray(comp.data) ? comp.data : []);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load trends.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id, user?.role, academicYear]);

  if (loading) return <Loader message="Loading trends..." />;
  if (error) return <Alert message={error} />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_TRENDS_VIEW)) return <Alert message="You do not have permission to view trends." />;

  const deptSeries = comparison.filter((r) => Array.isArray(r.trend) && r.trend.length > 0);
  const maxLen = deptSeries.reduce((m, r) => Math.max(m, r.trend.length), 0);
  const perDeptData = Array.from({ length: maxLen }, (_, i) => {
    const point = { period: `T${i + 1}` };
    deptSeries.forEach((r) => { point[r.code] = r.trend[i] ?? null; });
    return point;
  });
  const snapshot = comparison.map((r) => ({ code: r.code, compliance: r.compliance ?? null, readiness: r.readiness ?? null }));

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Quality & Performance Trends</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Institutional trajectory and department trend lines</p>
      </div>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Institution Quality Trend</h3>
        {trend.length === 0 ? <EmptyState title="No trend data" description="Institutional trend unavailable." /> : (
          <div className="h-64"><ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} /><Tooltip /><Legend />
              <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2.5} dot name="Quality score" />
            </LineChart>
          </ResponsiveContainer></div>
        )}
      </Card>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Per-Department Trend Lines</h3>
        {perDeptData.length === 0 ? <EmptyState title="No department trends" description="No per-department trend arrays available." /> : (
          <div className="h-72"><ResponsiveContainer width="100%" height="100%">
            <LineChart data={perDeptData}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="period" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} /><Tooltip /><Legend />
              {deptSeries.map((r, i) => (
                <Line key={r.code} type="monotone" dataKey={r.code} stroke={COLORS[i % COLORS.length]} dot={false} name={r.code} />
              ))}
            </LineChart>
          </ResponsiveContainer></div>
        )}
      </Card>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Compliance / Readiness Snapshot</h3>
        <p className="text-[11px] text-slate-500">Current snapshot only — historical compliance/readiness series are not available, so no history is invented here.</p>
        {snapshot.length === 0 ? <EmptyState title="No snapshot data" description="Snapshot unavailable." /> : (
          <div className="overflow-x-auto"><table className="min-w-full text-xs">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-3">Dept</th><th className="py-2 pr-3">Compliance (current)</th><th className="py-2 pr-3">Readiness (current)</th>
            </tr></thead>
            <tbody>{snapshot.map((s) => (
              <tr key={s.code} className="border-b border-slate-100">
                <td className="py-2 pr-3 font-bold">{s.code}</td>
                <td className="py-2 pr-3">{s.compliance ?? '—'}{s.compliance != null ? '%' : ''}</td>
                <td className="py-2 pr-3">{s.readiness ?? '—'}{s.readiness != null ? '%' : ''}</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </Card>
    </div>
  );
};
