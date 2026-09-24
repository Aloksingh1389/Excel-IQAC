import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { EvidenceStatusBadge } from './EvidenceStatusBadge';
import { EVIDENCE_STATUS } from '../../config/evidenceConfig';
import { EVIDENCE_TYPES, EVIDENCE_TYPE_LABELS } from '../../config/evidenceConfig';
import { Search, Filter, Eye, FileText, Download, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EvidenceTable = ({
  evidenceList = [],
  departments = [],
  hideDepartmentFilter = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [sortField, setSortField] = useState('uploadedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredEvidence = useMemo(() => {
    return evidenceList
      .filter((ev) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          ev.evidenceId.toLowerCase().includes(q) ||
          ev.fileName.toLowerCase().includes(q) ||
          ev.title.toLowerCase().includes(q) ||
          ev.uploadedBy.toLowerCase().includes(q) ||
          (ev.submissionId && ev.submissionId.toLowerCase().includes(q)) ||
          ev.departmentCode.toLowerCase().includes(q);

        const matchesStatus = statusFilter === 'ALL' || ev.status === statusFilter;
        const matchesType = typeFilter === 'ALL' || ev.evidenceType === typeFilter;
        const matchesDept = deptFilter === 'ALL' || ev.departmentCode === deptFilter;

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
  }, [evidenceList, searchQuery, statusFilter, typeFilter, deptFilter, sortField, sortOrder]);

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Evidence Documents Master Directory
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Search, filter & review submitted supporting evidence and verification records
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative shrink-0 w-full sm:w-52">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search EV ID, file, uploader..."
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
              {Object.values(EVIDENCE_STATUS).map((st) => (
                <option key={st} value={st}>
                  {st.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Evidence Type Filter */}
          <div className="relative shrink-0">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer appearance-none"
            >
              <option value="ALL">All Evidence Types</option>
              {Object.keys(EVIDENCE_TYPES).map((key) => (
                <option key={key} value={key}>
                  {EVIDENCE_TYPE_LABELS[key]}
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

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 custom-scroll">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
              <th
                onClick={() => handleSort('evidenceId')}
                className="p-3 cursor-pointer hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-1">
                  <span>Evidence ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3">Document Title & File</th>
              <th className="p-3">Evidence Type</th>
              <th className="p-3">Related Submission</th>
              <th className="p-3">Uploaded By</th>
              <th className="p-3 text-center">Dept</th>
              <th className="p-3 text-center">Version</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredEvidence.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-500 font-medium">
                  No evidence records found matching current filters.
                </td>
              </tr>
            ) : (
              filteredEvidence.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-3 font-bold text-indigo-900 whitespace-nowrap">
                    {ev.evidenceId}
                  </td>

                  <td className="p-3">
                    <div className="flex items-start gap-2 max-w-xs">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5 truncate">
                        <p className="font-bold text-slate-900 leading-tight truncate group-hover:text-indigo-600 transition">
                          {ev.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-normal truncate">
                          {ev.fileName} ({ev.fileSize})
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 text-slate-700 font-semibold text-[11px]">
                    {ev.typeLabel || ev.evidenceType}
                  </td>

                  <td className="p-3">
                    {ev.submissionId ? (
                      <Link
                        to={`/iqac/submissions/${ev.submissionId}`}
                        className="font-bold text-indigo-600 hover:text-indigo-800 text-[11px] truncate block max-w-[140px]"
                        title={ev.submissionTitle || ev.submissionId}
                      >
                        {ev.submissionId}
                      </Link>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Unlinked</span>
                    )}
                  </td>

                  <td className="p-3">
                    <p className="font-semibold text-slate-800 leading-tight">{ev.uploadedBy}</p>
                    <p className="text-[10px] text-slate-400 font-normal">{ev.uploadedByRole.replace(/_/g, ' ')}</p>
                  </td>

                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 font-black text-slate-800 text-[11px]">
                      {ev.departmentCode}
                    </span>
                  </td>

                  <td className="p-3 text-center font-bold text-slate-700 text-[11px]">
                    v{ev.version || 1}
                  </td>

                  <td className="p-3 text-center">
                    <EvidenceStatusBadge status={ev.status} />
                  </td>

                  <td className="p-3 text-right whitespace-nowrap">
                    <Link
                      to={`/iqac/evidence/${ev.id}`}
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
