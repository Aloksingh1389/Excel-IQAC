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

export const ManagementQuality = () => {
  const { user, academicYear } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) { setLoading(false); return undefined; }
    setLoading(true);
    setError(null);
    managementPortalService.getQualityOverview(user, academicYear || '2026-27')
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Failed to load quality overview.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, user?.role, academicYear]);

  if (loading) return <Loader message="Loading quality overview..." />;
  if (error) return <Alert message={error} />;
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_QUALITY_VIEW)) return <Alert message="You do not have permission to view quality." />;
  if (!data) return <EmptyState title="No quality data" description="Quality overview unavailable." />;

  const categories = Array.isArray(data.categories) ? data.categories : [];
  const departments = Array.isArray(data.departments) ? data.departments : [];
  const labels = Array.isArray(data.trendLabels) ? data.trendLabels : [];
  const trendData = labels.map((year, i) => {
    const scores = departments.map((d) => (Array.isArray(d.trend) ? d.trend[d.trend.length - labels.length + i] : null)).filter((v) => typeof v === 'number');
    return { year, score: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null };
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Quality Overview</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Institutional quality monitoring • {academicYear || '2026-27'}</p>
      </div>

      <Card className="p-6 text-center space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Institutional Quality Score</p>
        <p className="text-4xl font-black text-slate-900">{data.institutionalScore ?? '—'}{data.institutionalScore != null ? '%' : ''}</p>
      </Card>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Quality Categories</h3>
        {categories.length === 0 ? <EmptyState title="No categories" description="Category breakdown unavailable." /> : (
          <div className="space-y-2">{categories.map((c) => (
            <div key={c.name} className="space-y-1">
              <div className="flex justify-between text-xs"><span className="font-semibold text-slate-600">{c.name}</span><span className="font-bold">{c.score ?? '—'}{c.score != null ? '%' : ''}</span></div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${Math.max(0, Math.min(100, Number(c.score) || 0))}%` }} /></div>
            </div>
          ))}</div>
        )}
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Department Scores</h3>
        {departments.length === 0 ? <EmptyState title="No departments" description="No department quality data." /> : (
          <div className="overflow-x-auto"><table className="min-w-full text-xs">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-3">Dept</th><th className="py-2 pr-3">Score</th>
            </tr></thead>
            <tbody>{departments.map((d) => (
              <tr key={d.id || d.code} className="border-b border-slate-100">
                <td className="py-2 pr-3 font-bold">{d.code} <span className="font-medium text-slate-500">{d.name}</span></td>
                <td className="py-2 pr-3 font-bold">{d.score ?? '—'}{d.score != null ? '%' : ''}</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </Card>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Quality Trend</h3>
        {trendData.every((t) => t.score == null) ? <EmptyState title="No trend data" description="Trend unavailable." /> : (
          <div className="h-64"><ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} /><Tooltip /><Legend />
              <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2.5} dot name="Avg score" />
            </LineChart>
          </ResponsiveContainer></div>
        )}
      </Card>
    </div>
  );
};
