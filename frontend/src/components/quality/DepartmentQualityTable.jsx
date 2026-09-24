import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { QualityStatusBadge } from './QualityStatusBadge';
import { Search, Filter, Eye, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DepartmentQualityTable = ({ scorecards = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredScorecards = useMemo(() => {
    return scorecards
      .filter((sc) => {
        const q = searchQuery.toLowerCase().trim();
        return !q || sc.code.toLowerCase().includes(q) || sc.name.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        let aVal = a[sortField] || 0;
        let bVal = b[sortField] || 0;
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [scorecards, searchQuery, sortField, sortOrder]);

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Department Quality Performance Scorecards
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Aggregated quality score, compliance %, evidence completeness & action item resolution per department
          </p>
        </div>

        <div className="relative shrink-0 w-full sm:w-52">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search department code or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 custom-scroll">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b font-bold uppercase tracking-wider">
              <th className="p-3">Department</th>
              <th
                onClick={() => handleSort('score')}
                className="p-3 cursor-pointer hover:bg-slate-100 transition text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Quality Score</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3 text-center">Compliance %</th>
              <th className="p-3 text-center">Evidence %</th>
              <th className="p-3 text-center">Actions %</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Drill-Down</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredScorecards.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                  No department scorecards found matching search query.
                </td>
              </tr>
            ) : (
              filteredScorecards.map((sc) => (
                <tr key={sc.code} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-3">
                    <p className="font-extrabold text-slate-900 leading-tight">{sc.code}</p>
                    <p className="text-[10px] text-slate-400">{sc.name}</p>
                  </td>

                  <td className="p-3 text-center">
                    <span className="text-sm font-black text-indigo-950">{sc.score} / 100</span>
                  </td>

                  <td className="p-3 text-center font-bold text-slate-800">{sc.compliance}%</td>
                  <td className="p-3 text-center font-bold text-slate-800">{sc.evidence}%</td>
                  <td className="p-3 text-center font-bold text-slate-800">{sc.actions}%</td>

                  <td className="p-3 text-center">
                    <QualityStatusBadge score={sc.score} rating={sc.status} />
                  </td>

                  <td className="p-3 text-right">
                    <Link
                      to={`/iqac/quality-monitoring/departments/${sc.code}`}
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
