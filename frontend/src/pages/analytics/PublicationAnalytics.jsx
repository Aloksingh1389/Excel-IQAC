import React from 'react';
import { Link } from 'react-router-dom';
import { useAnalytics } from '../../hooks/useAnalytics';
import { KPIAnalyticsCard } from '../../components/analytics/KPIAnalyticsCard';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { DistributionPieChart } from '../../components/analytics/DistributionPieChart';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { 
  BookOpen, 
  Sparkles, 
  ArrowLeft, 
  TrendingUp, 
  Award, 
  FileText, 
  CheckCircle2 
} from 'lucide-react';

export const PublicationAnalytics = () => {
  const { data, loading, error, filters, setFilters, resetFilters, selectedYear } =
    useAnalytics('publications');

  if (loading || !data) {
    return <Loader message="Loading publication & indexing analytics..." />;
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
              Publication & Bibliometric Analytics
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Scopus, Web of Science, UGC-CARE indexing, citations, and departmental research output.
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
      />

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <KPIAnalyticsCard
          title="Total Publications"
          value={kpis.totalPublications}
          change="+14.7%"
          isPositive
          subtitle="All Peer-Reviewed Output"
          icon={BookOpen}
          color="indigo"
        />

        <KPIAnalyticsCard
          title="Scopus Indexed"
          value={kpis.scopusIndexed}
          subtitle="Q1 to Q4 Journals"
          icon={Award}
          color="blue"
        />

        <KPIAnalyticsCard
          title="Web of Science (SCI)"
          value={kpis.webOfScience}
          subtitle="High Impact Factor Journals"
          icon={Sparkles}
          color="emerald"
        />

        <KPIAnalyticsCard
          title="UGC-CARE Listed"
          value={kpis.ugcCare}
          subtitle="National Approved Repositories"
          icon={FileText}
          color="amber"
        />

        <KPIAnalyticsCard
          title="Citation Count"
          value={Number(kpis.citationCount).toLocaleString()}
          subtitle="Total Academic Citations"
          icon={TrendingUp}
          color="indigo"
        />

        <KPIAnalyticsCard
          title="Average H-Index"
          value={kpis.averageHIndex}
          subtitle="Institutional Research Impact"
          icon={Award}
          color="rose"
        />
      </div>

      {/* Indexing Breakdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DistributionPieChart
          title="Indexing Quality Breakdown"
          subtitle="Distribution of journal indexation standard"
          data={data.indexingBreakdown}
          dataKey="count"
          nameKey="name"
          innerRadius={55}
          outerRadius={85}
          className="lg:col-span-1"
        />

        {/* Department Ranking Table */}
        <Card className="p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Department Research Output Rankings</h3>
              <p className="text-xs text-slate-500">Publication output and indexed paper volume by department for AY {selectedYear}</p>
            </div>
            <span className="text-xs text-slate-400 font-semibold">12 Departments</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-center">Total Papers</th>
                  <th className="py-2.5 px-3 text-center">Indexed (Scopus/SCI)</th>
                  <th className="py-2.5 px-3 text-right">YoY Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {data.departmentRanking.map((dept) => (
                  <tr key={dept.rank} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 font-black text-indigo-700">#{dept.rank}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{dept.department}</td>
                    <td className="py-2.5 px-3 text-center font-extrabold text-slate-900">{dept.publications}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-indigo-600">{dept.indexed}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="font-bold text-emerald-600 inline-flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" />
                        {dept.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
