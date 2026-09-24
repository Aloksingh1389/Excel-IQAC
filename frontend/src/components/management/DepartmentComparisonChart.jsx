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
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';

const METRICS = [
  { key: 'quality', label: 'Quality', color: '#6366f1' },
  { key: 'compliance', label: 'Compliance', color: '#10b981' },
  { key: 'readiness', label: 'Readiness', color: '#14b8a6' },
  { key: 'evidenceCompleteness', label: 'Evidence', color: '#f59e0b' },
];

const pickValue = (row, metric) => {
  if (!row) return 0;
  const direct = row[metric];
  if (direct !== null && direct !== undefined && direct !== '') return Number(direct) || 0;
  // Fallbacks to common alternate key names
  const fallbacks = {
    quality: ['qualityScore', 'quality_score'],
    compliance: ['complianceRate', 'compliance_rate'],
    readiness: ['accreditationReadiness', 'readiness', 'accreditation_readiness'],
    evidenceCompleteness: ['evidence_completeness', 'evidence'],
  };
  for (const k of fallbacks[metric] || []) {
    const v = row[k];
    if (v !== null && v !== undefined && v !== '') return Number(v) || 0;
  }
  return 0;
};

export const DepartmentComparisonChart = ({ rows, metric = 'metric', title }) => {
  const data = Array.isArray(rows) ? rows : [];
  const validKeys = METRICS.map((m) => m.key);
  const [activeMetric, setActiveMetric] = useState(
    validKeys.includes(metric) ? metric : 'quality'
  );
  const active = METRICS.find((m) => m.key === activeMetric) || METRICS[0];

  const chartData = useMemo(
    () =>
      data.map((r) => ({
        label: r?.code || r?.name || '—',
        fullName: r?.name || r?.code || 'Department',
        value: pickValue(r, activeMetric),
      })),
    [data, activeMetric]
  );

  return (
    <Card className="p-5 sm:p-6" aria-label={title || 'Department comparison'}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">{title || 'Department Comparison'}</h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            {active.label} score by department (0–100)
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Select metric">
          {METRICS.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setActiveMetric(m.key)}
              aria-pressed={activeMetric === m.key}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                activeMetric === m.key
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {chartData.length === 0 ? (
        <EmptyState
          title="No comparison data"
          description="Department metric data is not available for this view."
        />
      ) : (
        <div className="h-64 sm:h-80" role="img" aria-label={`${active.label} bar chart by department`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-20} dy={8} height={52} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                formatter={(v) => [`${v}%`, active.label]}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
              />
              <Bar dataKey="value" name={active.label} radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={active.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};
