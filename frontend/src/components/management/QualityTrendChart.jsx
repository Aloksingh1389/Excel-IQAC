import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';

export const QualityTrendChart = ({ data }) => {
  const points = Array.isArray(data) ? data : [];

  return (
    <Card className="p-5 sm:p-6" aria-label="Quality trend over years">
      <h3 className="text-sm font-bold text-slate-900 mb-1">Quality Trend</h3>
      <p className="text-[11px] text-slate-500 font-medium mb-4">
        Institutional quality score by academic year
      </p>
      {points.length === 0 ? (
        <EmptyState
          title="No trend data"
          description="Quality scores by year are not available yet."
        />
      ) : (
        <div className="h-56 sm:h-72" role="img" aria-label="Quality score line chart by year">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip formatter={(v) => [`${v}%`, 'Quality score']} />
              <Line
                type="monotone"
                dataKey="score"
                name="Quality score"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#f59e0b' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};
