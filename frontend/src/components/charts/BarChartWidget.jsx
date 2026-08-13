import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const DEFAULT_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-xs border border-slate-700">
        <p className="font-semibold mb-1 text-slate-200">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-3 text-[11px]">
            <span style={{ color: entry.color }} className="font-medium">
              {entry.name}:
            </span>
            <span className="font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const BarChartWidget = ({
  data = [],
  dataKeys = [{ key: 'value', name: 'Value', color: '#2563eb' }],
  xAxisKey = 'name',
  height = 280,
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
          {dataKeys.map((dk, idx) => (
            <Bar key={dk.key} dataKey={dk.key} name={dk.name} fill={dk.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const LineChartWidget = ({
  data = [],
  dataKeys = [{ key: 'value', name: 'Value', color: '#2563eb' }],
  xAxisKey = 'name',
  height = 280,
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
          {dataKeys.map((dk, idx) => (
            <Line
              key={dk.key}
              type="monotone"
              dataKey={dk.key}
              name={dk.name}
              stroke={dk.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]}
              strokeWidth={2.5}
              dot={{ r: 3, fill: dk.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length] }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PieChartWidget = ({
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  colors = DEFAULT_COLORS,
  height = 280,
  innerRadius = 60,
  outerRadius = 90,
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const AreaChartWidget = ({
  data = [],
  dataKeys = [{ key: 'value', name: 'Value', color: '#2563eb' }],
  xAxisKey = 'name',
  height = 280,
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {dataKeys.map((dk, idx) => (
              <linearGradient key={`grad-${dk.key}`} id={`grad-${dk.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={dk.color || DEFAULT_COLORS[idx]} stopOpacity={0.4} />
                <stop offset="95%" stopColor={dk.color || DEFAULT_COLORS[idx]} stopOpacity={0.0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
          {dataKeys.map((dk) => (
            <Area
              key={dk.key}
              type="monotone"
              dataKey={dk.key}
              name={dk.name}
              stroke={dk.color}
              fillOpacity={1}
              fill={`url(#grad-${dk.key})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
