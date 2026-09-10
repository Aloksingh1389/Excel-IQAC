import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDesignationDisplay } from '../../config/roles';
import { getTimeBasedGreeting } from '../../utils/dateUtils';
import { analyticsService } from '../../services/analyticsService';
import { dashboardService } from '../../services/dashboardService';
import { KPIAnalyticsCard } from '../../components/analytics/KPIAnalyticsCard';
import { TrendLineChart } from '../../components/analytics/TrendLineChart';
import { ComparisonBarChart } from '../../components/analytics/ComparisonBarChart';
import { ManagementAttention } from '../../components/analytics/ManagementAttention';
import { ManagementInsight } from '../../components/analytics/ManagementInsight';
import { QuickActionCard } from '../../components/dashboard/QuickActionCard';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  TrendingUp 
} from 'lucide-react';

export const Dashboard = () => {
  const { user, academicYear } = useAuth();
  const [analyticsOverview, setAnalyticsOverview] = useState(null);
  const [academicData, setAcademicData] = useState(null);
  const [placementData, setPlacementData] = useState(null);
  const [quickActions, setQuickActions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [ovRes, acRes, plRes, actRes, qaRes] = await Promise.all([
          analyticsService.getAnalyticsOverview(academicYear),
          analyticsService.getAcademicAnalytics(academicYear),
          analyticsService.getPlacementAnalytics(academicYear),
          dashboardService.getRecentActivity(),
          dashboardService.getQuickActions(),
        ]);

        if (ovRes.success) setAnalyticsOverview(ovRes);
        if (acRes.success) setAcademicData(acRes);
        if (plRes.success) setPlacementData(plRes);
        if (actRes.success) setActivities(actRes.data);
        if (qaRes.success) setQuickActions(qaRes.data);
      } catch (err) {
        console.error('Error loading dashboard analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [academicYear]);

  if (loading || !analyticsOverview) {
    return <Loader message="Initializing Institutional Command & Management Portal..." />;
  }

  const greeting = getTimeBasedGreeting();
  const designationLabel = getDesignationDisplay(user?.designation, user?.role);
  const isTechnicalDirector = user?.designation === 'TECHNICAL_DIRECTOR';
  const kpis = analyticsOverview.overviewKPIs;

  return (
    <div className="space-y-8">
      {/* 1. Apex Management Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {greeting}, {user?.name}
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide border ${
                isTechnicalDirector
                  ? 'bg-indigo-100 text-indigo-900 border-indigo-200'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-200'
              }`}
            >
              {isTechnicalDirector
                ? 'TECHNICAL DIRECTOR • Institutional Command Dashboard'
                : 'EXECUTIVE DIRECTOR & PRINCIPAL • Institutional Management Dashboard'}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {isTechnicalDirector
              ? 'Apex command authority — Comprehensive monitoring of institution-wide performance, strategic trends, and risk intelligence.'
              : 'Institutional management & operational leadership — Monitoring academic progress, faculty capital, research output, and placements.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 shadow-2xs">
            Cycle: <strong>{academicYear}</strong>
          </span>
          <Link to="/director/analytics">
            <Button variant="primary" size="sm" icon={TrendingUp}>
              Full Analytics Hub
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Management KPI Cards (5 Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <KPIAnalyticsCard
          title="Overall Pass Rate"
          value={`${kpis.academic.passPercentage}%`}
          prevValue={`${kpis.academic.prevPassPercentage}%`}
          change="+2.2%"
          isPositive
          subtitle="Semester Examinations"
          icon={Award}
          color="emerald"
        />

        <KPIAnalyticsCard
          title="Campus Placements"
          value={`${kpis.placement.placementPercentage}%`}
          prevValue={`${kpis.placement.prevPlacementPercentage}%`}
          change="+5.1%"
          isPositive
          subtitle={`${kpis.placement.totalOffers} Job Offers`}
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
          subtitle={`${kpis.research.patents} Patents Granted/Filed`}
          icon={Sparkles}
          color="amber"
        />

        <KPIAnalyticsCard
          title="Total Faculty Strength"
          value={kpis.faculty.totalFaculty}
          subtitle={`${kpis.faculty.phdPercentage}% Doctorates`}
          icon={Users}
          color="indigo"
        />
      </div>

      {/* 3. Trends & Performance Trajectories (2 Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {academicData && (
          <TrendLineChart
            title="Institutional Academic Pass Trajectory"
            subtitle="Autonomous semester examination pass percentage (2023-24 to 2026-27)"
            data={academicData.yearlyTrend}
            lines={[
              { key: 'passPercentage', name: 'Pass Rate (%)', color: '#4f46e5' },
              { key: 'distinction', name: 'Distinction (%)', color: '#10b981' },
            ]}
            xAxisKey="year"
            unit="%"
          />
        )}

        {placementData && (
          <TrendLineChart
            title="Campus Placement & CTC Package Growth"
            subtitle="Placement rate percentage & average salary package (2023-24 to 2026-27)"
            data={placementData.yearlyTrend}
            lines={[
              { key: 'placementRate', name: 'Placement %', color: '#10b981' },
              { key: 'avgPackage', name: 'Avg CTC (LPA)', color: '#3b82f6' },
            ]}
            xAxisKey="year"
            unit=""
          />
        )}
      </div>

      {/* 4. Strategic Insights & Attention Required System */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ManagementInsight insights={analyticsOverview.managementInsights} />
        <ManagementAttention alerts={analyticsOverview.performanceAlerts} />
      </div>

      {/* 5. Department Quick Comparison Snippet */}
      {academicData && (
        <ComparisonBarChart
          title="Department Pass Rate Comparison"
          subtitle="Benchmarking 12 engineering and science programs for current cycle (Click bar for department details)"
          data={academicData.departmentComparison}
          bars={[{ key: 'passPercentage', name: 'Pass Percentage (%)', color: '#6366f1' }]}
          xAxisKey="code"
          unit="%"
        />
      )}

      {/* 6. Quick Actions & Real-Time Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Management Navigation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <QuickActionCard
                key={action.id}
                title={action.title}
                description={action.description}
                path={action.path}
                icon={action.icon}
              />
            ))}
          </div>
        </div>

        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Institutional Activity</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Live Feed</span>
          </div>

          <RecentActivity activities={activities} />
        </Card>
      </div>
    </div>
  );
};
