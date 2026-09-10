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
  Award, 
  BookOpen, 
  ArrowLeft, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2 
} from 'lucide-react';

export const FacultyAnalytics = () => {
  const { data, loading, error, filters, setFilters, resetFilters, selectedYear } =
    useAnalytics('faculty');

  if (loading || !data) {
    return <Loader message="Loading faculty human capital analytics..." />;
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
              Faculty & Human Capital Analytics
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Academic qualification profiles, cadre ratios, industry immersion, and professional development.
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
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
        <KPIAnalyticsCard
          title="Total Faculty Strength"
          value={kpis.totalFaculty}
          subtitle="Full-Time Regular Teaching Cadre"
          icon={Users}
          color="indigo"
        />

        <KPIAnalyticsCard
          title="Ph.D. Qualified Faculty"
          value={kpis.phdFaculty}
          subtitle={`${Math.round((kpis.phdFaculty / kpis.totalFaculty) * 100)}% Doctorates`}
          icon={GraduationCap}
          color="emerald"
        />

        <KPIAnalyticsCard
          title="Industry Experience"
          value={kpis.industryExperienceCount}
          subtitle="Faculty with Corporate Background"
          icon={Briefcase}
          color="blue"
        />

        <KPIAnalyticsCard
          title="FDP Participation Rate"
          value={`${kpis.fdpParticipationRate}%`}
          subtitle="AICTE ATAL / NPTEL Training"
          icon={Award}
          color="amber"
        />
      </div>

      {/* Charts: Qualification Donut & Designation Cadre Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistributionPieChart
          title="Faculty Academic Qualification Profile"
          subtitle="Highest doctoral vs postgraduate degree attainment"
          data={data.qualificationDistribution}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={85}
        />

        <ComparisonBarChart
          title="Academic Cadre Distribution"
          subtitle="Cadre ratio breakdown across Professors, Associate, and Assistant Professors"
          data={data.designationDistribution}
          bars={[{ key: 'count', name: 'Faculty Count', color: '#4f46e5' }]}
          xAxisKey="name"
          unit=" Faculty"
        />
      </div>

      {/* Department-Wise FDP Training Participation */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Department-Wise Faculty Development (FDP) Compliance</h3>
            <p className="text-xs text-slate-500">Continuous pedagogical and research upskilling across departments for AY {selectedYear}</p>
          </div>
          <span className="text-xs text-slate-400 font-semibold">12 Departments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">FDP Participation %</th>
                <th className="py-3 px-4">Average Training Hours / Faculty</th>
                <th className="py-3 px-4 text-right">NBA/NAAC Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {data.fdpParticipationByDept.map((dept, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{dept.department}</td>
                  <td className="py-3 px-4 font-extrabold text-indigo-700">{dept.rate}%</td>
                  <td className="py-3 px-4 text-slate-700 font-semibold">{dept.hours} Hours / Year</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        dept.rate >= 85
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : dept.rate >= 75
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {dept.rate >= 85 ? 'Exemplary' : dept.rate >= 75 ? 'Compliant' : 'Needs Review'}
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
