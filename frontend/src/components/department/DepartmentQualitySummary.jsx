import React, { useMemo } from 'react';
import { Award } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';

export const DepartmentQualitySummary = ({ quality }) => {
  const q = quality || {};
  const score = q.score ?? q.overall ?? q.overallScore ?? null;
  const categories = q.categories || {};
  const trend = Array.isArray(q.trend) ? q.trend : [];

  const chartData = useMemo(
    () =>
      Object.entries(categories).map(([name, pct]) => ({
        name: name.length > 14 ? `${name.slice(0, 13)}…` : name,
        fullName: name,
        value: Number(pct) || 0,
      })),
    [categories]
  );

  if (score == null && chartData.length === 0) {
    return (
      <EmptyState
        icon={Award}
        title="No quality data"
        description="Quality scores for this department are not available yet."
      />
    );
  }

  return (
    <Card className="p-5" aria-label="Department quality summary">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-sm font-bold text-slate-900">Quality Summary</h2>
        {score != null && (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-extrabold border bg-indigo-50 text-indigo-700 border-indigo-200"
            aria-label={`Overall quality score ${score}`}
          >
            <Award className="w-3.5 h-3.5" aria-hidden="true" />
            Score: {score}
          </span>
        )}
      </div>

      {chartData.length > 0 && (
        <>
          <ul className="space-y-2.5 mb-5" aria-label="Quality category scores">
            {chartData.map((cat) => (
              <li key={cat.fullName}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 truncate" title={cat.fullName}>
                    {cat.fullName}
                  </span>
                  <span className="font-bold text-slate-900 ml-2" aria-label={`${cat.fullName} ${cat.value} percent`}>
                    {cat.value}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full bg-slate-100 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={cat.value}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${cat.fullName} score`}
                >
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, cat.value))}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <div className="h-56" role="img" aria-label="Bar chart of quality scores by category">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {trend.length > 0 && (
        <p className="mt-3 text-[11px] text-slate-500" aria-label={`Score trend: ${trend.join(', ')}`}>
          Trend: {trend.join(' → ')}
        </p>
      )}
    </Card>
  );
};
