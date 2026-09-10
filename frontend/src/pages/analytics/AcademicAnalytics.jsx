import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAnalytics } from '../../hooks/useAnalytics';
import { KPIAnalyticsCard } from '../../components/analytics/KPIAnalyticsCard';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { TrendLineChart } from '../../components/analytics/TrendLineChart';
import { ComparisonBarChart } from '../../components/analytics/ComparisonBarChart';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { Award, GraduationCap, ArrowLeft, Percent, Layers, AlertCircle } from 'lucide-react';

export const AcademicAnalytics = () => {
  const navigate = useNavigate();
  const { data, loading, error, filters, setFilters, resetFilters, selectedYear } =
    useAnalytics('academic');

  if (loading || !data) {
    return <Loader message="Loading academic analytics..." />;
  }

  const kpis = data.kpis;

  const handleBarDrilldown = (entry) => {
    if (entry && entry.id) {
      navigate(`/director/institution/departments/${entry.id}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <Link to="/director/analytics">
            <Button variant="ghost" size="xs" icon={ArrowLeft}>
              Analytics
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Academic & Examination Analytics
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Course completion, pass rates, semester progressions, and departmental benchmarks.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          AY: {selectedYear}
        </span>
      </div>

      {/* 2. Filter Bar */}
      <AnalyticsFilterBar
        filters={filters}
        onFilterChange={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
        onReset={resetFilters}
        showDepartment
        showProgram
        showSemester
      />

      {/* 3. KPI Grid Cards (6 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <KPIAnalyticsCard
          title="Overall Pass Rate"
          value={`${kpis.passPercentage}%`}
          prevValue={`${kpis.prevPassPercentage}%`}
          change="+2.2%"
          isPositive
          icon={Award}
          color="emerald"
        />

        <KPIAnalyticsCard
          title="Average Result"
          value={`${kpis.averagePercentage}%`}
          subtitle="Score Across All Courses"
          icon={Percent}
          color="blue"
        />

        <KPIAnalyticsCard
          title="Distinction Rate"
          value={`${kpis.distinctionPercentage}%`}
          subtitle="CGPA ≥ 8.5 Equivalent"
          icon={Award}
          color="indigo"
        />

        <KPIAnalyticsCard
          title="Total Students"
          value={Number(kpis.totalStudents).toLocaleString()}
          subtitle="Registered Candidates"
          icon={GraduationCap}
          color="blue"
        />

        <KPIAnalyticsCard
          title="Failure Rate"
          value={`${kpis.failurePercentage}%`}
          change="-2.2%"
          isPositive
          subtitle="Unsuccessful Candidates"
          icon={AlertCircle}
          color="rose"
        />

        <KPIAnalyticsCard
          title="Backlog Rate"
          value={`${kpis.backlogPercentage}%`}
          change="-1.0%"
          isPositive
          subtitle="Arrears Pending Clearance"
          icon={Layers}
          color="amber"
        />
      </div>

      {/* 4. Charts: Pass Trend Line & Department Comparison Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendLineChart
          title="Multi-Year Pass Percentage Trend"
          subtitle="Institutional academic pass percentage trajectory (2023-24 to 2026-27)"
          data={data.yearlyTrend}
          lines={[
            { key: 'passPercentage', name: 'Overall Pass %', color: '#4f46e5' },
            { key: 'distinction', name: 'Distinction %', color: '#10b981' },
            { key: 'average', name: 'Average %', color: '#3b82f6' },
          ]}
          xAxisKey="year"
          unit="%"
        />

        <ComparisonBarChart
          title="Department-Wise Pass Percentage"
          subtitle="Pass outcome comparison across all 12 academic programs (Click bar to open department)"
          data={data.departmentComparison}
          bars={[{ key: 'passPercentage', name: 'Pass Rate (%)', color: '#6366f1' }]}
          xAxisKey="code"
          unit="%"
          onBarClick={handleBarDrilldown}
        />
      </div>

      {/* 5. Semester-by-Semester Performance Table */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Semester-Wise Performance Matrix</h3>
            <p className="text-xs text-slate-500">Autonomous semester examination outcomes for AY {selectedYear}</p>
          </div>
          <span className="text-xs text-slate-500 font-medium">8 Semesters Evaluated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Academic Semester</th>
                <th className="py-3 px-4">Pass Percentage</th>
                <th className="py-3 px-4">Average Grade Point Score</th>
                <th className="py-3 px-4">Backlog / Arrear %</th>
                <th className="py-3 px-4 text-right">Quality Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {data.semesterPerformance.map((sem, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{sem.semester}</td>
                  <td className="py-3 px-4 font-extrabold text-indigo-700">{sem.passPercentage}%</td>
                  <td className="py-3 px-4 text-slate-700">{sem.averageScore}%</td>
                  <td className="py-3 px-4 text-rose-600 font-semibold">{sem.backlogs}%</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Normal Progress
                    </span>
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
