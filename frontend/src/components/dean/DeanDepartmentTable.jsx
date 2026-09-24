import React, { useMemo, useState } from 'react';
import { Building2, ArrowUpDown } from 'lucide-react';
import { Card, Badge } from '../common/Card';
import { EmptyState } from '../common/EmptyState';

const COLUMNS = [
  { key: 'department', label: 'Department', sortable: true },
  { key: 'staffCount', label: 'Staff', sortable: true, numeric: true },
  { key: 'pendingReviews', label: 'Pending Reviews', sortable: true, numeric: true },
  { key: 'evidenceGaps', label: 'Evidence gaps', sortable: true, numeric: true },
  { key: 'qualityScore', label: 'Quality', sortable: true, numeric: true },
  { key: 'complianceRate', label: 'Compliance', sortable: true, numeric: true },
  { key: 'accreditationReadiness', label: 'Accreditation', sortable: true, numeric: true },
  { key: 'status', label: 'Status', sortable: true },
];

const getEvidenceGaps = (s) =>
  s?.evidenceMissing ?? s?.evidencePending ?? s?.evidenceGaps ?? 0;

const getSortValue = (row, key) => {
  switch (key) {
    case 'department':
      return String(row?.department?.name || row?.department?.code || '').toLowerCase();
    case 'evidenceGaps':
      return Number(getEvidenceGaps(row)) || 0;
    case 'status':
      return String(row?.status || '').toLowerCase();
    default:
      return Number(row?.[key]) || 0;
  }
};

const statusVariant = (status) => {
  const s = String(status || '').toUpperCase();
  if (s.includes('EXCELLENT') || s.includes('ACTIVE') || s.includes('ON TRACK')) return 'success';
  if (s.includes('ATTENTION') || s.includes('PENDING') || s.includes('PARTIAL')) return 'warning';
  if (s.includes('CRITICAL') || s.includes('OVERDUE') || s.includes('RISK')) return 'danger';
  if (s.includes('REVIEW')) return 'info';
  return 'neutral';
};

export const DeanDepartmentTable = ({ summaries, onSelect }) => {
  const rows = useMemo(() => (Array.isArray(summaries) ? summaries : []), [summaries]);
  const [sortKey, setSortKey] = useState('department');
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const va = getSortValue(a, sortKey);
      const vb = getSortValue(b, sortKey);
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, sortKey, sortAsc]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No departments found"
        description="No department summaries available for the current scope."
      />
    );
  }

  return (
    <Card className="overflow-hidden" aria-label="Department summary table">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap ${
                    col.numeric ? 'text-center' : ''
                  }`}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      aria-label={`Sort by ${col.label} ${sortKey === col.key ? (sortAsc ? 'descending' : 'ascending') : 'ascending'}`}
                      className={`inline-flex items-center gap-1 hover:text-slate-800 transition-colors ${
                        sortKey === col.key ? 'text-indigo-600' : ''
                      }`}
                    >
                      {col.label}
                      <ArrowUpDown className="w-3 h-3" aria-hidden="true" />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((s, idx) => {
              const id = s?.department?.id ?? s?.department?.code ?? idx;
              const key = s?.department?.id ?? s?.department?.code ?? `dept-${idx}`;
              return (
                <tr
                  key={key}
                  onClick={() => typeof onSelect === 'function' && onSelect(id)}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && typeof onSelect === 'function') {
                      e.preventDefault();
                      onSelect(id);
                    }
                  }}
                  tabIndex={typeof onSelect === 'function' ? 0 : undefined}
                  aria-label={`View ${s?.department?.name || s?.department?.code || 'department'}`}
                  className={
                    typeof onSelect === 'function'
                      ? 'hover:bg-slate-50 cursor-pointer transition-colors'
                      : ''
                  }
                >
                  <td className="px-4 py-3 min-w-[180px]">
                    <p className="font-semibold text-slate-800">
                      {s?.department?.name || s?.department?.code || '—'}
                    </p>
                    {s?.department?.name && s?.department?.code && (
                      <p className="text-[11px] text-slate-400 font-medium">{s.department.code}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-slate-800">
                    {s?.staffCount ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-amber-700">
                    {s?.pendingReviews ?? 0}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-rose-700">
                    {getEvidenceGaps(s)}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-slate-800">
                    {s?.qualityScore ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-slate-800">
                    {s?.complianceRate ?? '—'}
                    {typeof s?.complianceRate === 'number' ? '%' : ''}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-slate-800">
                    {s?.accreditationReadiness ?? '—'}
                    {typeof s?.accreditationReadiness === 'number' ? '%' : ''}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant={statusVariant(s?.status)} size="xs">
                      {s?.status || 'Unknown'}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
