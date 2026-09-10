import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card } from '../common/Card';
import { CustomTooltip } from './TrendLineChart';

export const PerformanceChart = ({
  title,
  subtitle = null,
  data = [],
  areas = [
    { key: 'passPercentage', name: 'Pass %', color: '#4f46e5' },
    { key: 'distinction', name: 'Distinction %', color: '#10b981' },
  ],
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
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {areas.map((area) => (
                <linearGradient key={`grad-${area.key}`} id={`grad-${area.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={area.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={area.color} stopOpacity={0.0} />
                </linearGradient>
              ))}
            </defs>
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
            {areas.length > 1 && <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />}
            {areas.map((area) => (
              <Area
                key={area.key}
                type="monotone"
                dataKey={area.key}
                name={area.name}
                stroke={area.color}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#grad-${area.key})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
