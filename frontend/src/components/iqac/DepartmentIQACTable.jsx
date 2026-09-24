import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { IQACStatusBadge } from './IQACStatusBadge';
import { Search, Filter, ArrowUpDown, ChevronRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DepartmentIQACTable = ({ departments = [], onSelectDepartment }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState('code');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredDepartments = useMemo(() => {
    return departments
      .filter((dept) => {
        const matchesQuery =
          dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dept.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
          statusFilter === 'ALL' || dept.overallStatus === statusFilter;
        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [departments, searchQuery, statusFilter, sortField, sortOrder]);

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Department IQAC Performance & Monitoring
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Comparative institutional quality metrics, evidence verification & submission progress
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Input */}
          <div className="relative shrink-0 w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer appearance-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ON_TRACK">On Track</option>
              <option value="ATTENTION_REQUIRED">Attention Required</option>
              <option value="OVERDUE">Overdue</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 custom-scroll">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
              <th
                onClick={() => handleSort('name')}
                className="p-3 cursor-pointer hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-1.5">
                  <span>Department</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3">Coordinator</th>
              <th
                onClick={() => handleSort('staffCount')}
                className="p-3 text-center cursor-pointer hover:bg-slate-100 transition"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Staff</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('completedSubmissions')}
                className="p-3 text-center cursor-pointer hover:bg-slate-100 transition"
              >
                Completed
              </th>
              <th className="p-3 text-center">Pending</th>
              <th className="p-3 text-center">Evidence</th>
              <th className="p-3 text-center">Verification</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredDepartments.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-500 font-medium">
                  No department IQAC records found matching search filters.
                </td>
              </tr>
            ) : (
              filteredDepartments.map((dept) => {
                const totalSub = dept.completedSubmissions + dept.pendingSubmissions;
                const completionPct = Math.round(
                  (dept.completedSubmissions / (totalSub || 1)) * 100
                );

                return (
                  <tr
                    key={dept.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-900 font-black text-xs flex items-center justify-center shrink-0">
                          {dept.code}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">
                            {dept.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-normal">
                            Code: {dept.code} &bull; Students: {dept.studentCount}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <p className="text-slate-800 font-semibold truncate max-w-[140px]">
                        {dept.iqacCoordinatorId || 'Prof. Coordinator'}
                      </p>
                      <p className="text-[10px] text-slate-400">IQAC Lead</p>
                    </td>

                    <td className="p-3 text-center font-bold text-slate-700">
                      {dept.staffCount}
                    </td>

                    <td className="p-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-bold text-emerald-700">
                          {dept.completedSubmissions}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({completionPct}%)
                        </span>
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`font-bold ${
                          dept.pendingSubmissions > 5
                            ? 'text-amber-600'
                            : 'text-slate-600'
                        }`}
                      >
                        {dept.pendingSubmissions}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-bold text-slate-800">
                          {dept.evidenceUploaded}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-medium">
                          {dept.evidenceVerified} Verified
                        </span>
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      <IQACStatusBadge status={dept.verificationStatus} />
                    </td>

                    <td className="p-3 text-center">
                      <IQACStatusBadge status={dept.overallStatus} />
                    </td>

                    <td className="p-3 text-right">
                      <Link
                        to={`/iqac/monitoring?dept=${dept.code}`}
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
