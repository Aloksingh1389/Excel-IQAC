import React from 'react';

export const CoordinatorStatusBadge = ({ status }) => {
  const getBadgeConfig = (st) => {
    switch (st) {
      case 'ACTIVE':
        return {
          label: 'ACTIVE',
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
        };
      case 'PENDING':
      case 'PENDING_ASSIGNMENT':
        return {
          label: 'PENDING',
          classes: 'bg-violet-50 text-violet-700 border-violet-200/80',
          dot: 'bg-violet-500',
        };
      case 'SUSPENDED':
        return {
          label: 'SUSPENDED',
          classes: 'bg-amber-50 text-amber-800 border-amber-200/80',
          dot: 'bg-amber-500',
        };
      case 'DEACTIVATED':
      case 'INACTIVE':
        return {
          label: 'DEACTIVATED',
          classes: 'bg-rose-50 text-rose-700 border-rose-200/80',
          dot: 'bg-rose-500',
        };
      default:
        return {
          label: st || 'UNKNOWN',
          classes: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  const config = getBadgeConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border tracking-wide whitespace-nowrap ${config.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
