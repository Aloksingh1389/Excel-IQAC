import React from 'react';
import { Gauge, ShieldCheck, BadgeCheck, Activity, AlertTriangle, Building2 } from 'lucide-react';
import { Card } from '../common/Card';
import { ManagementStatusBadge } from './ManagementStatusBadge';

const Row = ({ icon: Icon, label, value, tone }) => (
  <div className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-0">
    <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
      <Icon className={`w-4 h-4 ${tone || 'text-slate-400'}`} aria-hidden="true" />
      {label}
    </span>
    <span className="text-sm font-bold text-slate-900">{value ?? '—'}</span>
  </div>
);

export const ExecutiveSummaryCard = ({ summary }) => {
  const s = summary || {};
  const fmtPct = (v) => (v === null || v === undefined || v === '' ? '—' : `${v}%`);

  return (
    <Card className="p-5 sm:p-6" aria-label="Executive summary">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 className="text-sm font-bold text-slate-900">Executive Summary</h3>
        {s.operational && <ManagementStatusBadge status={s.operational} />}
      </div>
      <p className="text-xs text-slate-500 leading-relaxed mb-2">
        Institution operating status:{' '}
        <span className="font-semibold text-slate-700">{s.operational || 'Not reported'}</span>.
        {s.criticalActions !== null && s.criticalActions !== undefined
          ? ` ${s.criticalActions} critical action${Number(s.criticalActions) === 1 ? '' : 's'} recorded.`
          : ''}
        {s.departmentsAttention !== null && s.departmentsAttention !== undefined
          ? ` ${s.departmentsAttention} department${Number(s.departmentsAttention) === 1 ? '' : 's'} recorded as needing attention.`
          : ''}
      </p>
      <div>
        <Row icon={Gauge} label="Quality score" value={fmtPct(s.quality)} tone="text-amber-500" />
        <Row icon={ShieldCheck} label="Compliance rate" value={fmtPct(s.compliance)} tone="text-emerald-500" />
        <Row icon={BadgeCheck} label="Accreditation readiness" value={fmtPct(s.accreditation)} tone="text-teal-500" />
        <Row icon={AlertTriangle} label="Critical actions" value={s.criticalActions ?? '—'} tone="text-rose-500" />
        <Row icon={Building2} label="Departments needing attention" value={s.departmentsAttention ?? '—'} tone="text-violet-500" />
        <div className="flex items-center justify-between gap-3 py-2">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
            <Activity className="w-4 h-4 text-blue-500" aria-hidden="true" />
            Operational status
          </span>
          <span className="text-sm font-bold text-slate-900">{s.operational || '—'}</span>
        </div>
      </div>
    </Card>
  );
};
