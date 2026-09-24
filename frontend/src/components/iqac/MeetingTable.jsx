import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { MeetingStatusBadge } from './MeetingStatusBadge';
import { MEETING_STATUS, MEETING_TYPES, MEETING_TYPE_LABELS } from '../../config/meetingConfig';
import { Search, Filter, Eye, Calendar, MapPin, Users, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MeetingTable = ({
  meetings = [],
  departments = [],
  hideDepartmentFilter = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredMeetings = useMemo(() => {
    return meetings
      .filter((m) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          m.meetingId.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.organizerName.toLowerCase().includes(q) ||
          m.venue.toLowerCase().includes(q);

        const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
        const matchesType = typeFilter === 'ALL' || m.meetingType === typeFilter;
        const matchesDept = deptFilter === 'ALL' || m.departmentCode === deptFilter;

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
  }, [meetings, searchQuery, statusFilter, typeFilter, deptFilter, sortField, sortOrder]);

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            IQAC Meetings Directory
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Schedule, manage agendas, record attendance & track meeting minutes
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative shrink-0 w-full sm:w-52">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search meeting ID, title, venue..."
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
              {Object.values(MEETING_STATUS).map((st) => (
                <option key={st} value={st}>
                  {st.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative shrink-0">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none cursor-pointer appearance-none"
            >
              <option value="ALL">All Meeting Types</option>
              {Object.keys(MEETING_TYPES).map((key) => (
                <option key={key} value={key}>
                  {MEETING_TYPE_LABELS[key]}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 custom-scroll">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
              <th
                onClick={() => handleSort('meetingId')}
                className="p-3 cursor-pointer hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-1">
                  <span>Meeting ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3">Title & Venue</th>
              <th className="p-3">Type</th>
              <th
                onClick={() => handleSort('date')}
                className="p-3 cursor-pointer hover:bg-slate-100 transition text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Date & Time</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3">Organizer</th>
              <th className="p-3 text-center">Attendance</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredMeetings.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
                  No IQAC meetings found matching selected criteria.
                </td>
              </tr>
            ) : (
              filteredMeetings.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-3 font-bold text-indigo-900 whitespace-nowrap">
                    {m.meetingId}
                  </td>

                  <td className="p-3">
                    <div className="space-y-0.5 max-w-xs">
                      <p className="font-bold text-slate-900 leading-tight truncate group-hover:text-indigo-600 transition">
                        {m.title}
                      </p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{m.venue} ({m.mode})</span>
                      </p>
                    </div>
                  </td>

                  <td className="p-3 text-slate-700 font-semibold text-[11px]">
                    {m.typeLabel || m.meetingType}
                  </td>

                  <td className="p-3 text-center">
                    <p className="font-bold text-slate-900 leading-tight">{m.date}</p>
                    <p className="text-[10px] text-slate-400">{m.startTime} - {m.endTime}</p>
                  </td>

                  <td className="p-3">
                    <p className="font-semibold text-slate-800 leading-tight">{m.organizerName}</p>
                    <p className="text-[10px] text-slate-400">{m.organizerRole.replace(/_/g, ' ')}</p>
                  </td>

                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-[11px]">
                      {m.attendanceSummary?.attendanceRate || 83}%
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <MeetingStatusBadge status={m.status} />
                  </td>

                  <td className="p-3 text-right">
                    <Link
                      to={`/iqac/meetings/${m.id}`}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
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
