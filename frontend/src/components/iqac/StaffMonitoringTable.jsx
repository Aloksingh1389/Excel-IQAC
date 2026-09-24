import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { IQACStatusBadge } from './IQACStatusBadge';
import { Search, Filter, CheckCircle2, Clock, AlertTriangle, XCircle, ChevronRight } from 'lucide-react';

export const StaffMonitoringTable = ({ staffList = [], departmentName = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      const matchesSearch =
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'ALL' || staff.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [staffList, searchQuery, statusFilter]);

  const renderItemStatus = (statusStr) => {
    if (statusStr === 'COMPLETE' || statusStr === 'VERIFIED') {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Done</span>
        </span>
      );
    }
    if (statusStr === 'IN_PROGRESS' || statusStr === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-1 text-amber-700 font-bold text-[11px]">
          <Clock className="w-3.5 h-3.5" />
          <span>Pending</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-[11px]">
        <XCircle className="w-3.5 h-3.5" />
        <span>Missing</span>
      </span>
    );
  };

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Department Staff IQAC Monitoring
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Identify staff members requiring attention, profile completions & evidence status {departmentName && `• ${departmentName}`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative shrink-0 w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty name / ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50"
            />
          </div>

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

      <div className="overflow-x-auto rounded-xl border border-slate-200/80 custom-scroll">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
              <th className="p-3">Staff Member</th>
              <th className="p-3 text-center">Profile %</th>
              <th className="p-3 text-center">Academic Data</th>
              <th className="p-3 text-center">Research</th>
              <th className="p-3 text-center">Publications</th>
              <th className="p-3 text-center">Evidence</th>
              <th className="p-3 text-center">Last Updated</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredStaff.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-500 font-medium">
                  No staff members found matching criteria.
                </td>
              </tr>
            ) : (
              filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900 leading-tight">
                        {staff.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {staff.employeeId} &bull; {staff.designation}
                      </p>
                    </div>
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-bold text-slate-900">
                        {staff.profileCompletion}%
                      </span>
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            staff.profileCompletion >= 90
                              ? 'bg-emerald-500'
                              : staff.profileCompletion >= 70
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${staff.profileCompletion}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="p-3 text-center">
                    {renderItemStatus(staff.academicInfoStatus)}
                  </td>

                  <td className="p-3 text-center">
                    {renderItemStatus(staff.researchStatus)}
                  </td>

                  <td className="p-3 text-center">
                    {renderItemStatus(staff.publicationStatus)}
                  </td>

                  <td className="p-3 text-center">
                    {renderItemStatus(staff.evidenceStatus)}
                  </td>

                  <td className="p-3 text-center text-slate-500 text-[11px]">
                    {staff.lastUpdated}
                  </td>

                  <td className="p-3 text-center">
                    <IQACStatusBadge status={staff.status} />
                  </td>

                  <td className="p-3 text-right">
                    <button
                      type="button"
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition cursor-pointer"
                    >
                      Remind / View
                    </button>
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
