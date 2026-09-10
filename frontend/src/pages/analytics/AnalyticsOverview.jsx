import React from 'react';
import { Link } from 'react-router-dom';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useAuth } from '../../context/AuthContext';
import { getDesignationDisplay } from '../../config/roles';
import { KPIAnalyticsCard } from '../../components/analytics/KPIAnalyticsCard';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { TrendLineChart } from '../../components/analytics/TrendLineChart';
import { ComparisonBarChart } from '../../components/analytics/ComparisonBarChart';
import { DistributionPieChart } from '../../components/analytics/DistributionPieChart';
import { ManagementAttention } from '../../components/analytics/ManagementAttention';
import { ManagementInsight } from '../../components/analytics/ManagementInsight';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import { 
  BarChart3, 
  GraduationCap, 
  Users, 
  BookOpen, 
  Briefcase, 
  Award, 
  ArrowRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export const AnalyticsOverview = () => {
  const { user } = useAuth();
  const { data, loading, error, filters, setFilters, resetFilters, selectedYear } =
    useAnalytics('overview');

  if (loading || !data) {
    return <Loader message={`Loading institutional analytics for Academic Year ${selectedYear}...`} />;
  }

  const kpis = data.overviewKPIs;
  const isTechnicalDirector = user?.designation === 'TECHNICAL_DIRECTOR';

  return (
    <div className="space-y-8">
      {/* 1. Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              {isTechnicalDirector ? 'Institutional Command Analytics' : 'Management Analytics'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Institutional Analytics Hub
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Cross-functional decision support across academics, faculty capital, research, and placements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Active Cycle: {selectedYear}
          </span>
          <Link to="/director/analytics/departments">
            <Button variant="outline" size="sm" icon={BarChart3}>
              Department Scorecards
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Global Analytics Filter Bar */}
      <AnalyticsFilterBar
        filters={filters}
        onFilterChange={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
        onReset={resetFilters}
        showDepartment
        showProgram
      />

      {/* 3. Five-Pillar Key Performance Indicators (5 Grid Cards) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Institutional Core Indicators (AY {selectedYear} vs {data.compareYear})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <KPIAnalyticsCard
            title="Overall Pass Rate"
            value={`${kpis.academic.passPercentage}%`}
            prevValue={`${kpis.academic.prevPassPercentage}%`}
            change="+2.2%"
            isPositive
            subtitle="Autonomous Semester Exams"
            icon={Award}
            color="emerald"
          />

          <KPIAnalyticsCard
            title="Campus Placements"
            value={`${kpis.placement.placementPercentage}%`}
            prevValue={`${kpis.placement.prevPlacementPercentage}%`}
            change="+5.1%"
            isPositive
            subtitle={`${kpis.placement.totalOffers} Total Offers`}
            icon={Briefcase}
            color="blue"
          />

          <KPIAnalyticsCard
            title="Research Grants"
            value={kpis.research.totalFunding}
            change="+22.6%"
            isPositive
            subtitle={`${kpis.research.activeProjects} Active Projects`}
            icon={BookOpen}
            color="indigo"
          />

          <KPIAnalyticsCard
            title="Publications (SCI/Scopus)"
            value={kpis.research.publications}
            change="+14.7%"
            isPositive
            subtitle={`${kpis.research.patents} Patents Filed & Granted`}
            icon={Sparkles}
            color="amber"
          />

          <KPIAnalyticsCard
            title="Ph.D. Faculty Ratio"
            value={`${kpis.faculty.phdPercentage}%`}
            change="+4.3%"
            isPositive
            subtitle={`${kpis.faculty.totalFaculty} Total Faculty`}
            icon={Users}
            color="indigo"
          />
        </div>
      </div>

      {/* 4. Cross-Module Navigation Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Academic Analytics', path: '/director/analytics/academic', icon: GraduationCap },
          { label: 'Student Demographics', path: '/director/analytics/students', icon: Users },
          { label: 'Faculty Analytics', path: '/director/analytics/faculty', icon: Users },
          { label: 'Research & Grants', path: '/director/analytics/research', icon: BookOpen },
          { label: 'Publications & IPR', path: '/director/analytics/publications', icon: Sparkles },
          { label: 'Placement Records', path: '/director/analytics/placement', icon: Briefcase },
        ].map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.path}
              to={mod.path}
              className="p-3 bg-white hover:bg-indigo-50/60 rounded-xl border border-slate-200/90 hover:border-indigo-200 shadow-2xs transition flex items-center justify-between text-xs font-bold text-slate-800 hover:text-indigo-700 group"
            >
              <div className="flex items-center gap-2 truncate">
                <Icon className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">{mod.label}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
            </Link>
          );
        })}
      </div>

      {/* 5. Rule-Based Strategic Insights & Risk Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ManagementInsight insights={data.managementInsights} />
        <ManagementAttention alerts={data.performanceAlerts} />
      </div>
    </div>
  );
};
