import React from 'react';

const NORMALIZE = (s) =>
  String(s || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');

const STYLE_MAP = {
  good: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  on_track: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  excellent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  attention: 'bg-amber-50 text-amber-800 border-amber-200',
  needs_attention: 'bg-amber-50 text-amber-800 border-amber-200',
  watch: 'bg-amber-50 text-amber-800 border-amber-200',
  critical: 'bg-rose-50 text-rose-700 border-rose-200',
  at_risk: 'bg-rose-50 text-rose-700 border-rose-200',
  overdue: 'bg-rose-50 text-rose-700 border-rose-200',
  pending: 'bg-slate-100 text-slate-600 border-slate-200',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
};

const labelFor = (status) => {
  if (status === null || status === undefined || status === '') return 'Not reported';
  const pretty = String(status).trim().replace(/[_-]+/g, ' ');
  return pretty.charAt(0).toUpperCase() + pretty.slice(1);
};

export const ManagementStatusBadge = ({ status }) => {
  const key = NORMALIZE(status);
  const styles = STYLE_MAP[key] || STYLE_MAP.neutral;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-bold rounded-full border whitespace-nowrap ${styles}`}
      role="status"
      aria-label={`Status: ${labelFor(status)}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" aria-hidden="true" />
      {labelFor(status)}
    </span>
  );
};
