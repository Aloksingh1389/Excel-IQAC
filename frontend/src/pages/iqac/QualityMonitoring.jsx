import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQualityMonitoring } from '../../hooks/useQualityMonitoring';
import { ROLES, getDesignationDisplay } from '../../config/roles';
import { IQACStatCard } from '../../components/iqac/IQACStatCard';
import { QualityStatusBadge } from '../../components/quality/QualityStatusBadge';
import { AttentionRequiredCard } from '../../components/quality/AttentionRequiredCard';
import { QualityInsightCard } from '../../components/quality/QualityInsightCard';
import { DepartmentQualityTable } from '../../components/quality/DepartmentQualityTable';
import { Loader } from '../../components/common/Loader';
import { Card } from '../../components/common/Card';
import { ShieldCheck, CheckCircle2, FileText, AlertTriangle, TrendingUp, Award, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

export const QualityMonitoring = () => {
  const { user } = useAuth();
  const { summary, alerts, insights, loading } = useQualityMonitoring();

  if (loading || !summary) {
    return <Loader message="Loading Institutional Quality Monitoring Engine & Scorecards..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Institutional Quality Monitoring & Compliance Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
              {getDesignationDisplay(user?.designation, user?.role)}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Closed-loop monitoring integrating verified evidence, submissions, action items, department scorecards & improvement plans
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Link
            to="/iqac/quality-monitoring/departments"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Department Scorecards</span>
          </Link>
          <Link
            to="/iqac/compliance"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Compliance Center</span>
          </Link>
        </div>
      </div>

      {/* Top KPI Stat Cards (Section 17 requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <IQACStatCard
          title="Institutional Quality Score"
          value={`${summary.overallScore} / 100`}
          subtitle={`Target: ${summary.target}`}
          icon={Award}
          color="indigo"
          badgeText={summary.rating}
        />
        <IQACStatCard
          title="Compliance Rate"
          value={`${summary.breakdown.complianceRate}%`}
          subtitle="Accreditation Standards"
          icon={CheckCircle2}
          color="emerald"
        />
        <IQACStatCard
          title="Verified Evidence Rate"
          value={`${summary.breakdown.evidenceRate}%`}
          subtitle="Official Document Proofs"
          icon={ShieldCheck}
          color="teal"
        />
        <IQACStatCard
          title="Action Item Closure"
          value={`${summary.breakdown.actionRate}%`}
          subtitle="Resolution Implementation"
          icon={FileText}
          color="blue"
        />
        <IQACStatCard
          title="Attention Required"
          value={alerts.length}
          subtitle="Critical Indicator Flags"
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Main Quality Overview & Category Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quality Score Spotlight */}
        <Card className="p-6 space-y-4 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl">
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">
            Institutional Quality Benchmark
          </span>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black tracking-tight">
              {summary.overallScore}
            </span>
            <span className="text-lg font-bold text-slate-300">/ 100</span>
          </div>

          <div className="flex items-center gap-2">
            <QualityStatusBadge score={summary.overallScore} rating={summary.rating} />
            <span className="text-xs text-indigo-200 font-semibold">
              Gap from Target: {summary.gap > 0 ? `+${summary.gap}` : summary.gap} pts
            </span>
          </div>

          <p className="text-xs text-indigo-100 leading-relaxed font-medium pt-2 border-t border-indigo-800/80">
            Transparent rule-based scoring combining 30% indicator performance, 25% compliance rate, 20% verified evidence completeness, and 15% action resolution rate.
          </p>

          <div className="pt-2">
            <Link
              to="/iqac/quality-monitoring/trends"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 hover:text-white transition"
            >
              <span>View 3-Year Quality Trend Analysis</span>
              <TrendingUp className="w-4 h-4" />
            </Link>
          </div>
        </Card>

        {/* Category Performance Chart */}
        <Card className="lg:col-span-2 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Quality Score Breakdown Across Categories (%)
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Actual vs Target (85%)
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.categoryScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="score" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 2-Column Grid: Alerts & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttentionRequiredCard alerts={alerts} />
        <QualityInsightCard insights={insights} />
      </div>

      {/* Department Quality Scorecards Table */}
      <DepartmentQualityTable scorecards={summary.departmentScorecards} />
    </div>
  );
};
