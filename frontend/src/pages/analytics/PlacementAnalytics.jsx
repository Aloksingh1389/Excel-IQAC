import React from 'react';
import { Link } from 'react-router-dom';
import { useAnalytics } from '../../hooks/useAnalytics';
import { KPIAnalyticsCard } from '../../components/analytics/KPIAnalyticsCard';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { TrendLineChart } from '../../components/analytics/TrendLineChart';
import { DistributionPieChart } from '../../components/analytics/DistributionPieChart';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { 
  Briefcase, 
  Award, 
  ArrowLeft, 
  Coins, 
  Building2, 
  GraduationCap, 
  TrendingUp 
} from 'lucide-react';

export const PlacementAnalytics = () => {
  const { data, loading, error, filters, setFilters, resetFilters, selectedYear } =
    useAnalytics('placement');

  if (loading || !data) {
    return <Loader message="Loading placement & career outcome analytics..." />;
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
              Training & Campus Placement Analytics
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Graduation employment outcomes, corporate salary distributions, recruiter participation, and internships.
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
          title="Placement Rate"
          value={`${kpis.placementPercentage}%`}
          prevValue={`${kpis.prevPlacementPercentage}%`}
          change="+5.1%"
          isPositive
          subtitle={`${kpis.placedStudents} of ${kpis.eligibleStudents} Placed`}
          icon={Briefcase}
          color="emerald"
        />

        <KPIAnalyticsCard
          title="Highest Package"
          value={kpis.highestPackage}
          subtitle="Top Super Dream Offer"
          icon={Award}
          color="amber"
        />

        <KPIAnalyticsCard
          title="Average CTC"
          value={kpis.averagePackage}
          change="+9.8%"
          isPositive
          subtitle="Across All Placed Cadres"
          icon={Coins}
          color="blue"
        />

        <KPIAnalyticsCard
          title="Total Job Offers"
          value={kpis.totalOffers}
          subtitle="Includes Multi-Offer Students"
          icon={Award}
          color="indigo"
        />

        <KPIAnalyticsCard
          title="Visiting Companies"
          value={kpis.companiesVisited}
          subtitle="Tier-1 & Core Recruiters"
          icon={Building2}
          color="indigo"
        />

        <KPIAnalyticsCard
          title="Paid Internships"
          value={kpis.internships}
          subtitle="Industry PPO Conversions"
          icon={GraduationCap}
          color="rose"
        />
      </div>

      {/* Placement Trend & Package Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendLineChart
          title="Multi-Year Placement Trajectory"
          subtitle="Placement percentage and average CTC package growth (2023-24 to 2026-27)"
          data={data.yearlyTrend}
          lines={[
            { key: 'placementRate', name: 'Placement Rate (%)', color: '#10b981' },
            { key: 'avgPackage', name: 'Average CTC (LPA)', color: '#4f46e5' },
          ]}
          xAxisKey="year"
          unit=""
        />

        <DistributionPieChart
          title="Salary Package Band Distribution"
          subtitle="Offers categorized by Super Dream, Dream, Core, and Standard CTC tiers"
          data={data.packageDistribution}
          dataKey="count"
          nameKey="range"
          innerRadius={55}
          outerRadius={85}
        />
      </div>

      {/* Department-Wise Placement Comparison Table */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Department-Wise Placement Standing</h3>
            <p className="text-xs text-slate-500">Recruitment outcomes and average compensation package by engineering branch</p>
          </div>
          <span className="text-xs text-slate-400 font-semibold">12 Departments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Placement %</th>
                <th className="py-2.5 px-3 text-center">Total Offers</th>
                <th className="py-2.5 px-3 text-center">Average CTC Package</th>
                <th className="py-2.5 px-3 text-right">Recruitment Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {data.departmentPlacementSummary.map((dept, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{dept.department}</td>
                  <td className="py-2.5 px-3 font-extrabold text-emerald-700">{dept.rate}%</td>
                  <td className="py-2.5 px-3 text-center font-semibold text-indigo-700">{dept.offers} Offers</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-800">₹{dept.avgPackage} LPA</td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        dept.rate >= 90
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : dept.rate >= 80
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {dept.rate >= 90 ? 'Tier-1 High' : dept.rate >= 80 ? 'Standard Good' : 'Needs Expansion'}
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
