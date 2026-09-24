import React, { useMemo, useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { ManagementStatusBadge } from './ManagementStatusBadge';

const COLUMNS = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Department' },
  { key: 'hodName', label: 'HOD' },
  { key: 'staffCount', label: 'Staff', numeric: true },
  { key: 'studentCount', label: 'Students', numeric: true },
  { key: 'qualityScore', label: 'Quality %', numeric: true },
  { key: 'complianceRate', label: 'Compliance %', numeric: true },
  { key: 'accreditationReadiness', label: 'Readiness %', numeric: true },
  { key: 'status', label: 'Status' },
];

const getVal = (row, key) => {
  const v = row?.[key];
  if (v === null || v === undefined || v === '') return null;
  return v;
};

export const DepartmentPerformanceTable = ({ departments, onSelect }) => {
  const rows = Array.isArray(departments) ? departments : [];
  const [sortKey, setSortKey] = useState('qualityScore');
  const [sortDir, setSortDir] = useState('desc');

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = getVal(a, sortKey);
      const bv = getVal(b, sortKey);
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      let cmp;
      if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
      else cmp = String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'code' || key === 'name' || key === 'hodName' ? 'asc' : 'desc');
    }
  };

  if (rows.length === 0) {
    return (
      <EmptyState
        title="No department data"
        description="Department performance records are not available yet."
      />
    );
  }

  return (
    <Card className="overflow-hidden" aria-label="Department performance">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {COLUMNS.map((c) => {
                const active = sortKey === c.key;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    className={`px-3 sm:px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap ${
                      c.numeric ? 'text-right' : 'text-left'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      aria-label={`Sort by ${c.label} (${active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'unsorted'})`}
                      className="inline-flex items-center gap-1 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                    >
                      {c.label}
                      {active ? (
                        sortDir === 'asc' ? (
                          <ArrowUp className="w-3 h-3" aria-hidden="true" />
                        ) : (
                          <ArrowDown className="w-3 h-3" aria-hidden="true" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-300" aria-hidden="true" />
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((d, rowIndex) => {
              const id = d?.id ?? d?.code ?? `row-${rowIndex}`;
              const clickable = typeof onSelect === 'function';
              return (
                <tr
                  key={String(id)}
                  onClick={clickable ? () => onSelect(d?.id ?? d?.code) : undefined}
                  onKeyDown={
                    clickable
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelect(d?.id ?? d?.code);
                          }
                        }
                      : undefined
                  }
                  tabIndex={clickable ? 0 : undefined}
                  role={clickable ? 'button' : undefined}
                  aria-label={clickable ? `View ${d?.name || d?.code || 'department'} details` : undefined}
                  className={`${
                    clickable ? 'cursor-pointer hover:bg-indigo-50/50 focus:bg-indigo-50/50 focus:outline-none' : ''
                  } transition-colors`}
                >
                  <td className="px-3 sm:px-4 py-2.5 font-bold text-indigo-700 whitespace-nowrap">
                    {d?.code || '—'}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 font-medium text-slate-800 whitespace-nowrap">
                    {d?.name || '—'}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 text-slate-600 whitespace-nowrap">
                    {d?.hodName || '—'}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 text-right tabular-nums text-slate-700">
                    {d?.staffCount ?? '—'}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 text-right tabular-nums text-slate-700">
                    {d?.studentCount ?? '—'}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 text-right tabular-nums font-semibold text-slate-800">
                    {d?.qualityScore ?? '—'}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 text-right tabular-nums text-slate-700">
                    {d?.complianceRate ?? '—'}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 text-right tabular-nums text-slate-700">
                    {d?.accreditationReadiness ?? '—'}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 whitespace-nowrap">
                    <ManagementStatusBadge status={d?.status} />
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
