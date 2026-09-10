import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { Card } from '../common/Card';

const DEFAULT_COLORS = ['#4f46e5', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

export const DistributionPieChart = ({
  title,
  subtitle = null,
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  innerRadius = 55,
  outerRadius = 80,
  height = 280,
  showLegend = true,
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

      <div style={{ width: '100%', height }} className="relative">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={3}
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, item) => [
                `${Number(value).toLocaleString()} (${item.payload.percentage || ''}%)`,
                name,
              ]}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            {showLegend && (
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
