import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { DepartmentScorecard } from '../../components/analytics/DepartmentScorecard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { 
  BarChart3, 
  ArrowLeft, 
  ChevronRight, 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Sparkles,
  Info 
} from 'lucide-react';

export const DepartmentComparison = () => {
  const navigate = useNavigate();
  const { data, loading, error, filters, setFilters, resetFilters, selectedYear } =
    useAnalytics('departments');

  const [sortField, setSortField] = useState('overallScore');
  const [sortAsc, setSortAsc] = useState(false);

  if (loading || !data) {
    return <Loader message="Loading departmental scorecards and comparisons..." />;
  }

  const scorecards = data.scorecards || [];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedScorecards = [...scorecards].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    valA = Number(valA) || 0;
    valB = Number(valB) || 0;
    return sortAsc ? valA - valB : valB - valA;
  });

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
              Department Comparison & Quality Scorecards
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Multidimensional institutional performance matrix across all 12 academic programs.
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

      {/* Department Scorecard (Rankings + 6-Pillar Details) */}
      <DepartmentScorecard scorecards={scorecards} />

      {/* Comprehensive Multi-Metric Comparison Matrix Table */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Institutional Cross-Department Quality Matrix</h3>
            <p className="text-xs text-slate-500">Click column header to sort departments by specific metric</p>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{scorecards.length} Programs Evaluated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider select-none">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('name')}>
                  Department
                </th>
                <th className="py-3 px-3 text-center cursor-pointer hover:text-indigo-600" onClick={() => handleSort('overallScore')}>
                  Overall Score (100)
                </th>
                <th className="py-3 px-3 text-center cursor-pointer hover:text-indigo-600" onClick={() => handleSort('academic')}>
                  Pass %
                </th>
                <th className="py-3 px-3 text-center cursor-pointer hover:text-indigo-600" onClick={() => handleSort('placement')}>
                  Placement %
                </th>
                <th className="py-3 px-3 text-center cursor-pointer hover:text-indigo-600" onClick={() => handleSort('research')}>
                  Research
                </th>
                <th className="py-3 px-3 text-center cursor-pointer hover:text-indigo-600" onClick={() => handleSort('faculty')}>
                  FDP %
                </th>
                <th className="py-3 px-3 text-center cursor-pointer hover:text-indigo-600" onClick={() => handleSort('studentDev')}>
                  Student Dev
                </th>
                <th className="py-3 px-3 text-right">Drill-Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sortedScorecards.map((dept, index) => (
                <tr key={dept.id} className="hover:bg-slate-50/80 transition group">
                  <td className="py-3 px-3 font-black text-indigo-700">#{dept.rank || index + 1}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition truncate max-w-xs">
                      {dept.name}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{dept.code}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-50 text-indigo-900 border border-indigo-200">
                      {dept.overallScore} / 100
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-700">{dept.academic}%</td>
                  <td className="py-3 px-3 text-center font-bold text-blue-700">{dept.placement}%</td>
                  <td className="py-3 px-3 text-center font-bold text-indigo-600">{dept.research}</td>
                  <td className="py-3 px-3 text-center font-semibold text-slate-700">{dept.faculty}%</td>
                  <td className="py-3 px-3 text-center font-semibold text-purple-700">{dept.studentDev}</td>
                  <td className="py-3 px-3 text-right">
                    <Link to={`/director/institution/departments/${dept.id}`}>
                      <Button variant="ghost" size="xs" className="text-indigo-600 hover:text-indigo-800">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
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
