import React from 'react';

export const IQACStatusBadge = ({ status }) => {
  const getBadgeConfig = (st) => {
    switch (st) {
      case 'ON_TRACK':
        return {
          label: 'ON TRACK',
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
        };
      case 'ATTENTION_REQUIRED':
        return {
          label: 'ATTENTION REQUIRED',
          classes: 'bg-amber-50 text-amber-800 border-amber-200/80',
          dot: 'bg-amber-500',
        };
      case 'OVERDUE':
        return {
          label: 'OVERDUE',
          classes: 'bg-rose-50 text-rose-700 border-rose-200/80',
          dot: 'bg-rose-500',
        };
      case 'COMPLETED':
        return {
          label: 'COMPLETED',
          classes: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
          dot: 'bg-indigo-500',
        };
      case 'VERIFIED':
        return {
          label: 'VERIFIED',
          classes: 'bg-teal-50 text-teal-700 border-teal-200/80',
          dot: 'bg-teal-500',
        };
      case 'PENDING_REVIEW':
        return {
          label: 'PENDING REVIEW',
          classes: 'bg-violet-50 text-violet-700 border-violet-200/80',
          dot: 'bg-violet-500',
        };
      case 'ACTION_NEEDED':
        return {
          label: 'ACTION NEEDED',
          classes: 'bg-orange-50 text-orange-700 border-orange-200/80',
          dot: 'bg-orange-500',
        };
      case 'IN_PROGRESS':
        return {
          label: 'IN PROGRESS',
          classes: 'bg-sky-50 text-sky-700 border-sky-200/80',
          dot: 'bg-sky-500',
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
