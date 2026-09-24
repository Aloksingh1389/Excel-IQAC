import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { SubmissionStatusBadge } from './SubmissionStatusBadge';
import { SUBMISSION_STATUS } from '../../config/submissionStatuses';
import { SUBMISSION_TYPES, SUBMISSION_TYPE_LABELS } from '../../config/submissionTypes';
import { Search, Filter, Eye, ArrowUpDown, Clock, CheckCircle2, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SubmissionTable = ({
  submissions = [],
  departments = [],
  onActionClick,
  hideDepartmentFilter = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [sortField, setSortField] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case 'URGENT':
      case 'HIGH':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'MEDIUM':
      case 'NORMAL':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredSubmissions = useMemo(() => {
    return submissions
      .filter((sub) => {
        const matchesQuery =
          sub.submissionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.departmentCode.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;
        const matchesType = typeFilter === 'ALL' || sub.type === typeFilter;
        const matchesDept = deptFilter === 'ALL' || sub.departmentCode === deptFilter;

        return matchesQuery && matchesStatus && matchesType && matchesDept;
      })
      .sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [submissions, searchQuery, statusFilter, typeFilter, deptFilter, sortField, sortOrder]);

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      {/* Header & Control Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Institutional Submissions Directory
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Search, filter & review submitted records across institutional quality workflows
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Bar */}
          <div className="relative shrink-0 w-full sm:w-52">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, title, submitter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50"
            />
          </div>

          {/* Status Filter */}
          <div className="relative shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer appearance-none"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(SUBMISSION_STATUS).map((st) => (
                <option key={st} value={st}>
                  {st.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Submission Type Filter */}
          <div className="relative shrink-0">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer appearance-none"
            >
              <option value="ALL">All Submission Types</option>
              {Object.keys(SUBMISSION_TYPES).map((key) => (
                <option key={key} value={key}>
                  {SUBMISSION_TYPE_LABELS[key]}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Department Filter */}
          {!hideDepartmentFilter && departments.length > 0 && (
            <div className="relative shrink-0">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="pl-3 pr-8 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer appearance-none"
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.code}>
                    {d.code}
                  </option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 custom-scroll">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
              <th
                onClick={() => handleSort('submissionId')}
                className="p-3 cursor-pointer hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-1">
                  <span>Submission ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3">Type & Title</th>
              <th className="p-3">Submitted By</th>
              <th className="p-3 text-center">Dept</th>
              <th className="p-3 text-center">Current Reviewer</th>
              <th className="p-3 text-center">Priority</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
                  No submissions found matching selected filters.
                </td>
              </tr>
            ) : (
              filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-3 font-bold text-indigo-900 whitespace-nowrap">
                    {sub.submissionId}
                  </td>

                  <td className="p-3">
                    <div className="space-y-0.5 max-w-xs">
                      <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
                        {sub.typeLabel || sub.type}
                      </span>
                      <p className="font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition truncate">
                        {sub.title}
                      </p>
                    </div>
                  </td>

                  <td className="p-3">
                    <p className="font-semibold text-slate-800 leading-tight">
                      {sub.submittedBy}
                    </p>
                    <p className="text-[10px] text-slate-400 font-normal">
                      {sub.submittedByRole.replace(/_/g, ' ')}
                    </p>
                  </td>

                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 font-black text-slate-800 text-[11px]">
                      {sub.departmentCode}
                    </span>
                  </td>

                  <td className="p-3 text-center text-slate-600 font-semibold text-[11px]">
                    {sub.currentReviewerName || sub.currentReviewerRole || '—'}
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase ${getPriorityBadge(
                        sub.priority
                      )}`}
                    >
                      {sub.priority}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <SubmissionStatusBadge status={sub.status} />
                  </td>

                  <td className="p-3 text-right">
                    <Link
                      to={`/iqac/submissions/${sub.id}`}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
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
