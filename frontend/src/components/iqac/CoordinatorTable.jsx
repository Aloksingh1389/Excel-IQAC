import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { CoordinatorStatusBadge } from './CoordinatorStatusBadge';
import { Search, Filter, Eye, UserPlus, RefreshCw, ShieldAlert, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CoordinatorTable = ({
  coordinators = [],
  departments = [],
  canManage = false,
  onOpenAssign,
  onOpenReassign,
  onOpenStatusModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const filteredCoordinators = useMemo(() => {
    return coordinators.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.departmentCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const matchesDept = deptFilter === 'ALL' || c.departmentCode === deptFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [coordinators, searchQuery, statusFilter, deptFilter]);

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Department IQAC Coordinators Directory
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Active department leads, contact details & governance status
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative shrink-0 w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search coordinator / ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50"
            />
          </div>

          {/* Department Filter */}
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

          {/* Status Filter */}
          <div className="relative shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer appearance-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="DEACTIVATED">Deactivated</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {canManage && onOpenAssign && (
            <button
              type="button"
              onClick={onOpenAssign}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Assign Coordinator</span>
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200/80 custom-scroll">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
              <th className="p-3">Coordinator Name & ID</th>
              <th className="p-3">Department</th>
              <th className="p-3 text-center">Assigned Date</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Last Activity</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredCoordinators.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                  No coordinators found matching current filters.
                </td>
              </tr>
            ) : (
              filteredCoordinators.map((coord) => (
                <tr key={coord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900 leading-tight">
                        {coord.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-normal">
                        {coord.employeeId} &bull; {coord.email}
                      </p>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-900 font-black text-xs flex items-center justify-center shrink-0">
                        {coord.departmentCode}
                      </span>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                        {coord.departmentName}
                      </span>
                    </div>
                  </td>

                  <td className="p-3 text-center text-slate-600 text-[11px]">
                    {coord.assignedDate}
                  </td>

                  <td className="p-3 text-center">
                    <CoordinatorStatusBadge status={coord.status} />
                  </td>

                  <td className="p-3 text-center text-slate-500 text-[11px]">
                    {coord.lastActivityAt}
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/iqac/coordinators/${coord.id}`}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="View Coordinator Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {canManage && (
                        <>
                          <button
                            type="button"
                            onClick={() => onOpenReassign && onOpenReassign(coord)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                            title="Reassign Department Coordinator"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenStatusModal && onOpenStatusModal(coord)}
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition"
                            title="Update Status (Activate / Suspend / Deactivate)"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
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
