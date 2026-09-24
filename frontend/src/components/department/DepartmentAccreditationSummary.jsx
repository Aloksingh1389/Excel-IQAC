import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';

const CRITERION_NAMES = {
  1: 'Curricular Aspects',
  2: 'Teaching-Learning & Evaluation',
  3: 'Research, Innovations & Extension',
  4: 'Infrastructure & Learning Resources',
  5: 'Student Support & Progression',
  6: 'Governance, Leadership & Management',
  7: 'Institutional Values & Best Practices',
};

export const DepartmentAccreditationSummary = ({ accreditation }) => {
  const acc = accreditation || {};
  const readiness = acc.readiness ?? acc.overallReadiness ?? acc.score ?? null;
  const criteria = acc.criteria || {};

  const entries = Object.entries(criteria);
  if (readiness == null && entries.length === 0) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="No accreditation data"
        description="Accreditation readiness data is not available yet."
      />
    );
  }

  const barColor = (pct) => {
    const n = Number(pct) || 0;
    if (n >= 75) return 'bg-emerald-500';
    if (n >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <Card className="p-5" aria-label="Department accreditation summary">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-sm font-bold text-slate-900">Accreditation Readiness</h2>
        {readiness != null && (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-extrabold border bg-violet-50 text-violet-700 border-violet-200"
            aria-label={`Overall readiness ${readiness} percent`}
          >
            <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
            Readiness: {readiness}%
          </span>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-slate-500">Criterion-level data not available.</p>
      ) : (
        <ul className="space-y-2.5" aria-label="Accreditation criteria scores">
          {entries.map(([key, pct]) => {
            const num = String(key).replace(/^c/i, '');
            const criterionId = `c${num}`;
            const name = CRITERION_NAMES[num] || `Criterion ${num}`;
            const value = Number(pct) || 0;
            return (
              <li key={criterionId}>
                <Link
                  to={`/accreditation/criteria/${criterionId}`}
                  aria-label={`${name}: ${value} percent — view criterion details`}
                  className="group block rounded-lg border border-slate-200/70 px-3 py-2 hover:border-violet-300 hover:bg-violet-50/40 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                    <span className="font-semibold text-slate-700 truncate">
                      C{num} · {name}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-slate-900 shrink-0">
                      {value}%
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-violet-600" aria-hidden="true" />
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full bg-slate-100 overflow-hidden"
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Criterion ${num} readiness`}
                  >
                    <div
                      className={`h-full rounded-full ${barColor(value)}`}
                      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};
