import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { ActionItemStatusBadge } from './ActionItemStatusBadge';
import { ACTION_STATUS } from '../../config/activityConfig';
import { Search, Filter, Eye, CheckSquare, Clock, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ActionItemTable = ({
  actionItems = [],
  departments = [],
  hideDepartmentFilter = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [sortField, setSortField] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredActionItems = useMemo(() => {
    return actionItems
      .filter((ai) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          ai.actionItemId.toLowerCase().includes(q) ||
          ai.title.toLowerCase().includes(q) ||
          ai.assignedTo.toLowerCase().includes(q) ||
          (ai.meetingTitle && ai.meetingTitle.toLowerCase().includes(q));

        const matchesStatus = statusFilter === 'ALL' || ai.status === statusFilter;
        const matchesPriority = priorityFilter === 'ALL' || ai.priority === priorityFilter;
        const matchesDept = deptFilter === 'ALL' || ai.departmentCode === deptFilter;

        return matchesQuery && matchesStatus && matchesPriority && matchesDept;
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
  }, [actionItems, searchQuery, statusFilter, priorityFilter, deptFilter, sortField, sortOrder]);

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            IQAC Action Items & Resolution Assignment Directory
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Monitor resolution implementation, assigned owner deadlines, progress % & evidence links
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative shrink-0 w-full sm:w-52">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Action ID, title, owner..."
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
              {Object.values(ACTION_STATUS).map((st) => (
                <option key={st} value={st}>
                  {st.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative shrink-0">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none cursor-pointer appearance-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {!hideDepartmentFilter && departments.length > 0 && (
            <div className="relative shrink-0">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="pl-3 pr-8 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none cursor-pointer appearance-none"
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

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 custom-scroll">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
              <th
                onClick={() => handleSort('actionItemId')}
                className="p-3 cursor-pointer hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-1">
                  <span>Action ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3">Title & Meeting Origin</th>
              <th className="p-3">Assigned Owner</th>
              <th className="p-3 text-center">Dept</th>
              <th
                onClick={() => handleSort('dueDate')}
                className="p-3 cursor-pointer hover:bg-slate-100 transition text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Due Date</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3 text-center">Priority</th>
              <th className="p-3 text-center">Progress %</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredActionItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-500 font-medium">
                  No action items found matching current filters.
                </td>
              </tr>
            ) : (
              filteredActionItems.map((ai) => (
                <tr key={ai.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-3 font-bold text-indigo-900 whitespace-nowrap">
                    {ai.actionItemId}
                  </td>

                  <td className="p-3">
                    <div className="space-y-0.5 max-w-xs">
                      <p className="font-bold text-slate-900 leading-tight truncate group-hover:text-indigo-600 transition">
                        {ai.title}
                      </p>
                      {ai.meetingTitle && (
                        <p className="text-[10px] text-slate-400 truncate">
                          Origin: {ai.meetingTitle}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="p-3">
                    <p className="font-semibold text-slate-800 leading-tight">{ai.assignedTo}</p>
                    <p className="text-[10px] text-slate-400">{ai.assignedToRole.replace(/_/g, ' ')}</p>
                  </td>

                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 font-black text-slate-800 text-[11px]">
                      {ai.departmentCode}
                    </span>
                  </td>

                  <td className="p-3 text-center font-bold text-slate-800">
                    {ai.dueDate}
                  </td>

                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-blue-100 text-blue-900 border border-blue-200">
                      {ai.priority}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <div className="space-y-1 w-20 mx-auto">
                      <div className="flex justify-between text-[10px] font-bold text-slate-700">
                        <span>{ai.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                          style={{ width: `${ai.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="p-3 text-center">
                    <ActionItemStatusBadge status={ai.status} />
                  </td>

                  <td className="p-3 text-right whitespace-nowrap">
                    <Link
                      to={`/iqac/action-items/${ai.id}`}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Track</span>
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
