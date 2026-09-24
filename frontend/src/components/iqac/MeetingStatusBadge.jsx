import React from 'react';
import { MEETING_STATUS_CONFIG } from '../../config/meetingConfig';

export const MeetingStatusBadge = ({ status }) => {
  const config = MEETING_STATUS_CONFIG[status] || {
    label: status || 'UNKNOWN',
    classes: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border tracking-wide whitespace-nowrap ${config.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
