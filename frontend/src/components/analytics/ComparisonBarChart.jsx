import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { Card } from '../common/Card';
import { CustomTooltip } from './TrendLineChart';

export const ComparisonBarChart = ({
  title,
  subtitle = null,
  data = [],
  bars = [{ key: 'passPercentage', name: 'Pass %', color: '#4f46e5' }],
  xAxisKey = 'code',
  unit = '%',
  height = 280,
  layout = 'horizontal', // 'horizontal' | 'vertical'
  onBarClick = null,
  className = '',
}) => {
  return (
    <Card className={`p-5 space-y-4 ${className}`}>
      {(title || subtitle) && (
        <div className="space-y-0.5 pb-2 border-b border-slate-100 flex items-center justify-between">
          <div>
            {title && <h3 className="text-sm font-bold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
          {onBarClick && (
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Click bar to filter
            </span>
          )}
        </div>
      )}

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout={layout}
            margin={{ top: 10, right: 10, left: layout === 'vertical' ? 10 : -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            {layout === 'horizontal' ? (
              <>
                <XAxis
                  dataKey={xAxisKey}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  unit={unit}
                />
              </>
            ) : (
              <>
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  unit={unit}
                />
                <YAxis
                  type="category"
                  dataKey={xAxisKey}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  width={70}
                />
              </>
            )}
            <Tooltip content={<CustomTooltip unit={unit} />} />
            {bars.length > 1 && <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />}
            {bars.map((bar) => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                name={bar.name}
                fill={bar.color}
                radius={[4, 4, 0, 0]}
                onClick={onBarClick ? (entry) => onBarClick(entry) : undefined}
                className={onBarClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
