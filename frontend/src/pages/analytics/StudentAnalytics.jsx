import React from 'react';
import { Link } from 'react-router-dom';
import { useAnalytics } from '../../hooks/useAnalytics';
import { KPIAnalyticsCard } from '../../components/analytics/KPIAnalyticsCard';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { DistributionPieChart } from '../../components/analytics/DistributionPieChart';
import { ComparisonBarChart } from '../../components/analytics/ComparisonBarChart';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { 
  Users, 
  GraduationCap, 
  Trophy, 
  Award, 
  ArrowLeft, 
  UserCheck, 
  BookOpen, 
  ArrowRight,
  TrendingUp 
} from 'lucide-react';

export const StudentAnalytics = () => {
  const { data, loading, error, filters, setFilters, resetFilters, selectedYear } =
    useAnalytics('students');

  if (loading || !data) {
    return <Loader message="Loading student demographics and analytics..." />;
  }

  const kpis = data.kpis;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <Link to="/director/analytics">
            <Button variant="ghost" size="xs" icon={ArrowLeft}>
              Analytics
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Student Demographics & Progression Analytics
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Enrollment distribution, gender diversity, graduation progression, and extracurricular accolades.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          AY: {selectedYear}
        </span>
      </div>

      {/* Filter Bar */}
      <AnalyticsFilterBar
        filters={filters}
        onFilterChange={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
        onReset={resetFilters}
        showDepartment
        showProgram
      />

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <KPIAnalyticsCard
          title="Total Students"
          value={Number(kpis.totalStudents).toLocaleString()}
          subtitle="UG & PG Enrolled"
          icon={Users}
          color="indigo"
        />

        <KPIAnalyticsCard
          title="New Admissions"
          value={Number(kpis.newAdmissions).toLocaleString()}
          subtitle="First Year Intake"
          icon={UserCheck}
          color="emerald"
        />

        <KPIAnalyticsCard
          title="Graduating Students"
          value={Number(kpis.graduatingStudents).toLocaleString()}
          subtitle="Final Year Outgoing"
          icon={GraduationCap}
          color="blue"
        />

        <KPIAnalyticsCard
          title="Female Enrollment"
          value={`${Math.round((kpis.femaleStudents / kpis.totalStudents) * 100)}%`}
          subtitle={`${kpis.femaleStudents} Female Students`}
          icon={Users}
          color="rose"
        />

        <KPIAnalyticsCard
          title="Student Accolades"
          value={kpis.studentAchievements}
          subtitle="Hackathons & Awards"
          icon={Trophy}
          color="amber"
        />

        <KPIAnalyticsCard
          title="Certifications"
          value={Number(kpis.certificationsCount).toLocaleString()}
          subtitle="NPTEL, Coursera & Cisco"
          icon={Award}
          color="indigo"
        />
      </div>

      {/* Two Column Charts: Gender Donut & Department Distribution Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistributionPieChart
          title="Gender Diversity Distribution"
          subtitle="Institutional male vs female student representation for AY 2026-27"
          data={data.genderDistribution}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={90}
        />

        <ComparisonBarChart
          title="Department-Wise Student Strength"
          subtitle="Total enrolled student cohort distribution across engineering disciplines"
          data={data.departmentDistribution}
          bars={[{ key: 'count', name: 'Students Enrolled', color: '#3b82f6' }]}
          xAxisKey="name"
          unit=" Students"
        />
      </div>

      {/* Student Progression Funnel & Achievement Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progression Funnel */}
        <Card className="p-6 space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Student Lifecycle Progression Funnel</h3>
            <p className="text-xs text-slate-500">Intake retention, academic course completion, and outcome transitions</p>
          </div>

          <div className="space-y-3">
            {data.progressionFunnel.map((step, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    {step.stage}
                  </span>
                  <span className="font-extrabold text-slate-900">
                    {Number(step.count).toLocaleString()} ({step.percentage}%)
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(step.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Student Achievements by Domain */}
        <Card className="p-6 space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Student Accolades by Domain</h3>
            <p className="text-xs text-slate-500">Distribution of national hackathons, technical papers, and athletic recognitions</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {data.achievementCategories.map((cat, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
                  {cat.category}
                </span>
                <div className="text-2xl font-black text-slate-900" style={{ color: cat.color }}>
                  {cat.count}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Verified Recognitions</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
