import React from 'react';
import { Card } from '../common/Card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const PIE_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444'];

export const IQACOverview = ({ departments = [], statistics }) => {
  // Bar chart data: Department completion percentages
  const barData = departments.map((d) => {
    const total = d.completedSubmissions + d.pendingSubmissions;
    const pct = Math.round((d.completedSubmissions / (total || 1)) * 100);
    return {
      name: d.code,
      fullName: d.name,
      completion: pct,
    };
  });

  // Pie chart data: Submission Status distribution
  const pieData = statistics
    ? [
        { name: 'Verified', value: statistics.verifiedSubmissionsCount || 65 },
        { name: 'Under Review', value: statistics.pendingReviewCount || 15 },
        { name: 'Returned', value: 8 },
        { name: 'Pending Evidence', value: statistics.pendingEvidenceCount || 12 },
      ]
    : [
        { name: 'Verified', value: 65 },
        { name: 'Under Review', value: 15 },
        { name: 'Returned', value: 8 },
        { name: 'Pending Evidence', value: 12 },
      ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Department Completion Comparison Bar Chart */}
      <Card className="lg:col-span-2 p-4 sm:p-5 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Department IQAC Completion Rates
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Percentage of verified quarterly IQAC metrics and evidence documentation
          </p>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" axisLine={false} />
              <Tooltip
                formatter={(val) => [`${val}%`, 'IQAC Completion']}
                contentStyle={{ borderRadius: '12px', borderColor: '#e2e8f0', fontSize: '12px' }}
              />
              <Bar dataKey="completion" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 2. Submission Status Donut/Pie Chart */}
      <Card className="p-4 sm:p-5 space-y-3 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Submission Verification Breakdown
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Overall status distribution across institution
          </p>
        </div>

        <div className="h-56 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => [val, 'Submissions']} />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
