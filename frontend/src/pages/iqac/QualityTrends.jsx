import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQualityMonitoring } from '../../hooks/useQualityMonitoring';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ArrowLeft, TrendingUp, Calendar, ShieldCheck, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export const QualityTrends = () => {
  const { user } = useAuth();
  const { trends, loading } = useQualityMonitoring();

  if (loading || !trends) {
    return <Loader message="Loading 3-Year Quality Trend Analysis..." />;
  }

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
              3-Year Institutional Quality & Compliance Trend Analysis
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Historical progression tracking across academic years 2023-24 through 2025-26
            </p>
          </div>
        </div>
      </div>

      {/* 3-Year Trend Line Chart */}
      <Card className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            3-Year Institutional Score Trajectory (2023-24 to 2025-26)
          </h3>
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            +12% Overall Growth
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="academicYear" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#0f172a' }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="overallScore" name="Overall Quality Score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="complianceRate" name="Compliance Rate (%)" stroke="#059669" strokeWidth={2} />
              <Line type="monotone" dataKey="evidenceCompleteness" name="Evidence Completeness (%)" stroke="#0d9488" strokeWidth={2} />
              <Line type="monotone" dataKey="actionClosureRate" name="Action Closure Rate (%)" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Historical Snapshots Table */}
      <Card className="p-4 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
          Academic Year Quality Snapshots
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200 custom-scroll text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b font-bold uppercase tracking-wider">
                <th className="p-3">Academic Year</th>
                <th className="p-3 text-center">Quality Score</th>
                <th className="p-3 text-center">Compliance Rate</th>
                <th className="p-3 text-center">Evidence Completeness</th>
                <th className="p-3 text-center">Action Closure Rate</th>
                <th className="p-3 text-center">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {trends.map((t) => (
                <tr key={t.academicYear} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-extrabold text-slate-900">{t.academicYear}</td>
                  <td className="p-3 text-center font-black text-indigo-950 text-sm">{t.overallScore} / 100</td>
                  <td className="p-3 text-center font-bold text-emerald-800">{t.complianceRate}%</td>
                  <td className="p-3 text-center font-bold text-teal-800">{t.evidenceCompleteness}%</td>
                  <td className="p-3 text-center font-bold text-blue-800">{t.actionClosureRate}%</td>
                  <td className="p-3 text-center font-bold text-slate-700">{t.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
