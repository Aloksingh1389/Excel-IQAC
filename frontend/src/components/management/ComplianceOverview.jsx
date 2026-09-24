import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';

const SEGMENTS = [
  { key: 'compliant', label: 'Compliant', color: '#10b981' },
  { key: 'partial', label: 'Partial', color: '#f59e0b' },
  { key: 'underReview', label: 'Under review', color: '#6366f1' },
  { key: 'pending', label: 'Pending', color: '#94a3b8' },
  { key: 'overdue', label: 'Overdue', color: '#f43f5e' },
  { key: 'notApplicable', label: 'Not applicable', color: '#e2e8f0' },
];

export const ComplianceOverview = ({ data }) => {
  const d = data || {};
  const byStatus = d.byStatus || {};

  const segments = useMemo(
    () =>
      SEGMENTS.map((s) => ({
        ...s,
        value: Number(byStatus[s.key]) || 0,
      })).filter((s) => s.value > 0),
    [byStatus]
  );

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const hasData = total > 0 || d.institutionalRate !== null && d.institutionalRate !== undefined;

  if (!data || (!hasData && segments.length === 0)) {
    return (
      <EmptyState
        title="No compliance data"
        description="Compliance status breakdown is not available yet."
      />
    );
  }

  return (
    <Card className="p-5 sm:p-6" aria-label="Compliance overview">
      <h3 className="text-sm font-bold text-slate-900 mb-1">Compliance Overview</h3>
      <p className="text-[11px] text-slate-500 font-medium mb-4">Institutional compliance distribution</p>
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="text-center sm:text-left shrink-0">
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums">
            {d.institutionalRate === null || d.institutionalRate === undefined || d.institutionalRate === ''
              ? '—'
              : `${d.institutionalRate}%`}
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-1">
            Institutional rate
          </p>
        </div>
        {segments.length > 0 ? (
          <div className="flex-1 w-full min-w-0 flex flex-col sm:flex-row items-center gap-4">
            <div className="h-44 w-44 shrink-0" role="img" aria-label="Compliance status donut chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segments}
                    dataKey="value"
                    nameKey="label"
                    innerRadius="62%"
                    outerRadius="90%"
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {segments.map((s) => (
                      <Cell key={s.key} fill={s.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, name) => [v, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex-1 min-w-0 w-full space-y-1.5" aria-label="Compliance status legend">
              {segments.map((s) => (
                <li key={s.key} className="flex items-center justify-between gap-2 text-xs">
                  <span className="inline-flex items-center gap-2 font-medium text-slate-600 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: s.color }}
                      aria-hidden="true"
                    />
                    <span className="truncate">{s.label}</span>
                  </span>
                  <span className="font-bold text-slate-900 tabular-nums">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-xs text-slate-500">Status breakdown not reported.</p>
        )}
      </div>
    </Card>
  );
};
