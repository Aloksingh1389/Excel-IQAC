import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { MetricReadinessBadge } from './MetricReadinessBadge';
import { METRIC_READINESS_STATUS } from '../../config/accreditationFrameworkConfig';
import { Search, Filter, Eye, ArrowUpDown, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MetricTable = ({ metrics = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredMetrics = useMemo(() => {
    return metrics.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        m.code.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || m.readinessStatus === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [metrics, searchQuery, statusFilter]);

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            NAAC Accreditation Metrics Directory
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Quantitative & qualitative metrics, completion %, evidence verification & owner assignment
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative shrink-0 w-full sm:w-52">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search code, metric name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
            />
          </div>

          <div className="relative shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none cursor-pointer appearance-none"
            >
              <option value="ALL">All Readiness</option>
              {Object.values(METRIC_READINESS_STATUS).map((st) => (
                <option key={st} value={st}>
                  {st.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 custom-scroll text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b font-bold uppercase tracking-wider">
              <th className="p-3">Metric Code</th>
              <th className="p-3">Metric Name & Description</th>
              <th className="p-3 text-center">Type</th>
              <th className="p-3 text-center">Scope</th>
              <th className="p-3 text-center">Target</th>
              <th className="p-3 text-center">Completion %</th>
              <th className="p-3 text-center">Readiness Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredMetrics.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
                  No accreditation metrics found.
                </td>
              </tr>
            ) : (
              filteredMetrics.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-3 font-extrabold text-indigo-900 whitespace-nowrap">
                    {m.code}
                  </td>

                  <td className="p-3">
                    <div className="space-y-0.5 max-w-xs">
                      <p className="font-bold text-slate-900 leading-tight truncate group-hover:text-indigo-600 transition">
                        {m.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {m.description}
                      </p>
                    </div>
                  </td>

                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-slate-100 text-slate-700">
                      {m.type}
                    </span>
                  </td>

                  <td className="p-3 text-center font-bold text-slate-800">
                    {m.applicableScope}
                  </td>

                  <td className="p-3 text-center font-bold text-emerald-800">
                    {m.target || 'N/A'} {m.unit === 'PERCENTAGE' ? '%' : ''}
                  </td>

                  <td className="p-3 text-center font-black text-indigo-950">
                    {m.completionPercentage}%
                  </td>

                  <td className="p-3 text-center">
                    <MetricReadinessBadge status={m.readinessStatus} />
                  </td>

                  <td className="p-3 text-right whitespace-nowrap">
                    <Link
                      to={`/accreditation/metrics/${m.id}`}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
