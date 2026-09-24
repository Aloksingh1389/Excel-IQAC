import React from 'react';
import { Building2, ArrowRight, AlertTriangle, OctagonAlert, Info } from 'lucide-react';
import { Card, Badge } from '../common/Card';

const severityMeta = (severity) => {
  const s = String(severity || 'info').toLowerCase();
  if (s === 'critical') return { variant: 'danger', Icon: OctagonAlert, label: 'Critical' };
  if (s === 'warning') return { variant: 'warning', Icon: AlertTriangle, label: 'Warning' };
  return { variant: 'info', Icon: Info, label: 'Info' };
};

const Metric = ({ label, value, suffix = '' }) => (
  <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5 text-center">
    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
    <p className="text-lg font-extrabold text-slate-900">
      {value === undefined || value === null ? '—' : `${value}${suffix}`}
    </p>
  </div>
);

export const DepartmentHealthCard = ({ summary, onView }) => {
  const s = summary && typeof summary === 'object' ? summary : {};
  const dept = s.department && typeof s.department === 'object' ? s.department : {};
  const deptId = dept.id ?? dept.code ?? null;
  const evidenceGaps = s.evidenceMissing ?? s.evidencePending ?? 0;
  const attention = Array.isArray(s.attention) ? s.attention.slice(0, 3) : [];

  return (
    <Card className="p-5 flex flex-col gap-4" aria-label={`Health of ${dept.name || dept.code || 'department'}`}>
      <div className="flex items-start gap-3">
        <div
          className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0"
          aria-hidden="true"
        >
          <Building2 className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-slate-900 truncate">
            {dept.name || dept.code || 'Department'}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {dept.code && (
              <Badge variant="neutral" size="xs">{dept.code}</Badge>
            )}
            {s.status && <Badge variant="info" size="xs">{s.status}</Badge>}
          </div>
          {(dept.hodName || dept.coordinatorName) && (
            <p className="mt-1 text-[11px] text-slate-500 font-medium truncate">
              {dept.hodName ? `HOD: ${dept.hodName}` : ''}
              {dept.hodName && dept.coordinatorName ? ' · ' : ''}
              {dept.coordinatorName ? `Coordinator: ${dept.coordinatorName}` : ''}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Metric label="Staff" value={s.staffCount} />
        <Metric label="Quality" value={s.qualityScore} />
        <Metric label="Compliance" value={s.complianceRate} suffix={typeof s.complianceRate === 'number' ? '%' : ''} />
        <Metric label="Accred." value={s.accreditationReadiness} suffix={typeof s.accreditationReadiness === 'number' ? '%' : ''} />
        <Metric label="Pending" value={s.pendingReviews} />
        <Metric label="Ev. gaps" value={evidenceGaps} />
        <Metric label="Open acts" value={s.openActions} />
        <Metric label="Overdue" value={s.overdueActions} />
      </div>

      {attention.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Top attention items
          </p>
          <ul className="space-y-1.5">
            {attention.map((a, idx) => {
              const meta = severityMeta(a?.severity);
              const MetaIcon = meta.Icon;
              return (
                <li
                  key={a?.id ?? idx}
                  className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-2"
                >
                  <MetaIcon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
                  <span className="flex-1 leading-relaxed">{a?.text || '—'}</span>
                  <Badge variant={meta.variant} size="xs">{meta.label}</Badge>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => typeof onView === 'function' && deptId !== null && onView(deptId)}
        disabled={typeof onView !== 'function' || deptId === null}
        className="inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={`View ${dept.name || dept.code || 'department'}`}
      >
        View Department <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </Card>
  );
};
