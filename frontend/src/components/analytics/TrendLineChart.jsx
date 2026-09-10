import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card } from '../common/Card';

export const CustomTooltip = ({ active, payload, label, unit = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1 z-50">
        <p className="font-bold text-slate-300 border-b border-slate-700 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-extrabold text-white">
              {entry.value}
              {unit}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const TrendLineChart = ({
  title,
  subtitle = null,
  data = [],
  lines = [{ key: 'value', name: 'Value', color: '#4f46e5' }],
  xAxisKey = 'year',
  unit = '%',
  height = 280,
  className = '',
}) => {
  return (
    <Card className={`p-5 space-y-4 ${className}`}>
      {(title || subtitle) && (
        <div className="space-y-0.5 pb-2 border-b border-slate-100">
          {title && <h3 className="text-sm font-bold text-slate-900">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      )}

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              unit={unit}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            {lines.length > 1 && <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />}
            {lines.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 2, fill: '#ffffff', stroke: line.color }}
                activeDot={{ r: 6, stroke: line.color, strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
