import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';

const METRICS = [
  { key: 'quality', label: 'Quality', field: 'quality' },
  { key: 'compliance', label: 'Compliance', field: 'compliance' },
  { key: 'readiness', label: 'Readiness', field: 'readiness' },
  { key: 'evidence', label: 'Evidence %', field: 'evidenceCompleteness' },
  { key: 'pending', label: 'Pending reviews', field: 'pendingReviews' },
];

const BAR_COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

export const DepartmentComparisonChart = ({ rows, metric = 'quality', title }) => {
  const data = useMemo(() => (Array.isArray(rows) ? rows : []), [rows]);
  const initial = METRICS.some((m) => m.key === metric) ? metric : 'quality';
  const [active, setActive] = useState(initial);
  const def = METRICS.find((m) => m.key === active) || METRICS[0];

  const chartData = useMemo(
    () =>
      data.map((r, idx) => ({
        name: r?.code || r?.name || `Dept ${idx + 1}`,
        value: typeof r?.[def.field] === 'number' ? r[def.field] : null,
      })),
    [data, def.field],
  );

  const hasData = chartData.some((d) => typeof d.value === 'number');

  return (
    <Card className="p-5" aria-label={title || `Department comparison by ${def.label}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-600" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-800">
            {title || `Comparison — ${def.label}`}
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Select metric">
          {METRICS.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setActive(m.key)}
              aria-pressed={active === m.key}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                active === m.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 || !hasData ? (
        <EmptyState
          icon={BarChart3}
          title="No chart data"
          description={`No ${def.label.toLowerCase()} data available across departments.`}
        />
      ) : (
        <div className="w-full h-72" role="img" aria-label={`Bar chart of ${def.label} by department`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} dy={8} height={48} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                formatter={(v) => [v ?? '—', def.label]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};
