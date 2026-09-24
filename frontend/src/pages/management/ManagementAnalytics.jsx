import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { managementPortalService } from '../../services/managementPortalService';
import { MANAGEMENT_PERMISSIONS, hasManagementPermission } from '../../config/managementPortalConfig';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const Alert = ({ message }) => (
  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm font-medium">{message}</div>
);

const PILLARS = ['academic', 'faculty', 'student', 'research', 'publication', 'placement', 'overview'];
const TREND_KEYS = ['yearlyTrend', 'trendData', 'yearlyData', 'trend', 'monthlyTrend'];
const TABLE_KEYS = ['departmentComparison', 'comparison', 'breakdown', 'byDepartment'];

const pickArray = (obj, keys) => {
  if (!obj || typeof obj !== 'object') return null;
  for (const k of keys) {
    if (Array.isArray(obj[k]) && obj[k].length > 0) return { key: k, rows: obj[k] };
  }
  return null;
};

const GenericObjectTable = ({ value }) => {
  if (value === null || value === undefined) return <span className="text-slate-400">—</span>;
  if (typeof value !== 'object') return <span>{String(value)}</span>;
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-slate-400">—</span>;
    if (typeof value[0] !== 'object') return <span>{value.join(', ')}</span>;
    const cols = [...new Set(value.flatMap((r) => Object.keys(r || {})))].slice(0, 8);
    return (
      <div className="overflow-x-auto"><table className="min-w-full text-xs">
        <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
          {cols.map((c) => <th key={c} className="py-2 pr-3">{c}</th>)}
        </tr></thead>
        <tbody>{value.slice(0, 15).map((r, i) => (
          <tr key={i} className="border-b border-slate-100">
            {cols.map((c) => <td key={c} className="py-2 pr-3 text-slate-600">{r?.[c] === null || r?.[c] === undefined ? '—' : typeof r[c] === 'object' ? JSON.stringify(r[c]) : String(r[c])}</td>)}
          </tr>
        ))}</tbody>
      </table></div>
    );
  }
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
      {Object.entries(value).map(([k, v]) => (
        <div key={k} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
          <dt className="text-[11px] font-semibold text-slate-500 break-words">{k}</dt>
          <dd className="font-bold text-slate-800 break-words">{v === null || v === undefined ? '—' : typeof v === 'object' ? JSON.stringify(v) : String(v)}</dd>
        </div>
      ))}
    </dl>
  );
};

export const ManagementAnalytics = () => {
  const { pillar: routePillar } = useParams();
  const { user, academicYear } = useAuth();
  const [pillar, setPillar] = useState(routePillar || 'academic');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { if (routePillar) setPillar(routePillar); }, [routePillar]);
  useEffect(() => {
    let cancelled = false;
    if (!user) { setLoading(false); return undefined; }
    setLoading(true);
    setError(null);
    managementPortalService.getAnalytics(pillar, academicYear || '2026-27', {}, user)
      .then((res) => { if (!cancelled) setData(res?.data ?? res); })
      .catch((err) => { if (!cancelled) setError(err?.message || `Failed to load ${pillar} analytics.`); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [pillar, user?.id, user?.role, academicYear]);

  if (loading) return <Loader message={`Loading ${pillar} analytics...`} />;
  if (error) return (
    <div className="space-y-4">
      <PillarTabs active={pillar} onChange={setPillar} />
      <Alert message={error} />
    </div>
  );
  if (!hasManagementPermission(user, MANAGEMENT_PERMISSIONS.MANAGEMENT_ANALYTICS_VIEW)) return <Alert message="You do not have permission to view analytics." />;

  const kpis = data && typeof data === 'object' && data.kpis && typeof data.kpis === 'object' ? data.kpis : null;
  const trendPick = pickArray(data, TREND_KEYS);
  const tablePick = pickArray(data, TABLE_KEYS);
  const rest = data && typeof data === 'object' && !Array.isArray(data)
    ? Object.fromEntries(Object.entries(data).filter(([k]) => k !== 'kpis' && k !== trendPick?.key && k !== tablePick?.key))
    : null;
  const trendRows = trendPick?.rows || [];
  const trendNumericKeys = trendRows.length > 0 && typeof trendRows[0] === 'object'
    ? Object.keys(trendRows[0]).filter((k) => trendRows.some((r) => typeof r?.[k] === 'number')).slice(0, 5) : [];
  const trendXKey = trendRows.length > 0 && typeof trendRows[0] === 'object'
    ? (['year', 'label', 'month', 'period', 'name'].find((k) => trendRows[0][k] !== undefined) || Object.keys(trendRows[0])[0]) : 'year';

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Analytics — {pillar}</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Institution-wide {pillar} analytics • {academicYear || '2026-27'}</p>
      </div>
      <PillarTabs active={pillar} onChange={setPillar} />

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Key Indicators</h3>
        {!kpis ? <EmptyState title="No KPIs" description="No KPI object returned for this pillar." />
          : <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {Object.entries(kpis).map(([k, v]) => (
              <div key={k} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <p className="text-[11px] font-semibold text-slate-500 break-words">{k}</p>
                <p className="font-black text-slate-900 break-words">{v === null || v === undefined ? '—' : typeof v === 'object' ? JSON.stringify(v) : String(v)}</p>
              </div>
            ))}
          </div>}
      </Card>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Trend {trendPick ? `(${trendPick.key})` : ''}</h3>
        {!trendPick || trendNumericKeys.length === 0 ? <EmptyState title="No trend data" description="No plottable trend array found for this pillar." /> : (
          <div className="h-64"><ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendRows}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey={trendXKey} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend />
              {trendNumericKeys.map((k, i) => (
                <Line key={k} type="monotone" dataKey={k} stroke={['#4f46e5', '#0d9488', '#e11d48', '#d97706', '#0284c7'][i % 5]} strokeWidth={2} dot={false} name={k} />
              ))}
            </LineChart>
          </ResponsiveContainer></div>
        )}
      </Card>

      <Card className="p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Comparison {tablePick ? `(${tablePick.key})` : ''}</h3>
        {!tablePick ? <EmptyState title="No comparison table" description="No comparison array found for this pillar." />
          : <GenericObjectTable value={tablePick.rows} />}
      </Card>

      {rest && Object.keys(rest).length > 0 && (
        <Card className="p-4 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Additional Sections</h3>
          {Object.entries(rest).map(([k, v]) => (
            <div key={k} className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700">{k}</h4>
              <GenericObjectTable value={v} />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

const PillarTabs = ({ active, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {PILLARS.map((p) => (
      <Link key={p} to={p === 'academic' ? '/management/analytics' : `/management/analytics/${p}`}
        onClick={(e) => { e.preventDefault(); onChange(p); window.history.replaceState(null, '', p === 'academic' ? '/management/analytics' : `/management/analytics/${p}`); }}
        className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${active === p ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
        {p}
      </Link>
    ))}
  </div>
);

export const ManagementAnalyticsBar = ({ data = [], xKey = 'name', bars = [] }) => {
  if (!Array.isArray(data) || data.length === 0) return <EmptyState title="No data" description="Nothing to chart." />;
  return (
    <div className="h-64"><ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend />
        {bars.map((b, i) => <Bar key={b} dataKey={b} fill={['#4f46e5', '#0d9488', '#e11d48'][i % 3]} />)}
      </BarChart>
    </ResponsiveContainer></div>
  );
};
