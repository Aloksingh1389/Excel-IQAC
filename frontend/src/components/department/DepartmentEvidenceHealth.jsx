import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck2, Inbox, SearchCheck, BadgeCheck, FileWarning, Undo2 } from 'lucide-react';
import { Card } from '../common/Card';

const tiles = (health) => [
  { label: 'Required', value: health?.required ?? 0, tone: 'bg-slate-100 text-slate-700 border-slate-200', Icon: Inbox },
  { label: 'Submitted', value: health?.submitted ?? 0, tone: 'bg-blue-50 text-blue-700 border-blue-200', Icon: FileCheck2 },
  { label: 'Under Review', value: health?.underReview ?? 0, tone: 'bg-violet-50 text-violet-700 border-violet-200', Icon: SearchCheck },
  { label: 'Verified', value: health?.verified ?? 0, tone: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: BadgeCheck },
  { label: 'Missing', value: health?.missing ?? 0, tone: 'bg-rose-50 text-rose-700 border-rose-200', Icon: FileWarning },
  { label: 'Returned', value: health?.returned ?? 0, tone: 'bg-amber-50 text-amber-800 border-amber-200', Icon: Undo2 },
];

export const DepartmentEvidenceHealth = ({ health }) => {
  const h = health || {};
  const rate = h.verificationRate ?? h.verifiedRate ?? h.rate ?? 0;
  const missing = h.missing ?? 0;
  const returned = h.returned ?? 0;

  return (
    <Card className="p-5" aria-label="Department evidence health">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-sm font-bold text-slate-900">Evidence Health</h2>
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold border bg-teal-50 text-teal-800 border-teal-200"
          aria-label={`Verification rate ${rate} percent`}
        >
          Verification rate: {rate}%
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {tiles(h).map(({ label, value, tone, Icon }) => (
          <div key={label} className={`rounded-lg border px-3 py-3 ${tone}`}>
            <div className="flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              <p className="text-[10px] font-bold uppercase tracking-wider">{label}</p>
            </div>
            <p className="text-xl font-extrabold mt-1" aria-label={`${label}: ${value}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {(missing > 0 || returned > 0) && (
        <div className="mt-4 space-y-2" role="alert">
          {missing > 0 && (
            <Link
              to="/department/evidence"
              aria-label={`${missing} missing evidence items — review now`}
              className="flex items-center justify-between gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-100 transition-colors"
            >
              <span>{missing} evidence item{missing === 1 ? '' : 's'} missing — action required.</span>
              <span className="underline underline-offset-2">Review</span>
            </Link>
          )}
          {returned > 0 && (
            <Link
              to="/department/evidence"
              aria-label={`${returned} returned evidence items — review now`}
              className="flex items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors"
            >
              <span>{returned} evidence item{returned === 1 ? '' : 's'} returned — resubmission needed.</span>
              <span className="underline underline-offset-2">Review</span>
            </Link>
          )}
        </div>
      )}
    </Card>
  );
};
