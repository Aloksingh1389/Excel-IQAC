import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Search, Filter, Eye, ArrowUpDown, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ImprovementPlanTable = ({ plans = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredPlans = useMemo(() => {
    return plans.filter((ip) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        ip.planId.toLowerCase().includes(q) ||
        ip.title.toLowerCase().includes(q) ||
        ip.ownerName.toLowerCase().includes(q) ||
        ip.departmentCode.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || ip.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [plans, searchQuery, statusFilter]);

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'ON_TRACK':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">ON TRACK</span>;
      case 'AT_RISK':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">AT RISK</span>;
      case 'OVERDUE':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-50 text-rose-800 border border-rose-300">OVERDUE</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">COMPLETED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Quality Improvement Plans Directory
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Active department interventions, target benchmarks & Stage 5E action item linkages
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative shrink-0 w-full sm:w-52">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search plan ID, title, owner..."
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
              <option value="ALL">All Statuses</option>
              <option value="ON_TRACK">On Track</option>
              <option value="AT_RISK">At Risk</option>
              <option value="OVERDUE">Overdue</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 custom-scroll">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b font-bold uppercase tracking-wider">
              <th className="p-3">Plan ID</th>
              <th className="p-3">Plan Title & Indicator</th>
              <th className="p-3">Assigned Owner</th>
              <th className="p-3 text-center">Dept</th>
              <th className="p-3 text-center">Target Date</th>
              <th className="p-3 text-center">Progress %</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredPlans.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
                  No improvement plans found.
                </td>
              </tr>
            ) : (
              filteredPlans.map((ip) => (
                <tr key={ip.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-3 font-bold text-indigo-900 whitespace-nowrap">
                    {ip.planId}
                  </td>

                  <td className="p-3">
                    <div className="space-y-0.5 max-w-xs">
                      <p className="font-bold text-slate-900 leading-tight truncate group-hover:text-indigo-600 transition">
                        {ip.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        Indicator: {ip.indicatorName}
                      </p>
                    </div>
                  </td>

                  <td className="p-3 font-semibold text-slate-800">
                    {ip.ownerName}
                  </td>

                  <td className="p-3 text-center font-bold text-slate-800">
                    {ip.departmentCode}
                  </td>

                  <td className="p-3 text-center font-bold text-slate-800">
                    {ip.targetDate}
                  </td>

                  <td className="p-3 text-center">
                    <div className="space-y-1 w-20 mx-auto">
                      <div className="flex justify-between text-[10px] font-bold text-slate-700">
                        <span>{ip.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                          style={{ width: `${ip.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="p-3 text-center">
                    {renderStatusBadge(ip.status)}
                  </td>

                  <td className="p-3 text-right">
                    <Link
                      to={`/iqac/improvement-plans/${ip.id}`}
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
