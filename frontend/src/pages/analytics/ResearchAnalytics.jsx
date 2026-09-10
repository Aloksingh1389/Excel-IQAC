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
  BookOpen, 
  Sparkles, 
  FlaskConical, 
  ArrowLeft, 
  Coins, 
  Rocket, 
  FileCheck2 
} from 'lucide-react';

export const ResearchAnalytics = () => {
  const { data, loading, error, filters, setFilters, resetFilters, selectedYear } =
    useAnalytics('research');

  if (loading || !data) {
    return <Loader message="Loading research & innovation analytics..." />;
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
              Research, Grants & Innovation Analytics
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Extramural sponsored research, patent commercialization, and institutional R&D funding streams.
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
          title="Sponsored Grants Pool"
          value={kpis.researchFunding}
          change="+22.6%"
          isPositive
          subtitle="Govt & Industry Sponsored"
          icon={Coins}
          color="emerald"
        />

        <KPIAnalyticsCard
          title="Active Projects"
          value={kpis.activeProjects}
          subtitle="Sponsored Research Grants"
          icon={FlaskConical}
          color="indigo"
        />

        <KPIAnalyticsCard
          title="Total Patents"
          value={kpis.patents}
          change="+24.1%"
          isPositive
          subtitle="Filed, Published & Granted"
          icon={Sparkles}
          color="amber"
        />

        <KPIAnalyticsCard
          title="Indexed Publications"
          value={kpis.publications}
          change="+14.7%"
          isPositive
          subtitle="Scopus & SCI Papers"
          icon={BookOpen}
          color="blue"
        />

        <KPIAnalyticsCard
          title="Consultancy Revenue"
          value={kpis.consultancyRevenue}
          subtitle="Industry Testing & Solutions"
          icon={Coins}
          color="indigo"
        />

        <KPIAnalyticsCard
          title="Incubated Startups"
          value={kpis.innovationStartups}
          subtitle="IPR Cell Venture Pipeline"
          icon={Rocket}
          color="rose"
        />
      </div>

      {/* Research Trajectory & Patent Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendLineChart
          title="Multi-Year Research Output Growth"
          subtitle="Trajectory of active projects, publications, and patents filed (2023-24 to 2026-27)"
          data={data.yearlyTrend}
          lines={[
            { key: 'publications', name: 'Publications', color: '#4f46e5' },
            { key: 'patents', name: 'Patents', color: '#f59e0b' },
            { key: 'projects', name: 'Active Projects', color: '#10b981' },
          ]}
          xAxisKey="year"
          unit=""
        />

        <DistributionPieChart
          title="Patent Lifecycle & Grant Status"
          subtitle="IPR portfolio distribution from initial filing to formal government patent grant"
          data={data.patentsStatus}
          dataKey="count"
          nameKey="status"
          innerRadius={55}
          outerRadius={85}
        />
      </div>

      {/* Funding Agencies Breakdown */}
      <Card className="p-6 space-y-4">
        <div className="pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Extramural Research Funding by Sponsoring Agency</h3>
          <p className="text-xs text-slate-500">Breakdown of active grants from DST, SERB, AICTE, and Industry CSR sponsors for AY {selectedYear}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.fundingBreakdown.map((agency, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block truncate">{agency.agency}</span>
              <div className="text-xl font-black text-indigo-700">{agency.amount}</div>
              <span className="text-[10px] text-slate-400 font-semibold">{agency.pct}% of Institutional Grants</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
