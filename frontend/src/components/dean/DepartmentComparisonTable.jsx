import React from 'react';
import { Scale } from 'lucide-react';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';

const cell = (v, suffix = '') => {
  if (v === undefined || v === null || v === '') return '—';
  return `${v}${suffix}`;
};

const COLUMNS = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Department' },
  { key: 'staff', label: 'Staff', numeric: true },
  { key: 'students', label: 'Students', numeric: true },
  { key: 'passPercentage', label: 'Pass %', numeric: true, suffix: '%' },
  { key: 'placementPercentage', label: 'Placement %', numeric: true, suffix: '%' },
  { key: 'publications', label: 'Publications', numeric: true },
  { key: 'submissionCompletion', label: 'Submission %', numeric: true, suffix: '%' },
  { key: 'evidenceCompleteness', label: 'Evidence %', numeric: true, suffix: '%' },
  { key: 'compliance', label: 'Compliance %', numeric: true, suffix: '%' },
  { key: 'quality', label: 'Quality', numeric: true },
  { key: 'readiness', label: 'Readiness %', numeric: true, suffix: '%' },
  { key: 'openActions', label: 'Open Actions', numeric: true },
  { key: 'overdueActions', label: 'Overdue', numeric: true },
  { key: 'pendingReviews', label: 'Pending Reviews', numeric: true },
];

export const DepartmentComparisonTable = ({ rows }) => {
  const data = Array.isArray(rows) ? rows : [];

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Scale}
        title="No comparison data"
        description="No departments available to compare for the current scope."
      />
    );
  }

  return (
    <Card className="overflow-hidden" aria-label="Department comparison table">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left">
              {COLUMNS.map((col, ci) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap ${
                    col.numeric ? 'text-center' : 'text-left'
                  } ${ci === 0 ? 'sticky left-0 z-10 bg-slate-50 shadow-[1px_0_0_0_#e2e8f0]' : ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((r, idx) => (
              <tr key={r?.code ?? r?.name ?? `row-${idx}`} className="hover:bg-slate-50 transition-colors">
                {COLUMNS.map((col, ci) => {
                  const v = r?.[col.key];
                  const text = cell(v, typeof v === 'number' ? (col.suffix || '') : '');
                  if (ci === 0) {
                    return (
                      <td
                        key={col.key}
                        className="px-4 py-3 sticky left-0 z-10 bg-white shadow-[1px_0_0_0_#f1f5f9] font-bold text-slate-800 whitespace-nowrap"
                      >
                        {text}
                      </td>
                    );
                  }
                  if (col.key === 'name') {
                    return (
                      <td key={col.key} className="px-4 py-3 font-semibold text-slate-800 min-w-[180px]">
                        <span className="block max-w-[240px] truncate" title={String(v ?? '')}>
                          {text}
                        </span>
                      </td>
                    );
                  }
                  return (
                    <td
                      key={col.key}
                      className={`px-4 py-3 whitespace-nowrap font-medium text-slate-700 ${
                        col.numeric ? 'text-center' : ''
                      }`}
                    >
                      {text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
