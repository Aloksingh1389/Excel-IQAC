import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';

const CRITERION_LABELS = {
  1: 'Curricular Aspects',
  2: 'Teaching & Evaluation',
  3: 'Research & Extension',
  4: 'Infrastructure',
  5: 'Student Support',
  6: 'Governance & Leadership',
  7: 'Institutional Values',
};

const toneFor = (v) => {
  const n = Number(v) || 0;
  if (n >= 75) return 'bg-emerald-500';
  if (n >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
};

export const AccreditationOverview = ({ data, onCriterionClick }) => {
  const d = data || {};
  const criteria = d.criteria || {};
  const keys = [1, 2, 3, 4, 5, 6, 7];
  const hasAny = keys.some((k) => criteria[k] !== null && criteria[k] !== undefined && criteria[k] !== '');

  if (!data || (!hasAny && (d.institutionalReadiness === null || d.institutionalReadiness === undefined))) {
    return (
      <EmptyState
        title="No accreditation data"
        description="Criterion-wise readiness has not been reported yet."
      />
    );
  }

  return (
    <Card className="p-5 sm:p-6" aria-label="Accreditation readiness overview">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Accreditation Readiness</h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Criterion-wise institutional readiness</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {d.institutionalReadiness === null || d.institutionalReadiness === undefined || d.institutionalReadiness === ''
              ? '—'
              : `${d.institutionalReadiness}%`}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Overall</p>
        </div>
      </div>
      <ul className="space-y-2.5">
        {keys.map((k) => {
          const v = criteria[k];
          const shown = v === null || v === undefined || v === '' ? null : Number(v);
          const pct = shown === null ? 0 : Math.max(0, Math.min(100, shown));
          const row = (
            <>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-700 truncate">
                  C{k}: {CRITERION_LABELS[k]}
                </span>
                <span className="text-xs font-bold text-slate-900 tabular-nums shrink-0">
                  {shown === null ? '—' : `${shown}%`}
                </span>
              </div>
              <div
                className="h-2 rounded-full bg-slate-100 overflow-hidden"
                role="progressbar"
                aria-label={`Criterion ${k} readiness`}
                aria-valuenow={Math.round(pct)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className={`h-full rounded-full transition-all ${toneFor(pct)}`} style={{ width: `${pct}%` }} />
              </div>
            </>
          );
          if (typeof onCriterionClick === 'function') {
            return (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => onCriterionClick(k)}
                  aria-label={`View criterion ${k} details`}
                  className="block w-full text-left rounded-lg p-1.5 -m-1.5 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {row}
                </button>
              </li>
            );
          }
          return (
            <li key={k}>
              <Link
                to="/management/accreditation"
                aria-label={`View criterion ${k} details`}
                className="block rounded-lg p-1.5 -m-1.5 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {row}
                <span className="sr-only">Open accreditation overview</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        to="/management/accreditation"
        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
      >
        Open accreditation workspace <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
      </Link>
    </Card>
  );
};
