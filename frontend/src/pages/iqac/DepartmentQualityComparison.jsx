import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQualityMonitoring } from '../../hooks/useQualityMonitoring';
import { QualityStatusBadge } from '../../components/quality/QualityStatusBadge';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, BarChart3, CheckSquare, ShieldCheck, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export const DepartmentQualityComparison = () => {
  const { user } = useAuth();
  const { summary, loading } = useQualityMonitoring();

  if (loading || !summary) {
    return <Loader message="Loading Department Quality Comparison Matrix..." />;
  }

  const comparisonData = summary.departmentScorecards;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/iqac/quality-monitoring"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Department Quality Benchmark Comparison Matrix
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Side-by-side comparative analysis of department quality scores, compliance, evidence & action resolution rates
            </p>
          </div>
        </div>
      </div>

      {/* Comparative Bar Chart */}
      <Card className="p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
          Comparative Quality Metrics Breakdown Across Departments (%)
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="code" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#0f172a' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="score" name="Overall Quality Score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="compliance" name="Compliance %" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="evidence" name="Evidence %" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actions" name="Actions %" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Comparison Table */}
      <Card className="p-4 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
          Detailed Metrics Comparison Matrix
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200 custom-scroll text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b font-bold uppercase tracking-wider">
                <th className="p-3">Department</th>
                <th className="p-3 text-center">Quality Score</th>
                <th className="p-3 text-center">Compliance Rate</th>
                <th className="p-3 text-center">Evidence Completeness</th>
                <th className="p-3 text-center">Action Resolution</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {comparisonData.map((d) => (
                <tr key={d.code} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-extrabold text-slate-900">{d.code} - {d.name}</td>
                  <td className="p-3 text-center font-black text-indigo-950 text-sm">{d.score} / 100</td>
                  <td className="p-3 text-center font-bold text-emerald-800">{d.compliance}%</td>
                  <td className="p-3 text-center font-bold text-teal-800">{d.evidence}%</td>
                  <td className="p-3 text-center font-bold text-blue-800">{d.actions}%</td>
                  <td className="p-3 text-center">
                    <QualityStatusBadge score={d.score} rating={d.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
